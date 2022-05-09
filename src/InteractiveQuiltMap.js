import React, { Component } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { GroundOverlay, OverlayView, Polygon, Rectangle } from '@react-google-maps/api';
//import QuiltOverlay from './QuiltOverlay';

var handleBlockClick;

const containerStyle = {
  width: '1334px',
  height: '740px'
};

const center = {
  lat: 37.76906625350,
  lng: -122.45864076433
};
const origin = { lat: 37.76906625350, lng: -122.45864076433 };
const pitchright = { lat: 0.54e-4, lng: 0.9e-4 };
const pitchdown = { lat: -0.75e-4, lng: 5.0e-5 };
const gutterWidth = { lat: -9e-6, lng: 0.15e-4 };
const positionShift = { 
  "a" : { lat: 0, lng: 0},
  "b" : { lat: 0, lng: 0.5},
  "c" : { lat: 0.5, lng: 0},
  "d" : { lat: 0.5, lng: 0.5},
}
const row = 0;
const col = 0;
const bounds =
{
  south: origin.lat + row * pitchright.lat - col * pitchdown.lat,
  west: origin.lng + row * pitchright.lng + col * pitchdown.lng,
  north: origin.lat + (row + 1) * pitchright.lat - col * pitchdown.lat,
  east: origin.lng + (col + 1) * pitchdown.lng + row * pitchright.lng
};

const getBlockImage = (blockNum) => {
  const blockLibrary = process.env.REACT_APP_BLOCK_SRC;
  const blockImageName = String(blockNum).padStart(5, '0') + "_files/0/0_0.jpeg";
  return blockLibrary + blockImageName;
}

const paths = [
  {  lat: origin.lat, lng: origin.lng },
  {  lat: origin.lat + pitchright.lat, lng: origin.lng  + pitchright.lng},
  {  lat: origin.lat + pitchright.lat + pitchdown.lat, lng: origin.lng + pitchright.lng + pitchdown.lng },
  {  lat: origin.lat + pitchdown.lat, lng: origin.lng  + pitchdown.lng},
  {  lat: origin.lat + pitchdown.lat, lng: origin.lng  + pitchdown.lng},
  {  lat: origin.lat + pitchright.lat + pitchdown.lat, lng: origin.lng + pitchright.lng + pitchdown.lng },
  {  lat: origin.lat + pitchright.lat + 2*pitchdown.lat, lng: origin.lng + pitchright.lng + 2*pitchdown.lng },
  {  lat: origin.lat + 2*pitchdown.lat, lng: origin.lng  + 2*pitchdown.lng},
  ];

const options = {
  fillColor: "lightblue",
  fillOpacity: 1,
  strokeColor: "red",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}

const onBlockClick = block => {
  console.log("GroundOverlay onClick block: ", block)
}

const onRectClick = blockNum => {
  console.log("GroundOverlay onClick blockNum: ", blockNum);
  handleBlockClick(blockNum)
}

//import Mask from './Mask.js'; Static entry in index.html
const initQuiltDisplay = (db) => {
  let quiltgrid = [];
  let gutters = { lat: 0, lng: 0 };
  for (let col in db) {
    for (let row in db[col]) {
      for (let position in db[col][row]) {
        const rowNum = Number(row) - 1;
        const colNum = Number(col) - 1; 
        let blockBounds =  {
            ne: {lat: origin.lat + rowNum * gutterWidth.lat +
                    (rowNum + positionShift[position].lat) * pitchdown.lat * 0.5 +
                    colNum * pitchright.lat * 0.5,
                 lng:  origin.lng + colNum * gutterWidth.lng +
                    (colNum + 0.5 + positionShift[position].lng) * pitchright.lng * 0.5 +
                    rowNum * pitchdown.lng * 0.5
            },
            sw: {lat: origin.lat + rowNum * gutterWidth.lat +
                    (rowNum + 0.5 + positionShift[position].lat) * pitchdown.lat * 0.5 +
                    colNum * pitchright.lat * 0.5,
            lng: origin.lng + colNum * gutterWidth.lng +
                    (colNum + positionShift[position].lng) * pitchright.lng * 0.5 +
                    rowNum * pitchdown.lng * 0.5,}
            
          };
        let proposedKey = row + "_" + col + "_" + position;
        //console.info(proposedKey);
        //console.info(gutters);
        //console.info(blockBounds);
        /*
        "floatPane" | "mapPane" | "markerLayer" | "overlayLayer" | "overlayMouseTarget"
*/
        quiltgrid.push(
          <div key={proposedKey+"div"}>
           <GroundOverlay
            key={proposedKey+'gnd'}
            url={getBlockImage(db[col][row][position])}
            bounds={{north: blockBounds.ne.lat,
              south:blockBounds.sw.lat,
              east:blockBounds.ne.lng,
              west:blockBounds.sw.lng}}
            onClick={onBlockClick}
          /> 
          <Rectangle
          key={proposedKey+'rect'}
           bounds={{north: blockBounds.ne.lat,
                    south:blockBounds.sw.lat,
                    east:blockBounds.ne.lng,
                    west:blockBounds.sw.lng}} 
                    onClick={onRectClick.bind(this,db[col][row][position])}
                    />
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
  transform: 'rotate(25deg'
};


function InteractiveQuiltMap(props) {
  // props.config
  handleBlockClick=props.handleBlockClick;
  let blockOverlays = initQuiltDisplay(props.db);
  //console.info(paths);
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={24}
        options={{maxZoom:25,minZoom:17}}
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