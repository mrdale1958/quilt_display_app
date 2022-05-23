import React, { useEffect } from 'react';
import OpenSeaDragon from 'openseadragon';


function PopupOnCenter(props){
      
     if (props.block === 0) return null;   
    console.log('making a pop up');

    
  

    return (
    <div className="popup">
        <div className="popup_content">
          <span className="close" onClick={props.toggle}>
            &times;
          </span>
          <p>block under reticle {props.block}</p>
         </div>
    </div>
    );
}

export default React.memo(PopupOnCenter);

    