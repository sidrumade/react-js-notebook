// import logo from './logo.svg';
import React from 'react';
import './App.css';
import './notebook.css';
import HeaderComponent from './Comonents/HeaderComponent';
import CellComponent from './Comonents/CellComponent';

import InsertCellBelow from './Utils/InsertCellBelow';
import InsertCellAbove from './Utils/InsertCellAbove';
import MoveCellDown from './Utils/MoveCellDown';
import MoveCellUp from './Utils/MoveCellUp';
import DeleteCell from './Utils/DeleteCell';


// import run from './Comonents/lib';
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      result: null,
      cellContext_data: [{
        cellindex_value: 0,
        output: [],
        editorsValue: `for(var i = 0;i<10 ; i++){
                            show(i);
                            }`,
        rows: 5,
        error: ''
      }],
      run_all: false,
      active_cell_index: 0
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
    global.show = function (data) {
      output.push(data);
    };

    // execute js code here
    let code = this_component.state.cellContext_data[cellIndex].editorsValue;
    global.eval(code);

    let cellContext = this_component.state.cellContext_data[cellIndex];


    cellContext['output'] = output;

    this_component.setState(prevState => {
      const newCellContextData = [...prevState.cellContext_data];
      newCellContextData[cellIndex] = cellContext;
      return { cellContext_data: newCellContextData };
    });

  };


  evalCode = (cellIndex) => {
    try {
      this.run(cellIndex, this);

      let cellContext = this.state.cellContext_data[cellIndex];
      cellContext['error'] = '';
      this.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex] = cellContext;
        return { cellContext_data: newCellContextData };
      });


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


  handleKeyDown = (e, cellindex) => {
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
        rows: 5
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
  InsertCellAboveHandler = (cellIndex) =>{
    InsertCellAbove({ 'this_component': this, 'force': true, 'cellIndex': cellIndex });
  }
  MoveCellDownHandler = (cellIndex) =>{
    MoveCellDown({ 'this_component': this, 'cellIndex': cellIndex });
  }
  MoveCellUpHandler = (cellIndex) =>{
    MoveCellUp({ 'this_component': this, 'cellIndex': cellIndex });
  }
  DeleteCellHandler = (cellIndex) =>{
    DeleteCell({ 'this_component': this, 'cellIndex': cellIndex });
  }


  render = () => {


    return (
      <div className="App">
        <HeaderComponent cellIndex={this.state.active_cell_index} 
        InsertCellBelowHandler={this.InsertCellBelowHandler} 
        InsertCellAboveHandler = {this.InsertCellAboveHandler} 
        MoveCellDownHandler = {this.MoveCellDownHandler}
        MoveCellUpHandler = {this.MoveCellUpHandler}
        DeleteCellHandler = {this.DeleteCellHandler}
        ></HeaderComponent>
        {/* <button value={'Add Cell'}  onClick={ (e)=>{ this.setState({'editorsValue' : [...this.state.editorsValue,''] });}} >Add Cell</button> */}
        <div id="notebook_panel">
          <div id="notebook">
            <div id="notebook-container" className='container'>
              {
                this.state.cellContext_data.map((item, index) => {
                  return <CellComponent rows={item.rows} key={index} cellindex={index} editorsValue={item.editorsValue} handleEditorChange={this.handleEditorChange} handleKeyDown={(e) => this.handleKeyDown(e, index)} output={this.state.cellContext_data && this.state.cellContext_data[index] ? this.state.cellContext_data[index].output : []} active_cell_index={this.state.active_cell_index} changeActiveCellIndex={this.changeActiveCellIndex} error = {item.error} />
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  };
};


export default App;