import React, { useEffect, useState } from 'react';
import OpenSeaDragon from 'openseadragon';
import NamesList from './NamesList.js';
import { getNamesOnBlock } from '../Services/nameslist.js';
import CloseIcon from '@mui/icons-material/Close';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';

// TODO needs to animate up like the other one does 
// TODO don't pass mouse events to map below
function PopupBlock(props){

  const [names, setNames] = useState([]);

  useEffect(()=>{
    setNames(getNamesOnBlock(props.block));
    if (names !== undefined && names.length){
      var  viewer = OpenSeaDragon({
        id: "openseadragon1", //id + "osd",
        showNavigationControl: false,
        prefixUrl: "css/seadragon_images/",
        defaultZoomLevel: 1,
        minZoomLevel: 0,
        maxZoomLevel: 4,
        minZoomImageRatio: 0,
        tileSources:  {
        Image: {
            xmlns:    "http://schemas.microsoft.com/deepzoom/2008",
            Url:      process.env.REACT_APP_BLOCK_SRC + String(props.block).padStart(5, '0') +"_files/",
            Format:"jpeg", 
            Overlap:"0" ,
            TileSize:"128",
            
              Size: {
                  Width:"2048", 
                  Height:"2048"
                },
              MaxLevel: 4,
              MinLevel: 0
        }},
        visibilityRatio: 1.0,
        constrainDuringPan: true,
        overlays: [],
      });
    }},[names, props.block]);

 
 
  
  if (props.block === 0) return null;   
  console.log('making a pop up');

 
    return (
    <div className="modal">
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Block #{props.block}</Typography>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {( props.block !== -1)? "Location:" + props.location:" " }</Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.toggle}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            
          
          </Toolbar>
        </AppBar>
        <div className="modal_content">
            <div className="ocd-div" >
                
                <div className="openseadragon" id="openseadragon1"></div>
                <ul className="ocd-toolbar"></ul>
            </div>
            <NamesList names={names} config={props.config}/>
        </div>
    </div>
    );
}

export default React.memo(PopupBlock);

    