const OpenFile = (props) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const fileContents = event.target.result;
      const stateFromFile = JSON.parse(fileContents);
      let notebook_name = stateFromFile.notebook_name;
      localStorage.setItem(`stateData#${props.notebook_hash}`, JSON.stringify(stateFromFile));
      if (notebook_name.trim() === ''){
        notebook_name = 'untitled'
      }
      window.open(`/${notebook_name}.jsnb/?notebook_hash=${props.notebook_hash}`, '_blank');
    };
    fileReader.readAsText(props.this_state.state.selectedFile);
  };


export default  OpenFile;