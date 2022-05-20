import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AQTDisplay from './Components/AQTDisplay';
import reportWebVitals from './reportWebVitals';
import { readCSVfile }  from './Services/csvreader.js';
//import registerServiceWorker from './registerServiceWorker';



var config = {}; 

fetch('./config.json')
.then((response) => {
  return response.json()
})
.then((json) => {
  config = json;
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
      //console.log("raw timeline: " + mydata);
      console.log("getting display data");
      let displayData = readCSVfile(mydata);
      //console.log("timelineData: " + timelineData);
      //logIn()
      //.then(runExhibit(displayData));
      // alogin();
      runExhibit(displayData);

    })
    .catch((error) => console.log("csv read error", error));
  })
  .catch((error) => console.log("poi read error", error));
}
)
.catch((error) => console.log("config read error", error));

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
