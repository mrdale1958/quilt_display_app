export  function getnames() {
    return fetch('http://localhost:3333/nameList')
    .then(data => data.json())
    }

export  function addName(nameobj) {
    return fetch('http://localhost:3333/nameList', {
    method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
    body: JSON.stringify({ nameobj })
    })
    .then(data => data.json())
}
/*       
const getNamesOnBlock = (block_num,noStatusChange=false) => {
    const namesOnBlockQuery = JSON.stringify({
            "query":[
                {"Block #":"=="+[block_num]},
                {"Panel Listing":"==","omit":"true"}],
            "limit":"500","offset":"1",
            "sort":[
                {"fieldName":"Panel Number","sortOrder":"ascend"},
                {"fieldName":"Panel Listing","sortOrder":"ascend"}]});


    find(namesOnBlockQuery)
    .then(json => {
      if (Object.keys(json.response).length === 0) return;
      if ( ! noStatusChange) {
          reportStatus("found " +  
          json.response.data.length +
          " names on Block # " +  block_num );
      }
      //let namesList = ""
      let names = json.response.data.map((datum) => {
        /* searchList += "<li>" + datum.fieldData["Panel Listing"] +
              "(" + datum.fieldData["Panel Number"].charAt(datum.fieldData["Panel Number"].length - 1)+ ")</li>";
              */
             /* 
             return(datum.fieldData["Panel Listing"]);
      });
      props.addNamesToSearch(names);        //setNamesList({...namesDB,block_num:namesList});
      //clearResultsList()
      
  })
  .catch((error) => {
    console.error('Error:', error);
    return Promise.reject();
  })  ;
 } */