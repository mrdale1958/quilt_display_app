export const PositionDrawProps = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
}
//?:( (offsetWidth: number, offsetHeight: number) => { x: number; y: number }) | undefined

export function getOffsetOverride(
  containerElement,
  getPixelPositionOffset) {
  return typeof getPixelPositionOffset === 'function'
    ? getPixelPositionOffset(containerElement.offsetWidth, containerElement.offsetHeight)
    : {}
}

function createLatLng(inst, Type) { return new Type(inst.lat, inst.lng) }

function createLatLngBounds(inst, Type) {
  return new Type(
    new window.google.maps.LatLng(inst.ne.lat, inst.ne.lng),
    new window.google.maps.LatLng(inst.sw.lat, inst.sw.lng)
  )
}

function ensureOfType(
  inst,
  type,
  factory
) {
  return inst instanceof type ? inst : factory(inst, type)
}

function ensureOfTypeBounds(
  inst,
  type,
  factory
) {
  return inst instanceof type ? inst : factory(inst, type)
}

function getLayoutStylesByBounds(
  mapCanvasProjection,
  offset,
  bounds
) {
  const ne = mapCanvasProjection && mapCanvasProjection.fromLatLngToDivPixel(bounds.getNorthEast())

  const sw = mapCanvasProjection && mapCanvasProjection.fromLatLngToDivPixel(bounds.getSouthWest())

  if (ne && sw) {
    return {
      left: `${sw.x + offset.x}px`,
      top: `${ne.y + offset.y}px`,
      width: `${ne.x - sw.x - offset.x}px`,
      height: `${sw.y - ne.y - offset.y}px`,
    }
  }

  return {
    left: '-9999px',
    top: '-9999px',
  }
}

function getLayoutStylesByPosition  (
  mapCanvasProjection,
  offset,
  position
) {
  const point = mapCanvasProjection && mapCanvasProjection.fromLatLngToDivPixel(position)

  if (point) {
    const { x, y } = point

    return {
      left: `${x + offset.x}px`,
      top: `${y + offset.y}px`,
    }
  }

  return {
    left: '-9999px',
    top: '-9999px',
  }
}

export function getLayoutStyles (
  mapCanvasProjection,
  offset,
  bounds,
  position
) {
  return bounds !== undefined
    ? getLayoutStylesByBounds(
        mapCanvasProjection,
        offset,
        ensureOfTypeBounds(bounds, window.google.maps.LatLngBounds, createLatLngBounds)
      )
    : getLayoutStylesByPosition(
        mapCanvasProjection,
        offset,
        ensureOfType(position, window.google.maps.LatLng, createLatLng)
      )
}

export function arePositionsEqual (
  currentPosition,
  previousPosition
) {
  return currentPosition.left === previousPosition.left
    && currentPosition.top === previousPosition.top
    && currentPosition.width === previousPosition.height
    && currentPosition.height === previousPosition.height;
}
