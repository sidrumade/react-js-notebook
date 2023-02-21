const MoveCellUp = (props)=>{
    const cellIndex =  props.cellIndex ;
    if(cellIndex === 0){
      console.log('cant move up');
      return
    }
    

    props.this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        let index1 = cellIndex; // index of first element to swap
        let index2 = cellIndex-1 ; // index of second element to swap



        [newCellContextData[index1] , newCellContextData[index2]]  = [newCellContextData[index2] , newCellContextData[index1]] 
        newCellContextData.map((item, index) => {
          newCellContextData[index]['cellindex_value'] = index;
        });

        return { 'cellContext_data' : newCellContextData }
    });



}

export default MoveCellUp;