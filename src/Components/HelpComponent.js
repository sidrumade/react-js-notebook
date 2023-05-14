import React from "react";
import '../help.css';


const HelpComponent = () => {
    return (<div className="helpcomponent">
    <h4>Server Information:</h4>
    <p>You are using Javascript notebook.<br></br>
    The version of the notebook server is: <b>1.0.0</b>
    <br></br>
    <br></br>
    <p className = "title">Shortcut1 (Run Current Cell)</p>
    <pre>Ctrl + Enter / Shift + Enter</pre>

    <p className = "title">Shortcut2 (Run Current Cell and go to next Cell)</p>
    <pre>Shift + Enter</pre>

    <p className = "title">Display Variable</p>
    <pre>show(variable_name);</pre>
    
    <p className = "title"> Load External Library</p>
    <pre>loadLibrary('lib url');</pre>

    <p className = "title">Plotly Plot</p>
    <pre>show_graph(data,layout);</pre>
    <p>Note: Data block and plotting block should be in saperate cell</p>



    </p>
    </div>);
        
}

            export default HelpComponent;