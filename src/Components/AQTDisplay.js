import React, { useState, useReducer, useCallback, useEffect } from 'react';
//import logo from './logo.svg';
import './AQTDisplay.css';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import  {getnames, addName}  from '../Services/nameslist.js';

import InteractiveQuiltmap from './InteractiveQuiltMap.js';

function AQTDisplay(props) {

  function reducer(state, action) {
    let foo = {menuList: state.menuList.concat(action.payload)};
    return foo;
  }
  const [searchList, setSearchList] = useState({menuList: []});
  
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
       
    const addNamesToSearch = (blockID) => {
      addName({"BlockNumber": blockID, "PanelListing":"bar"});
    }
  useEffect(() => {
    let mounted = true;
    getnames()
    .then(names => {
      if (mounted)  {
        setSearchList(names);
      }
    })
    return () => mounted = false;
  },[])     
   
  /* const addNamesToSearch = useCallback((namelist) => {
    dispatch({payload: namelist});
    console.log(namelist);
  },[]); */
  
  
  // look at https://mui.com/material-ui/react-autocomplete/ for the seearch function
  return (
    <div className="AQTDisplay">
    <Autocomplete
      id="grouped-by-block"
      options={searchList.menuList.sort((a, b) => b.PanelListing.localeCompare(a.PanelListing))}
      groupBy={(option) => option.BlockNumber}
      getOptionLabel={(option) => option.PanelListing}
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