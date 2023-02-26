import React, { Component } from 'react';
import App from '../App';

class FileExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
    };
  }

  handleFileSelect = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleOpenClick = () => {
    if (!this.state.selectedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const fileContents = event.target.result;
      const stateFromFile = JSON.parse(fileContents);
      localStorage.setItem('stateData', JSON.stringify(stateFromFile));
      window.open('/file1.jsnb', '_blank');
    };
    fileReader.readAsText(this.state.selectedFile);
  };

  render() {
    return (
      <div>
        <input type="file" accept=".jsnb" onChange={this.handleFileSelect} />
        <button onClick={this.handleOpenClick}>Open</button>
      </div>
    );
  }
}

export default FileExplorer;
