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
    latLon: {"lat":37.7691015718921,"lng":-122.45865863206681},
    gridPosition: {"row":1, "column": 0, "side": "top"}
  },
  1 : { 
    label: "1", 
    latLon:{"lat":37.76867328073065,"lng":-122.45818924548921},
    gridPosition: {"row":6, "column": 0, "side": "bottom"}
  },
  2 : { 
    label: "2", 
    latLon: {"lat":37.769158818542586,"lng":-122.4585647547513},
    gridPosition: {"row":1, "column": 1, "side": "top"}
  },
  3 : { 
    label: "2", 
    latLon: {"lat":37.76872840745488,"lng":-122.45810609700975},
    gridPosition: {"row":6, "column": 1, "side": "bottom"}
  },
  4 : { 
    label: "3", 
    latLon: {"lat":37.76922454612366,"lng":-122.45847355964479},
    gridPosition: {"row":1, "column": 2, "side": "top"}
  },
  5 : { 
    label: "3", 
    latLon: {"lat":37.7687792936254,"lng":-122.45800953748521},
    gridPosition: {"row":6, "column": 2, "side": "bottom"}
  },
  6 : { 
    label: "4", 
    latLon: {"lat":37.769269071226034,"lng":-122.45839041116533},
    gridPosition: {"row":1, "column": 3, "side": "top"}
  },
  7 : { 
    label: "4", 
    latLon: {"lat":37.768840781034704,"lng":-122.45792102458772},
    gridPosition: {"row":6, "column": 3, "side": "bottom"}
  },
  8 : { 
    label: "5", 
    latLon: {"lat":37.76932207726535,"lng":-122.4582965338498},
    gridPosition: {"row":1, "column": 4, "side": "top"}
  },
  9 : { 
    label: "5", 
    latLon: {"lat":37.768895907634075,"lng":-122.45781910064515},
    gridPosition: {"row":6, "column": 4, "side": "bottom"}
  },
  10 : { 
    label: "6", 
    latLon: {"lat":37.76937084278796,"lng":-122.45821338537034},
    gridPosition: {"row":1, "column": 5, "side": "top"}
  },
  11 : { 
    label: "6", 
    latLon: {"lat":37.768938312682536,"lng":-122.45773326995668},
    gridPosition: {"row":6, "column": 5, "side": "bottom"}
  },
  12 : { 
    label: "7", 
    latLon: {"lat":37.769432329705396,"lng":-122.45812755468187},
    gridPosition: {"row":1, "column": 6, "side": "top"}
  },
  13 : { 
    label: "7", 
    latLon: {"lat":37.769006160709516,"lng":-122.45764475705919},
    gridPosition: {"row":6, "column": 6, "side": "bottom"}
  },
  14 : { 
    label: "8", 
    latLon: {"lat":37.76948957609981,"lng":-122.45802294853029},
    gridPosition: {"row":1, "column": 7, "side": "top"}
  },
  15 : { 
    label: "8", 
    latLon: {"lat":37.769050685943384,"lng":-122.45755356195268},
    gridPosition: {"row":6, "column": 7, "side": "bottom"}
  },
  16 : { 
    label: "9", 
    latLon: {"lat":37.769544702215505,"lng":-122.4579344356328},
    gridPosition: {"row":1, "column": 8, "side": "top"}
  },
  17 : { 
    label: "9", 
    latLon: {"lat":37.7691015718921,"lng":-122.45744359138307},
    gridPosition: {"row":6, "column": 8, "side": "bottom"}
  },
  18 : { 
    label: "10", 
    latLon: {"lat":37.76958498665867,"lng":-122.45782982948121},
    gridPosition: {"row":1, "column": 9, "side": "top"}
  },
  19 : { 
    label: "10", 
    latLon: {"lat":37.76916305903345,"lng":-122.45736312511262},
    gridPosition: {"row":6, "column": 9, "side": "bottom"}
  },
  20 : { 
    label: "11", 
    latLon: {"lat":37.76957862595858,"lng":-122.45766085031327},
    gridPosition: {"row":2, "column": 10, "side": "top"}
  },
  21 : { 
    label: "11", 
    latLon: {"lat":37.76928603316275,"lng":-122.45736580732164},
    gridPosition: {"row":5, "column": 10, "side": "bottom"}
  },
  22 : { 
    label: "12", 
    latLon: {"lat":37.76956802479053,"lng":-122.45749991777238},
    gridPosition: {"row":3, "column": 11, "side": "top"}
  },
  23 : { 
    label: "12", 
    latLon: {"lat":37.769409007087546,"lng":-122.45734434964952},
    gridPosition: {"row":4, "column": 11, "side": "bottom"}
  },
  24 : { 
    label: "13", 
    latLon: {"lat":37.76972916238076,"lng":-122.45722264441547},
    gridPosition: {"row":3, "column": 14, "side": "top"}
  },
  25 : { 
    label: "13", 
    latLon: {"lat":37.76956802479053,"lng":-122.45706808212098},
    gridPosition: {"row":4, "column": 14, "side": "bottom"}
  },
  26 : { 
    label: "14", 
    latLon: {"lat":37.769784288317844,"lng":-122.45713513734636},
    gridPosition: {"row":3, "column": 15, "side": "top"}
  },
  27 : { 
    label: "14", 
    latLon: {"lat":37.76962527107991,"lng":-122.45697688701448},
    gridPosition: {"row":4, "column": 15, "side": "bottom"}
  },
  28 : { 
    label: "15", 
    latLon: {"lat":37.769847895117266,"lng":-122.45704930665788},
    gridPosition: {"row":3, "column": 16, "side": "top"}
  },
  29 : { 
    label: "15", 
    latLon: {"lat":37.769676156633246,"lng":-122.45688032748994},
    gridPosition: {"row":4, "column": 16, "side": "bottom"}
  },
  30 : { 
    label: "16", 
    latLon: {"lat":37.7698987805174,"lng":-122.4569634759694},
    gridPosition: {"row":3, "column": 17, "side": "top"}
  },
  31 : { 
    label: "16", 
    latLon: {"lat":37.76973128260986,"lng":-122.45679449680146},
    gridPosition: {"row":4, "column": 17, "side": "bottom"}
  },
  32 : { 
    label: "17", 
    latLon: {"lat":37.76995602655074,"lng":-122.45686423423585},
    gridPosition: {"row":3, "column": 18, "side": "top"}
  },
  33 : { 
    label: "17", 
    latLon: {"lat":37.769788528772835,"lng":-122.45670598390397},
    gridPosition: {"row":4, "column": 18, "side": "bottom"}
  },
  34 : { 
    label: "18", 
    latLon: {"lat":37.77001539276067,"lng":-122.45678108575639},
    gridPosition: {"row":3, "column": 19, "side": "top"}
  },
  35 : { 
    label: "18", 
    latLon: {"lat":37.76985637601971,"lng":-122.45661478879747},
    gridPosition: {"row":4, "column": 19, "side": "bottom"}
  },
  36 : { 
    label: "19", 
    latLon: {"lat":37.770064157826056,"lng":-122.45666843297776},
    gridPosition: {"row":3, "column": 20, "side": "top"}
  },
  37 : { 
    label: "19", 
    latLon: {"lat":37.76990938163802,"lng":-122.45651554706392},
    gridPosition: {"row":4, "column": 20, "side": "bottom"}
  },
  38 : { 
    label: "20", 
    latLon: {"lat":37.7701235239492,"lng":-122.45659869554338},
    gridPosition: {"row":3, "column": 21, "side": "top"}
  },
  391 : { 
    label: "20", 
    latLon: {"lat":37.76995814677331,"lng":-122.45642435195741},
    gridPosition: {"row":4, "column": 21, "side": "bottom"}
  },
  40 : { 
    label: "21", 
    latLon: {"lat":37.77016592829367,"lng":-122.4564940893918},
    gridPosition: {"row":3, "column": 22, "side": "top"}
  },
  41 : { 
    label: "21", 
    latLon: {"lat":37.77001115231868,"lng":-122.45633583905992},
    gridPosition: {"row":4, "column": 22, "side": "bottom"}
  },
  42 : { 
    label: "22", 
    latLon: {"lat":37.77022953476483,"lng":-122.45640825870332},
    gridPosition: {"row":3, "column": 23, "side": "top"}
  },
  43 : { 
    label: "22", 
    latLon: {"lat":37.77006627804556,"lng":-122.4562419617444},
    gridPosition: {"row":4, "column": 23, "side": "bottom"}
  },
  44 : { 
    label: "23", 
    latLon: {"lat":37.77027829968898,"lng":-122.45630097034272},
    gridPosition: {"row":3, "column": 24, "side": "top"}
  },
  45 : { 
    label: "23", 
    latLon: {"lat":37.7701235239492,"lng":-122.45615613105592},
    gridPosition: {"row":4, "column": 24, "side": "bottom"}
  }


}

const aves =
{
  0 : { 
    label: "A", 
    latLon: {"lat":37.768690237216305,"lng":-122.45830592600132},
    gridPosition: {"row":6, "column": 0, "side": "left"}
  },
  1 : { 
    label: "B", 
    latLon: {"lat":37.76875331489252,"lng":-122.45837700454021},
    gridPosition: {"row":5, "column": 0, "side": "left"}
  },
  2 : { 
    label: "C", 
    latLon: {"lat":37.768821163089235,"lng":-122.45845009473587},
    gridPosition: {"row":4, "column": 0, "side": "left"}
  },
  3 : { 
    label: "D", 
    latLon: {"lat":37.76889696217286,"lng":-122.4585278787973},
    gridPosition: {"row":3, "column": 0, "side": "left"}
  },
  4 : { 
    label: "E", 
    latLon: {"lat":37.768964280175,"lng":-122.45860700396324},
    gridPosition: {"row":2, "column": 0, "side": "left"}
  },
  5 : { 
    label: "F", 
    latLon: {"lat":37.76902523736818,"lng":-122.45867104170347},
    gridPosition: {"row":1, "column": 0, "side": "left"}
  },
  6 : { 
    label: "A", 
    latLon: {"lat":37.769254754001246,"lng":-122.45734636572624},
    gridPosition: {"row":6, "column": 9, "side": "right"}
  },           
  7 : { 
    label: "F", 
    latLon: {"lat":37.76958869147917,"lng":-122.45772254554058},
    gridPosition: {"row":1, "column": 9, "side": "right"}
  },
  8 : { 
    label: "B", 
    latLon: {"lat":37.769374547619165,"lng":-122.45734535989786},
    gridPosition: {"row":5, "column": 10, "side": "right"}
  },
  9 : { 
    label: "E", 
    latLon: {"lat":37.769577030195805,"lng":-122.45756463048482},
    gridPosition: {"row":2, "column": 10, "side": "right"}
  },
  10 : { 
    label: "C", 
    latLon:{"lat":37.7694922208071,"lng":-122.45733530161405},
    gridPosition: {"row":4, "column": 11, "side": "right"}
  },
  11 : { 
    label: "D", 
    latLon: {"lat":37.76956165850134,"lng":-122.45740973291421},
    gridPosition: {"row":3, "column": 11, "side": "right"}
  },
  12 : { 
    label: "C", 
    latLon: {"lat":37.76958816700853,"lng":-122.45716866495904},
    gridPosition: {"row":4, "column": 14, "side": "left"}
  },
  13 : { 
    label: "D", 
    latLon: {"lat":37.76965283409231,"lng":-122.45723940822181},
    gridPosition: {"row":3, "column": 14, "side": "left"}
  },
  14 : { 
    label: "C", 
    latLon:{"lat":37.77021044724162,"lng":-122.45614305970693},
    gridPosition: {"row":4, "column": 24, "side": "right"}
  },
  15 : { 
    label: "D", 
    latLon: {"lat":37.770277764048025,"lng":-122.45621682045484},
    gridPosition: {"row":3, "column": 24, "side": "right"}
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
      const text = ( dut.text )? dut.text : null; 
      POIOverlays.push(
        <OtherPOIOverlay 
        id={dut.id}
        map={map}
        bounds={bounds} 
        key={dut.id}
        boxStyle={dut.styles}
        mapPaneName={OtherPOIOverlay.MAP_PANE} 
        image={image}
        text={text}
        />
       
        );
      }
    return(POIOverlays)
  },[]); 
    /*
    <div><Marker 
    position={dut.location}
    label={dut.id}
    />
    </div>
    
    */

    function labelLatLonFromGrid(gridPosition) {
      const positionShift = { left: {lat: 0.1, lng: -1.55},
      "right": {lat: -1.1, lng: -0.2},
      "top": {lat: -1.4, lng: -1.2},
      "bottom": {lat: -0.1, lng: -0.25}}
     
      return {lat: props.config.origin.lat + gridPosition.row * props.config.gutterWidth.lat +
        (gridPosition.row + positionShift[gridPosition.side].lat) * props.config.pitchdown.lat * 0.5 +
        gridPosition.column * props.config.pitchright.lat * 0.5,
        lng:  props.config.origin.lng + gridPosition.column * props.config.gutterWidth.lng +
        (gridPosition.column + 0.5 + positionShift[gridPosition.side].lng) * props.config.pitchright.lng * 0.5 +
        gridPosition.row * props.config.pitchdown.lng * 0.5
      }
    }
  
    const [streetsAndAves, setGrid] = useState(null);

    useEffect(() => {

    })
    
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
        location={block.LOCATION_ID}
        config={props.config}
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
    if (props.config.debugMode) {const latLngInfoWindow = <InfoWindow position={event.latLng}><div >{JSON.stringify(event.latLng.toJSON())}</div></InfoWindow>
    setInfoWindow(latLngInfoWindow) }
    
  }
  
        
  
  
  const enableBlockInfoPopUp = (block) => {
    //console.log("open a popup for info for", block);
    setBlockInCenter(block);
    setHovering(true);
  }
  const fixZoomDependentLayers = (map) => {
    if (map && map.getZoom()<18){
      setGrid(null)
    } else {
      let streetLabels = Object.keys(streets).map((street, index) => {
        return( <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} key={index + "_street"} position={labelLatLonFromGrid(streets[street].gridPosition)}>
        <div className="street-label ggp-rotation super-block-rotation-c">{streets[street].label} </div></OverlayView>)
      })
      let aveLabels= Object.keys(aves).map((ave, index) => {
          return( <OverlayView mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} key={index + "_ave"} position={labelLatLonFromGrid(aves[ave].gridPosition)}>
          <div className="ave-label ggp-rotation super-block-rotation-c">{aves[ave].label} </div></OverlayView>)
        }) 
      setGrid(streetLabels.concat(aveLabels));  
     
        
      }
    }

  const scanForBlockInCenter = (map) => {
    //var blockInCenter = -1;
    if (map)
    console.log("center change", map.getCenter().toString());

    if (map && map.getZoom()>19){

      for (var block in blockBoundsForCenterBehavior.current) {
        // TODO take rotation into account
        if (blockBoundsForCenterBehavior.current[block].bounds.contains(map.center)) {
          enableBlockInfoPopUp(blockBoundsForCenterBehavior.current[block].block);
          return;
        }
      }}
    //console.log("closing popup");
    setHovering(false);
    setBlockInCenter(-1);    
  }
  //useEffect(() => {
    //  setBlocksOverlay(buildBlocksOverlay(props));
    //},[buildBlocksOverlay, props]
    //);
    
  useEffect(() => {
    if (selectedBlock !== props.selectedBlock) {
      myMap.setZoom(props.config.zoom);
      setSelectedBlock(props.selectedBlock);
      const blockImage = blockBoundsForCenterBehavior.current.find(o => {return (o.block.padStart(5, '0') === props.selectedBlock.substring(0,5))})
      //myMap.setCenter(blockImage.bounds.getCenter());
      myMap.panTo(blockImage.bounds.getCenter());
      console.log("selected Block:", props.selectedBlock, blockImage.bounds.getCenter().toString(), myMap.getCenter().toString());
  }
  }, [ selectedBlock, myMap,   props.selectedBlock, props.config.zoom]);
  
  
  useEffect(() => {
    //console.log("dbloaded", searchDBLoaded);
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
    //mapOptions['mapTypeId'] = window.google.maps.MapTypeId.ROADMAP;
    mapOptions['mapTypeId'] = window.google.maps.MapTypeId.SATELLITE;
    mapOptions["mapTypeControlOptions"]= {
      "style": window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      "position": window.google.maps.ControlPosition.TOP_RIGHT
    }
    mapOptions["zoomControlOptions"]= {
      "position": window.google.maps.ControlPosition.TOP_LEFT
    }
    

    // TODO enable higher zoom levels in satellite mode
    // TODO 
    return (
      <div className={"map-holder"}>
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
        onZoomChanged={map => fixZoomDependentLayers(myMap)}
      >
        { /* Child components, such as markers, info windows, etc. */}
        <PopupOnCenter open={blockInCenter!==-1} block={blockInCenter} intersection={getIntersection(blockInCenter)}/>
        {blocksOverlay}
        { props.config.debugMode ? blockBoundsForCenterBehavior.current.map((block, index) => {
            return <Rectangle 
                      bounds={block.bounds} 
                      key={index+"_BlockBox"} 
                      options={blockBorderOptions}/>    
                }) : null }
        {POIsOverlay}
        {streetsAndAves}
        {infoWindow}
      </GoogleMap>
      <div  className={"reticule"}><img src={"https://upload.wikimedia.org/wikipedia/commons/6/64/Red_Ribbon.svg"} width={20}  /></div>
</div>
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