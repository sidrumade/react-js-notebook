import Prism from 'prismjs';
import React from 'react';
import CodeEditor from 'react-simple-code-editor';
import 'prismjs/themes/prism.css';
import '../cellstyle.css'
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';


const CellComponent = (props) => {

  return (
    <div className='jupyter-cell'>
      <div style={{ display: 'flex' }}>
        <Button variant="outline-secondary" size="sm" style={{
          borderRadius: "50%",
          height: "3em",
          marginRight: "1px",
          transition: "all 0.2s ease-out",
          "&:hover": {
            backgroundColor: "#007bff",
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(0, 123, 255, 0.5)"
          },
          "&:active": {
            backgroundColor: "#0062cc",
            boxShadow: "none"
          }
        }}
        >
          <FontAwesomeIcon icon={faPlay} />
        </Button>
        <CodeEditor
          value={props.editorsValue[props.cellindex]}
          rows={props.rows}
          onValueChange={(newValue) => props.handleEditorChange(newValue, props.cellindex)}
          highlight={code => Prism.highlight(code, Prism.languages.javascript)}
          onKeyDown={(e) => props.handleKeyDown(e, props.cellindex)}
          padding={10}
          className="input"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            flex: 1,
          }}
        />
      </div>
      <div className='output cell_output_block'>
        <div className='output_area'>
          {props.output.map((value, index) => {
            return <div className='output_subarea output_text output_result' key={index}><pre>{value}</pre></div>
          })}
        </div>
      </div>

    </div>


  );
}

export default CellComponent;
