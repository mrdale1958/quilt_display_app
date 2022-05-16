import React, { useState, useEffect } from 'react';
import { GroundOverlay, OverlayView, Polygon, Rectangle, InfoWindow } from '@react-google-maps/api';
import getBlockImage from '../Services/blockImage.js';
import PopupBlock from './PopupBlock.js';


function BlockOverlay(props) {
  const [blockID, setBlockID] = useState("00000");
  const [names, setNames] = useState([]);
  const [baseKey, setBaseKey] = useState("");
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    setBlockID(props.blockID);
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
    props.handleBlockClick(blockNum);
  }
  
  const onRectClick = blockNum => {
    console.log("GroundOverlay onClick blockNum: ", blockNum);
    props.handleBlockClick(blockNum)
  }    
  if (baseKey === '') return null;
  var popup = seen ? <PopupBlock toggle={toggleSeen} block={blockID} /> : null;
  return(
      <div key={baseKey+"div"}>
        {popup}
        <GroundOverlay
              key={baseKey+'gnd'}
              url={getBlockImage(props.blockID)}
              bounds={props.blockBoundsOnMap}
              onClick={onBlockClick}
          /> 
            
          <Rectangle
                key={baseKey+'rect'}
                bounds={props.blockBoundsOnMap} 
                onClick={onRectClick.bind(this,props.blockID)}
                options={blockBorderOptions}
                      /> 
          { props.selectedBlock ? <Rectangle
              key={baseKey+'selectedrect'}
                bounds={props.blockBoundsOnMap} 
                onClick={onRectClick.bind(this,props.blockID)}
                options={selectedBlockBorderOptions}
                /> : null }
      </div>

  );

}

export default BlockOverlay;