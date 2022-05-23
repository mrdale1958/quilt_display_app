import React, { useEffect } from 'react';
import OpenSeaDragon from 'openseadragon';


function PopupBlock(props){
    useEffect(() => {
        //debugger;
        initSeaDragon()
    })
         
     if (props.block === 0) return null;   
    console.log('making a pop up');

    const initSeaDragonDZI = () => {

      // let { id, tileSources } = this.props
      // let image = "css/heididesigns/AQT_LA_TouchScreen_bg_v3.png" ;
      //loadImage(image).then(data => {
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

    