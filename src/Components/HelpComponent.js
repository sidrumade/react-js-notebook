import React from "react";
import '../help.css';


const HelpComponent = () => {
    return (
        <div className="helpcomponent">
            <h4>Notebook Information</h4>
            <div style={{color: 'var(--text-muted)'}}>
              <p>You are using the modern JavaScript Notebook environment, powered by fully isolated Web Workers.<br/>
              Engine Version: <b>2.0</b></p>
            </div>
            
            <hr style={{borderColor: 'var(--border)', margin: '24px 0', opacity: 0.5}} />

            <h4>Keyboard Shortcuts</h4>
            <div className="help-section">
                <p className="title">Run Current Cell</p>
                <pre>Ctrl + Enter</pre>
                <p>Executes the core processing logic or immediately renders the markdown of the currently focused cell without advancing.</p>

                <p className="title">Execute and Advance</p>
                <pre>Shift + Enter</pre>
                <p>Executes the current cell and automatically spotlights the next one. If you are naturally at the bottom, an empty new cell is automatically placed.</p>
                
                <p className="title">Discard Markdown Edits</p>
                <pre>Escape</pre>
                <p>While actively editing a Markdown cell block, pressing Escape instantly wipes out any unsafe text changes and elegantly forces the cell safely back into its original rendered block mode.</p>
            </div>

            <hr style={{borderColor: 'var(--border)', margin: '24px 0', opacity: 0.5}} />

            <h4>Kernel Automation APIs</h4>
            <p style={{marginBottom: '16px', color: 'var(--text-dim)', fontSize: '13px'}}>Since your pure computational logic actively crunches data simultaneously inside a disconnected Background Worker Thread, you possess specialized bridged endpoints giving that thread absolute physical control over the Front-End screen:</p>
            
            <div className="help-section">
                <p className="title">Print Dynamic Output</p>
                <pre>show(variable_name);</pre>
                <p>A specialized native helper method instructed to systematically stringify arrays, strings, and variables, quickly dumping them into the cell's standard logging area.</p>

                <p className="title">Install & Load External Source Code</p>
                <pre>loadLibrary('https://cdn.jsdelivr.net/.../lodash.js');</pre>
                <p>Instantly downloads an external JavaScript dependency via its HTTP CDN, importing its public methods globally into the local computation engine. Ideal for leveraging comprehensive math, AI, or data utilities remotely without reloading.</p>

                <p className="title">Inject Literal HTML</p>
                <pre>insertHTML('&lt;h1&gt;Interactive Chart Title&lt;/h1&gt;');</pre>
                <p>Instead of buffering normal raw code strings into the terminal section, this instruction bypasses execution and firmly cements raw structural HTML directly into a designated "Plot Layout" screen strictly below the cell structure.</p>

                <p className="title">Dominate The Main Thread</p>
                <pre>{"displayOnMainThread('<div id=\"box\"></div>', function(arg) { /* Heavy UI Routines */ }, [arg]);"}</pre>
                <p><b>Advanced Feature.</b> Background background computational environments generally can NEVER communicate with standard Window DOMs natively. By combining standard payload pipelines, this instruction forces the parent structural browser to accept complete interactive script blocks (like sophisticated Plotly canvas graphing scripts or full React hydration events) alongside pure unparsed HTML shells directly from within your hidden calculation variables! A wildly overpowered feature effectively establishing unscripted two-way binding.</p>
            </div>
        </div>
    );
}

export default HelpComponent;