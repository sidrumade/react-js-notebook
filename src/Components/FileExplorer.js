import React, { Component } from 'react';
import App from '../App';
import NavDropdown from 'react-bootstrap/NavDropdown';


class FileExplorer extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = props.fileInputRef ;
    // this.notebook_name = props.notebook_name;
    this.notebook_hash = props.notebook_hash;
    this.state = {
      selectedFile: null,
    };
  }

  handleFileSelect = (event) => {
    this.setState({ selectedFile: event.target.files[0] } , ()=>{this.handleOpenClick();});
  };

  handleOpenClick = () => {
    if (!this.state.selectedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const fileContents = event.target.result;
      const stateFromFile = JSON.parse(fileContents);
      const notebook_name = stateFromFile.notebook_name;
      localStorage.setItem(`stateData#${this.notebook_hash}`, JSON.stringify(stateFromFile));
      console.log('================',notebook_name);
      if (notebook_name.trim() === ''){
        notebook_name = 'untitled'
      }
      window.open(`/${notebook_name}.jsnb/?notebook_hash=${this.notebook_hash}`, '_blank');
    };
    fileReader.readAsText(this.state.selectedFile);
  };

  render() {
    return (
      <>
        <NavDropdown.Item onClick={() => {this.fileInputRef.current.click();this.handleOpenClick();}} >Open...</NavDropdown.Item>
        <div>
        <input type="file" accept=".jsnb" onChange={this.handleFileSelect} ref={this.fileInputRef} style={{display: 'none'}} />
      </div>
      </>
      

    );
  }
}

export default FileExplorer;
