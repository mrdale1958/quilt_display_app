import React, { useState, useRef , useEffect} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { motion, useCycle } from 'framer-motion';

function PopupOnCenter(props){
    const [isOpen, setOpen] = useState(props.open);
    //const [isOpen, toggleOpen] = useCycle(false, true);
    const containerRef = useRef(null);
       //if (props.block === 0) return null;   
    //console.log('making a pop up', isOpen, props.block);

    const handleClose = (event) => {
        setOpen(false);
    }

    const popup = {
      open: {
        bottom: 0
      },
      closed: {
        bottom: "-100px"
      }
    }
  useEffect(() => {
    setOpen(props.open);
  },[props.open])
   return (<motion.div 
            className="popup"
            initial={false}
            animate={isOpen ? "open" : "closed"}
            variants={popup}
            ref={containerRef}>
        <div className="popup_content">
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Block #{( props.block !== -1)?props.block:" "}</Typography>
           
          
          </Toolbar>
        </AppBar>
        </div>
    </motion.div>);
    ;
}

export default React.memo(PopupOnCenter);

    /* <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
             */