// import logo from './logo.svg';
import React from 'react';
import './App.css';
import './notebook.css';
import HeaderComponent from './Comonents/HeaderComponent';
import CellComponent from './Comonents/CellComponent';
// import run from './Comonents/lib';
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      result: null,
      cellContext_data: [{ 
        cellindex_value: 0,
        output: []}],
      run_all: false,
      // cellindex_value: 0,
      editorsValue: [`for(var i = 0;i<10 ; i++){
        show(i);
        }`],
      editorsOutput: [],
      rows: 5,
    }
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.run = this.run.bind(this);

  }


  handleEditorChange = (newValue, cellindex) => {
    const newEditorsValue = [...this.state.editorsValue];
    newEditorsValue[cellindex] = newValue;
    this.setState({ 'editorsValue': newEditorsValue });
    this.setState({ rows: newEditorsValue[cellindex].split("\n").length });


  }

  // run = (cellIndex, this_component) => {

  //   global.show =  function (data) {
  //     let all_results = this_component.state.cellContext_data[cellIndex];  //its dict inside list   [{cellindex},]
  //     if (all_results["initial_run"] === true) {  // all_resukt is dict
  //       // initial_run is true so there is no perior output so directly set new output
  //       let cell_output = all_results["output"].concat(data); //[...,data];
  //       const cellContext = {
  //         initial_run: false,
  //         cellindex_value: cellIndex,
  //         output : cell_output
  //       };

  //       this_component.setState(prevState => {
  //         const newCellContextData = [...prevState.cellContext_data];
  //         newCellContextData[cellIndex] = cellContext;
  //         console.log('after setup====',newCellContextData);
  //         return { cellContext_data: newCellContextData };
  //       });

  //     }
  //     else {
  //       console.log('initial run is false========================');
  //     }
  //   }

  //   // execute js code here
  //   let code = this_component.state.editorsValue[cellIndex];
  //   global.eval(code);

  // }



  run = (cellIndex, this_component) => {
    let output = [];
    global.show = function (data) {
      output.push(data);
    };
  
    // execute js code here
    let code = this_component.state.editorsValue[cellIndex];
    global.eval(code);
  
    let all_results = this_component.state.cellContext_data[cellIndex];
      const cellContext = {
        cellindex_value: cellIndex,
        output: output
      };
  
      this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData[cellIndex] = cellContext;
        return { cellContext_data: newCellContextData };
      });
    
  };
  
  



  
  

  evalCode = (cellIndex) => {
    try {
      this.run(cellIndex, this);
    } catch (error) {
      this.setState({ result: error.toString() });
    }

  };


  handleKeyDown = (e, cellindex) => {
    if (e.ctrlKey && e.keyCode === 13) {
      e.preventDefault();
      console.log('*******control enter');

      const cellIndex = cellindex;
      const cellContext = {
        cellindex_value: cellIndex,
        output : []
      };

      this.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        
        if (typeof newCellContextData[cellIndex] === "undefined") {
          newCellContextData.splice(cellIndex, 0, cellContext);
        } else {
          newCellContextData[cellIndex] = cellContext;
        }
      
        return { cellContext_data: newCellContextData };
      }, () => {
        this.evalCode(cellIndex);
      });
      

      

    }
    else if (e.shiftKey && e.keyCode === 13) {
      e.preventDefault();
      console.log('*******shift enter',);
      
      const cellIndex = cellindex;
      const cellContext = {
        cellindex_value: cellIndex,
        output : []
      };

      this.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        
        if (typeof newCellContextData[cellIndex] === "undefined") {
          newCellContextData.splice(cellIndex, 0, cellContext);
        } else {
          newCellContextData[cellIndex] = cellContext;
        }
      
        return { cellContext_data: newCellContextData };
      }, () => {
        this.evalCode(cellIndex);
      });
      

      // addd extra cell need to varify next cell is present;
      this.setState({ 'editorsValue': [...this.state.editorsValue, ""] });  // addd cell after shift+enter

    }



  }


  render = () => {


    return (
      <div className="App">
        <HeaderComponent></HeaderComponent>
        {/* <button value={'Add Cell'}  onClick={ (e)=>{ this.setState({'editorsValue' : [...this.state.editorsValue,''] });}} >Add Cell</button> */}
        <div id="notebook_panel">
          <div id="notebook">
            <div id="notebook-container" className='container'>
              {
                this.state.editorsValue.map((item, index) => {
                  return <CellComponent rows={this.state.rows} key={index} cellindex={index} editorsValue={this.state.editorsValue} handleEditorChange={this.handleEditorChange} handleKeyDown={(e) => this.handleKeyDown(e, index)} output={this.state.cellContext_data && this.state.cellContext_data[index] ? this.state.cellContext_data[index].output : []} />
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