import React, { Component } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { GroundOverlay, Polygon } from '@react-google-maps/api';

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
const pitchdown = { lat: 0.81e-4, lng: 5.0e-5 };
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
  const blockLibrary = "https://atecquilt.utdallas.edu/quiltdata/pyramids6000/";
  const blockImageName = String(blockNum).padStart(5, '0') + "_files/0/0_0.jpeg";
  return blockLibrary + blockImageName;
}

const paths = [
  {  lat: origin.lat, lng: origin.lng },
  {  lat: origin.lat - pitchright.lat, lng: origin.lng  - pitchright.lng},
  {  lat: origin.lat - pitchright.lat - pitchdown.lat, lng: origin.lng - pitchright.lng + pitchdown.lng },
  {  lat: origin.lat - pitchdown.lat, lng: origin.lng  + pitchdown.lng},
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


//import Mask from './Mask.js'; Static entry in index.html
const initQuiltDisplay = (db) => {
  let quiltgrid = [];

  for (let col in db) {
    for (let row in db[col]) {
      for (let position in db[col][row]) {
        let blockBounds =  {
            south: origin.lat + 
                    (row + positionShift[position].lat) * pitchright.lat - 
                    (col + positionShift[position].lat) * pitchdown.lat,
            west: origin.lng + 
                    (row + positionShift[position].lng) * pitchright.lng + 
                    (col + positionShift[position].lng) * pitchdown.lng,
            north: origin.lat + 
                    (row + 1 + positionShift[position].lat) * pitchright.lat - 
                    (col + positionShift[position].lat) * pitchdown.lat,
            east: origin.lng + 
                    (col + 1 + positionShift[position].lng) * pitchdown.lng + 
                    (row + positionShift[position].lng) * pitchright.lng
          };
        let proposedKey = row + "_" + col + "_" + position;
        console.info(proposedKey);
        quiltgrid.push(
        
          <GroundOverlay
            key={proposedKey}
            url={getBlockImage(db[col][row][position])}
            bounds={blockBounds}
          />
        );
      }
    }
  }
  
  return quiltgrid;
}

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
})

function InteractiveQuiltMap(props) {
  // props.config
  let blockOverlays = initQuiltDisplay(props.db);
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={19}
      >
        { /* Child components, such as markers, info windows, etc. */}

        <Polygon
          paths={paths}
          options={options}
        />
        {blockOverlays}
        <></>
      </GoogleMap>
    </LoadScript>
  )
}

export default React.memo(InteractiveQuiltMap);
