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
  const [selectedBlock, setSelectedBlock] = useState(0);

  React.useEffect(() => { console.log("component updated"); });
  const toggleSeen = () => { 
    console.log("toggling block");
    setSeen(!seen)};
  const handleBlockClick= (blockNum) => {
    setSeen(!seen);
    console.log("block click", blockNum, seen);
    setSelectedBlock(blockNum);
  }

  var popup = seen ? <PopupBlock toggle={toggleSeen} block={selectedBlock} /> : null;
  //var names = props.namesDB;
  //if (Object.keys(names).length === 0) names = [{"item": "list"}];
  //console.log("block in db", names.length);
  return (
    <div className="AQTDisplay">
    {popup}
    <div>
      <form onSubmit={(event) => { 
        console.log("submit search for", event.target.value);
      setSelectedBlock(event.target.value)}} >
      <input className="search" placeholder="Search the June 2022 Quilt Display" 
      onChange={event => setQuery(event.target.value)}
      />
      </form>
      
    </div>
    <InteractiveQuiltmap db={props.db} config={props.config} handleBlockClick={handleBlockClick} selectedBlock={selectedBlock}
      
      />
      {          
        props.blockList.filter(name => {
          if (query === "") {
            //if query is empty
            return name;
          } else if (name.toLowerCase().includes(query.toLowerCase())) {
            //returns filtered array
            return name;
          }
        }).map((block,index) => {
          <div className="box" key={index}>
            <p>{block} </p>
          </div>
        })
      }
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