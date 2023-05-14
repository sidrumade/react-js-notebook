// import logo from './logo.svg';
import React from 'react';
import './App.css';
import './notebook.css';
import * as d3 from "d3";
import HeaderComponent from './Components/HeaderComponent';
import CellComponent from './Components/CellComponent';
import InsertCellBelow from './Utils/InsertCellBelow';
import InsertCellAbove from './Utils/InsertCellAbove';
import MoveCellDown from './Utils/MoveCellDown';
import MoveCellUp from './Utils/MoveCellUp';
import DeleteCell from './Utils/DeleteCell';
import HelpComponent from './Components/HelpComponent';
import { Button, Modal } from 'react-bootstrap';


import * as Plotly from 'plotly.js';

import generateHash from './Utils/generateHash';
import { saveAs } from 'file-saver';
import FileExplorer from './Components/FileExplorer';


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
      cellContext_data: [{
        cellindex_value: 0,
        output: [],
        editorsValue: `data=[{ 'x': [1, 2, 3],
        'y': [2, 6, 3],
        'type': 'scatter',
        'mode': 'lines+markers',
        'marker': {'color': 'red'},
      },
      {'type': 'bar', 'x': [1, 2, 3], 'y': [2, 5, 3]}];

layout= {'width': 320, 'height': 240, 'title': 'A Fancy Plot'} `,
        rows: 5,
        error: '',
        plotly_input: {}
      },
      {
        cellindex_value: 1,
        output: [],
        editorsValue: `show_graph(data,layout);`,
        rows: 5,
        error: '',
        plotly_input: {}
      }],
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
    let plotly_output = [];

    global.show = function (data) {
      output.push(data);
    };

    global.show_graph = (data, layout) => {
      plotly_output.push({ 'data': data, 'layout': layout });
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


    global.d3 = d3;
    global.Plotly = Plotly;



    // execute js code here
    let code = this_component.state.cellContext_data[cellIndex].editorsValue;
    try {
      //execute code first 
      // Split the code on ';' or '\n'
      const codeLines = code.split(/;|\n/).filter((line) => line.trim() !== '');
      // Check if the resulting array has a length greater than 1
      const hasMultipleLinesOrStatements = codeLines.length > 1;
      // Check if the code contains a call to show_graph()
      const hasShowGraphCall = /show_graph\s*\(/.test(code.replace(/\s/g, ''));

      if ((hasMultipleLinesOrStatements && hasShowGraphCall)) {
        console.warn('show_graph() function call detected');
        let cellContext = this.state.cellContext_data[cellIndex];
        cellContext['error'] = 'must specify show_graph() function in saperate call';
        this.setState(prevState => {
          const newCellContextData = [...prevState.cellContext_data];
          newCellContextData[cellIndex] = cellContext;
          return { cellContext_data: newCellContextData };
        });
        return 0;
      }
      else {
        global.eval(code);

      }
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


    if (plotly_output.length === 0) {
      let cellContext = this_component.state.cellContext_data[cellIndex];
      cellContext['output'] = output;
      cellContext['plotly_input'] = plotly_output;
      this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex] = cellContext;
        return { cellContext_data: newCellContextData };
      });
    }
    else {

      const data = plotly_output[0].data;
      const layout = plotly_output[0].layout;
      // createGraph(data, layout, container);
      let cellContext = this_component.state.cellContext_data[cellIndex];
      cellContext['plotly_input']['data'] = data;
      cellContext['plotly_input']['layout'] = layout;
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
        plotly_input: {}
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
          newCellContextData[index]['plotly_input'] = {};


        });
        return { 'cellContext_data': newCellContextData };
      });
    }
    else {
      this.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex]['output'] = [];
        newCellContextData[cellIndex]['plotly_input'] = {};
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
                  return <CellComponent rows={item.rows} key={index} cellindex={index} editorsValue={item.editorsValue} handleEditorChange={this.handleEditorChange} handleKeyDown={(e) => this.handleKeyDown(e)} output={this.state.cellContext_data && this.state.cellContext_data[index] ? this.state.cellContext_data[index].output : []} active_cell_index={this.state.active_cell_index} changeActiveCellIndex={this.changeActiveCellIndex} error={item.error} plotly_input={item.plotly_input} handleClearOutput={this.handleClearOutput} />
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
          <Button variant="primary" onClick={this.toggleHelpModalClose}>Understood</Button>
        </Modal.Footer>
      </Modal>


      </div>
    );
  };
};


export default App;