const InsertCellBelow = (props)=>{

    const cellIndex =  props.cellIndex ;
    const cellContext = {
        cellindex_value: cellIndex,
        output : [],
        editorsValue : '',
        rows : 5
      };

    props.this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        let active_cell_index = prevState.active_cell_index ;

        if (typeof newCellContextData[cellIndex+1] === "undefined" || props.force === true ) { // if next cell not available than add empty
         newCellContextData.splice(cellIndex+1, 0, cellContext); //add output array also
         active_cell_index ++ 
        }
        else {
          //if next cell already exist then set it as active
          active_cell_index ++ 
            }

      
        return { 'cellContext_data' : newCellContextData , 'active_cell_index': active_cell_index };
      });

    


}

export default InsertCellBelow;