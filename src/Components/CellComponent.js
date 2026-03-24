import Prism from 'prismjs';
import React, { memo } from 'react';
import CodeEditor from 'react-simple-code-editor';
import 'prismjs/themes/prism.css';
import '../cellstyle.css'
import CellPlot from './CellPlot';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CellComponent = memo((props) => {
  const [editing, setEditing] = React.useState(false);
  const isMarkdown = props.cell_type === 'markdown';
  const showMarkdown = isMarkdown && !editing;
  const isActive = props.cellindex === props.active_cell_index;

  const onRunClick = (e) => {
    e.stopPropagation();
    setEditing(false);
    props.handleRunThisCell(props.cellindex);
  };

  const hasRun = props.execution_count !== null && props.execution_count !== undefined;
  
  let cellStateClass = '';
  if (isActive) cellStateClass = 'active';
  else if (hasRun) cellStateClass = 'ran';

  return (
    <div 
      className={`cell ${cellStateClass}`} 
      onClick={() => props.changeActiveCellIndex(props.cellindex)}
    >
      <div className="cell-header">
        <span className="cell-exec-label" style={hasRun || props.is_executing ? {} : {color: 'var(--text-dim)'}}>
          In [{props.is_executing ? '*' : (props.execution_count !== null ? props.execution_count : ' ')}]
        </span>
        <select 
           className="cell-type-select"
           value={props.cell_type} 
           onChange={(e) => props.changeCellType(props.cellindex, e.target.value)}
        >
           <option value="code">Code</option>
           <option value="markdown">Markdown</option>
        </select>
        {hasRun && <span className="cell-exec-time">{props.executionTime} Sec.</span>}
        
        <div className="cell-actions">
           <button className="icon-btn" title="Move up" onClick={(e) => { e.stopPropagation(); /* TODO: impl move cell up prop if passed */ }}>
             <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 11V3M3 7l4-4 4 4"/></svg>
           </button>
           <button className="icon-btn" title="Move down" onClick={(e) => { e.stopPropagation(); /* TODO: impl move cell down prop if passed */ }}>
             <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 3v8M3 7l4 4 4-4"/></svg>
           </button>
           <button className="icon-btn" title="Delete" onClick={(e) => { e.stopPropagation(); /* Delete not passed here, let user clear out */ props.handleClearOutput(props.cellindex) }}>
             <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 3.5h10M5.5 3.5V2h3v1.5M5 5.5v5M9 5.5v5M3.5 3.5l.5 8h6l.5-8"/></svg>
           </button>
           <button className="icon-btn run-btn" onClick={onRunClick} title="Run cell">
             <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5V2z"/></svg>
           </button>
        </div>
      </div>

      {showMarkdown ? (
          <div 
             className="markdown-body cell-code"
             onDoubleClick={() => setEditing(true)} 
             title="Double click to edit"
          >
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.editorsValue || '*(Empty Markdown)*'}</ReactMarkdown>
          </div>
      ) : (
        <CodeEditor
          value={props.editorsValue || ''}
          onValueChange={(newValue) => props.handleEditorChange(newValue, props.cellindex)}
          highlight={code => Prism.highlight(code, Prism.languages.javascript)}
          onKeyDown={props.handleKeyDown}
          className="cell-code"
          placeholder="// Type code here..."
          style={{}}
        />
      )}

      {props.error && (
         <div className="cell-error-output">
           {props.error}
         </div>
      )}

      {props.output?.length > 0 && (
        <div className="cell-output">
          <div className="output-header">
             <span className="output-label">Out [{props.execution_count !== null ? props.execution_count : ' '}]</span>
             <button className="output-clear" title="Clear output" onClick={(e) => { e.stopPropagation(); props.handleClearOutput(props.cellindex) }}>
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 2l8 8M10 2L2 10"/></svg>
             </button>
          </div>
          <div className="output-log">
             {props.output.map((value, index) => {
                let outputString;
                try {
                  if (typeof value === 'string') {
                     outputString = value;
                  } else {
                     outputString = JSON.stringify(value);
                  }
                } catch (err) {
                  outputString = "Error: " + err.message;
                }
                const isSuccess = outputString.toLowerCase().includes("successfully") || outputString.toLowerCase().includes("success");
                return <pre key={index} className={isSuccess ? 'success-text' : ''}>{outputString}</pre>;
             })}
          </div>
        </div>
      )}

      {props.html_element && (
         <div className="cell-plot-area">
            <CellPlot
              key={props.cellindex}
              cellindex_value={props.cellindex}
              execution_count={props.execution_count}
              html_element={props.html_element}
              handleClearOutput={props.handleClearOutput}
            />
         </div>
      )}
    </div>
  );
});

export default CellComponent;
