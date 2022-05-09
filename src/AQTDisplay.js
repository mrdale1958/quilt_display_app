import React, { useState, useEffect } from 'react';
//import logo from './logo.svg';
import './AQTDisplay.css';
import InteractiveQuiltmap from './InteractiveQuiltMap.js';
import Data from "./MOCK_DATA.json";

function AQTDisplay(props) {
  //const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  React.useEffect(() => { console.log("component updated"); });

  var names = props.namesDB;
  if (Object.keys(names).length === 0) names = [{"item": "list"}];
  console.log("block in db", names.length);
  return (
    <div className="AQTDisplay">
    <div>
      <input placeholder="Search the June 2022 Quilt Display" onChange={event => setQuery(event.target.value)}/>
      {          
        names.filter(name => {
          if (query === "") {
            //if query is empty
            return name;
          } else if (post.title.toLowerCase().includes(query.toLowerCase())) {
            //returns filtered array
            return name;
          }
        }).map((block,index) => {
          <div key={index}>
            <p>{block} </p>
          </div>
        })
      }
    </div>
  <InteractiveQuiltmap db={props.db} configData={props.config} namesDB={props.namesDB}/>
    </div>
  );
}

export default AQTDisplay;
