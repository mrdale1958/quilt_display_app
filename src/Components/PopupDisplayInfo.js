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
function PopupDisplayInfo(props){

  const [names, setNames] = useState([]);

  
 
    return (
    <div className="modal">
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            San Francisco Quilt Display Search</Typography>
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
        <div className="info-content">
        
To find a name and panel included in the June 11/12 display, simply enter a NAME or BLOCK number in the Find a Panel bar.  If it is in the display, a red ribbon will appear on the map where that panel is located, along with the Block Number and location code. Printed lists and maps will be available at the display.  If you have any questions or need assistance, please locate a volunteer and they can guide you to the location.
        </div>
    </div>
    );
}

export default React.memo(PopupDisplayInfo);

    