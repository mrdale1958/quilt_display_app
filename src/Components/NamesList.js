import React, { useEffect, useState } from 'react';

function NamesList(props){
    
    const [names, setNames] = useState("");
    useEffect(() => {
        if ((props.names !== undefined) && (props.names.length > 0))
            setNames(props.names.map((datum, index) => {
                let panelIndex;
                if ([ '1','2','3','4','5','6','7','8' ].includes(datum.panelNumber )) panelIndex = datum.panelNumber-1;
                else if (datum.panelNumber==="1-8" ) panelIndex=0;
                else {
                    //console.log("weird panel ID, ", datum);
                    panelIndex = 0;
                }
                return <li style={{
                    backgroundColor: props.config.panelItemColors[panelIndex].bg,
                    color: props.config.panelItemColors[panelIndex].fg,
                  }} key={index+"_nameOnBlock"}>{ datum.name }</li>
            }))
        return null;
        
    }, [props.names, props.config.panelItemColors])
    
    useEffect(() => {
//console.log("hoping to display names", names);
    },[names]); 
    return (
        <div className="names-list">
           {names} 
          </div>
        );
    }
    
    export default React.memo(NamesList);
    