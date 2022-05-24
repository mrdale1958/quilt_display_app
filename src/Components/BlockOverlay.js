import React, { useState, useEffect } from 'react';
import { GroundOverlay, OverlayView, Polygon, Rectangle, InfoWindow } from '@react-google-maps/api';
import getBlockImage from '../Services/blockImage.js';
import PopupBlock from './PopupBlock.js';
import QuiltOverlay from './QuiltOverlay.js';
/*global google*/


function BlockOverlay(props) {
  const [blockID, setBlockID] = useState("00000");
  const [names, setNames] = useState([]);
  const [baseKey, setBaseKey] = useState("");
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    setBlockID(props.blockID.padStart(5, '0'));
  },[props.blockID]
  );
  
  useEffect(() => {
    setNames(props.names);
  },[props.names]
  );
 
  useEffect(() => {
    setBaseKey( props.row + "_" + props.col + "_" + props.position);
  }, [props.row, props.col, props.position]
  );
    
  const toggleSeen = () => { 
    console.log("toggling block");
    setSeen(!seen);
  };

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
      
  const selectedBlockBorderOptions = {
        fillColor: "red",
        fillOpacity: 0.01,
        strokeColor: "red",
        strokeOpacity: 1,
        strokeWeight: 1,
        clickable: false,
        draggable: false,
        editable: false,
        geodesic: false,
        zIndex: 10
      }
        
  const onBlockClick = blockNum => {
    console.log("QuiltOverlay onClick block: ", blockNum)
    toggleSeen();
  }
  
  const onRectClick = blockNum => {
    console.log("GroundOverlay onClick blockNum: ", blockNum);
    props.handleBlockClick(blockNum)
  }    
  if (baseKey === '') return null;
  if (props.map)
    console.log("blockoverlay has a map")
    //console.log("selected?", props.selected, blockID);
  var popup = seen ? <PopupBlock toggle={toggleSeen} block={blockID} names={names}/> : null;
  return(
    <div key={baseKey+"div"}>
      {popup}
      
      <QuiltOverlay
        block={blockID}
        bounds={props.blockBoundsOnMap}
        superBlockLocation={props.superBlockLocation}
        image={getBlockImage(blockID)}
        mapPaneName={QuiltOverlay.OVERLAY_MOUSE_TARGET} 
        map={props.map}
        border={(props.selected || seen) ? selectedBlockBorderOptions : blockBorderOptions}  
        clickHandler={onBlockClick} >
      </QuiltOverlay>    
      
    </div>

  );

}

export default BlockOverlay;

/* <GroundOverlay
              key={baseKey+'gnd'}
              url={getBlockImage(blockID)}
              bounds={props.blockBoundsOnMap}
              onClick={onBlockClick}
              
          /> 
          
          
          <div className={'ggp-rotation'}>
            { props.selected ? <Polygon
              key={baseKey+'selectedrect'}
                bounds={props.blockBoundsOnMap} 
                onClick={onRectClick.bind(this,blockID)}
                options={selectedBlockBorderOptions}
                /> : <Polygon
                key={baseKey+'rect'}
                bounds={props.blockBoundsOnMap} 
                onClick={onRectClick.bind(this,blockID)}
                options={blockBorderOptions}
                      /> }
          </div>*/
