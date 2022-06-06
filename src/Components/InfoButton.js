import React, { useState, useCallback, useEffect } from 'react';
import PopupDisplayInfo from './PopupDisplayInfo';



export default function InfoButton(props)  {
    const [active, setActive] = useState(true);
    const handleClick = (event) => {
        setActive(! active );
    }
    if (active) {
        return <PopupDisplayInfo toggle={handleClick}/>
    } else {
        return <div style={{width: "10vw", paddingLeft:"2vw"}}>
                    <img onClick={handleClick} src={"./icons/info.svg"} height={"56px"} width={"25px"} />
            </div>
    }
}