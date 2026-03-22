import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from "@fortawesome/free-solid-svg-icons";


class CellPlot extends Component {
  constructor(props) {
    super(props);
    this.plotRef = React.createRef();
  }

  componentDidMount() {
    this.executeScripts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.html_element !== this.props.html_element) {
      this.executeScripts();
    }
  }

  executeScripts() {
    if (this.plotRef.current) {
      // Find all script tags injected via dangerouslySetInnerHTML
      const scripts = this.plotRef.current.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const scriptCode = scripts[i].innerText;
        if (scriptCode && scriptCode.trim() !== '') {
          try {
            // Strictly evaluate within global window context so functions like `renderPlot` attach properly if needed
            window.eval(scriptCode);
          } catch (e) {
            console.error("Error executing injected script:", e);
          }
        }
      }
    }
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