import Prism from 'prismjs';
import React, { memo } from 'react';
import CodeEditor from 'react-simple-code-editor';
import 'prismjs/themes/prism.css';
import '../cellstyle.css'
import CellPlot from './CellPlot';

const CellComponent = memo((props) => {
  const [editing, setEditing] = React.useState(false);
  const [originalValue, setOriginalValue] = React.useState('');
  const isMarkdown = props.cell_type === 'markdown';
  const showMarkdown = isMarkdown && !editing;
  const isActive = props.cellindex === props.active_cell_index;

  const onRunClick = (e) => {
    e.stopPropagation();
    setEditing(false);
    props.handleRunThisCell(props.cellindex);
  };

  const handleMdKeyDown = (e) => {
    if (isMarkdown && editing) {
       if (e.key === 'Escape') {
          e.preventDefault();
          props.handleEditorChange(originalValue, props.cellindex);
          setEditing(false);
       } else if (e.shiftKey && e.keyCode === 13) {
          e.preventDefault();
          setEditing(false);
          props.handleKeyDown(e);
       } else if (e.ctrlKey && e.keyCode === 13) {
          e.preventDefault();
          setEditing(false);
          props.handleKeyDown(e);
       }
    } else {
       props.handleKeyDown(e);
    }
  };

  const hasRun = props.execution_count !== null && props.execution_count !== undefined;
  
  let cellStateClass = '';
  if (isActive) cellStateClass = 'active';
  else if (hasRun) cellStateClass = 'ran';

  return (
    <div 
      className={`cell ${cellStateClass} ${isMarkdown ? 'markdown' : ''}`} 
      onClick={() => props.changeActiveCellIndex(props.cellindex)}
    >
      {!showMarkdown && (
        <div className="cell-header">
          <select 
             className="cell-type-select"
             value={props.cell_type} 
             onChange={(e) => props.changeCellType(props.cellindex, e.target.value)}
          >
             <option value="code">Code</option>
             <option value="markdown">Markdown</option>
          </select>
          {hasRun && !isMarkdown && <span className="cell-exec-time">{props.executionTime} Sec.</span>}
          
          {isMarkdown && editing && (
             <span style={{marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '500'}}>
                Shift+↵ to render
             </span>
          )}

          <div className="cell-actions" style={isMarkdown && editing ? {marginLeft: '12px'} : {}}>
             <button className="icon-btn" title="Move up" onClick={(e) => { e.stopPropagation(); props.MoveCellUpHandler(props.cellindex); }}>
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 11V3M3 7l4-4 4 4"/></svg>
             </button>
             <button className="icon-btn" title="Move down" onClick={(e) => { e.stopPropagation(); props.MoveCellDownHandler(props.cellindex); }}>
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 3v8M3 7l4 4 4-4"/></svg>
             </button>
             <button className="icon-btn" title="Delete" onClick={(e) => { e.stopPropagation(); props.DeleteCellHandler(props.cellindex); }}>
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 3.5h10M5.5 3.5V2h3v1.5M5 5.5v5M9 5.5v5M3.5 3.5l.5 8h6l.5-8"/></svg>
             </button>
             {!isMarkdown && (
               <button className="icon-btn run-btn" onClick={onRunClick} title="Run cell">
                 <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5V2z"/></svg>
               </button>
             )}
          </div>
        </div>
      )}

      {showMarkdown ? (
          <div style={{position: 'relative'}}>
             <div className="md-badge" style={{
                position: 'absolute', top: 8, right: 8, width: 28, height: 16,
                background: 'rgba(239, 159, 39, 0.15)', color: '#EF9F27',
                fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 4, cursor: 'default', userSelect: 'none'
             }}>MD</div>
             <div 
                className="markdown-body cell-code"
                onDoubleClick={() => { setOriginalValue(props.editorsValue); setEditing(true); }} 
                title="Double click to edit"
                style={{cursor: 'text', padding: '8px 16px', minHeight: '30px'}}
                dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parse(props.editorsValue || '*(Empty Markdown)*') : (props.editorsValue || '*(Empty Markdown)*') }}
             >
             </div>
          </div>
      ) : (
        <CodeEditor
          value={props.editorsValue || ''}
          onValueChange={(newValue) => props.handleEditorChange(newValue, props.cellindex)}
          highlight={code => Prism.highlight(code, isMarkdown ? Prism.languages.markdown || Prism.languages.javascript : Prism.languages.javascript)}
          onKeyDown={handleMdKeyDown}
          padding={16}
          className="cell-code"
          placeholder={isMarkdown ? "Type markdown here..." : "// Type code here..."}
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
