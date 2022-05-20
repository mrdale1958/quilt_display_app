import React,{ useState }  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AQTDisplay from './Components/AQTDisplay';
import reportWebVitals from './reportWebVitals';
import { readCSVfile }  from './Services/csvreader.js';
//import registerServiceWorker from './registerServiceWorker';


const containerStyle = {
  width: '100%',
  height: '100%'
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
  zoom:23,
  options:{maxZoom:28,
            minZoom:17,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true
          },

  origin : { lat: 37.76907400867421, lng: -122.45866567286548 },
  pitchright : { lat: 1.1e-4, lng: 1.8e-4 },
  pitchdown : { lat: -1.3e-4, lng: 1.50e-4 },
  gutterWidth : { lat: -1.2e-6, lng: 1.25e-6 },
  positionShift : { 
    "a" : { lat: 0, lng: 0},
    "b" : { lat: -0.35, lng: 0.39},
    "c" : { lat: 0.42, lng: 0.32},
    "d" : { lat: 0.07, lng: 0.71},
    "e" : { lat: 0, lng: 0},
    "f" : { lat: -0.35, lng: 0.39},
    "g" : { lat: 0.42, lng: 0.32},
    "h" : { lat: 0.07, lng: 0.71},
  }
}	


fetch('D9355JuneDisplay16052022.txt')
//fetch('D9355JuneDisplay.txt')
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
  //logIn()
  //.then(runExhibit(displayData));
  // alogin();
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
