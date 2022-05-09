import React, { useEffect } from 'react';
import OpenSeaDragon from 'openseadragon';


function PopupBlock(props){
    
        
    console.log('making a pop up');

    const initSeaDragonDZI = () => {

      // let { id, tileSources } = this.props
      // let image = "css/heididesigns/AQT_LA_TouchScreen_bg_v3.png" ;
      //loadImage(image).then(data => {
        var  viewer = OpenSeaDragon({
              id: "openseadragon1", //id + "osd",
              showNavigationControl: false,
              prefixUrl: "css/seadragon_images/",
              tileSources:  process.env.REACT_APP_BLOCK_SRC + String(props.block).padStart(5, '0') +".dzi",
              visibilityRatio: 1.0,
              constrainDuringPan: true,
              overlays: [
              /*{
                  id: 'overlay2890',
                  x: 0.039, 
                  y: 0.2185, 
                  lastx: 0.039452, 
                  lasty: 0.218675, 
                  width: 0.0081, 
                  height: 0.0081,
                  className: 'highlight'
              },
              {
                  id: 'overlay4174',
                  x: 0.414, 
                  y: 0.3125, 
                  lastx: 0.413702, 
                  lasty: 0.313700, 
                  width: 0.0081, 
                  height: 0.0081,
                  className: 'highlight'
              },
              {
                  id: 'overlay0335',
                  x: 0.1952, 
                  y: 0.02328, 
                  lastx: 0.193452, 
                  lasty: 0.024675, 
                  width: 0.0081, 
                  height: 0.0081,
                  className: 'highlight'
              },
              {
                  id: 'overlay1321',
                  x: 0.6561, 
                  y: 0.0936, 
                  lastx: 0.551702, 
                  lasty: 0.103700, 
                  width: 0.0081, 
                  height: 0.0081, 
                  className: 'highlight'
              }*/
              {
                  id: 'overlay3877',
                  x: 0.5076, 
                  y: 0.2891, 
                  lastx: 0.4870, 
                  lasty: 0.2691, 
                  width: 0.0081, 
                  height: 0.0081,
                  className: 'highlight'
              }],
          });
       //});
  }

  const initSeaDragon = () => {
      //console.log("this.props.useIIIF=",this.props.useIIIF);
      //if (props.useIIIF==='yes') {
      //    this.initSeaDragonIIIF();
      //} else {
          initSeaDragonDZI();
      //}
  }
  useEffect(() => {
      //debugger;
      initSeaDragon()
  })
   

    return (
    <div className="modal">
        <div className="modal_content">
          <span className="close" onClick={props.toggle}>
            &times;
          </span>
          <p>show zoomable block {props.block}</p>
          <div className="ocd-div" >
                
          <div className="openseadragon" id="openseadragon1"></div>
          <ul className="ocd-toolbar">
             
          </ul>
      </div>
       </div>
      </div>
    );
}

export default React.memo(PopupBlock);

    