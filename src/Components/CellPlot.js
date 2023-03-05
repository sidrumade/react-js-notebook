import React, { Component } from 'react';
import Plot from 'plotly.js';
import * as d3 from "d3";


class CellPlot extends Component {
  constructor(props) {
    super(props);
    this.plotRef = React.createRef();
  }

  componentDidUpdate() {
    const { cellindex_value, plotly_input } = this.props;
    try{
      Plot.newPlot(this.plotRef.current, plotly_input.data, plotly_input.layout);
    }
    catch(error){   
      return;
    }
  }
  componentDidMount() {
    const { cellindex_value, plotly_input } = this.props;
    try{
      Plot.newPlot(this.plotRef.current, plotly_input.data, plotly_input.layout);
    }
    catch(error){
     
      return;
    }
  }


  render() {
    const { cellindex_value } = this.props;
    return <div style={{'display':'flex' , 'minHeight': '400px'}}>
    
    <div className="prompt output_prompt">
                <bdi>Out[{cellindex_value+1}]:</bdi>
    </div>


      <div id={ `graph_plan_${cellindex_value}` } ref={this.plotRef}>

      </div>
    </div>;
  }
}

export default CellPlot;