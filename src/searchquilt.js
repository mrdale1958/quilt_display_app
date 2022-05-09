
logIn();
//
// globals
//
const pageSize = 100;
const pagingThreshold = 100;
var nameSearchResults = {};
var pageQueue = [];

//
// helper functions
//
const newRedRibbon = (block_num)  => {
    var img = document.createElement("img");
    img.src = "https://upload.wikimedia.org/wikipedia/commons/6/64/Red_Ribbon.svg";
    img.width = 20;
    img.id = block_num + 1;
    return img;
       
}
const onlyUnique = (value, index, self) => { 
        return self.indexOf(value) === index;
}

const clearOverlays = () => {
        viewer.clearOverlays();    
}

const clearSearchbar = () => {
        document.getElementById("search").value = '';
}

const addNameToResults = (name, blockNumber) => {
    let cleanName = name.trim().replace(/\*$/, '').trim();
    let cleanBlockNumber = parseInt(blockNumber);
    if (isNaN(cleanBlockNumber)) return;
    if ( nameSearchResults[cleanName] == undefined) {
        nameSearchResults[cleanName] = [ cleanBlockNumber ];
    } else if ( ! nameSearchResults[cleanName].includes(cleanBlockNumber)) {
        nameSearchResults[cleanName].push(cleanBlockNumber);
    }
}

const reportStatus = (status) => {
    document.getElementById("status").innerHTML = status;
    //document.getElementById("status").style.display="block";

}

const updateStatus = (status) => {
    document.getElementById("status").innerHTML = document.getElementById("status").innerHTML.concat(status);
    //document.getElementById("status").style.display="block";

}

const clearStatus = (status) => {
    document.getElementById("status").innerHTML = "";
    //document.getElementById("status").style.display="none";

}

const clearResultsList = () => {
    nameSearchResults = {};
    document.getElementById("namesList").innerHTML = "";
    document.getElementById("results-box").style.display="none";
    document.getElementById("result-description").innerHTML = "";
}

const addNewResults = ( namesList ) => {
    document.getElementById("results-box").style.display="block";
    document.getElementById("namesList").innerHTML = document.getElementById("namesList").innerHTML.concat(namesList);
}

const addNewResultDescription = ( description ) => {
    document.getElementById("results-box").style.display="block";
    document.getElementById("result-description").innerHTML = description;
}

const buildBlockLink = (blockNum) => {
    let paddedBlockNum = String(blockNum).padStart(4, "0");
    // using blocknum to call flyToBlock because sometimes 0 padded strings get interpreted as octal
    let blockLink = "<a href=# onClick='flyToBlock(" + blockNum + ")' >" + paddedBlockNum + "</a>";
    return(blockLink);

}

//
// query and display functions
//

const showBlockData = (block_num,noStatusChange=false) => {
    var namesOnBlockQuery = JSON.stringify({
            "query":[
                {"Block #":"=="+[block_num]},
                {"Panel Listing":"==","omit":"true"}],
            "limit":"500","offset":"1",
            "sort":[
                {"fieldName":"Panel Number","sortOrder":"ascend"},
                {"fieldName":"Panel Listing","sortOrder":"ascend"}]});


    find(namesOnBlockQuery)
    .then(json => {
        if ( ! noStatusChange) {
            reportStatus("found " +  
            json.response.data.length +
            " names on Block # " +  block_num );
        }
        let namesList = ""
        let names = json.response.data.map((datum) => {
                namesList += "<li>" + datum.fieldData["Panel Listing"] +
                "(" + datum.fieldData["Panel Number"].charAt(datum.fieldData["Panel Number"].length - 1)+ ")</li>";
                return(datum.fieldData["Panel Listing"]);
                });
        clearResultsList()
        addNewResultDescription("Names(panel number) on Block # " +  block_num + "");
        addNewResults(namesList);
    });
 }


const displaySingleBlock = (blockNum=1,searchTerm='') => {
    let columnCount = 100;
    let column = (blockNum % columnCount) - 0.5;
    let x = column / 100.0;
    let row = (( blockNum - column) / columnCount) + 0.5;
    let y = row / 100.0;
    reportStatus("Found &ldquo;" + searchTerm + "&rdquo; on block #" + blockNum + ".");
    let ribbonColumn = (blockNum-1)  % columnCount ;
    let ribbonRow = ( blockNum - ribbonColumn) / columnCount;
    viewer.clearOverlays();
    let ribbon = newRedRibbon(blockNum - 1);
    viewer.addOverlay({
            element: ribbon,
            location: new OpenSeadragon.Point(ribbonColumn/100.0,ribbonRow/100.0),
        } ); 
    new OpenSeadragon.MouseTracker({
            element: ribbon,
            clickHandler: function(event) {
                var target = event.originalEvent.target;
                showBlockData(target.id, true);
            }
        });
    
    viewer.viewport.goHome(true);
    viewer.viewport.panTo(new OpenSeadragon.Point(x,y), false);
    viewer.viewport.zoomTo(FullSizeBlockZoomLevel);
}



const displayMultipleBlocks = (results, searchTerm, lastPageP) => {
    //document.getElementById("result_description").innerHTML = "Found " + results.data.length;
    let namesList = '';
    let blocks = results.data.map((datum) => {
        namesList += "<li><a href=#" +
        datum.fieldData["Block #"] + ">" +
        datum.fieldData["Panel Listing"] + "</a></li>";
        addNameToResults(datum.fieldData["Panel Listing"],datum.fieldData["Block #"]);
        return(parseInt(datum.fieldData["Block #"]));
            });
    // console.log("block count", blocks.length);
    uniqueBlocks = blocks.filter(onlyUnique);
    overlayInfo = uniqueBlocks.map((blockNum)=> {
        blockNum -= 1; // fix the mortals counting from 1
        let column = blockNum % 100;
        let x = column / 100.0;
        let row = ( blockNum - column) / 100;
        let y = row / 100.0;
        let ribbon = newRedRibbon(blockNum);

        viewer.addOverlay({
            element: ribbon,
            location: new OpenSeadragon.Point(x,y),
        })
        new OpenSeadragon.MouseTracker({
            element: ribbon,
            clickHandler: function(event) {
                var target = event.originalEvent.target;
                showBlockData(target.id);
            }
        });
        return({[blockNum]: [x,y,column, row]});
    });

    // 
    // this looks buggy in both cases
    // I think there's an edge case here with a single block that will get weird.
    // some of that will get less weird when I can believe I've filtered out multiple 
    // makers from the return set
    // also the panel count info needs to happen when all pages are loaded. 
    // It would be nice to enumerate the hits also
    //
    let foo = pageQueue.pop();
    if (uniqueBlocks.length === 1) {
        let blockNum = uniqueBlocks[0];
        displaySingleBlock(blockNum, searchTerm);

    } else if ( pageQueue.length === 0 ) {
        // this is where I should display all the returned names
        namesList = "";
        let sortedNames = [];
        for (var name in nameSearchResults)  {
            sortedNames.push(name);
        }
        sortedNames.sort();

        for (var nameIndex in sortedNames)  {
            let name = sortedNames[nameIndex];
            if (nameSearchResults.hasOwnProperty(name)) {
                let blockList = "(";
                if (nameSearchResults[name].length === 1) {
                   let blockLink = buildBlockLink(nameSearchResults[name][0]);
                   blockList = blockList.concat(blockLink);                    
                } else {
                    let sortedBlocks = nameSearchResults[name];
                    sortedBlocks.sort(function(a,b){return(a-b)});
                    for (var block=0; block<(sortedBlocks.length - 1); block++) {
                        let blockLink = buildBlockLink(sortedBlocks[block]);
                        blockList = blockList.concat(blockLink + ",");
                        if ((block % 4) ===1) blockList = blockList.concat("<BR>");
                    }
                    block = nameSearchResults[name].length - 1;
                    blockList = blockList.concat(buildBlockLink(nameSearchResults[name][block]));                    
                }
                blockList = blockList.concat(")");
                if (Object.keys(nameSearchResults).length === 1) {
                    namesList = name + blockList;
                } else {
                    namesList += "<li>" + name + blockList + "</li>";
                }
            }
        }
        addNewResultDescription("Names(block number) matching &ldquo;" +  searchTerm + "&rdquo;");
        addNewResults(namesList);
        viewer.viewport.goHome(false);

     } 
     // else {
    //     document.getElementById("result_description").innerHTML = "Found " + 
    //         results.data.length + 
    //         " panels on " + uniqueBlocks.length + " blocks.";

    // }
}

const displayByPage = (searchTerm='',foundCount=1) => {
    clearOverlays();
    let lastPage = false;
    pagesToDisplay = Math.ceil(foundCount / pageSize)
    reportStatus("Found " + 
        foundCount +
        " matches for &ldquo;" +  searchTerm + "&rdquo;");
    clearResultsList();
    for (var pageNum=0; pageNum<pagesToDisplay; pageNum++) {
        var pageQuery = JSON.stringify({"query":[{"Panel Listing":"*" + [searchTerm]+"*"}],
                    "limit": pageSize, 
                    "offset": pageSize*pageNum+1});
        pageQueue.push(pageNum);
        find(pageQuery)
        .then(json => {
            displayMultipleBlocks(json.response, searchTerm, lastPage);
        });
    }
}

const displayOneBlock = (searchTerm) => {
    var existingBlocksCount = 5989;
    reportStatus("Searching for Block # " + searchTerm + "...");
    if (searchTerm < 1 || searchTerm > existingBlocksCount) {
         viewer.clearOverlays();
         viewer.viewport.goHome(true);
         reportStatus("There are currently " + existingBlocksCount + " blocks in the Quilt. You requested " + searchTerm + ". Please request another block.") ;
         return null;
     
    }
    var blockQuery = JSON.stringify({
        "query":[
            {"Block #":"=="+[searchTerm]},
            {"Panel Listing":"==","omit":"true"}],
        "limit":"500","offset":"1",
        "sort":[{"fieldName":"Panel Number","sortOrder":"ascend"},
            {"fieldName":"Panel Listing","sortOrder":"ascend"}]});

    viewer.clearOverlays();
    find(blockQuery)
    .then(json => {
        let namesList = ""
        let names = json.response.data.map((datum) => {
                
            return(datum.fieldData["Panel Listing"] + " " + 
                "(" + datum.fieldData["Panel Number"].charAt(datum.fieldData["Panel Number"].length - 1) + ")");
        });
        let uniqueNames = names.filter(onlyUnique);
        uniqueNames.map((datum) => {
                namesList += "<li>" + datum + "</li>";
            return;
        });
        reportStatus("Found " + 
            json.response.data.length +
            " names on Block #" +  searchTerm );
        clearSearchbar();
        clearResultsList();
        addNewResultDescription("Names(panel number) on Block # " +  searchTerm + "");
        addNewResults (namesList);
        let blockNum = searchTerm - 1;
        let columnCount = 100;
        let column = blockNum % columnCount;
        let ribbonColumn = blockNum  % columnCount ;
        let x = (column+0.5) / 100.0; // needs to be scaled from 0-99 to 0.0-0.99
        let row = ( blockNum - column) / columnCount;
        let ribbonRow = ( blockNum - ribbonColumn) / columnCount;
        let y = (row + 0.5) / 100.0; // needs to be scaled from 0-99 to 0.0-0.99
        // document.getElementById("search_term").innerHTML = "movingto: " + x + "," + y + "," + (ribbonColumn/100.0) + "," +  (ribbonRow/100.0);
        reportStatus("Found " + uniqueNames.length + " names on Block # " + searchTerm);
        viewer.clearOverlays();
        let ribbon = newRedRibbon(blockNum);
        viewer.addOverlay({
                element: ribbon,
                location: new OpenSeadragon.Point(ribbonColumn/100.0,ribbonRow/100.0),
            } ); 
        new OpenSeadragon.MouseTracker({
                element: ribbon,
                clickHandler: function(event) {
                    var target = event.originalEvent.target;
                }
            });
          
        viewer.viewport.goHome(true);
        viewer.viewport.panTo(new OpenSeadragon.Point(x,y), false);
        viewer.viewport.zoomTo(FullSizeBlockZoomLevel);
    })
    .catch((error) => {
      console.error('Error:', error);
      return Promise.reject();
    });    
}

//
// initiate the search
//

const searchPanelListings = (searchTerm='') => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer "+ authToken);
    let queryURL = "https://aidsquilt.360works.com/fmi/data/v1/databases/PMDB/layouts/DataAPI/_find";
    if (searchTerm === '') {
        searchTerm = document.getElementById("search").value;
        if (searchTerm === '') { 
            return; 
        }
        let blockNumber = parseInt(searchTerm);
        if ( !isNaN(blockNumber)) {
            searchTerm = blockNumber;
        } 
    }
    let queryType = typeof searchTerm;
    switch  (queryType) {
              
    case 'string':
            clearStatus();
            clearResultsList();
            reportStatus("Looking for blocks that include the name &ldquo;" + searchTerm + "&rdquo;...");
            viewer.viewport.goHome(false);
            searchTerm = searchTerm.replace(/\*/g, '').trim();
            var initialQuery = JSON.stringify({"query":[{"Panel Listing":"*"+[searchTerm]+"*"}],"limit": "1", "offset": "1"});

            find(initialQuery)
            .then(json => {
                let foundCount = 0;
                if (Object.keys(json.response).length != 0) {
                    //
                    // empty find result returns respnse == {} but messages will have an FMP error code
                    //
                    foundCount = json.response.dataInfo.foundCount;
                } else {
                    logDBError(json.messages, searchTerm);

                }
                if (foundCount === 0) {
                    reportStatus("Sorry, couldn't find any matches for the name &ldquo;" + searchTerm + "&rdquo;.");
                } else if (foundCount === 1) {
                    displaySingleBlock(json.response.data[0].fieldData["Block #"], searchTerm);
                } else  { //if ( foundCount > pageSize )
                    updateStatus("Found " + foundCount);
                    displayByPage(searchTerm, foundCount);
                }
            })
            .catch((error) => {
              console.error('Error:', error);
              return Promise.reject();
            })  ;
            break;
        case 'number':
            displayOneBlock(searchTerm);
            break;
        
        case 'boolean':
            break;    
    }

    return false; 
    
}  

