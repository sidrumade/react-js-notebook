const InsertCellAbove = (props) => {

  const cellIndex = props.cellIndex;
  const cellContext = {
    cellindex_value: cellIndex,
    output: [],
    editorsValue: '',
    rows: 5
  };

  props.this_component.setState(prevState => {
    const newCellContextData = [...prevState.cellContext_data];
    newCellContextData.splice(cellIndex, 0, cellContext); //add output array also
    newCellContextData.map((item, index) => {
      newCellContextData[index]['cellindex_value'] = index;
    });
    return { 'cellContext_data': newCellContextData };
  });




}

export default InsertCellAbove;