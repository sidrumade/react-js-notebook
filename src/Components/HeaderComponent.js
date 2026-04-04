import React from "react";
import '../header.css';

const HeaderComponent = (props) => {
    return (
        <header className="topbar ignore-component">
            <div className="topbar-logo">
                <div className="logo-icon">⬡</div>
                <input 
                    type='text' 
                    value={props.notebook_name} 
                    className="topbar-title" 
                    onChange={(e)=>props.notebookNameChangeHandler(e)} 
                />
                <span className="topbar-title" style={{marginLeft: '-15px'}}><span>/ notebook</span></span>
            </div>
            
            <div className="topbar-sep"></div>

            <nav className="topbar-nav">
                <div className="nav-dropdown">
                    <button className="nav-btn">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h8M2 12h10"/></svg>
                        Tools
                        <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l4 4 4-4"/></svg>
                    </button>
                    <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={(e)=>props.InsertCellBelowHandler(props.cellIndex)}>
                             Insert Cell Below
                        </button>
                        <button className="dropdown-item" onClick={(e)=>props.InsertCellAboveHandler(props.cellIndex)}>
                             Insert Cell Above
                        </button>
                        <button className="dropdown-item" onClick={(e)=>props.MoveCellUpHandler(props.cellIndex)}>
                             Move Cell Up
                        </button>
                        <button className="dropdown-item" onClick={(e)=>props.MoveCellDownHandler(props.cellIndex)}>
                             Move Cell Down
                        </button>
                        <button className="dropdown-item" style={{color: 'var(--error)'}} onClick={(e)=>props.DeleteCellHandler(props.cellIndex)}>
                             Delete Cell
                        </button>
                        <button className="dropdown-item" onClick={(e)=>props.handleClearOutput()}>
                             Clear Output
                        </button>
                    </div>
                </div>

                <div className="nav-dropdown">
                    <button className="nav-btn">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3l10 10M13 3L3 13"/></svg>
                        Download As
                        <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l4 4 4-4"/></svg>
                    </button>
                    <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={props.handleDownloadHTML}>HTML</button>
                        <button className="dropdown-item" onClick={props.handleSaveClick}>Notebook (.jsnb)</button>
                        <button className="dropdown-item" onClick={(e) => {window.print()}}>PDF</button>
                    </div>
                </div>

                <button className="nav-btn" onClick={props.toggleHelpModalOpen}>Help</button>
            </nav>

            <div className="topbar-right">
                <div className="kernel-badge">
                    <div className={`kernel-dot ${props.isKernelBusy ? 'busy' : ''}`}></div>
                    {props.isKernelBusy ? 'Busy' : 'Ready'}
                </div>
                <button className="btn-run-all" onClick={props.handleRunAll}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5l9 4.5-9 4.5V1.5z"/></svg>
                    Run All
                </button>
            </div>
        </header>
    );
}

export default HeaderComponent;