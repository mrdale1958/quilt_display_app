import React from 'react';
import {Map, Marker, GoogleApiWrapper, USGSOverlay} from 'google-maps-react';
import {  Polygon } from "google-maps-react";
//import Mask from './Mask.js'; Static entry in index.html


class InteractiveQuiltMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        color: "red",
        origin: new this.props.google.maps.LatLng(37.76906625350, -122.45864076433 ),
        center: new this.props.google.maps.LatLng(37.76906625350, -122.45864076433 ),
        pitchright: new this.props.google.maps.LatLng(0.54e-4,  0.9e-4 ),
        pitchdown: new this.props.google.maps.LatLng(0.81e-4,  5.0e-5 ),
        initialZoom: 19
    }
    this.initMap = this.initMap.bind(this);
}
  componentDidMount() {
    this.initMap();
    
  }
  initMap() {
    
    let origin = this.state.origin;
    let pitchright = this.state.pitchright;
    let pitchdown = this.state.pitchdown;

    var testBounds = new this.props.google.maps.LatLngBounds(
        new this.props.google.maps.LatLng(62.281819, -150.287132),
        new this.props.google.maps.LatLng(62.400471, -150.005608));

    // The photograph is courtesy of the U.S. Geological Survey.
    var testImage = 'https://developers.google.com/maps/documentation/' +
        'javascript/examples/full/images/talkeetna.png';

    // The custom USGSOverlay object contains the USGS image,
    // the bounds of the image, and a reference to the map.
    this.setState((state, props) => {
        return {quiltgrid: quiltgrid, testBounds: testBounds, testImage: testImage}; // + this.props.configData.screenWidth/2};
    });


    const outerCoords = [ 
    
   { lat: origin.lat, lng: origin.lng },
      { lat: origin.lat+26*pitchright.lat, lng: origin.lng+26*pitchright.lng},
  
      { lat:origin.lat+26*pitchright.lat-6*pitchdown.lat, lng: origin.lng+26*pitchright.lng+6*pitchdown.lng },
  
      { lat: origin.lat - 6*pitchdown.lat, lng: origin.lng +6*pitchdown.lng},
  
    ];
  
    let quiltgrid = [ outerCoords ];
    
  var row = 0;
  var col = 0;
  for (row = 0; row<10; row++) {
      for (col = 0; col <6; col++) {
    quiltgrid.push([
      { lat: origin.lat+row*pitchright.lat-col*pitchdown.lat, lng: origin.lng+row*pitchright.lng+col*pitchdown.lng },
      { lat: origin.lat+(row+1)*pitchright.lat-col*pitchdown.lat, lng: origin.lng+(row+1)*pitchright.lng+col*pitchdown.lng },
  
      { lat:origin.lat+(row+1)*pitchright.lat-(col+1)*pitchdown.lat, lng: origin.lng+(row+1)*pitchright.lng+(col+1)*pitchdown.lng },
  
      { lat: origin.lat - (col+1)*pitchdown.lat+row*pitchright.lat, lng: origin.lng + (col+1)*pitchdown.lng+row*pitchright.lng },
  
    ]);
    }
  }
  for (row = 10; row<11; row++) {
      for (col = 1; col <5; col++) {
    quiltgrid.push([
      { lat: origin.lat+row*pitchright.lat-col*pitchdown.lat, lng: origin.lng+row*pitchright.lng+col*pitchdown.lng },
      { lat: origin.lat+(row+1)*pitchright.lat-col*pitchdown.lat, lng: origin.lng+(row+1)*pitchright.lng+col*pitchdown.lng },
  
      { lat:origin.lat+(row+1)*pitchright.lat-(col+1)*pitchdown.lat, lng: origin.lng+(row+1)*pitchright.lng+(col+1)*pitchdown.lng },
  
      { lat: origin.lat - (col+1)*pitchdown.lat+row*pitchright.lat, lng: origin.lng + (col+1)*pitchdown.lng+row*pitchright.lng },
  
    ]);
    }
  }
  
  for (row = 11; row<12; row++) {
      for (col = 2; col <4; col++) {
    quiltgrid.push([
      { lat: origin.lat+row*pitchright.lat-col*pitchdown.lat, lng: origin.lng+row*pitchright.lng+col*pitchdown.lng },
      { lat: origin.lat+(row+1)*pitchright.lat-col*pitchdown.lat, lng: origin.lng+(row+1)*pitchright.lng+col*pitchdown.lng },
  
      { lat:origin.lat+(row+1)*pitchright.lat-(col+1)*pitchdown.lat, lng: origin.lng+(row+1)*pitchright.lng+(col+1)*pitchdown.lng },
  
      { lat: origin.lat - (col+1)*pitchdown.lat+row*pitchright.lat, lng: origin.lng + (col+1)*pitchdown.lng+row*pitchright.lng },
  
    ]);
    }
  }
  
  for (row =15; row<26; row++) {
      for (col = 2; col <4; col++) {
    quiltgrid.push([
      { lat: origin.lat+row*pitchright.lat-col*pitchdown.lat, lng: origin.lng+row*pitchright.lng+col*pitchdown.lng },
      { lat: origin.lat+(row+1)*pitchright.lat-col*pitchdown.lat, lng: origin.lng+(row+1)*pitchright.lng+col*pitchdown.lng },
  
      { lat:origin.lat+(row+1)*pitchright.lat-(col+1)*pitchdown.lat, lng: origin.lng+(row+1)*pitchright.lng+(col+1)*pitchdown.lng },
  
      { lat: origin.lat - (col+1)*pitchdown.lat+row*pitchright.lat, lng: origin.lng + (col+1)*pitchdown.lng+row*pitchright.lng },
  
    ]);
    }
  }
  this.setState((state, props) => {
    return {quiltgrid: quiltgrid}; // + this.props.configData.screenWidth/2};
  });
   }

  render() {
      const triangleCoords = [
        {lat: 25.774, lng: -80.190},
        {lat: 18.466, lng: -66.118},
        {lat: 32.321, lng: -64.757},
        {lat: 25.774, lng: -80.190}
      ];
    const containerStyle = {
      position: 'relative',  
      width: '1080px',
      height: '1080px'
    }
    return (
        <Map className='quilt-map' 
                    containerStyle={containerStyle}
                    google={this.props.google} 
                    zoom={this.state.initialZoom}
                    initialCenter={this.state.center}>
            <Polygon
                paths={triangleCoords}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={2}
                fillColor="#0000FF"
                fillOpacity={0.35} />
            <Polygon
                paths={this.state.quiltgrid}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={2}
                fillColor="#0000FF"
                fillOpacity={0.35} />

            <Marker onClick={this.onMarkerClick}
                name={'Current location'} />
            <USGSOverlay  
                bounds={this.state.testBounds}  
                srcImage={this.state.testImage} 
            />
       
        </Map>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_MAPS_API_KEY),
  version: 'beta'
})(InteractiveQuiltMap);
// This example uses the Google Maps JavaScript API's Data layer
// to create a rectangular polygon with 2 holes in it.
