import React, { useEffect, useState } from 'react';

function NamesList(props){
    const [names, setNames] = useState("");
    useEffect(() => {
        if ((props.names !== undefined) && (props.names.length > 0))
            setNames(props.names.map((datum, index) => {
                return <li key={index+"_nameOnBlock"}>{ datum }</li>
            }))
        return null;
        
    }, [props.names])
    
    useEffect(() => {
console.log("hoping to display names", names);
    },[names]); 
    return (
        <div className="names-list">
           {names} 
          </div>
        );
    }
    
    export default React.memo(NamesList);
    