// import logo from './logo.svg';
import React from 'react';
import './App.css';
import './notebook.css';
import HeaderComponent from './Components/HeaderComponent';
import CellComponent from './Components/CellComponent';
import InsertCellBelow from './Utils/InsertCellBelow';
import InsertCellAbove from './Utils/InsertCellAbove';
import MoveCellDown from './Utils/MoveCellDown';
import MoveCellUp from './Utils/MoveCellUp';
import DeleteCell from './Utils/DeleteCell';
import HelpComponent from './Components/HelpComponent';
import { Button, Modal } from 'react-bootstrap';

import generateHash from './Utils/generateHash';
import { saveAs } from 'file-saver';
import FileExplorer from './Components/FileExplorer';

import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';



// import run from './Comonents/lib';
class App extends React.Component {

  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.queryParams = new URLSearchParams(window.location.search);
    this.notebookHash = this.queryParams.get('notebook_hash');
    this.stateData = null;
    this.notebook_data = {};
    if (this.notebookHash == undefined) {
      this.stateData = null;
      this.notebookHash = generateHash()
    }
    else {
      this.stateData = localStorage.getItem(`stateData#${this.notebookHash}`);
      this.notebook_data = JSON.parse(this.stateData);
      if (this.notebook_data.notebookHash === this.notebookHash) {

      }
    }

    this.state = this.stateData !== null ? JSON.parse(this.stateData) : {
      notebook_hash: this.notebookHash,
      notebook_name: 'untitled',
      showHelp:false,
      cellContext_data: [
        {
          cellindex_value: 0,
          output: [],
          editorsValue:`loadLibrary('https://cdn.plot.ly/plotly-2.24.1.min.js');`,
          rows: 1,
          error: '',
          html_element: '',
          executionTime : 0
        },
        {
          cellindex_value: 1,
          output: [],
          editorsValue: `insertHTML("<div style='height:350px;width:600px;' id='myDiv' ></div>")`,
          rows: 1,
          error: '',
          html_element: '',
          executionTime : 0
        },
        {
        cellindex_value: 2,
        output: [],
        editorsValue: `var frames = [
          {name: 'sine', data: [{x: [], y: []}]},
          {name: 'cosine', data: [{x: [], y: []}]},
          {name: 'circle', data: [{x: [], y: []}]},
        ];
        
        var n = 100;
        for (var i = 0; i < n; i++) {
          var t = i / (n - 1) * 2 - 1;
        
          // A sine wave:
          frames[0].data[0].x[i] = t * Math.PI;
          frames[0].data[0].y[i] = Math.sin(t * Math.PI);
        
          // A cosine wave:
          frames[1].data[0].x[i] = t * Math.PI;
          frames[1].data[0].y[i] = Math.cos(t * Math.PI);
        
          // A circle:
          frames[2].data[0].x[i] = Math.sin(t * Math.PI);
          frames[2].data[0].y[i] = Math.cos(t * Math.PI);
        }
        
        Plotly.newPlot('myDiv', [{
          x: frames[0].data[0].x,
          y: frames[0].data[0].y,
          line: {simplify: false},
        }], {
          xaxis: {range: [-Math.PI, Math.PI]},
          yaxis: {range: [-1.2, 1.2]},
          updatemenus: [{
            buttons: [
              {method: 'animate', args: [['sine']], label: 'sine'},
              {method: 'animate', args: [['cosine']], label: 'cosine'},
              {method: 'animate', args: [['circle']], label: 'circle'}
            ]
          }]
        }).then(function() {
          Plotly.addFrames('myDiv', frames);
        });
        `,
        rows: 40,
        error: '',
        html_element: '',
        executionTime : 0
      },
      ],
      run_all: false,
      active_cell_index: 0,

      folders: [],
      currentFolder: null,
    }




    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.run = this.run.bind(this);
    this.changeActiveCellIndex = this.changeActiveCellIndex.bind(this);
    this.InsertCellBelowHandler = this.InsertCellBelowHandler.bind(this);
    this.InsertCellAboveHandler = this.InsertCellAboveHandler.bind(this);
    this.MoveCellDownHandler = this.MoveCellDownHandler.bind(this);
    this.MoveCellUpHandler = this.MoveCellUpHandler.bind(this);
    this.DeleteCellHandler = this.DeleteCellHandler.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.notebookNameChangeHandler = this.notebookNameChangeHandler.bind(this);
    this.handleDownloadHTML = this.handleDownloadHTML.bind(this);
    this.handleClearOutput = this.handleClearOutput.bind(this);
    this.toggleHelpModalOpen = this.toggleHelpModalOpen.bind(this);
    this.handleRunThisCell = this.handleRunThisCell.bind(this);

  }

  componentDidUpdate() {
    try {
      localStorage.setItem(`stateData#${this.notebookHash}`, JSON.stringify(this.state));
    }
    catch {
      console.log('Error in saving state.');

    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only update the component if the props or state have changed
    return nextState !== this.state;
  }





  handleEditorChange = (newValue, cellindex) => {

    this.setState(prevState => {
      const newCellContextData = [...prevState.cellContext_data];
      newCellContextData[cellindex]['editorsValue'] = newValue;
      newCellContextData[cellindex]['rows'] = newValue.split("\n").length;
      return { cellContext_data: newCellContextData };
    });

  }



  run = (cellIndex, this_component) => {
    let output = [];
    let html_element = [];

    global.show = function (...data) {
      output.push(data.join(' '));
    };

    global.insertHTML = (element) => {
      html_element.push(`${element}`);
    }

    global.loadLibrary=(libraryUrl)=> {
      const script = document.createElement('script');
      script.src = libraryUrl;
      script.async = true;
    
      const callback = () => {
        console.log(`${libraryUrl} loaded`);
      };
    
      script.addEventListener('load', callback);
    
      document.head.appendChild(script);
    }




    // execute js code here
    let code = this_component.state.cellContext_data[cellIndex].editorsValue;
    try {

            
      const startTime = performance.now();
      let raw_output = global.eval(code);
      output.push(`${raw_output}`);

      // End measuring the execution time
      const endTime = performance.now();

      // Calculate the elapsed time in milliseconds
      const executionTime = (endTime - startTime)/1000;
      
      let cellContext = this.state.cellContext_data[cellIndex];
      cellContext['executionTime'] = executionTime.toFixed(2);
      console.log(cellContext['output'],'=====after push');
      this.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex] = cellContext;
        return { cellContext_data: newCellContextData };
      });


      
    }
    catch (error) {
      let cellContext = this.state.cellContext_data[cellIndex];
      cellContext['error'] = error.toString();
      this.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex] = cellContext;
        return { cellContext_data: newCellContextData };
      });
      return 0;
    }


    if (html_element.length === 0) {
      let cellContext = this_component.state.cellContext_data[cellIndex];
      cellContext['output'] = output;
      cellContext['html_element'] = '';  // null if no plotly input
      this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex] = cellContext;
        return { cellContext_data: newCellContextData };
      });
    }
    else {

      const data = html_element[0];  // take 0th html element from list
      
      // createGraph(data, layout, container);
      let cellContext = this_component.state.cellContext_data[cellIndex];
      cellContext['html_element'] = data;
      this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex] = cellContext;
        return { cellContext_data: newCellContextData };
      }, () => { });


    }

  };


  evalCode = (cellIndex) => {
    try {
      const out = this.run(cellIndex, this);
      if (out != 0) {
        let cellContext = this.state.cellContext_data[cellIndex];
        cellContext['error'] = '';

        this.setState(prevState => {
          const newCellContextData = [...prevState.cellContext_data];
          newCellContextData[cellIndex] = cellContext;
          return { cellContext_data: newCellContextData };
        });
      }

    } catch (error) {

      let cellContext = this.state.cellContext_data[cellIndex];
      cellContext['error'] = error.toString();
      this.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex] = cellContext;
        return { cellContext_data: newCellContextData };
      });
    }

  };

  handleRunThisCell =(cell_index)=>{
    this.changeActiveCellIndex(cell_index);
    this.evalCode(this.state.active_cell_index);
  }


  handleKeyDown = (e) => {
    let cellindex = this.state.active_cell_index;

    if (e.ctrlKey && e.keyCode === 13) {
      e.preventDefault();
      this.evalCode(cellindex); //take active index
    }
    else if (e.shiftKey && e.keyCode === 13) {
      e.preventDefault();
      const cellIndex = cellindex;
      const cellContext = {
        cellindex_value: cellIndex,
        output: [],
        editorsValue: '',
        rows: 5,
        html_element: '',
        executionTime : 0
      };

      this.evalCode(cellIndex);
      InsertCellBelow({ 'this_component': this, 'force': false, 'cellIndex': cellIndex });


    }

  }

  changeActiveCellIndex = (cellIndex) => {
    this.setState({ active_cell_index: cellIndex });
  }
  InsertCellBelowHandler = (cellIndex) => {
    InsertCellBelow({ 'this_component': this, 'force': true, 'cellIndex': cellIndex });
  }
  InsertCellAboveHandler = (cellIndex) => {
    InsertCellAbove({ 'this_component': this, 'force': true, 'cellIndex': cellIndex });
  }
  MoveCellDownHandler = (cellIndex) => {
    MoveCellDown({ 'this_component': this, 'cellIndex': cellIndex });
  }
  MoveCellUpHandler = (cellIndex) => {
    MoveCellUp({ 'this_component': this, 'cellIndex': cellIndex });
  }
  DeleteCellHandler = (cellIndex) => {
    DeleteCell({ 'this_component': this, 'cellIndex': cellIndex });
  }

  handleAddFolder = (newFolder) => {
    this.setState((prevState) => ({
      folders: [...prevState.folders, newFolder],
    }));
  };

  handleFolderClick = (folder) => {
    this.setState({ currentFolder: folder });
  };

  notebookNameChangeHandler = (e) => {
    const notebook_name = e.target.value;
    this.setState({ 'notebook_name': notebook_name })
  }

  handleSaveClick = () => {
    const stateToSave = this.state;
    const notebook_name = this.state.notebook_name;
    const blob = new Blob([JSON.stringify(stateToSave)], {
      type: 'text/plain;charset=utf-8',
    });

    saveAs(blob, `${notebook_name}.jsnb`);
  };

  handleDownloadHTML = () => {

    // Clone the document element so that modifications don't affect the actual page
    const clonedElement = document.documentElement.cloneNode(true);

    // Remove the elements you want to ignore
    const elementsToIgnore = clonedElement.querySelectorAll('.ignore-component');
    elementsToIgnore.forEach((element) => element.remove());

    // Create the blob object with the modified HTML
    const html = clonedElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'page.html');
  };

  handleClearOutput = (cellIndex = undefined) => {

    if (cellIndex === undefined) {
      this.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData.map((item, index) => {
          newCellContextData[index]['output'] = [];
          newCellContextData[index]['html_element'] = '';
          newCellContextData[index]['executionTime'] = 0;


        });
        return { 'cellContext_data': newCellContextData };
      });
    }
    else {
      this.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex]['output'] = [];
        newCellContextData[cellIndex]['html_element'] = '';
        newCellContextData[cellIndex]['executionTime'] = 0;
        return { 'cellContext_data': newCellContextData };
      });
    }

  }
  toggleHelpModalClose = () => {
    this.setState({
      showHelp: false
    });
  }

  toggleHelpModalOpen = () => {
    this.setState({
      showHelp: true
    });
  }

  

  render = () => {


    return (
      <div className="App">
        <HeaderComponent cellIndex={this.state.active_cell_index}
          InsertCellBelowHandler={this.InsertCellBelowHandler}
          InsertCellAboveHandler={this.InsertCellAboveHandler}
          MoveCellDownHandler={this.MoveCellDownHandler}
          MoveCellUpHandler={this.MoveCellUpHandler}
          DeleteCellHandler={this.DeleteCellHandler}
          handleSaveClick={this.handleSaveClick}
          notebook_name={this.state.notebook_name}
          notebookHash={this.state.notebookHash}
          notebookNameChangeHandler={this.notebookNameChangeHandler}
          handleDownloadHTML={this.handleDownloadHTML}
          handleClearOutput={this.handleClearOutput}
          toggleHelpModalOpen = {this.toggleHelpModalOpen}
        >
          <FileExplorer notebook_name={this.state.notebook_name} notebook_hash={this.state.notebook_hash} fileInputRef={this.fileInputRef} />

        </HeaderComponent>


        <div id="notebook_panel">
          <div id="notebook">
            <div id="notebook-container" className='container'>
              {
                this.state.cellContext_data.map((item, index) => {
                  return <CellComponent rows={item.rows} key={index} cellindex={index} editorsValue={item.editorsValue} handleEditorChange={this.handleEditorChange} handleKeyDown={(e) => this.handleKeyDown(e)} output={this.state.cellContext_data && this.state.cellContext_data[index] ? this.state.cellContext_data[index].output : []} active_cell_index={this.state.active_cell_index} changeActiveCellIndex={this.changeActiveCellIndex} error={item.error} html_element={item.html_element} handleClearOutput={this.handleClearOutput} handleRunThisCell={this.handleRunThisCell} executionTime = {this.state.cellContext_data[index].executionTime} />
                })
              }
            </div>
          </div>
        </div>

        

      <Modal
        show={this.state.showHelp}
        onHide={this.toggleHelpModalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Javascript Notebook Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HelpComponent/>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="light" size="md" onClick={ (e) => window.open("https://www.linkedin.com/in/siddhesh-rumade-b363621b0/", "_blank")}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="2em" height="2em">
        <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" fill="#0077b5" />
        </svg>
        </Button>

        <Button variant="light" size="md" style={{'marginRight':'auto'}} onClick={ (e) => window.open("https://github.com/sidrumade", "_blank")}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" width="2em" height="2em">
        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
        </Button>
          <Button variant="primary" onClick={this.toggleHelpModalClose}>Understood</Button>
        </Modal.Footer>
      </Modal>


      </div>
    );
  };
};


export default App;