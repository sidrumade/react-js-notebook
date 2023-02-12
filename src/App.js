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
      context: {},
      editorsValue: [`var x = 100;show(x);`],
      editorsOutput: [],
      rows: 5,
    }
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.run = this.run.bind(this);

  }


  componentDidMount() {

  }

  componentDidUpdate() {
    // global.myEval('console.log("hello",x);var x=500;');
  }



  handleEditorChange = (newValue, cellindex) => {
    const newEditorsValue = [...this.state.editorsValue];
    newEditorsValue[cellindex] = newValue;
    this.setState({ 'editorsValue': newEditorsValue });
    this.setState({ rows: newEditorsValue[cellindex].split("\n").length });


  }
  run = (code, this_component) => {
    global.show = function (data) {
      console.log("context received in show()---", this_component);
      let all_results = this_component.state.editorsOutput;
      all_results[this_component.state.context.cellindex] = data;
      this_component.setState({ 'editorsOutput': all_results })
    }


    global.eval(code);
  }

  evalCode = (code, context) => {
    try {
      this.run(code, this);
    } catch (error) {
      this.setState({ result: error.toString() });
    }

  };


  handleKeyDown = (e, cellindex) => {
    this.setState({ 'context': { 'cellindex': cellindex } });
    if (e.ctrlKey && e.keyCode === 13) {
      console.log(`Ctrl + Enter pressed on input ${cellindex} ${this.state.editorsValue[cellindex]}`);
      this.evalCode(this.state.editorsValue[cellindex], this.state.context);

    } else if (e.shiftKey && e.keyCode === 13) {
      e.preventDefault();
      this.evalCode(this.state.editorsValue[cellindex], this.state.context);
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
                  return <CellComponent rows={this.state.rows} key={index} cellindex={index} editorsValue={this.state.editorsValue} handleEditorChange={this.handleEditorChange} handleKeyDown={(e) => this.handleKeyDown(e, index)} output={this.state.editorsOutput[index]} />
                })
              }

            </div>
            <div>
              <h2>
                {this.state.result}
              </h2>

            </div>
          </div>
        </div>
      </div>
    );
  };
};


export default App;