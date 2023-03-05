async function readData() {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://people.sc.fsu.edu/~jburkardt/data/csv/hw_200.csv";
    const response = await fetch(proxyUrl + url);
    const csv = await response.text();
    const data = new dfd.DataFrame(csv);
    console.log(data);
  }
  
  readData();