import * as ReactDOM from 'react-dom'

import invariant from 'invariant'

import MapContext from '../Services/map-context'

import { getOffsetOverride, getLayoutStyles, arePositionsEqual } from '../Services/dom-helper'
import React,  { ReactNode, CSSProperties, PureComponent, RefObject, createRef, ReactPortal, Children } from 'react'

/*global google*/

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

//export type PaneNames = keyof window.google.maps.MapPanes
const QuiltOverlayProps = {
  children: "ReactNode | undefined",
  // required
  mapPaneName: "",
  getPixelPositionOffset: "((offsetWidth: number, offsetHeight: number) => { x: number; y: number })" ,
  //bounds?: window.google.maps.LatLngBounds | window.google.maps.LatLngBoundsLiteral | undefined
  bounds: "window.google.maps.LatLngBounds ",
  position: "window.google.maps.LatLng | window.google.maps.LatLngLiteral | undefined",
  onLoad: "((overlayView: window.google.maps.OverlayView) => void) | undefined",
  onUnmount: "((overlayView: window.google.maps.OverlayView) => void) | undefined",
  image: "string  | undefined"
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
    this.div = document.createElement("div");
      this.div.style.borderStyle = "none";
      this.div.style.borderWidth = "0px";
      this.div.style.position = "absolute";

      // Create the img element and attach it to the div.
      const img = document.createElement("img");

      img.src = this.image;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.position = "absolute";
      this.div.appendChild(img);

      // Add the element to the "overlayLayer" pane.
      const panes = this.overlayView.getPanes();

      panes.overlayLayer.appendChild(this.div);this.updatePane()
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
      const llBounds = new window.google.maps.LatLngBounds({'lat': this.bounds.south, 'lng': this.bounds.east}, {'lat': this.bounds.north, 'lng': this.bounds.west});
      const sw = quiltProjection.fromLatLngToDivPixel(
        llBounds.getSouthWest()
      );
      const ne = quiltProjection.fromLatLngToDivPixel(
        llBounds.getNorthEast()
      );

      // Resize the image's div to fit the indicated dimensions.
      if (this.div) {
        this.div.style.left = sw.x + "px";
        this.div.style.top = ne.y + "px";
        this.div.style.width = ne.x - sw.x + "px";
        this.div.style.height = sw.y - ne.y + "px";
      }
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
    if (this.div) {
      this.div.parentNode.removeChild(this.div);
      delete this.div;
    }
    this.props.onUnmount?.(this.overlayView)
  }

  /**
     *  Set the visibility to 'hidden' or 'visible'.
     */
   hide() {
    if (this.div) {
      this.div.style.visibility = "hidden";
    }
  }

  show() {
    if (this.div) {
      this.div.style.visibility = "visible";
    }
  }

  toggle() {
    if (this.div) {
      if (this.div.style.visibility === "hidden") {
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
      bounds: props.bounds,
      image: props.image,
      quiltDiv: <div></div>
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
    if (this.props.map)
      this.overlayView.setMap(this.props.map)
    else
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

  render() {
    const paneEl = this.state.paneEl
    const kiddos = React.Children.toArray(this.props.children)
    if (paneEl) {
      return ReactDOM.createPortal(
        <div
          ref={this.containerRef}
          style={this.state.containerStyle}
        >
          {Children.only(this.props.children)}
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
