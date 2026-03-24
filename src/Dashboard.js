import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import kernelManager from './KernelManager';
import generateHash from './Utils/generateHash';
import './dashboard.css';

const Dashboard = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [activeKernels, setActiveKernels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Collect all notebooks from backend
    fetch('http://localhost:3001/api/notebooks')
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          setNotebooks(data);
        }
      })
      .catch(err => {
        console.error("Error fetching notebooks", err);
      });
  }, []);

  useEffect(() => {
    // Check active kernels periodically (every second) to keep UI fresh
    const interval = setInterval(() => {
      setActiveKernels(kernelManager.getActiveKernels());
    }, 1000);
    setActiveKernels(kernelManager.getActiveKernels());
    return () => clearInterval(interval);
  }, []);

  const handleOpenNotebook = (hash) => {
    window.open(`/notebook?notebook_hash=${hash}`, '_blank');
  };

  const handleNewNotebook = () => {
    const newNotebookState = {
      notebook_name: 'untitled',
      showHelp: false,
      cellContext_data: [
        {
          id: generateHash(),
          cell_type: 'code',
          execution_count: null,
          is_executing: false,
          cellindex_value: 0,
          output: [],
          editorsValue: `// Using markdown\n// Try changing this cell to markdown via Header Controls or keep it as Javascript`,
          rows: 3,
          error: '',
          html_element: '',
          executionTime: 0
        }
      ],
      run_all: false,
      active_cell_index: 0,
      folders: [],
      currentFolder: null,
    };
    fetch('http://localhost:3001/api/notebooks/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotebookState)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setNotebooks([...notebooks, { hash: data.newName, name: data.newName, lastUpdated: new Date().toLocaleTimeString() }]);
        window.open(`/notebook?notebook_hash=${data.newName}`, '_blank');
      }
    }).catch(e => console.error("Error creating new notebook", e));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const fileContents = e.target.result;
        const stateFromFile = JSON.parse(fileContents);
        
        fetch('http://localhost:3001/api/notebooks/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stateFromFile)
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
             setNotebooks(prev => [...prev, { hash: data.newName, name: data.newName, lastUpdated: new Date().toLocaleTimeString() }]);
             window.open(`/notebook?notebook_hash=${data.newName}`, '_blank');
          }
        }).catch(e => console.error("Error parsing/uploading notebook file", e));

      } catch (err) {
        console.error("Error parsing notebook file", err);
        alert("Invalid notebook file");
      }
    };
    fileReader.readAsText(file);
    event.target.value = null; // reset input
  };

  const shutdownKernel = (hash) => {
    kernelManager.shutdownKernel(hash);
    setActiveKernels(kernelManager.getActiveKernels());
  };

  const shutdownAllKernels = () => {
    activeKernels.forEach(hash => kernelManager.shutdownKernel(hash));
    setActiveKernels(kernelManager.getActiveKernels());
  };

  const deleteNotebook = (hash) => {
    if (window.confirm("Are you sure you want to delete this notebook permanently?")) {
      fetch(`http://localhost:3001/api/notebooks/${hash}`, {
        method: 'DELETE'
      }).then(() => {
        kernelManager.shutdownKernel(hash);
        setNotebooks(notebooks.filter(nb => nb.hash !== hash));
        setActiveKernels(kernelManager.getActiveKernels());
      }).catch(e => console.error("Error deleting notebook", e));
    }
  };

  const runningCount = activeKernels.length;
  
  const filteredNotebooks = notebooks.filter(nb => {
    if (nb.name && nb.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    return false;
  });

  return (
    <div className="dashboard-root">
      {/* ── Top Bar ──────────────────────────────────────────────── */}
      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-icon">⬡</div>
          <div className="brand-text">
            <span className="brand-name">NoteKernel</span>
            <span className="brand-sub">Notebook Dashboard</span>
          </div>
        </div>
        <div className="topbar-actions">
          <input
            type="file"
            accept=".jsnb"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6.5 1v5.5L9 9"/><circle cx="6.5" cy="6.5" r="5.5"/></svg>
            Open Notebook
          </button>
          <button className="btn btn-primary" onClick={handleNewNotebook}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1v10M1 6h10"/></svg>
            New Notebook
          </button>
        </div>
      </header>

      {/* ── Layout ───────────────────────────────────────────────── */}
      <div className="dashboard-layout">

        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>Filesystem &amp; Kernels</h1>
            <p>Local file directory and kernel management</p>
          </div>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-val" style={{ color: 'var(--green)' }}>{runningCount}</span>
              <span className="stat-label">Running</span>
            </div>
            <div className="stat-sep"></div>
            <div className="stat">
              <span className="stat-val" style={{ color: 'var(--text-muted)' }}>{notebooks.length - runningCount > 0 ? notebooks.length - runningCount : 0}</span>
              <span className="stat-label">Stopped</span>
            </div>
            <div className="stat-sep"></div>
            <div className="stat">
              <span className="stat-val">{notebooks.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        {/* ── Filesystem Panel ──────────────────────────────────── */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: 'var(--text-muted)' }}><path d="M1 3.5A1.5 1.5 0 012.5 2h3l1.5 2H12.5A1.5 1.5 0 0114 5.5v6A1.5 1.5 0 0112.5 13h-10A1.5 1.5 0 011 11.5v-8z"/></svg>
            <span className="panel-title">Local Storage</span>
            <span className="panel-count">{filteredNotebooks.length}</span>
            <div className="panel-search">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="5.5" cy="5.5" r="4"/><path d="M9 9l2.5 2.5"/></svg>
              <input type="text" placeholder="Search notebooks…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <table className="nb-table">
            <thead>
              <tr>
                <th>Notebook</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotebooks.length === 0 ? (
                <tr>
                  <td colSpan="3">
                    <div className="empty-state">No notebooks found.</div>
                  </td>
                </tr>
              ) : (
                filteredNotebooks.map(nb => {
                  const isRunning = activeKernels.includes(nb.hash);
                  return (
                    <tr key={nb.hash} onClick={(e) => {
                      if (e.target.closest('button')) return;
                      handleOpenNotebook(nb.hash);
                    }}>
                      <td>
                        <div className="nb-name">
                          <div className={`nb-icon ${isRunning ? 'running' : 'stopped'}`}>
                            {isRunning ? '📒' : '📓'}
                          </div>
                          <div>
                            <div className="nb-title">{nb.name}</div>
                            <div className="nb-ext">.jsnb</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {isRunning ? (
                          <span className="badge-status running">
                            <span className="badge-dot"></span> Running
                          </span>
                        ) : (
                          <span className="badge-status stopped">
                            <span className="badge-dot"></span> Stopped
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="act-btn act-open" onClick={(e) => { e.stopPropagation(); handleOpenNotebook(nb.hash); }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 6h9M6 2l4 4-4 4"/></svg>
                            Open
                          </button>
                          <button className="act-btn act-delete" onClick={(e) => { e.stopPropagation(); deleteNotebook(nb.hash); }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 3h8M4.5 3V2h3v1M4 3l.5 7M8 3l-.5 7"/></svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Active Kernels Panel ──────────────────────────────── */}
        <div className="dashboard-panel kernels-panel">
          <div className="panel-header">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: 'var(--green)' }}><circle cx="7" cy="7" r="2.5"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M3.22 3.22l1.41 1.41M9.37 9.37l1.41 1.41M3.22 10.78l1.41-1.41M9.37 4.63l1.41-1.41"/></svg>
            <span className="panel-title">Active Kernels</span>
            <span className="panel-count" style={{ color: 'var(--green)', borderColor: 'rgba(62,207,122,.3)', background: 'var(--green-dim)' }}>{activeKernels.length}</span>
          </div>

          {activeKernels.length === 0 ? (
             <div className="empty-state">No running kernels</div>
          ) : (
             activeKernels.map(hash => {
               const nb = notebooks.find(n => n.hash === hash);
               const name = nb ? nb.name : hash;
               return (
                 <div className="kernel-row" key={hash}>
                   <div className="kernel-indicator"></div>
                   <div className="kernel-info">
                     <div className="kernel-name">{name}</div>
                     <div className="kernel-meta">jsnb · executing</div>
                   </div>
                   <div className="kernel-actions">
                     <button className="act-btn act-open" style={{ padding: '5px 11px', fontSize: '11px' }} onClick={() => handleOpenNotebook(hash)}>Open</button>
                     <button className="act-btn act-shutdown" style={{ padding: '5px 11px', fontSize: '11px' }} onClick={() => shutdownKernel(hash)}>
                       <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 1v4M2.5 3A4 4 0 105 9"/></svg>
                       Shutdown
                     </button>
                   </div>
                 </div>
               );
             })
          )}

          {/* Shutdown All footer */}
          {activeKernels.length > 0 && (
            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border-soft)' }}>
              <button className="act-btn act-shutdown" style={{ width: '100%', justifyContent: 'center', padding: '9px 14px' }} onClick={shutdownAllKernels}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 1.5v4M3 3.5A4.5 4.5 0 106 10.5"/></svg>
                Shutdown All Kernels
              </button>
            </div>
          )}
        </div>

      </div>{/* /layout */}
    </div>
  );
};

export default Dashboard;
