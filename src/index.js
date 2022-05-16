import React,{ useState }  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AQTDisplay from './Components/AQTDisplay';
import reportWebVitals from './reportWebVitals';
import { readCSVfile }  from './Services/csvreader.js';
//import registerServiceWorker from './registerServiceWorker';


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
  console.log("getting display data");
  let displayData = readCSVfile(mydata);
  //console.log("timelineData: " + timelineData);
  runExhibit(displayData);

});


function runExhibit(displayData) {
  
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
