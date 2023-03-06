import React, { Component } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import OpenFile from '../Utils/OpenFile';

class FileExplorer extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = props.fileInputRef ;
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
    OpenFile({ 'this_state' : this ,'notebook_hash': this.notebook_hash });
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
