import React, { useState, useReducer, useCallback, useEffect } from 'react';
//import logo from './logo.svg';
import './AQTDisplay.css';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import  {getnames, addNamesOnBlock}  from '../Services/nameslist.js';

import InteractiveQuiltmap from './InteractiveQuiltMap.js';

function AQTDisplay(props) {

  function reducer(state, action) {
    let foo = {menuList: state.menuList.concat(action.payload)};
    return foo;
  }
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
    const [addNamesFlag, setAddNamesFlag] = useState(false);
    const [blockToAdd, setAddBlock] = useState({});
    const sortByBlockNumber = (a,b) => {
      //console.log("sorting", a.BlockNumber, b.BlockNumber);
      return a.BlockNumber.localeCompare(b.BlockNumber);
    }
    const addNamesToSearch = (blockID) => {
      if ((searchList.length > 0) && searchList.find(o => o.BlockNumber === blockID.padStart(5, '0')))  return;
      console.log("want to add", blockID.padStart(5, '0'));
        addNamesOnBlock(blockID.padStart(5, '0'))
        .then(data=> {
          try {
            data.sort(sortByBlockNumber);
            setSearchList(data)}
          catch(error){
            console.error("menu sort", data, error)
          }
        })
      
    }
const refreshMenu = useCallback(() => {
  console.log("searchList: ", searchList);
  let mounted = true;
  let names = getnames();
  //.then(names => {
    if (mounted && names.length > 0)  {
      //console.log("setting search list", names);
      setSearchList(names);
    }
  //})
  //return () => mounted = false;
  mounted = false;
},[searchList]);
 
  useEffect(() => {
    //if (searchList.length === 0)  return;
   refreshMenu();
  },[searchList,refreshMenu])     
   
  /* const addNamesToSearch = useCallback((namelist) => {
    dispatch({payload: namelist});
    console.log(namelist);
  },[]); */
  
  
  // look at https://mui.com/material-ui/react-autocomplete/ for the seearch function
  return (
    <div className="AQTDisplay">
    {  
    (searchList.length > 1) ?
    <Autocomplete
      id="grouped-by-block"
      options={searchList}
      groupBy={(option) => option.BlockNumber}
      getOptionLabel={(option) => option.PanelListing}
      sx={{ width: 300 }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.key}>
            {option.PanelListing}
          </li>
        );
      }}
      renderInput={(params) => <TextField {...params} label="Search the June 2022 Quilt Display" />}
    /> : null
    }
    <InteractiveQuiltmap 
                        config={props.config} 
                        blocks={props.blocks}
                        otherPOIs={props.otherPOIs}
                        polyOverlays={polyOverlays}
                        addNamesToSearch={addNamesToSearch}
                        refreshMenu={refreshMenu}
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