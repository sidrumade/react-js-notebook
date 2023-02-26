import React, { Component } from 'react';
import Plot from 'plotly.js';

class CellPlot extends Component {
  constructor(props) {
    super(props);
    this.plotRef = React.createRef();
  }

  componentDidUpdate() {
    const { cellindex_value, plotly_input } = this.props;
    Plot.newPlot(this.plotRef.current, plotly_input.data, plotly_input.layout);
  }
  componentDidMount() {
    const { cellindex_value, plotly_input } = this.props;
    Plot.newPlot(this.plotRef.current, plotly_input.data, plotly_input.layout);
  }

  render() {
    const { cellindex_value } = this.props;
    return <div id={cellindex_value} ref={this.plotRef}></div>;
  }
}

export default CellPlot;