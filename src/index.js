import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AQTDisplay from './AQTDisplay';
import reportWebVitals from './reportWebVitals';
import { readCSVfile }  from './csvreader.js'
//import registerServiceWorker from './registerServiceWorker';

let config = {
	incomingURL:window.location.href,
	displayData : {},
	};


  fetch('D9355JuneDisplay.txt')
  //fetch('D9355JuneDisplay7blocks.txt')
	.then((response) => {
    	//response => response.clone.text();
		//console.log(response);
		return response.text();
	})
	.then((mydata) => {
		//console.log("raw timeline: " + mydata);
		let displayData = readCSVfile(mydata);
		//console.log("timelineData: " + timelineData);
		runExhibit(displayData);

	});

 
function runExhibit(displayData) {
  let spatialDataByRows = {};
  let rowData, rowName, positionName, blockNumber;
  for (let block in displayData) {
    rowData = displayData[block];
    rowName = rowData["row"];
    positionName = rowData["position"];
    blockNumber = rowData["Block #"];
    if (spatialDataByRows[rowData["column"]]) {
      if (spatialDataByRows[rowData["column"]][rowName]) {
        spatialDataByRows[rowData["column"]][rowName][positionName] =  blockNumber ;
      } else {
        spatialDataByRows[rowData["column"]][rowName] = {[positionName]: blockNumber };
      }
    } else {
      spatialDataByRows[rowData["column"]] = { [rowName] : {[positionName]: blockNumber }};
      
    }
  }
  ReactDOM.render(
    <React.StrictMode>
      <AQTDisplay db={spatialDataByRows} configData={config} />
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
