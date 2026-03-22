import generateHash from './generateHash';

const OpenFile = (props) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const fileContents = event.target.result;
      const stateFromFile = JSON.parse(fileContents);
      let notebook_name = stateFromFile.notebook_name;
      
      const newHash = generateHash();
      stateFromFile.notebook_hash = newHash;
      
      localStorage.setItem(`stateData#${newHash}`, JSON.stringify(stateFromFile));
      
      if (notebook_name.trim() === ''){
        notebook_name = 'untitled'
      }

      window.open(`${window.location.origin}/notebook?notebook_hash=${newHash}`, '_blank');
    };
    fileReader.readAsText(props.this_state.state.selectedFile);
  };


export default  OpenFile;