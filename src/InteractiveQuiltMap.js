import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { GroundOverlay, OverlayView, Polygon, Rectangle, InfoWindow } from '@react-google-maps/api';
import { CircularProgress } from '@mui/material';
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
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });
  const [infoWindow, setInfoWindow] = useState(null);
  
  function handleMapClick(event) {
    console.log("Map clicked: ", JSON.stringify(event.latLng.toJSON()));
    const latLngInfoWindow = <InfoWindow position={event.latLng}><div >{JSON.stringify(event.latLng.toJSON())}</div></InfoWindow>
    setInfoWindow(latLngInfoWindow)
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
  //handleBlockClick=props.handleBlockClick;
  let mapOptions = props.config.options;
  
  const renderMap = () => {
      // wrapping to a function is useful in case you want to access `window.google`
      // to eg. setup options or create latLng object, it won't be available otherwise
      // feel free to render directly if you don't need that
    mapOptions['mapTypeId'] = window.google.maps.MapTypeId.HYBRID;

    return (
      <GoogleMap
        mapContainerStyle={props.config.mapContainerStyle}
        center={props.config.center}
        zoom={props.config.zoom}
        tilt={0}
        options={props.config.options}
        onClick={props.handleBlockClick}
      >
        { /* Child components, such as markers, info windows, etc. */}
        {props.blocksOverlay}
        {props.otherPOIs}
        <Polygon
          paths={props.polyOverlays}
          options={blockBorderOptions}
        />
        {infoWindow}
      </GoogleMap>);
  
  }
  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  return isLoaded ? renderMap() : <CircularProgress />
}


export default React.memo(InteractiveQuiltMap);

/*
        */

        /* */