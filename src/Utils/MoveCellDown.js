const MoveCellDown = (props)=>{
  console.log(props.this_component.state.cellContext_data,'so initial');

    const cellIndex =  props.cellIndex ;
    if(cellIndex + 1  === props.this_component.state.cellContext_data.length){
      console.log('cant move');
      return
    }
    

    props.this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        console.log('before===',newCellContextData);
        let index1 = cellIndex; // index of first element to swap
        let index2 = cellIndex + 1 ; // index of second element to swap



        [newCellContextData[cellIndex] , newCellContextData[cellIndex+1]]  = [newCellContextData[cellIndex+1] , newCellContextData[cellIndex]] 
        newCellContextData.map((item, index) => {
          newCellContextData[index]['cellindex_value'] = index;
        });

        console.log('after===',newCellContextData);

        return { 'cellContext_data' : newCellContextData }
    });



}

export default MoveCellDown;