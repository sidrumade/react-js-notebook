/**
 * KernelManager
 * Manages active Web Workers for executing JS Notebook code in the background.
 * Simulates a Jupyter-like backend kernel environment.
 */

class KernelManager {
  constructor() {
    this.kernels = {}; // notebook_hash -> worker instance
  }

  // Create or get the kernel for a notebook
  getKernel(notebookHash) {
    if (!this.kernels[notebookHash]) {
      this.startKernel(notebookHash);
    }
    return this.kernels[notebookHash];
  }

  markKernelActive(hash) {
    let active = JSON.parse(localStorage.getItem('active_kernels') || "[]");
    if (!active.includes(hash)) {
        active.push(hash);
        localStorage.setItem('active_kernels', JSON.stringify(active));
    }
  }

  markKernelInactive(hash) {
    let active = JSON.parse(localStorage.getItem('active_kernels') || "[]");
    active = active.filter(h => h !== hash);
    localStorage.setItem('active_kernels', JSON.stringify(active));
  }

  startKernel(notebookHash) {
    this.markKernelActive(notebookHash);
    // We create a web worker using a blob
    const workerCode = `
      // Worker Kernel Execution Environment
      self.global = self; // Polyfill global so code using global.xxx doesn't crash
      let executionCount = 0;
      let currentCellId = null;
      
      // Polyfill for loading external libraries dynamically in a worker
      self.loadLibrary = function(libraryUrl) {
        try {
          importScripts(libraryUrl);
          if (currentCellId) self.postMessage({ type: 'output', cellId: currentCellId, data: 'Script loaded successfully: ' + libraryUrl });
        } catch (err) {
          if (currentCellId) self.postMessage({ type: 'output', cellId: currentCellId, data: 'Error loading script: ' + err.message });
        }
      };

      let outputBuffer = [];
      let outputLinesCount = 0;
      let flushTimeout = null;
      let lastFlushTime = 0;
      const MAX_LINES = ${process.env.REACT_APP_MAX_OUTPUT_LINES || 1000};

      const flushBuffer = () => {
         if (outputBuffer.length > 0 && currentCellId) {
            self.postMessage({ type: 'output', cellId: currentCellId, data: outputBuffer });
            outputBuffer = [];
         }
         lastFlushTime = performance.now();
      };

      const customPrint = (str) => {
         if (!currentCellId) return;
         if (outputLinesCount >= MAX_LINES) {
            if (outputLinesCount === MAX_LINES) {
               outputBuffer.push("--- [Output truncated: maximum of " + MAX_LINES + " lines reached] ---");
               outputLinesCount++;
               flushBuffer();
            }
            return;
         }
         outputBuffer.push(str);
         outputLinesCount++;
         
         if (performance.now() - lastFlushTime > 50) {
            flushBuffer();
         } else if (!flushTimeout) {
            flushTimeout = setTimeout(() => {
               flushBuffer();
               flushTimeout = null;
            }, 50);
         }
      };

      self.show = function(...data) { customPrint(data.join(' ')); };

      // Polyfill console to route outputs directly to the Notebook cell
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;
      const originalInfo = console.info;

      const safeSerialize = (val) => {
         if (typeof val === 'string') return val;
         try { return JSON.stringify(val); }
         catch (e) { return String(val); }
      };

      console.log = function(...args) { customPrint(args.map(safeSerialize).join(' ')); originalLog.apply(console, args); };
      console.info = function(...args) { customPrint(args.map(safeSerialize).join(' ')); originalInfo.apply(console, args); };
      console.warn = function(...args) { customPrint('WARN: ' + args.map(safeSerialize).join(' ')); originalWarn.apply(console, args); };
      console.error = function(...args) { customPrint('ERROR: ' + args.map(safeSerialize).join(' ')); originalError.apply(console, args); };

      self.insertHTML = function(html) {
        if (currentCellId) self.postMessage({ type: 'html', cellId: currentCellId, data: html });
      };

      // Advanced Helper: lets you write standard JS functions in the cell, but executes them on the Main UI thread!
      self.displayOnMainThread = function(html, scriptFunction, args = []) {
        const scriptStr = '(' + scriptFunction.toString() + ').apply(window, ' + JSON.stringify(args) + ');';
        self.insertHTML(html + '\\n<script>\\n' + scriptStr + '\\n</script>');
      };

      self.addEventListener('message', async (e) => {
        const { cellId, code, command } = e.data;
        
        if (command === 'execute') {
          currentCellId = cellId;
          executionCount++;
          outputLinesCount = 0;
          self.postMessage({ type: 'status', cellId, status: 'executing' });
          let raw_output;
          let errorMsg = '';
          const startTime = performance.now();
          
          try {
            // Using eval in the worker context
            raw_output = eval(code);
            
            // If the code evaluated to a Promise, wait for it to resolve
            if (raw_output && typeof raw_output.then === 'function') {
                raw_output = await raw_output;
            }
          } catch (err) {
            errorMsg = err.toString();
          }

          const endTime = performance.now();
          const executionTime = ((endTime - startTime) / 1000).toFixed(2);
          
          flushBuffer();
          
          self.postMessage({ 
            type: 'done', 
            cellId, 
            raw_output: raw_output === undefined || typeof raw_output === 'object' ? null : String(raw_output), 
            error: errorMsg,
            executionCount,
            executionTime
          });
          // Note: we intentionally do NOT set currentCellId = null;
          // By leaving it, any dangling background asynchronous output 
          // (like unreturned nested Promises or setTimeouts) will attach to the last-executed cell.
        }
      });
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    
    this.kernels[notebookHash] = worker;
  }

  interruptKernel(notebookHash) {
    if (this.kernels[notebookHash]) {
      this.kernels[notebookHash].terminate();
      delete this.kernels[notebookHash];
      this.startKernel(notebookHash); // Spin up immediately
    }
  }

  restartKernel(notebookHash) {
    this.interruptKernel(notebookHash);
  }

  shutdownKernel(notebookHash) {
    if (this.kernels[notebookHash]) {
      this.kernels[notebookHash].terminate();
      delete this.kernels[notebookHash];
    }
    this.markKernelInactive(notebookHash);
  }

  getActiveKernels() {
    return JSON.parse(localStorage.getItem('active_kernels') || "[]");
  }
}

const kernelManager = new KernelManager();
export default kernelManager;
