import React, { useState, useCallback, useEffect } from 'react';
//import logo from './logo.svg';
import './AQTDisplay.css';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import  {getnames, addNamesOnBlock}  from '../Services/nameslist.js';
import { loggedIn, logIn } from '../Services/quiltDB.js';

import InteractiveQuiltmap from './InteractiveQuiltMap.js';

function AQTDisplay(props) {

  
  const [searchList, setSearchList] = useState([]);
  const [searchSelection, setSearchSelection] = useState({"BlockNumber":"00000", "PanelListing":""});
  const [selectedBlock, setSelectedBlock] = useState("");
  const [searchReady, setSearchReady] = useState(true);
  const [authorised, setAuthorization] = useState(false);
  const [ searchDBLoaded, setDBLoaded ] = useState(false);
  const [namesByBlock, setNamesDB] = useState({});

  let polyOverlays = [
    {  lat: props.config.origin.lat, 
      lng: props.config.origin.lng },
    {  lat: props.config.origin.lat + props.config.pitchright.lat, 
      lng: props.config.origin.lng  + props.config.pitchright.lng},
    {  lat: props.config.origin.lat + props.config.pitchright.lat + props.config.pitchdown.lat, 
      lng: props.config.origin.lng + props.config.pitchright.lng + props.config.pitchdown.lng },
    {  lat: props.config.origin.lat + props.config.pitchdown.lat, 
      lng: props.config.origin.lng  + props.config.pitchdown.lng},
    {  lat: props.config.origin.lat, 
      lng: props.config.origin.lng },
    {  lat: props.config.origin.lat + props.config.pitchright.lat - props.config.gutterWidth.lat, 
      lng: props.config.origin.lng  + props.config.pitchright.lng - props.config.gutterWidth.lng},
      {  lat: props.config.origin.lat + props.config.pitchright.lat + props.config.pitchdown.lat - props.config.gutterWidth.lat, 
        lng: props.config.origin.lng + props.config.pitchright.lng + props.config.pitchdown.lng - props.config.gutterWidth.lng },
      {  lat: props.config.origin.lat + props.config.pitchdown.lat - props.config.gutterWidth.lat, 
        lng: props.config.origin.lng  + props.config.pitchdown.lng - props.config.gutterWidth.lng},
  ];
  let otherPOIs = null;

  const sortByBlockNumber = (a,b) => {
    //console.log("sorting", a.BlockNumber, b.BlockNumber);
    return a.BlockNumber.localeCompare(b.BlockNumber) ||
    a.PanelLast.localeCompare(b.PanelLast);
  }
  const addNamesToSearch = useCallback((blockID) => {
    if ((searchList.length > 0) && searchList.find(o => o.BlockNumber === blockID.padStart(5, '0')))  return;
    //console.log("want to add", blockID.padStart(5, '0'));
      addNamesOnBlock(blockID.padStart(5, '0'))
      .then(data=> {
        try {
          data.sort(sortByBlockNumber);
          setSearchList(data)}
        catch(error){
          console.error("menu sort", data, error)
        }
      })
    
  },[searchList]);
  const refreshMenu = useCallback(() => {
    //console.log("searchList: ", searchList);
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
  
  useEffect(() => {
    refreshMenu();
    console.log("selected Block:", selectedBlock);
  }, [   refreshMenu,    selectedBlock]);

  useEffect(( ) => {
    console.log("logged in? begin", authorised, loggedIn)
    
    if (loggedIn ) {
      if (searchDBLoaded) return;
      const inventory=props.blocks;
      for (let block in inventory) {
        addNamesToSearch(inventory[block].BlockNumber.padStart(5, '0'));
      }
      setDBLoaded(true);
    }
    else 
    logIn().then(result =>
      {if (loggedIn) setAuthorization(true);
        console.log("logged in? return", authorised, loggedIn)
      }
      );   
  }, [props.blocks, addNamesToSearch, searchDBLoaded, authorised]);
  return (
    <div className="AQTDisplay">
    {  
    (searchList.length > 1) ?
    // TODO test for return, if list is len 1 then just select that item, else blink
    <Autocomplete className="search-bar"
      id="grouped-by-block"
      options={searchList}
      
      groupBy={(option) => option.BlockNumber}
      getOptionLabel={(option) => option.PanelListing}
      sx={{ width: "40vw" }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.key}>
            {option.PanelListing}
          </li>
        );
      }}
      value={searchSelection}
      onChange={(_event, selection) => {
        console.log("updating search result to",selection);
        if (selection === null) return;
        setSearchSelection(selection);
        const newSelectedBlock = (selection.BlockNumber.startsWith('Block 0')) ? selection.PanelListing : selection.BlockNumber; 
        if ((newSelectedBlock !== "00000") && (newSelectedBlock !== ""))  setSelectedBlock(newSelectedBlock);
        // TODO clear the autocomplete
      }}
      renderInput={(params) => <TextField {...params} label="Search the Quilt" />}
    /> : null
    }
    { ( searchList.length > 352 ) ? <InteractiveQuiltmap 
                        config={props.config} 
                        blocks={props.blocks}
                        selectedBlock={selectedBlock}
                        otherPOIs={props.otherPOIs}
                        polyOverlays={polyOverlays}
                        addNamesToSearch={addNamesToSearch}
                        names={searchList}
                        refreshMenu={refreshMenu}
                        POIs={props.config.POIs}
      /> : null }
      <div  className={"reticule"}><img src={"https://upload.wikimedia.org/wikipedia/commons/6/64/Red_Ribbon.svg"} width={20}  /></div>

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