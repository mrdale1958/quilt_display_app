import { logIn, find } from '../Services/quiltDB.js';

export  function getnames() {
    return fetch('http://localhost:3334/nameList')
    .then(data => data.json())
    }

export  function addName(nameobj) {
    let newBody = JSON.stringify( nameobj );
    return fetch('http://localhost:3334/nameList', {
    method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
    body: newBody
    })
    .then(data => data.json())
}
export function addNamesOnBlock  (block_num,noStatusChange=false)  {
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
          console.log("found " +  
          json.response.data.length +
          " names on Block # " +  block_num );
      }
      //let namesList = ""
      json.response.data.map((datum) => {
        addName({"BlockNumber": datum.fieldData["Panel Number"].charAt(datum.fieldData["Panel Number"].length - 1),
             "PanelListing":datum.fieldData["Panel Listing"]})
        .then(
            console.log("added ", data => data.json())
        )
      })
    })
    .catch((error) => {
        console.error('Error:', error);
        return Promise.reject();
      })  ;
    }