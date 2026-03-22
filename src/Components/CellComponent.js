import Prism from 'prismjs';
import React, { memo } from 'react';
import CodeEditor from 'react-simple-code-editor';
import 'prismjs/themes/prism.css';
import '../cellstyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Alert from 'react-bootstrap/Alert';
import CellPlot from './CellPlot';
import { Button, Form } from 'react-bootstrap';
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CellComponent = memo((props) => {
  const [editing, setEditing] = React.useState(false);
  const isMarkdown = props.cell_type === 'markdown';
  const showMarkdown = isMarkdown && !editing;

  const onRunClick = () => {
    setEditing(false);
    props.handleRunThisCell(props.cellindex);
  };

  return (
    <div className={`jupyter-cell cell ${props.cellindex === props.active_cell_index ? 'selected' : ''}`} onClick={() => props.changeActiveCellIndex(props.cellindex)}>
      <div style={{ display: 'flex' }} >
        <div className="prompt_container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 5px', marginBottom: '5px' }}>
            <div className={`run_this_cell ${props.cellindex === props.active_cell_index ? '' : 'invisible'}`} title="Run this cell" style={{ cursor: 'pointer', marginRight: '10px' }} onClick={onRunClick}>
              <FontAwesomeIcon icon={faPlay} />
            </div>
            <div className="prompt input_prompt" style={{ flex: 1, textAlign: 'right', whiteSpace: 'nowrap' }}>
              <bdi>In</bdi>&nbsp;[{props.is_executing ? '*' : (props.execution_count !== null ? props.execution_count : ' ')}]:
            </div>
          </div>
          <Form.Select 
            size="sm" 
            value={props.cell_type} 
            onChange={(e) => props.changeCellType(props.cellindex, e.target.value)}
            style={{ width: '80px', fontSize: '10px', padding: '2px 10px 2px 5px', marginBottom: '5px' }}
          >
            <option value="code">Code</option>
            <option value="markdown">MD</option>
          </Form.Select>
          <bdi className='executionTime'>{props.executionTime} Sec.</bdi>
        </div>
        { showMarkdown ? (
            <div 
               className="markdown-body p-3 w-100" 
               onDoubleClick={() => setEditing(true)} 
               style={{ border: '1px solid #e1e4e8', backgroundColor: '#fdfdfd', cursor: 'text', flex: 1 }}
               title="Double click to edit"
            >
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.editorsValue || '*(Empty Markdown)*'}</ReactMarkdown>
            </div>
        ) : (
          <CodeEditor
            value={props.editorsValue || ''}
            rows={props.rows || 5}
            onValueChange={(newValue) => props.handleEditorChange(newValue, props.cellindex)}
            highlight={code => Prism.highlight(code, Prism.languages.javascript)}
            onKeyDown={props.handleKeyDown}
            padding={10}
            className="input"
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              flex: 1,
            }}
          />
        )}
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
                <bdi>Out[{props.execution_count !== null ? props.execution_count : ' '}]:</bdi>
                <Button className="clear_out_btn" title="delete cell" variant='light' size="sm" onClick={() => props.handleClearOutput(props.cellindex)}>
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
});

export default CellComponent;
