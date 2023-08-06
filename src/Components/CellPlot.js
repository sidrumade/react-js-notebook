import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from "@fortawesome/free-solid-svg-icons";


class CellPlot extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { cellindex_value , html_element } = this.props;

    if (!html_element || html_element.trim() === '') {
      return null;
    }

    return  (<div style={{ 'display': 'flex', 'minHeight': '400px' }}>
            <div className="prompt output_prompt">
              <bdi>Out[{cellindex_value + 1}]:</bdi>
              <Button className="clear_out_btn" title="delete cell" variant='light' size="sm" onClick={(e) => { this.props.handleClearOutput(cellindex_value); }}>
                <FontAwesomeIcon icon={faTrash} style={{'color':'black'}} />
              </Button>
            </div>
            <div id={`graph_plan_${cellindex_value}`} ref={this.plotRef} dangerouslySetInnerHTML={{ __html: html_element }}>
            </div>
          </div>);
  }
}

export default React.memo(CellPlot);