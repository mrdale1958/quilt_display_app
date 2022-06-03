import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AQTDisplay from './Components/AQTDisplay';
import reportWebVitals from './reportWebVitals';
import { readCSVfile }  from './Services/csvreader.js';
//import registerServiceWorker from './registerServiceWorker';


// TODo cookie for splash/instructions page

var config = {}; 
var latestnames = [];

fetch('./latestNames.json')
.then((response) => {
  return response.json()
})
.then((json) => {
  latestnames = json;
})
.then(() => {
  fetch('./config.json')
.then((response) => {
  return response.json()
})
.then((json) => {
  config = json;
  config.latestNames = latestnames;
  config.debugMode = (window.location.pathname === "/debug") ? true : false;
})
.then(() => {
  fetch('./D9355JuneDisplayPOIs.json')
  .then((response) => {
    return response.json()
  })
  .then((json) => {
    config.POIs = json;
  })
  .then(() => {
    fetch('D9355JuneDisplay16052022.txt')
    //fetch('D9355JuneDisplay.txt')
    //fetch('D9355JuneDisplay7blocks.txt')}
    .then((response) => {
        //response => response.clone.text();
      //console.log(response);
      return response.text();
    })
    .then((mydata) => {
// TODO need aux data
// TODO need coming soon images
      console.log("getting display data");
      let displayData = readCSVfile(mydata);
      
      runExhibit(displayData);

    })
    .catch((error) => console.log("csv read error", error));
  })
  .catch((error) => console.log("poi read error", error));
}
)
.catch((error) => console.log("config read error", error));
}
)
.catch((error) => console.log("latest names read error", error));

function runExhibit(displayData) {
// TODO This method must be called while responding to a user interaction or a device orientation change; otherwise it will fail.
  //document.getElementById('root').requestFullscreen()
  //.catch((error) => {
  //  console.log("full screen error", error)
  //});
  ReactDOM.render(
    <React.StrictMode>
      <AQTDisplay blocks={displayData} config={config} otherPOIs={"otherPOIs"}/>
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
