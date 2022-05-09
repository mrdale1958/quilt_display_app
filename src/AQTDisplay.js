import React, { useState, useEffect } from 'react';
//import logo from './logo.svg';
import './AQTDisplay.css';
import InteractiveQuiltmap from './InteractiveQuiltMap.js';
import PopupBlock from './PopupBlock.js';
import Data from "./MOCK_DATA.json";



function AQTDisplay(props) {
  //const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const [seen, setSeen] = useState(false);
  const [selectedBlock, setSelection] = useState(0);

  React.useEffect(() => { console.log("component updated"); });
  const toggleSeen = () => { 
    console.log("toggling block");
    setSeen(!seen)};
  const handleBlockClick= (blockNum) => {
    setSeen(!seen);
    console.log("block click", blockNum, seen);
    setSelection(blockNum);
  }

  var popup = seen ? <PopupBlock toggle={toggleSeen} block={selectedBlock} /> : null;
  //var names = props.namesDB;
  //if (Object.keys(names).length === 0) names = [{"item": "list"}];
  //console.log("block in db", names.length);
  return (
    <div className="AQTDisplay">
    {popup}
    <div>
      <input placeholder="Search the June 2022 Quilt Display" onChange={event => setQuery(event.target.value)}/>
      
    </div>
  <InteractiveQuiltmap db={props.db} configData={props.config} handleBlockClick={handleBlockClick}
      
      />
    </div>
  );
}

export default AQTDisplay;

/* {          
        names.filter(name => {
          if (query === "") {
            //if query is empty
            return name;
          } else if (name["Panel Listing"].toLowerCase().includes(query.toLowerCase())) {
            //returns filtered array
            return name;
          }
        }).map((block,index) => {
          <div key={index}>
            <p>{block} </p>
          </div>
        })
      }
      */