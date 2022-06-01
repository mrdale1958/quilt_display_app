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
    label: "1", 
    latLon: {"lat":37.7691015718921,"lng":-122.45865863206681}
  },
  1 : { 
    label: "1", 
    latLon:{"lat":37.76867328073065,"lng":-122.45818924548921}
  },
  2 : { 
    label: "2", 
    latLon: {"lat":37.769158818542586,"lng":-122.4585647547513}
  },
  3 : { 
    label: "2", 
    latLon: {"lat":37.76872840745488,"lng":-122.45810609700975}
  },
  4 : { 
    label: "3", 
    latLon: {"lat":37.76922454612366,"lng":-122.45847355964479}
  },
  5 : { 
    label: "3", 
    latLon: {"lat":37.7687792936254,"lng":-122.45800953748521}
  },
  6 : { 
    label: "4", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  7 : { 
    label: "4", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  8 : { 
    label: "5", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  9 : { 
    label: "5", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  10 : { 
    label: "6", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  11 : { 
    label: "6", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  12 : { 
    label: "7", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  13 : { 
    label: "7", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  14 : { 
    label: "8", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  15 : { 
    label: "8", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  16 : { 
    label: "9", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  17 : { 
    label: "9", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  18 : { 
    label: "10", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  19 : { 
    label: "10", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  20 : { 
    label: "11", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  21 : { 
    label: "11", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  22 : { 
    label: "12", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  23 : { 
    label: "12", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  24 : { 
    label: "13", 
    latLon: {"lat":37.76972916238076,"lng":-122.45722264441547}
  },
  25 : { 
    label: "13", 
    latLon: {"lat":37.76972916238076,"lng":-122.45722264441547}
  },
  26 : { 
    label: "14", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  27 : { 
    label: "14", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  28 : { 
    label: "15", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  29 : { 
    label: "15", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  30 : { 
    label: "16", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  31 : { 
    label: "16", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  32 : { 
    label: "17", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  33 : { 
    label: "17", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  34 : { 
    label: "18", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  35 : { 
    label: "18", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  36 : { 
    label: "19", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  37 : { 
    label: "19", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  38 : { 
    label: "20", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  391 : { 
    label: "20", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  40 : { 
    label: "21", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  41 : { 
    label: "21", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  42 : { 
    label: "22", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  43 : { 
    label: "22", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  44 : { 
    label: "23", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  },
  45 : { 
    label: "23", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636}
  }


}

const aves =
{
  0 : { 
    label: "A", 
    latLon: {"lat":37.768690237216305,"lng":-122.45830592600132}
  },
  1 : { 
    label: "B", 
    latLon: {"lat":37.76875331489252,"lng":-122.45837700454021}
  },
  2 : { 
    label: "C", 
    latLon: {"lat":37.768821163089235,"lng":-122.45845009473587}
  },
  3 : { 
    label: "D", 
    latLon: {"lat":37.76889696217286,"lng":-122.4585278787973}
  },
  4 : { 
    label: "E", 
    latLon: {"lat":37.768964280175,"lng":-122.45860700396324}
  },
  5 : { 
    label: "F", 
    latLon: {"lat":37.76902523736818,"lng":-122.45867104170347}
  },
  6 : { 
    label: "A", 
    latLon: {"lat":37.769254754001246,"lng":-122.45734636572624}
  },           
  7 : { 
    label: "F", 
    latLon: {"lat":37.76958869147917,"lng":-122.45772254554058}
  },
  8 : { 
    label: "B", 
    latLon: {"lat":37.769374547619165,"lng":-122.45734535989786}
  },
  9 : { 
    label: "E", 
    latLon: {"lat":37.769577030195805,"lng":-122.45756463048482}
  },
  10 : { 
    label: "C", 
    latLon:{"lat":37.7694922208071,"lng":-122.45733530161405}
  },
  11 : { 
    label: "D", 
    latLon: {"lat":37.76956165850134,"lng":-122.45740973291421}
  },
  12 : { 
    label: "C", 
    latLon: {"lat":37.76958816700853,"lng":-122.45716866495904}
  },
  13 : { 
    label: "D", 
    latLon: {"lat":37.76965283409231,"lng":-122.45723940822181}
  },
  14 : { 
    label: "C", 
    latLon:{"lat":37.77021044724162,"lng":-122.45614305970693}
  },
  15 : { 
    label: "D", 
    latLon: {"lat":37.770277764048025,"lng":-122.45621682045484}
  },
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
        <div><OtherPOIOverlay 
        id={dut.id}
        map={map}
        bounds={bounds} 
        key={dut.id}
        boxStyle={dut.styles}
        mapPaneName={OtherPOIOverlay.MAP_PANE} 
        image={image}
        />
        <Marker 
      position={dut.location}
      label={dut.id}
      />
      </div>
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
    for (const blockIndex in inventory) {
      const block = inventory[blockIndex];
      currRow = Number(block.row) - 1;
      currColumn = Number(block.column) - 1; 
      const position = block.position;
      
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
      const blockID = block.BlockNumber.padStart(5, '0');
      blockBoundsForCenterBehavior.current.push({block: blockID, bounds: new window.google.maps.LatLngBounds(blockBounds.sw,blockBounds.ne)});
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
        superBlockLocation={block.position}
        row={block.row} 
        col={block.column} 
        position={position} 
        blockBoundsOnMap={blockBoundsOnMap} 
        blockID={blockID}
        key={blockID}
        handleBlockClick={handleBlockClick}
        selected={selectedBlock}
        names={props.names[blockID]}
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
    setBlockInCenter(block);
    setHovering(true);
  }
  const scanForBlockInCenter = (map) => {
    //var blockInCenter = -1;
    for (var block in blockBoundsForCenterBehavior.current) {
      // TODO take rotation into account
      if (blockBoundsForCenterBehavior.current[block].bounds.contains(map.center)) {
        enableBlockInfoPopUp(blockBoundsForCenterBehavior.current[block].block);
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
      
      myMap.setCenter(blockBoundsForCenterBehavior.current.find(o => {return (o.block.padStart(5, '0') === props.selectedBlock)}).bounds.getCenter());
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
  // TODO get this and other things to just not get called until there are intersections to find
  const getIntersection = (blockID) => {
    const blockObj = props.blocks.find(o => {return (blockInCenter>-1 && o.BlockNumber.padStart(5, '0') === blockInCenter.padStart(5, '0'))});
    return (blockInCenter>-1) ? blockObj.LOCATION_ID : "";
  }
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
        <PopupOnCenter open={blockInCenter!==-1} block={blockInCenter} intersection={getIntersection(blockInCenter)}/>
        {blocksOverlay}
        { blockBoundsForCenterBehavior.current.map((block, index) => {
            return <Rectangle 
                      bounds={block.bounds} 
                      key={index+"_BlockBox"} 
                      options={blockBorderOptions}/>    
                })}
        {POIsOverlay}
        {Object.keys(streets).map((street, index) => {
          return( <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} key={index + "_street"} position={streets[street].latLon}>
          <div className="street-label ggp-rotation super-block-rotation-c">{streets[street].label} </div></OverlayView>)
          
        })}
        {Object.keys(aves).map((ave, index) => {
          return( <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} key={index + "_ave"} position={aves[ave].latLon}>
          <div className="street-label ggp-rotation super-block-rotation-c">{aves[ave].label} </div></OverlayView>)
          
        })}
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
      /*{(Object.keys(blockBoundsForCenterBehavior.current).length) ?
          blockBoundsForCenterBehavior.current.map((box, index) => {
                return null;<Rectangle 
                            bounds={box[Object.keys(box)[0]]} 
                            key={index+"_BlockBox"} 
                            options={blockBorderOptions}/>
     
          }) : null}*/
      /* 
      <div><div id={"mumble"} style={{height:0}}>{props.selectedBlock}</div>
      </div>
      
      <Marker 
      position={dut.location}
      label={dut.id}
      />*/