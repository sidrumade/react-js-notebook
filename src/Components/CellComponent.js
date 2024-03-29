import Prism from 'prismjs';
import React from 'react';
import CodeEditor from 'react-simple-code-editor';
import 'prismjs/themes/prism.css';
import '../cellstyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepForward } from '@fortawesome/free-solid-svg-icons';
import Alert from 'react-bootstrap/Alert';
import CellPlot from './CellPlot';
import { Button } from 'react-bootstrap';
import { faTrash } from "@fortawesome/free-solid-svg-icons";



const CellComponent = (props) => {
  return (
    <div className={`jupyter-cell cell ${props.cellindex === props.active_cell_index ? 'selected' : ''}`} onClick={(e) => { props.changeActiveCellIndex(props.cellindex) }}>
      <div style={{ display: 'flex' }} >
        <div className="prompt_container">
          <div className="prompt input_prompt">
            <bdi>In</bdi>&nbsp;[{props.cellindex + 1}]:
          </div>
          <div className={`run_this_cell ${props.cellindex === props.active_cell_index ? '' : 'hide_element'}`} title="Run this cell">
            <FontAwesomeIcon icon={faStepForward} onClick={ (e)=> props.handleRunThisCell(props.cellindex)} />
          </div>
          <bdi className='executionTime'>{props.executionTime} Sec.</bdi>
        </div>
        <CodeEditor
          value={props.editorsValue || ''}
          rows={props.rows || 5}
          onValueChange={(newValue) => props.handleEditorChange(newValue, props.cellindex)}
          highlight={code => Prism.highlight(code, Prism.languages.javascript)}
          onKeyDown={(e) => props.handleKeyDown(e)}
          padding={10}
          className="input"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            flex: 1,
          }}
        />
      </div>
      {
        props.error ? (<Alert key='danger' variant='danger'>
          {props.error}
        </Alert>) : null
      }
      {
        props.output.length > 0 ? (<div className="output_wrapper" >
          <div className="output output_scroll">
            <div className="output_area">
              <div className="run_this_cell"></div>
              <div className="prompt output_prompt">
                <bdi>Out[{props.cellindex+1}]:</bdi>
                <Button className="clear_out_btn" title="delete cell" variant='light' size="sm" onClick={(e) => { props.handleClearOutput(props.cellindex); }}>
                  <FontAwesomeIcon icon={faTrash} style={{'color':'black'}}/>
                </Button>
              </div>
              <div className="output_subarea output_html rendered_html output_text output_result" dir="auto">
                <div>
                  {props.output.map((value, index) => {
                    let outputString;
                    try {
                      outputString = JSON.stringify(value);
                    } catch (err) {
                      outputString = value;
                      outputString = "Error: " + err.message;
                    }
                    return <pre key={index}>{outputString}</pre>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>) : null}




      <div>
        {
          props.html_element != '' ? <CellPlot
            key={props.cellindex}
            cellindex_value={props.cellindex}
            html_element={props.html_element}
            handleClearOutput = {props.handleClearOutput}
            
          /> : null
        }
      </div>



    </div>
  );
}

export default CellComponent;
