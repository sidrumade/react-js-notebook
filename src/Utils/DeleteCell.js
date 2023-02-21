const DeleteCell = (props)=>{
    const cellIndex =  props.cellIndex ;
    if(0 === props.this_component.state.cellContext_data.length - 1){
      console.log('cant delete the only cell');
      return
    }
    

    props.this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        newCellContextData.splice(cellIndex,1); // delete cellcontext at given index
        
        newCellContextData.map((item, index) => {
          newCellContextData[index]['cellindex_value'] = index;
        });

        return { 'cellContext_data' : newCellContextData }
    });



}

export default DeleteCell;