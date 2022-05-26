import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Rectangle, Polygon, InfoWindow, OverlayView, Marker } from '@react-google-maps/api';
import { CircularProgress } from '@mui/material';
import OtherPOIOverlay from './OtherPOIOverlay.js';
import BlockOverlay from './BlockOverlay.js';
import PopupOnCenter from './PopupOnCenter.js';
import { loggedIn, logIn } from '../Services/quiltDB.js';


const FEET_TO_DEGREES_LAT = 3.18e-6;
const FEET_TO_DEGREES_LNG = 3.46e-6;

const reportStatus = (status) => {
  document.getElementById("status").innerHTML = status;
  //document.getElementById("status").style.display="block";
  
}

const streets =
{
  0 : { 
    label: "13", 
    latLon: {"lat":37.76972916238076,"lng":-122.45722264441547}
  }

}

const aves =
{
  0 : { 
    label: "C", 
    latLon: {"lat":37.76965283409231,"lng":-122.45723940822181}
  },
  1 : { 
    label: "D", 
    latLon: {"lat":37.76958816700853,"lng":-122.45716866495904}
  }           

}


function InteractiveQuiltMap(props) {
  // props.config
  const blockBorderOptions = {
    fillColor: "lightblue",
    fillOpacity: 0,
    strokeColor: "white",
    strokeOpacity: 1,
    strokeWeight: 1,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1
  }
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
  const [StreetsAndAvenues, setsRoadSigns] = useState(null);
    
  const [authorised, setAuthorization] = useState(false);
  const [myMap, setMap] = useState(null);
  const blockBoundsForCenterBehavior = useRef([]);
  const [blockInCenter, setBlockInCenter] = useState(-1);
  const [hovering, setHovering] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState("")
  const [names, setNames] = useState([]);
  const [searchDBLoaded, setDBLoaded ] = useState(false);
 
  const handleBlockClick= (blockNum) => {
    //setSeen(!seen);
    console.log("block click", blockNum);
    //setSelectedBlock(blockNum);
  }
  
  const demoPOIs = [
    {
      id: "Main/Reader's Stage",
      styles: {
        transform: "rotate(0deg)",
        backgroundColor: "red",
        border: "black ridge 1px",
        width: "100%",
        height: "100%"
      } , 
      location: {"lat":37.76866373956265,"lng":-122.45814364793596},
      size: {width:20,height:12}
      
    },
    {
      id: "Media Tent",
      styles: {
        transform: "rotate(322deg)",
        backgroundColor: "tan",
        border: "black ridge 1px",
        width: "100%",
        height: "100%"
      } ,
      location: {"lat":37.76887152472016,"lng":-122.45769303682145},
      size: {width:20,height:10}
    },
    {
      id: "Volunteer check-in",
      styles: {
        transform: "rotate(322deg)",
        backgroundColor: "blue",
        border: "black ridge 1px",
        width: "100%",
        height: "100%"
      } ,
      location: {"lat":37.769321017144925,"lng":-122.45854597928819},
      size: {width:20,height:10}
    },
    {
      id: "Info/Merchandise",
      styles: {
        transform: "rotate(322deg)",
        backgroundColor: "purple",
        border: "black ridge 1px",
        width: "100%",
        height: "100%"
      },
      size: {width:20,height:10},
      location: {"lat":37.769377733565726,"lng":-122.4583501780301}
    }
  ]
  
  const buildPOIsOverlay = useCallback((props, map) => {
    let inventory = props.config.POIs;
    let POIOverlays = [];
    for (var POI in inventory) {
      const dut = inventory[POI];
      const bounds = {
        north: dut.location.lat,
        
        south: dut.location.lat - dut.size.height*FEET_TO_DEGREES_LAT,
        
        east:dut.location.lng,
        west:dut.location.lng -  dut.size.width*FEET_TO_DEGREES_LNG
      }
      const image = ( dut.image )? dut.image : null; 
      POIOverlays.push(
        <OtherPOIOverlay 
        id={dut.id}
        map={map}
        bounds={bounds} 
        key={dut.id}
        boxStyle={dut.styles}
        mapPaneName={OtherPOIOverlay.MAP_PANE} 
        image={image}
        />
        
        );
      }
    return(POIOverlays)
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
      const tmpBlockID = inventory[block]['Block #'].padStart(5, '0');
      let tmpBlockObject = {};
      tmpBlockObject[tmpBlockID] = new window.google.maps.LatLngBounds(blockBounds.sw,blockBounds.ne);
      blockBoundsForCenterBehavior.current.push( tmpBlockObject);
      const blockBoundsOnMap = {
        north: blockBounds.ne.lat,
        south:blockBounds.sw.lat,
        east:blockBounds.ne.lng,
        west:blockBounds.sw.lng
      };
      // TODO clean up blockID inventory[block]['Block #'] stuff
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
        selected={selectedBlock}
        names={props.names[inventory[block]['Block #']]}
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
  
        
  
  /* useEffect(() => {
    console.log("logged in? begin", authorised, loggedIn)
    
    if (loggedIn ) {
      if (searchDBLoaded) return;
      const inventory=props.blocks;
      for (let block in inventory) {
        props.addNamesToSearch(inventory[block]['Block #'].padStart(5, '0'));
      }
      setDBLoaded(true);
    }
    else 
    logIn().then(result =>
      {if (loggedIn) setAuthorization(true);
        console.log("logged in? return", authorised, loggedIn)
      }
      );
  },[authorised,searchDBLoaded,props]); */
  const enableBlockInfoPopUp = (block) => {
    //console.log("open a popup for info for", block);
    setBlockInCenter(Object.keys(blockBoundsForCenterBehavior.current[block])[0]);
    setHovering(true);
  }
  const scanForBlockInCenter = (map) => {
    //var blockInCenter = -1;
    for (var block in blockBoundsForCenterBehavior.current) {
      // TODO take rotation into account
      if (Object.values(blockBoundsForCenterBehavior.current[block])[0].contains(map.center)) {
        enableBlockInfoPopUp(block);
        return;
      }
    }
    //console.log("closing popup");
    setHovering(false);
    setBlockInCenter(-1);    
  }
  //useEffect(() => {
    //  setBlocksOverlay(buildBlocksOverlay(props));
    //},[buildBlocksOverlay, props]
    //);
    
  useEffect(() => {
    console.log("selected Block:", props.selectedBlock);
    if (selectedBlock !== props.selectedBlock) {
      setSelectedBlock(props.selectedBlock);
      myMap.setCenter(blockBoundsForCenterBehavior.current[Number(props.selectedBlock)].getCenter());
      myMap.panTo(myMap.getCenter());
      myMap.setZoom(props.config.zoom);
    }
  }, [ selectedBlock, myMap,   props.selectedBlock, props.config.zoom]);
  
  
  useEffect(() => {
    console.log("dbloaded", searchDBLoaded);
    if (searchDBLoaded) props.refreshMenu();
  },[searchDBLoaded,props])
  
  useEffect(() => {
    setNames(props.names);
    if (myMap && names.length) setBlocksOverlay(buildBlocksOverlay(props,myMap));
    
  },[names,props,myMap,buildBlocksOverlay]);
  
  useEffect(() => {
    let namesDB = {};
    if (props.names.length) {
      for (var entry in props.names) {
        const currentEntry = namesDB[entry];
        const newEntry = (props.names[entry].BlockNumber.startsWith('Block 0')) ? null : props.names[entry].PanelListing;
        if (newEntry) {
          if (currentEntry !== undefined) {
            namesDB[props.names[entry].BlockNumber].push(newEntry);
          } else
          {          
            namesDB[props.names[entry].BlockNumber] = [newEntry];
          }    
        }
      }
      setNames(namesDB);
    }
  },[props.names]);
      
  const renderMap = () => {
    // wrapping to a function is useful in case you want to access `window.google`
    // to eg. setup options or create latLng object, it won't be available otherwise
    // feel free to render directly if you don't need that
    let mapOptions = props.config.options;
    mapOptions['mapTypeId'] = window.google.maps.MapTypeId.ROADMAP;
    mapOptions["mapTypeControlOptions"]= {
      "style": window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      "position": window.google.maps.ControlPosition.TOP_RIGHT
    }
    mapOptions["zoomControlOptions"]= {
      "position": window.google.maps.ControlPosition.TOP_LEFT
    }
    //console.log("boxes",blockBoundsForCenterBehavior.current);
    // TODO enable higher zoom levels in satellite mode
    // TODO add row and column labels
    // TODO 
    return (
      <GoogleMap
      mapContainerStyle={props.config.mapContainerStyle}
      center={props.config.center}
      zoom={props.config.zoom}
      tilt={0}
      options={props.config.options}
      onClick={handleMapClick}
      onLoad={map => {
        setPOIsOverlay(buildPOIsOverlay(props,map));
        setMap(map)
      }}
      onCenterChanged={map =>scanForBlockInCenter(myMap)}
      >
      { /* Child components, such as markers, info windows, etc. */}
      <PopupOnCenter open={blockInCenter!==-1} block={blockInCenter} />
      {blocksOverlay}
      {(Object.keys(blockBoundsForCenterBehavior.current).length) ?
          blockBoundsForCenterBehavior.current.map((box, index) => {
                return <Rectangle 
                            bounds={box[Object.keys(box)[0]]} 
                            key={index+"_BlockBox"} 
                            options={blockBorderOptions}/>
     
          }) : null}
      {POIsOverlay}
      {StreetsAndAvenues}
      <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} position={streets[0].latLon}>
      <div className="street-label ggp-rotation super-block-rotation-c">{streets[0].label} </div></OverlayView>
      <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} position={aves[0].latLon}>
      <div className="street-label ggp-rotation super-block-rotation-c">{aves[0].label} </div></OverlayView>
      <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} position={aves[1].latLon}>
      <div className="street-label ggp-rotation super-block-rotation-c">{aves[1].label} </div></OverlayView>
      {infoWindow}
      </GoogleMap>
    );
  }
  
  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }
    
  return isLoaded ? renderMap() : <CircularProgress />
}
      
      
export default React.memo(InteractiveQuiltMap);
      
      /*<Polygon
      paths={props.polyOverlays}
      options={blockBorderOptions}
      />
      */
      
      /* 
      <div><div id={"mumble"} style={{height:0}}>{props.selectedBlock}</div>
      </div>
      
      <Marker 
      position={dut.location}
      label={dut.id}
      />*/