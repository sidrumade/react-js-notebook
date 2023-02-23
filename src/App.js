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

import CellPlot from './Components/CellPlot';

// import run from './Comonents/lib';
class App extends React.Component {

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();

    this.state = {
      result: null,
      cellContext_data: [{
        cellindex_value: 0,
        output: [],
        editorsValue: `var data = [{"x": [1, 2, 3], "y": [2, 6, 3], "type": "scatter", "mode": "lines+markers", "marker": {"color": "red"}}, {"type": "bar", "x": [1, 2, 3], "y": [2, 5, 3]}];

        var layout = {"width": 320, "height": 240, "title": "A Fancy Plot"} ;
        show_graph(data,layout);`,
        rows: 5,
        error: '',
        plotly_input :{'data' : [{"x": [1, 2, 3], "y": [2, 6, 3], "type": "scatter", "mode": "lines+markers", "marker": {"color": "red"}}, {"type": "bar", "x": [1, 2, 3], "y": [2, 5, 3]}],
        layout : {"width": 320, "height": 240, "title": "A Fancy Plot"} }


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
    let plotly_output = [];

    global.show = function (data) {
      output.push(data);
    };

    global.show_graph = (data,layout) =>{
      plotly_output.push({'data':data,'layout':layout});
    }

    

    // execute js code here
    let code = this_component.state.cellContext_data[cellIndex].editorsValue;

    //execute code first 
    global.eval(code);

    if(plotly_output.length === 0){
      let cellContext = this_component.state.cellContext_data[cellIndex];
      cellContext['output'] = output;

      this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex] = cellContext;
        return { cellContext_data: newCellContextData };
      });
    }
    else{
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhhh');
      
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
      },()=>{       console.log('after update',this_component.state.cellContext_data);    });
      
      
    }

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

        <div>
        { this.state.cellContext_data.map((cellData) => (
          cellData.plotly_input ? <CellPlot 
            key={cellData.cellindex_value}
            cellindex_value={cellData.cellindex_value}
            plotly_input={cellData.plotly_input}
          /> : null
        ))}
      </div>


      </div>
    );
  };
};


export default App;