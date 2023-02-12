import Prism from 'prismjs';
import React  from 'react';
import CodeEditor from 'react-simple-code-editor';
import 'prismjs/themes/prism.css';
import '../cellstyle.css'

const CellComponent = (props) => {
  
  return (
<div className='jupyter-cell'>
  <div style={{ display: 'flex' }}>
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
    <button style={{ marginLeft: 10 }}>Button</button>
  </div>
  <div className='output'>
    <h4>{props.output} </h4>
  </div>
</div>

    
  );
}

export default CellComponent;
