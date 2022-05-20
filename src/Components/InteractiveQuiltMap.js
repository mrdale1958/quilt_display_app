import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Polygon, InfoWindow, OverlayView } from '@react-google-maps/api';
import { CircularProgress } from '@mui/material';
import OtherPOIOverlay from './OtherPOIOverlay.js';
import BlockOverlay from './BlockOverlay.js';
import { loggedIn, logIn } from '../Services/quiltDB.js';

const reportStatus = (status) => {
  document.getElementById("status").innerHTML = status;
  //document.getElementById("status").style.display="block";

}


function InteractiveQuiltMap(props) {
  // props.config
  const onClick = () => {
    console.info('I have been clicked!')
  };
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });
  //const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [blocksOverlay, setBlocksOverlay] = useState([]);
  const [POIsOverlay, setPOIsOverlay] = useState([]);
  const [authorised, setAuthorization] = useState(false);
  
  
  const handleBlockClick= (blockNum) => {
    //setSeen(!seen);
    console.log("block click", blockNum);
    //setSelectedBlock(blockNum);
  }

  const demoPOIs = [
    {
      id: "demo001",
      styles: {
        transform: "rotate(51deg)",
        backgroundColor: "red",
        border: "black ridge 1px",
      } ,
      POIBoundsOnMap: {
        north: 37.76864995787339,

        south:37.7686086127902,

        east:-122.45811146142778,
        west:-122.45819460990724
      }
     }
  ]
 
  const buildPOIsOverlay = useCallback((props, map) => {
    let inventory = props.POIs ? props.POIs : demoPOIs;
    let config = props.config;
    let POIs = [];
    for (var POI in inventory) {
      const dut = inventory[POI];
      POIs.push(
        <OtherPOIOverlay 
              map={map}
              bounds={dut.POIBoundsOnMap} 
              key={dut.id}
              boxStyle={dut.styles}
              mapPaneName={OtherPOIOverlay.MAP_PANE} 
              />
    );
    }
    return(POIs)
  },[]); 
  const buildBlocksOverlay = useCallback( (props, map) => {
    let inventory = props.blocks;
    let config = props.config;
    let blocks = [];
    let prevRow, prevColumn, currRow, currColumn;
    //let selectedBlock = props.selectedBlock;
    let gutters = { lat: 0, lng: 0 };
    for (let block in inventory) {
      currRow = Number(inventory[block].row) - 1;
      currColumn = Number(inventory[block].column) - 1; 
      const position = inventory[block].position;

      let blockBounds =  {
          ne: {lat: config.origin.lat + currRow * config.gutterWidth.lat +
                  (currRow + config.positionShift[position].lat) * config.pitchdown.lat * 0.5 +
                  currColumn * config.pitchright.lat * 0.5,
                lng:  config.origin.lng + currColumn * config.gutterWidth.lng +
                  (currColumn + 0.5 + config.positionShift[position].lng) * config.pitchright.lng * 0.5 +
                  currRow * config.pitchdown.lng * 0.5
          },
          sw: {lat: config.origin.lat + currRow * config.gutterWidth.lat +
                  (currRow + 0.5 + config.positionShift[position].lat) * config.pitchdown.lat * 0.5 +
                  currColumn * config.pitchright.lat * 0.5,
                lng: config.origin.lng + currColumn * config.gutterWidth.lng +
                  (currColumn + config.positionShift[position].lng) * config.pitchright.lng * 0.5 +
                  currRow * config.pitchdown.lng * 0.5,}
          
      };
      let blockBoundsOnMap = {
        north: blockBounds.ne.lat,
        south:blockBounds.sw.lat,
        east:blockBounds.ne.lng,
        west:blockBounds.sw.lng
      };
      
      blocks.push(
        <BlockOverlay 
              map={map}
              superBlockLocation={inventory[block].position}
              row={inventory[block].row} 
              col={inventory[block].column} 
              position={position} 
              blockBoundsOnMap={blockBoundsOnMap} 
              blockID={inventory[block]['Block #']}
              key={inventory[block]['Block #'].padStart(5, '0')}
              handleBlockClick={handleBlockClick}
              selected={(props.selectedBlock === inventory[block]['Block #'].padStart(5, '0'))}
              />
    );

    if (prevRow !== currRow) {
      gutters.lat++;
    }
    if (prevColumn !== currColumn) {
      gutters.lng++;
    }
    prevRow = currRow;
    prevColumn = currColumn;
    
  }
  return(blocks)
},[]);

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
const [ searchDBLoaded, setDBLoaded ] = useState(false);

  function buildSearchDB(inventory=props.blocks) {
    if (searchDBLoaded) return;
    for (let block in inventory) {
      props.addNamesToSearch(inventory[block]['Block #'].padStart(5, '0'));
    }
    setDBLoaded(true);
  }
  useEffect(() => {
    console.log("logged in? begin", authorised, loggedIn)

    if (loggedIn ) buildSearchDB();
    else 
      logIn().then(result =>
        {if (loggedIn) setAuthorization(true);
          console.log("logged in? return", authorised, loggedIn)
        }
      );
  },[authorised,buildSearchDB]);
  
  //useEffect(() => {
  //  setBlocksOverlay(buildBlocksOverlay(props));
  //},[buildBlocksOverlay, props]
  //);

  useEffect(() => {
    console.log("dbloaded", searchDBLoaded);
    if (searchDBLoaded) props.refreshMenu();
  },[searchDBLoaded,props])

  const renderMap = () => {
      // wrapping to a function is useful in case you want to access `window.google`
      // to eg. setup options or create latLng object, it won't be available otherwise
      // feel free to render directly if you don't need that
    let mapOptions = props.config.options;
    mapOptions['mapTypeId'] = window.google.maps.MapTypeId.HYBRID;

    return (
      <GoogleMap
        mapContainerStyle={props.config.mapContainerStyle}
        center={props.config.center}
        zoom={props.config.zoom}
        tilt={0}
        options={props.config.options}
        onClick={handleMapClick}
        onLoad={map => {
          setBlocksOverlay(buildBlocksOverlay(props,map));
          setPOIsOverlay(buildPOIsOverlay(props,map));

        }}
      >
        { /* Child components, such as markers, info windows, etc. */}
        {blocksOverlay}
        {POIsOverlay}
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