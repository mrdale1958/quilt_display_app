import React, { useState, useEffect } from 'react';
//import logo from './logo.svg';
import './AQTDisplay.css';
import InteractiveQuiltmap from './InteractiveQuiltMap.js';
import PopupBlock from './PopupBlock.js';
import Data from "./MOCK_DATA.json";
import { GroundOverlay, OverlayView, Polygon, Rectangle, InfoWindow } from '@react-google-maps/api';

function AQTDisplay(props) {
  //const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const [seen, setSeen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(0);

  let polyOverlays = [
    {  lat: props.config.origin.lat, lng: props.config.origin.lng },
    {  lat: props.config.origin.lat + props.config.pitchright.lat, lng: props.config.origin.lng  + props.config.pitchright.lng},
    {  lat: props.config.origin.lat + props.config.pitchright.lat + props.config.pitchdown.lat, lng: props.config.origin.lng + props.config.pitchright.lng + props.config.pitchdown.lng },
    {  lat: props.config.origin.lat + props.config.pitchdown.lat, lng: props.config.origin.lng  + props.config.pitchdown.lng},
    {  lat: props.config.origin.lat + props.config.pitchdown.lat, lng: props.config.origin.lng  + props.config.pitchdown.lng},
    {  lat: props.config.origin.lat + props.config.pitchright.lat + props.config.pitchdown.lat, lng: props.config.origin.lng + props.config.pitchright.lng + props.config.pitchdown.lng },
    {  lat: props.config.origin.lat + props.config.pitchright.lat + 2*props.config.pitchdown.lat, lng: props.config.origin.lng + props.config.pitchright.lng + 2*props.config.pitchdown.lng },
    {  lat: props.config.origin.lat + 2*props.config.pitchdown.lat, lng: props.config.origin.lng  + 2*props.config.pitchdown.lng},
    ];
    let otherPOIs = null;
    const getBlockImage = (blockNum) => {
      const blockLibrary = process.env.REACT_APP_BLOCK_SRC;
      const blockImageName = String(blockNum).padStart(5, '0') + "_files/0/0_0.jpeg";
      return blockLibrary + blockImageName;
    }
    
   
      const blockBorderOptions = {
        fillColor: "lightblue",
        fillOpacity: 0,
        strokeColor: "red",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
        draggable: false,
        editable: false,
        geodesic: false,
        zIndex: 1
      }
      const selectedBlockBorderOptions = {
        fillColor: "lightblue",
        fillOpacity: 0,
        strokeColor: "lightblue",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
        draggable: false,
        editable: false,
        geodesic: false,
        zIndex: 10
      }
        
    const onBlockClick = blockNum => {
      console.log("GroundOverlay onClick block: ", blockNum)
      handleBlockClick(blockNum);
    }
    
    const onRectClick = blockNum => {
      console.log("GroundOverlay onClick blockNum: ", blockNum);
      handleBlockClick(blockNum)
    }
    
    //import Mask from './Mask.js'; Static entry in index.html
    const initQuiltDisplay = () => {
      let db = props.db;
      let config = props.config;
      let selectedBlock = props.selectedBlock;
      let quiltgrid = [];
      let gutters = { lat: 0, lng: 0 };
      for (let col in db) {
        for (let row in db[col]) {
          for (let position in db[col][row]) {
            const rowNum = Number(row) - 1;
            const colNum = Number(col) - 1; 
            let blockBounds =  {
                ne: {lat: config.origin.lat + rowNum * config.gutterWidth.lat +
                        (rowNum + config.positionShift[position].lat) * config.pitchdown.lat * 0.5 +
                        colNum * config.pitchright.lat * 0.5,
                     lng:  config.origin.lng + colNum * config.gutterWidth.lng +
                        (colNum + 0.5 + config.positionShift[position].lng) * config.pitchright.lng * 0.5 +
                        rowNum * config.pitchdown.lng * 0.5
                },
                sw: {lat: config.origin.lat + rowNum * config.gutterWidth.lat +
                        (rowNum + 0.5 + config.positionShift[position].lat) * config.pitchdown.lat * 0.5 +
                        colNum * config.pitchright.lat * 0.5,
                lng: config.origin.lng + colNum * config.gutterWidth.lng +
                        (colNum + config.positionShift[position].lng) * config.pitchright.lng * 0.5 +
                        rowNum * config.pitchdown.lng * 0.5,}
                
              };
            let proposedKey = row + "_" + col + "_" + position;
            //console.info(proposedKey);
            //console.info(gutters);
            //console.info(blockBounds);
            /*
            "floatPane" | "mapPane" | "markerLayer" | "overlayLayer" | "overlayMouseTarget"
    */
              let blockBoundsOnMap = {north: blockBounds.ne.lat,
                south:blockBounds.sw.lat,
                east:blockBounds.ne.lng,
                west:blockBounds.sw.lng};
            quiltgrid.push(
              <div key={proposedKey+"div"}>
               <GroundOverlay
                key={proposedKey+'gnd'}
                url={getBlockImage(db[col][row][position])}
                bounds={blockBoundsOnMap}
                onClick={onBlockClick}
              /> 
             
               <Rectangle
                  key={proposedKey+'rect'}
                  bounds={blockBoundsOnMap} 
                  onClick={onRectClick.bind(this,db[col][row][position])}
                  options={blockBorderOptions}
                        /> 
              { selectedBlock ? <Rectangle
                key={proposedKey+'rect'}
                  bounds={blockBoundsOnMap} 
                  onClick={onRectClick.bind(this,db[col][row][position])}
                  options={selectedBlockBorderOptions}
                  /> : null }
            </div>
            );
          }
          gutters.lat++;
        }
        gutters.lng++;
      }
      
      return quiltgrid;
    }
  let blocksOverlay = [];
   
  React.useEffect(() => { 
    blocksOverlay= initQuiltDisplay();
    console.log("component updated"); });
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
    <InteractiveQuiltmap 
                        config={props.config} 
                        handleBlockClick={handleBlockClick} 
                        selectedBlock={selectedBlock}
                        blocksOverlay={blocksOverlay}
                        otherPOIs={otherPOIs}
                        polyOverlays={polyOverlays}
      
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