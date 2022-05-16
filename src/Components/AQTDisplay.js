import React, { useState, useEffect } from 'react';
//import logo from './logo.svg';
import './AQTDisplay.css';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';

import InteractiveQuiltmap from './InteractiveQuiltMap.js';

function AQTDisplay(props) {
  const [searchList, setSearchList] = useState([]);
  
  let polyOverlays = [
    {  lat: props.config.origin.lat, lng: props.config.origin.lng },
    {  lat: props.config.origin.lat + props.config.pitchright.lat, lng: props.config.origin.lng  + props.config.pitchright.lng},
    {  lat: props.config.origin.lat + props.config.pitchright.lat + props.config.pitchdown.lat, lng: props.config.origin.lng + props.config.pitchright.lng + props.config.pitchdown.lng },
    {  lat: props.config.origin.lat + props.config.pitchdown.lat, lng: props.config.origin.lng  + props.config.pitchdown.lng},
    {  lat: props.config.origin.lat + props.config.pitchdown.lat, lng: props.config.origin.lng  + props.config.pitchdown.lng},
    {  lat: props.config.origin.lat + props.config.pitchright.lat + props.config.pitchdown.lat, lng: props.config.origin.lng + props.config.pitchright.lng + props.config.pitchdown.lng },
    {  lat: props.config.origin.lat + props.config.pitchright.lat + 2*props.config.pitchdown.lat, lng: props.config.origin.lng + props.config.pitchright.lng + 2*props.config.pitchdown.lng },
    {  lat: props.config.origin.lat + 2*props.config.pitchdown.lat, lng: props.config.origin.lng  + 2*props.config.pitchdown.lng},
    ];
    let otherPOIs = null;
       
   
      
       
         
    //import Mask from './Mask.js'; Static entry in index.html
   
   
  const addNamesToSearch = (namelist) => {
    let foo = searchList;
    foo.push(namelist);
    setSearchList(foo);
  }
  
  
  // look at https://mui.com/material-ui/react-autocomplete/ for the seearch function
  return (
    <div className="AQTDisplay">
    <Autocomplete
      id="grouped-by-block"
      options={searchList.sort((a, b) => -b.PanelListing.localeCompare(a.PanelListing))}
      groupBy={(searchList) => searchList.BlockNumber}
      getOptionLabel={(searchList) => searchList.PanelListing}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Search the June 2022 Quilt Display" />}
    />
   
    <InteractiveQuiltmap 
                        config={props.config} 
                        blocks={props.blocks}
                        otherPOIs={props.otherPOIs}
                        polyOverlays={polyOverlays}
                        addNamesToSearch={addNamesToSearch}
      />
      
    </div>
  );
}

export default AQTDisplay;

/* {          
        names.filter(name => {
          if (query === "") {
            //if query is empty
            return name;
          } else if (name["Panel Listing"].toLowerCase().includes(query.toLowerCase())) {
            //returns filtered array
            return name;
          }
        }).map((block,index) => {
          <div key={index}>
            <p>{block} </p>
          </div>
        })
      }


      {          
        props.blockList.filter(name => {
          if (query === "") {
            //if query is empty
            return name;
          } else if (name.toLowerCase().includes(query.toLowerCase())) {
            //returns filtered array
            return name;
          }
        }).map((block,index) => {
          <div className="box" key={index}>
            <p>{block} </p>
          </div>
        })
      }
      */