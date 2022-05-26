import * as ReactDOM from 'react-dom'

import invariant from 'invariant'

import MapContext from '../Services/map-context'

import React,  { PureComponent,createRef } from 'react'


function convertToLatLngString(latLngLike) {
  if (!latLngLike) {
    return ''
  }

  const latLng = latLngLike instanceof window.google.maps.LatLng
    ? latLngLike
    : new window.google.maps.LatLng(latLngLike.lat, latLngLike.lng)

  return latLng + ''
}

function convertToLatLngBoundsString(latLngBoundsLike) {
  if (!latLngBoundsLike) {
    return ''
  }

  const latLngBounds = latLngBoundsLike instanceof window.google.maps.LatLngBounds
    ? latLngBoundsLike
    : new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(latLngBoundsLike.south, latLngBoundsLike.east),
        new window.google.maps.LatLng(latLngBoundsLike.north, latLngBoundsLike.west)
      )

  return latLngBounds + ''
}


export class QuiltOverlay extends PureComponent {
  static FLOAT_PANE = `floatPane`
  static MAP_PANE = `mapPane`
  static MARKER_LAYER = `markerLayer`
  static OVERLAY_LAYER = `overlayLayer`
  static OVERLAY_MOUSE_TARGET = `overlayMouseTarget`


  
  overlayView;
  containerRef;

  updatePane = () => {
    const mapPaneName = this.props.mapPaneName

    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapPanes
    const mapPanes = this.overlayView.getPanes()
    invariant(
      !!mapPaneName,
      `OverlayView requires props.mapPaneName but got %s`,
      mapPaneName
    )

    if (mapPanes) {
      this.setState({
        paneEl: mapPanes[mapPaneName]
      })
    } else {
      this.setState({
        paneEl: null
      })
    }
  }
  onAdd = () => {
    
      // Create the img element and attach it to the div.
      this.updatePane()

    this.props.onLoad?.(this.overlayView)
  }

  onPositionElement = () => {
    // We use the south-west and north-east
      // coordinates of the overlay to peg it to the correct position and size.
      // To do this, we need to retrieve the projection from the overlay.
      const quiltProjection = this.overlayView.getProjection()

      // Retrieve the south-west and north-east coordinates of this overlay
      // in LatLngs and convert them to pixel coordinates.
      // We'll use these coordinates to resize the div.

      // lng seems to be off ~block width so leets ove it
      const lngOffset = this.bounds.east - this.bounds.west;
      const llBounds = new window.google.maps.LatLngBounds(
        {'lat': this.bounds.south, 'lng': this.bounds.east - lngOffset}, 
        {'lat': this.bounds.north, 'lng': this.bounds.west - lngOffset});
      const sw = quiltProjection.fromLatLngToDivPixel(
        llBounds.getSouthWest()
      );
      const ne = quiltProjection.fromLatLngToDivPixel(
        llBounds.getNorthEast()
      );
      
      // Resize the image's div to fit the indicated dimensions.
        var placementStyle = JSON.parse(JSON.stringify(this.state.containerStyle));
        placementStyle.left = sw.x + "px";
        placementStyle.top = ne.y + "px";
        //placementStyle.width = ne.x - sw.x + "px";
        placementStyle.width = sw.x - ne.x + "px";
        placementStyle.height = sw.y - ne.y + "px";
        this.setState(prevState => ({containerStyle: placementStyle})); 

/*
    const offset = {
      x: 0,
      y: 0,
      ...(this.containerRef.current
        ? getOffsetOverride(this.containerRef.current, this.props.getPixelPositionOffset)
        : {}),
    }

    const layoutStyles = getLayoutStyles(
      quiltProjection,
      offset,
      this.props.bounds,
      this.props.position
    )

    const { left, top, width, height } = this.state.containerStyle;
    if(!arePositionsEqual(layoutStyles, { left, top, width, height })) {
      this.setState({
        containerStyle: {
          ...layoutStyles,
          position: 'absolute'
        },
      })
    } */
  }

  draw = () => {
    this.onPositionElement()
  }

  onRemove = () => {
    this.setState(() => ({
      paneEl: null
    }))
    // this.mapPaneEl = null
    if (this.state.quiltDiv) {
      this.state.quiltDiv.parentNode.removeChild(this.state.quiltDiv);
      delete this.state.quiltDiv;
    }
    this.props.onUnmount?.(this.overlayView)
  }

  /**
     *  Set the visibility to 'hidden' or 'visible'.
     */
   hide() {
    if (this.state.quiltDiv) {
      this.setState(prevState => ({visibility: "hidden"})); 
       }
  }

  show() {
    if (this.state.quiltDiv) {
      this.setState(prevState => ({visibility: "visible"})); 
    }
  }

  toggle() {
    if (this.state.quiltDiv) {
      if (this.state.visibility === "hidden") {
        this.show();
      } else {
        this.hide();
      }
    }
  }

 /* toggleDOM(map: window.google.maps.Map) {
    if (this.getMap()) {
      this.setMap(null);
    } else {
      this.setMap(map);
    }
  }*/

  constructor(props) {
    super(props)
    this.containerRef = createRef()
    this.state = {
      paneEl: null,
      containerStyle: {
        // set initial position
        position: 'absolute'
      },
      visibility: "visible",
      bounds: props.bounds,
      image: props.image,
      placement: {
        left: "0px",
        top: "0px",
        width: "100px",
        height: "100px"},
      quiltStyle : {
        borderStyle: "none",
        borderWidth: "0px",
        position: "absolute",
        cursor: "crosshair"
      }
    }
    
  
    // You must implement three methods: onAdd(), draw(), and onRemove().
    const overlayView = new window.google.maps.OverlayView()
    overlayView.onAdd = this.onAdd
    overlayView.draw = this.draw
    overlayView.onRemove = this.onRemove
    this.overlayView = overlayView
    this.bounds = props.bounds;
    this.image = props.image;
  }

  componentDidMount() {
    // You must call setMap() with a valid Map object to trigger the call to
    // the onAdd() method and setMap(null) in order to trigger the onRemove() method.
    if (this.props.map){
      this.overlayView.setMap(this.props.map);
      
   } else
      console.log("no map yet")
  }

  componentDidUpdate(prevProps) {
    const prevPositionString = convertToLatLngString(prevProps.position)
    const positionString = convertToLatLngString(this.props.position)
    const prevBoundsString = convertToLatLngBoundsString(prevProps.bounds)
    const boundsString = convertToLatLngBoundsString(this.props.bounds)

    if (prevPositionString !== positionString || prevBoundsString !== boundsString) {
      this.overlayView.draw()
    }
    if (prevProps.mapPaneName !== this.props.mapPaneName) {
      this.updatePane()
    }
  }

  componentWillUnmount() {
    this.overlayView.setMap(null)
  }
  onClick = (event) => {
    event.stopPropagation()
    console.info('QuiltOverlay says I have been clicked! bubbling up')
    this.props.clickHandler(this.props.block)
  };
  
  render() {
    const paneEl = this.state.paneEl
    if (paneEl) {
      return ReactDOM.createPortal(
        <div 
          ref={this.containerRef}
          style={this.state.containerStyle}
        >
          <div onClick={this.onClick}
                className={'ggp-rotation super-block-rotation-'+this.props.superBlockLocation} 
                style={this.state.quiltStyle}>
            <img alt={""} src={this.image} width={"100%"} height={"100%"} position="absolute"/>
          </div>
        </div>,
        paneEl
      )
    } else {
      return null
    }
  }
}
QuiltOverlay.contextType = MapContext


export default QuiltOverlay
