const MoveCellDown = (props)=>{
    const cellIndex =  props.cellIndex ;
    if(cellIndex + 1  === props.this_component.state.cellContext_data.length){
      console.log('cant move down');
      return
    }
    

    props.this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        let index1 = cellIndex; // index of first element to swap
        let index2 = cellIndex + 1 ; // index of second element to swap
        [newCellContextData[index1] , newCellContextData[index2]]  = [newCellContextData[index2] , newCellContextData[index1]] 
        newCellContextData.forEach((item, index) => {
          item.cellindex_value = index;
        });

        let newActiveIndex = prevState.active_cell_index;
        if (newActiveIndex === index1) {
            newActiveIndex = index2;
        } else if (newActiveIndex === index2) {
            newActiveIndex = index1;
        }

        return { 'cellContext_data' : newCellContextData, 'active_cell_index': newActiveIndex }
    });



}

export default MoveCellDown;