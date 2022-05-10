import React,{ useState }  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AQTDisplay from './AQTDisplay';
import reportWebVitals from './reportWebVitals';
import { readCSVfile }  from './csvreader.js';
//import registerServiceWorker from './registerServiceWorker';
import { logIn, find } from './quiltDB.js';


let spatialDataByRows = {};
let blockList = [];

const containerStyle = {
  width: '1334px',
  height: '740px'
};

const center = {
  lat: 37.76946625350,
  lng: -122.45707076433
};
let config = {
	incomingURL:window.location.href,
	displayData : {},
  mapContainerStyle:containerStyle,
  center:center,
  zoom:19,
  options:{maxZoom:25,
            minZoom:17,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true
          },
  origin : { lat: 37.76909625350, lng: -122.45867076433 },
  pitchright : { lat: 1.1e-4, lng: 1.5e-4 },
  pitchdown : { lat: -1.5e-4, lng: 12.0e-5 },
  gutterWidth : { lat: -18e-6, lng: 0.3e-4 },
  positionShift : { 
    "a" : { lat: 0, lng: 0},
    "b" : { lat: 0, lng: 0.5},
    "c" : { lat: 0.5, lng: 0},
    "d" : { lat: 0.5, lng: 0.5},
  }
}	


fetch('D9355JuneDisplay.txt')
//fetch('D9355JuneDisplay7blocks.txt')
.then((response) => {
    //response => response.clone.text();
  //console.log(response);
  return response.text();
})
.then((mydata) => {
  //console.log("raw timeline: " + mydata);
  console.log("logging in to database");
  let displayData = readCSVfile(mydata);
  //console.log("timelineData: " + timelineData);
  buildDatabase(displayData);

});
const reportStatus = (status) => {
  document.getElementById("status").innerHTML = status;
  //document.getElementById("status").style.display="block";

}

const buildDatabase = (inventory) => {
  let rowData, rowName, positionName, blockNumber;
  //const [namesDB, setNamesList] = useState({});
  //const [spatialDataByRows, setSpatialData] = useState({});

  logIn()
  .then((response) => {
    for (let block in inventory) {
      rowData = inventory[block];
      rowName = rowData["row"];
      positionName = rowData["position"];
      blockNumber = rowData["Block #"];
      blockList.push(blockNumber);
      if (spatialDataByRows[rowData["column"]]) {
        if (spatialDataByRows[rowData["column"]][rowName]) {
          spatialDataByRows[rowData["column"]][rowName][positionName] =  blockNumber ;
        } else {
          spatialDataByRows[rowData["column"]][rowName] = {[positionName]: blockNumber };
        }
      } else {
        spatialDataByRows[rowData["column"]] = { [rowName] : {[positionName]: blockNumber }};
        
      }
      getBlockNames(String(blockNumber).padStart(5, '0'));

  }
  runExhibit(spatialDataByRows);

})
.catch((error) => {
    console.error('Error:', error);
    return Promise.reject();
  })  ;
  
}

const getBlockNames = (block_num,noStatusChange=false) => {
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
      if (Object.keys(json.response).length === 0) return;
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
              //setNamesList({...namesDB,block_num:namesList});
      //clearResultsList()
      
  })
  .catch((error) => {
    console.error('Error:', error);
    return Promise.reject();
  })  ;
 }

 
function runExhibit(displayData) {
  
  ReactDOM.render(
    <React.StrictMode>
      <AQTDisplay db={spatialDataByRows} config={config} blockList={blockList} />
    </React.StrictMode>,
    document.getElementById('root')
  );
  //registerServiceWorker();

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
