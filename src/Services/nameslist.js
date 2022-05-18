import { logIn, loggedIn, find } from '../Services/quiltDB.js';
var namesList = [];

export  function getnames() {
    return namesList;
    //return fetch('http://localhost:3334/nameList')
    //.then(data => data.json())
    //.catch(error=>console.log(error))
    }

export  function addName(nameobj) {
	return new Promise((resolve, reject) => {
        //let newBody = JSON.stringify( nameobj );
        let newBody =  nameobj ;
    namesList.push(newBody);
    resolve (namesList);
    });
    //return fetch('http://localhost:3334/nameList', {
    //method: 'POST',
    //    headers: {
    //    'Content-Type': 'application/json'
    //    },
    //body: newBody
    //})
    //.then(data => data.json())
    //.catch(error=>{failedAdds++;
        //console.log("addName", "fetch failed");
    //    return Promise.reject(error);
    //})
//}

}
var insertionCount = 0;
var blocksCount = 0;
var namesCount = 0;
var failedAdds = 0;
var blocksToAdd = [];

export const addNamesOnBlock = (block_num) => {return new Promise((resolve, reject) => {
    resolve(JSON.stringify({
        "query":[
            {"Block #":"=="+[block_num]},
            {"Panel Listing":"==","omit":"true"}],
        "limit":"500","offset":"1",
        "sort":[
            {"fieldName":"Panel Number","sortOrder":"ascend"},
            {"fieldName":"Panel Listing","sortOrder":"ascend"}]}));
        }
    ).then( (namesOnBlockQuery) =>
        find(namesOnBlockQuery)
        .then(
            json => {
                if (Object.keys(json.response).length === 0) return;
                //if ( ! noStatusChange) {
                    blocksCount++;
                    namesCount += json.response.data.length;
                    // blocksCount= 352 namesCount= 6034 added=1521 failed=4463 actually added= 1642
                    // blocksCount= 352 namesCount= 6034 added=1582 failed=4448 actually added= 1649
                    //console.log("found ",  
                    //  json.response.data.length,
                    //  " names on Block # ",  block_num, "blocksCount=",blocksCount,"namesCount=",namesCount );
                //}
                //let namesList = ""
                return json.response.data;
            }
        ).then(data =>
        {
            data.map(async (datum) => {
                insertionCount++;

                await addName({"BlockNumber": datum.fieldData["Panel Number"].substring(0,5),
                    "PanelListing":datum.fieldData["Panel Listing"], key:"Search_"+insertionCount})
            //.then(data=>{
                //console.log(insertionCount, "added ", namesList.length);
            //})
            // .catch(error=>console.log("addNamesOnBlock", "fails=", failedAdds))
            })
            return(namesList);
        })
    )
}

export function brokenaddNamesOnBlock  (block_num,noStatusChange=false)  {
	return new Promise((resolve, reject) => {
        //let queueLength = blocksToAdd.push(block_num);
        console.log("adding",block_num);
        if (!loggedIn) {
            console.log(block_num,"addNamesOnBlock not logged in to db")
            return}
       // while (blocksToAdd.length) {
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
                    blocksCount++;
                    namesCount += json.response.data.length;
                    // blocksCount= 352 namesCount= 6034 added=1521 failed=4463 actually added= 1642
                    // blocksCount= 352 namesCount= 6034 added=1582 failed=4448 actually added= 1649
                    //console.log("found ",  
                    //  json.response.data.length,
                    //  " names on Block # ",  block_num, "blocksCount=",blocksCount,"namesCount=",namesCount );
                }
                //let namesList = ""
                json.response.data.map(async (datum) => {
                    await addName({"BlockNumber": datum.fieldData["Panel Number"].substring(0,5),
                        "PanelListing":datum.fieldData["Panel Listing"]})
                    //.then(data=>{
                        insertionCount++;
                        console.log(insertionCount, "added ", namesList.length);
                    //})
                    // .catch(error=>console.log("addNamesOnBlock", "fails=", failedAdds))
                });
                resolve(namesList);
            })
            .catch((error) => {
                console.error('AddNamesOnBlock:', error);
                return Promise.reject();  
            })  ;
        resolve(namesList);
})}