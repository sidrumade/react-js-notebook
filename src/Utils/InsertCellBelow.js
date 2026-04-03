import generateHash from './generateHash';

const InsertCellBelow = (props)=>{

    const cellIndex =  props.cellIndex ;
    const cellContext = {
        id: generateHash(),
        cell_type: 'code',
        execution_count: null,
        is_executing: false,
        cellindex_value: cellIndex+1,
        output : [],
        editorsValue : '',
        rows : 5,
        plotly_input : {}
      };

    props.this_component.setState(prevState => {
        const newCellContextData = [...prevState.cellContext_data];
        let targetIndex = cellIndex;
        let newActiveIndex = prevState.active_cell_index;

        if (typeof newCellContextData[targetIndex+1] === "undefined" || props.force === true ) { 
          newCellContextData.splice(targetIndex+1, 0, cellContext);
          newActiveIndex = targetIndex + 1;
        }
        else {
          if (typeof newCellContextData[targetIndex+1] != "undefined"){
            newActiveIndex = targetIndex + 1;
          } 
        }

        // Fix cellindex_value attributes
        newCellContextData.forEach((item, idx) => {
          item.cellindex_value = idx;
        });

        return { 'cellContext_data' : newCellContextData , 'active_cell_index': newActiveIndex };
      });

    


}

export default InsertCellBelow;