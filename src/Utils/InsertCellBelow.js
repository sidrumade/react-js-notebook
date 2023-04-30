const InsertCellBelow = (props)=>{

    const cellIndex =  props.cellIndex ;
    const cellContext = {
        cellindex_value: cellIndex+1,
        output : [],
        editorsValue : '',
        rows : 5,
        plotly_input : {}
      };

    props.this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        let active_cell_index = prevState.active_cell_index ;

        if (typeof newCellContextData[active_cell_index+1] === "undefined" || props.force === true ) { // if next cell not available than add empty
          newCellContextData.splice(active_cell_index+1, 0, cellContext); //add output array also
         active_cell_index ++ 
        }
        else {
          //if next cell already exist then set it as active
          if (typeof newCellContextData[active_cell_index+1] != "undefined"){
            active_cell_index ++
          } 
        }
        return { 'cellContext_data' : newCellContextData , 'active_cell_index': active_cell_index };
      });

    


}

export default InsertCellBelow;