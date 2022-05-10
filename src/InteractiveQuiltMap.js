import React, { Component } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { GroundOverlay, OverlayView, Polygon, Rectangle } from '@react-google-maps/api';
//import QuiltOverlay from './QuiltOverlay';

var handleBlockClick;



const row = 0;
const col = 0;
/*const bounds =
{
  south: origin.lat + row * pitchright.lat - col * pitchdown.lat,
  west: origin.lng + row * pitchright.lng + col * pitchdown.lng,
  north: origin.lat + (row + 1) * pitchright.lat - col * pitchdown.lat,
  east: origin.lng + (col + 1) * pitchdown.lng + row * pitchright.lng
};*/

const getBlockImage = (blockNum) => {
  const blockLibrary = process.env.REACT_APP_BLOCK_SRC;
  const blockImageName = String(blockNum).padStart(5, '0') + "_files/0/0_0.jpeg";
  return blockLibrary + blockImageName;
}

/*const paths = [
  {  lat: origin.lat, lng: origin.lng },
  {  lat: origin.lat + pitchright.lat, lng: origin.lng  + pitchright.lng},
  {  lat: origin.lat + pitchright.lat + pitchdown.lat, lng: origin.lng + pitchright.lng + pitchdown.lng },
  {  lat: origin.lat + pitchdown.lat, lng: origin.lng  + pitchdown.lng},
  {  lat: origin.lat + pitchdown.lat, lng: origin.lng  + pitchdown.lng},
  {  lat: origin.lat + pitchright.lat + pitchdown.lat, lng: origin.lng + pitchright.lng + pitchdown.lng },
  {  lat: origin.lat + pitchright.lat + 2*pitchdown.lat, lng: origin.lng + pitchright.lng + 2*pitchdown.lng },
  {  lat: origin.lat + 2*pitchdown.lat, lng: origin.lng  + 2*pitchdown.lng},
  ];*/

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
const initQuiltDisplay = (db, config, selectedBlock) => {
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

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
})

const onClick = () => {
  console.info('I have been clicked!')
};

const divStyle = {
  background: 'white',
  border: '1px solid #ccc',
  padding: 0,
  transform: 'rotate(25deg)'
};


function InteractiveQuiltMap(props) {
  // props.config
  handleBlockClick=props.handleBlockClick;
  let blockOverlays = initQuiltDisplay(props.db, props.config, props.selectedBlock);
  console.info(props.config);
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={props.config.mapContainerStyle}
        center={props.config.center}
        zoom={props.config.zoom}
        options={props.config.options}
      >
        { /* Child components, such as markers, info windows, etc. */}
        {blockOverlays}

     
        <></>
      </GoogleMap>
    </LoadScript>
  )
}

export default React.memo(InteractiveQuiltMap);

/*<Polygon
          paths={paths}
          options={options}
        />
        */

        /* */