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
        editorsValue: `var xData = ['Carmelo<br>Anthony', 'Dwyane<br>Wade',
        'Deron<br>Williams', 'Brook<br>Lopez',
        'Damian<br>Lillard', 'David<br>West',
        'Blake<br>Griffin', 'David<br>Lee',
        'Demar<br>Derozan'];
  
  function getrandom(num , mul) {
      var value = [ ];
      for ( i = 0; i <= num; i++ ) {
          var rand = Math.random() * mul;
          value.push(rand);
      }
      return value;
  }
  
  var yData = [
          getrandom(30 ,10),
          getrandom(30, 20),
          getrandom(30, 25),
          getrandom(30, 40),
          getrandom(30, 45),
          getrandom(30, 30),
          getrandom(30, 20),
          getrandom(30, 15),
          getrandom(30, 43),
      ];
  var colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];
  
  var data = [];
  
  for ( var i = 0; i < xData.length; i ++ ) {
      var result = {
          type: 'box',
          y: yData[i],
          name: xData[i],
          boxpoints: 'all',
          jitter: 0.5,
          whiskerwidth: 0.2,
          fillcolor: 'cls',
          marker: {
              size: 2
          },
          line: {
              width: 1
          }
      };
      data.push(result);
  };
  
  layout = {
      title: 'Points Scored by the Top 9 Scoring NBA Players in 2012',
      yaxis: {
          autorange: true,
          showgrid: true,
          zeroline: true,
          dtick: 5,
          gridcolor: 'rgb(255, 255, 255)',
          gridwidth: 1,
          zerolinecolor: 'rgb(255, 255, 255)',
          zerolinewidth: 2
      },
      margin: {
          l: 40,
          r: 30,
          b: 80,
          t: 100
      },
      paper_bgcolor: 'rgb(243, 243, 243)',
      plot_bgcolor: 'rgb(243, 243, 243)',
      showlegend: false
  };
  show_graph(data, layout);
  `,
        rows: 5,
        error: '',
        plotly_input: {
          'data': [{"type":"box","y":[9.140410835420264,6.916808693676764,3.155867846408552,2.1091300567546742,6.053243209701204,8.038998622618127,6.38556823952361,5.207473620123913,0.1280132905185838,0.9146989550262474,6.151016282968303,1.8809034606742947,2.5768495706343373,3.9321811012921746,2.3595017913050267,7.574944678499806,4.653443132811821,9.274719352738089,6.206142608033163,2.0583639675478373,3.575684017236209,4.9205445327297115,9.170429238551453,6.274778507947687,3.5499502964316134,4.3602467657646615,3.1157780953221947,2.876033287099211,3.0335309259559997,6.838082957578033,5.672049424984882],"name":"Carmelo<br>Anthony","boxpoints":"all","jitter":0.5,"whiskerwidth":0.2,"fillcolor":"cls","marker":{"size":2},"line":{"width":1}},{"type":"box","y":[12.819679191421434,17.58970158682622,16.38906294788757,2.195575763648603,10.475795133625418,5.409651192852309,6.152985758239533,5.070245770455677,3.881400531935235,12.179465145030264,5.8612522922830035,12.488726513250253,3.5741047615620025,2.3924280944039777,14.518555720062373,18.69856277461961,11.75784355969039,15.934156369498535,3.642334001499201,18.632881847787655,17.998872121733303,11.477264016169551,17.511693919915515,12.234079570561835,8.938979027530864,19.589497525031383,19.176082569680755,5.152522380392011,6.248051871141211,18.1877157795399,12.629320222025143],"name":"Dwyane<br>Wade","boxpoints":"all","jitter":0.5,"whiskerwidth":0.2,"fillcolor":"cls","marker":{"size":2},"line":{"width":1}},{"type":"box","y":[20.474648571335667,9.198568185676395,14.352007207736204,0.4129821038804743,23.592365121386035,2.1912644468741194,5.343296994800259,7.35996508177729,0.6617927645422045,4.726386281761891,24.29501814652881,19.205767465888155,23.910453358958993,22.008105603741555,21.778588648222936,23.640583688450654,9.038574939007857,18.6384601413422,22.46105429058093,21.060344980211678,24.97248289469293,0.6953766302602415,4.727051475709063,8.882523944045111,10.80571403437666,18.903688411673333,8.788724461468227,20.67747824628255,4.3391551134524,5.407264278372059,9.17664060764262],"name":"Deron<br>Williams","boxpoints":"all","jitter":0.5,"whiskerwidth":0.2,"fillcolor":"cls","marker":{"size":2},"line":{"width":1}},{"type":"box","y":[3.3783156707269146,14.134580023245897,11.84355912905998,9.22123546314269,22.66411407248283,3.298378426639741,9.36461251373505,22.38282190829962,19.08573091457678,36.27731917089229,34.14298777595074,7.777734655988886,34.0553069870177,39.36149656231483,21.117965400786403,16.846511771284028,6.759928680225649,11.403484363240025,35.031831782395834,23.757600067260505,14.160468005180405,25.00065137895294,25.425569820044398,25.89261202956775,22.208805104124025,19.228773708485033,36.90147799371611,12.787012900723873,9.847116917896663,37.7644351050142,34.20027632454143],"name":"Brook<br>Lopez","boxpoints":"all","jitter":0.5,"whiskerwidth":0.2,"fillcolor":"cls","marker":{"size":2},"line":{"width":1}},{"type":"box","y":[43.95383914823185,40.305344701567655,23.712121034106033,36.17863674546824,1.9865677022204693,31.11576659475685,31.439206757464117,13.856857686794788,9.163408671085119,22.207836847778204,4.841362554162502,32.08188950448051,44.763041089187766,31.624580371464145,2.900898036276551,19.113291940914205,33.96855894974083,42.556490601954145,1.2355044433652662,12.87645390077822,44.57976763319174,32.399198262606944,32.73256644946769,6.566756289454757,36.3511627738038,31.010681314728565,21.952031953730618,38.16806532512404,42.509656084050015,6.618674893262721,42.98296467415414],"name":"Damian<br>Lillard","boxpoints":"all","jitter":0.5,"whiskerwidth":0.2,"fillcolor":"cls","marker":{"size":2},"line":{"width":1}},{"type":"box","y":[10.713176506252273,8.22235663346533,1.6654902201413768,10.03989377991007,28.951543846905388,26.236822973729254,22.87578083623248,28.20919156553479,11.183297176038312,0.2635820284418966,1.5875989964297055,27.391134316452817,0.32370306552523265,22.711795897859194,9.284906274638331,14.491100539188924,4.277926413030864,1.630301001388248,0.054936254855267874,22.31233291564807,29.255369492331386,20.888366290055462,29.968041313055817,22.886407640651196,16.188290627480775,6.613414265766485,29.018344014640558,0.4575915109371276,26.60921528184102,6.973588865839416,29.195191379377448],"name":"David<br>West","boxpoints":"all","jitter":0.5,"whiskerwidth":0.2,"fillcolor":"cls","marker":{"size":2},"line":{"width":1}},{"type":"box","y":[0.36719171402936013,16.18275054976699,18.46476990350546,11.99500761970522,11.905793344795288,16.81574645002196,6.4975331897486015,3.662382062548375,15.40504536167232,19.156627887990698,17.116757354986905,16.068404331532648,5.38337155741152,4.575355119505677,5.43752590530776,19.054001862667377,2.134504169964151,5.363946759647142,2.238176510608638,4.839820071614442,6.482477917587575,12.649932215531665,12.420429324297421,1.765974700647932,16.32917637564384,18.97580449382827,2.158934249041169,12.299486877770999,6.920844614637924,8.551753428628256,14.025971308299406],"name":"Blake<br>Griffin","boxpoints":"all","jitter":0.5,"whiskerwidth":0.2,"fillcolor":"cls","marker":{"size":2},"line":{"width":1}},{"type":"box","y":[14.910638214081697,7.859913226590908,3.960420322100652,2.5406949520189466,0.7952535196328026,3.645364947618174,2.2008514228571703,11.41921473400785,11.868035495369321,11.175964707280544,6.798999694297849,4.680200238800676,0.30237290050969756,0.18267357781402038,12.204785170325952,10.617214395403455,5.000518656698292,2.0765826544268675,7.841042779371751,8.638280928666145,14.074798968296994,5.812977358094099,4.116898376884835,6.146640219128146,8.456383180054258,6.4127402477033195,7.739445310467784,5.497455102326752,4.758599371238692,9.01500179037541,6.585655928284534],"name":"David<br>Lee","boxpoints":"all","jitter":0.5,"whiskerwidth":0.2,"fillcolor":"cls","marker":{"size":2},"line":{"width":1}},{"type":"box","y":[18.71169225099319,6.247030598047354,31.993611044332503,41.76436563331754,36.110702767710734,32.02569371300971,39.21375893998611,37.149103030744605,28.058739819886288,35.330210657272715,30.372609338573188,18.205376032247052,0.790127927831479,30.873854537057355,7.079651206823461,4.153229583736186,42.04830328027043,27.93406299798134,5.332953667766829,35.10717821741246,5.618039555834814,35.70995819179241,34.8523912066849,7.924740140994587,4.0077528605379715,8.289335209646831,0.35293295627296617,38.94285752572678,15.352831722998442,32.22149454547353,21.445490756395177],"name":"Demar<br>Derozan","boxpoints":"all","jitter":0.5,"whiskerwidth":0.2,"fillcolor":"cls","marker":{"size":2},"line":{"width":1}}],
        
        'layout': {
            title: 'Points Scored by the Top 9 Scoring NBA Players in 2012',
            yaxis: {
                autorange: true,
                showgrid: true,
                zeroline: true,
                dtick: 5,
                gridcolor: 'rgb(255, 255, 255)',
                gridwidth: 1,
                zerolinecolor: 'rgb(255, 255, 255)',
                zerolinewidth: 2
            },
            margin: {
                l: 40,
                r: 30,
                b: 80,
                t: 100
            },
            paper_bgcolor: 'rgb(243, 243, 243)',
            plot_bgcolor: 'rgb(243, 243, 243)',
            showlegend: false
        }
                }
        


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

    global.show_graph = (data, layout) => {
      plotly_output.push({ 'data': data, 'layout': layout });
    }



    // execute js code here
    let code = this_component.state.cellContext_data[cellIndex].editorsValue;

    //execute code first 
    global.eval(code);

    if (plotly_output.length === 0) {
      let cellContext = this_component.state.cellContext_data[cellIndex];
      cellContext['output'] = output;

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
      }, () => { console.log('after update', this_component.state.cellContext_data); });

      
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
        rows: 5,
        plotly_input : {}
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


  render = () => {


    return (
      <div className="App">
        <HeaderComponent cellIndex={this.state.active_cell_index}
          InsertCellBelowHandler={this.InsertCellBelowHandler}
          InsertCellAboveHandler={this.InsertCellAboveHandler}
          MoveCellDownHandler={this.MoveCellDownHandler}
          MoveCellUpHandler={this.MoveCellUpHandler}
          DeleteCellHandler={this.DeleteCellHandler}
        ></HeaderComponent>
        {/* <button value={'Add Cell'}  onClick={ (e)=>{ this.setState({'editorsValue' : [...this.state.editorsValue,''] });}} >Add Cell</button> */}
        <div id="notebook_panel">
          <div id="notebook">
            <div id="notebook-container" className='container'>
              {
                this.state.cellContext_data.map((item, index) => {
                  return <CellComponent rows={item.rows} key={index} cellindex={index} editorsValue={item.editorsValue} handleEditorChange={this.handleEditorChange} handleKeyDown={(e) => this.handleKeyDown(e, index)} output={this.state.cellContext_data && this.state.cellContext_data[index] ? this.state.cellContext_data[index].output : []} active_cell_index={this.state.active_cell_index} changeActiveCellIndex={this.changeActiveCellIndex} error={item.error} plotly_input = {item.plotly_input}/>
                })
              }
            </div>
          </div>
        </div>

        {/* <div>
        { this.state.cellContext_data.map((cellData) => (
          cellData.plotly_input ? <CellPlot 
            key={cellData.cellindex_value}
            cellindex_value={cellData.cellindex_value}
            plotly_input={cellData.plotly_input}
          /> : null
        ))}
      </div> */}


      </div>
    );
  };
};


export default App;