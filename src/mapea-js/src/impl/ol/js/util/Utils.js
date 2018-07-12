import Feature from "facade/js/feature/Feature";
import WKT from "facade/js/geom/WKT";


/**
 * @namespace Utils
 */
export default class Utils {

  /**
   *
   * @function
   * @api stable
   */
  static generateResolutions(projection, extent, minZoom, maxZoom) {
    let generatedResolutions, defaultMaxZoom = 28;

    // extent
    if (Utils.isNullOrEmpty(extent)) {
      extent = projection.getExtent();
    }
    // size
    let size = ol.extent.getWidth(extent) / 256;

    // zoom levels
    let zoomLevels;
    if (Utils.isNullOrEmpty(minZoom)) {
      minZoom = ol.DEFAULT_MIN_ZOOM;
    }
    if (Utils.isNullOrEmpty(maxZoom)) {
      maxZoom = defaultMaxZoom;
    }
    zoomLevels = maxZoom - minZoom;

    generatedResolutions = new Array(zoomLevels);
    for (let i = 0; i < zoomLevels; i++) {
      generatedResolutions[i] = size / Math.pow(2, i);
    }

    return generatedResolutions;
  }

  /**
   *
   * @function
   * @api stable
   */
  static addOverlayImage(overlayImage, map) {
    let mapSize = map.getMapImpl().getSize();

    let screenXY = overlayImage['screenXY'];
    let screenXUnits = overlayImage['screenXUnits'];
    let screenYUnits = overlayImage['screenYUnits'];
    let overlayXY = overlayImage['overlayXY'];
    let overlayXUnits = overlayImage['overlayXUnits'];
    let overlayYUnits = overlayImage['overlayYUnits'];
    let size = overlayImage['size'];
    let src = overlayImage['src'];

    // src
    let img = document.createElement("img");
    img.src = src;

    // size
    img.style.width = size[0];
    img.style.height = size[1];

    // position
    let offsetX = overlayXY[0];
    if (overlayXUnits === ol.style.IconAnchorUnits.FRACTION) {
      offsetX = offsetX * size[0];
    }
    let offsetY = overlayXY[1];
    if (overlayYUnits === ol.style.IconAnchorUnits.FRACTION) {
      offsetY = (size[1] - (offsetY * size[1]));
    }
    img.style.position = "absolute";
    let left = screenXY[0];
    if (screenXUnits === ol.style.IconAnchorUnits.FRACTION) {
      left = (left * mapSize[0]) - offsetX;
    }
    let top = screenXY[1];
    if (screenYUnits === ol.style.IconAnchorUnits.FRACTION) {
      top = (mapSize[1] - (top * mapSize[1])) - offsetY;
    }
    img.style.top = top;
    img.style.left = left;

    // parent
    let container = map.getMapImpl().getOverlayContainerStopEvent();
    container.appendChild(img);

    return img;
  }


  /**
   * Get the height of an extent.
   * @public
   * @function
   * @param {ol.Extent} extent Extent.
   * @return {number} Height.
   * @api stable
   */
  static getExtentHeight(extent) {
    return extent[3] - extent[1];
  }

  /**
   * Get the width of an extent.
   * @public
   * @function
   * @param {ol.Extent} extent Extent.
   * @return {number} Width.
   * @api stable
   */
  static getExtentWidth(extent) {
    return extent[2] - extent[0];
  }

  /**
   * Calcs the geometry center
   * @public
   * @function
   * @param {ol.geom} geom the ol geometry
   * @return {Array<number>} center coordinates
   * @api stable
   */
  static getCentroid(geometry) {
    let centroid, coordinates, medianIdx, points, lineStrings;
    if (Utils.isNullOrEmpty(geometry)) {
      return null;
    }
    switch (geometry.getType()) {
      case "Point":
        centroid = geometry.getCoordinates();
        break;
      case "LineString":
      case "LinearRing":
        coordinates = geometry.getCoordinates();
        medianIdx = Math.floor(coordinates.length / 2);
        centroid = coordinates[medianIdx];
        break;
      case "Polygon":
        centroid = Utils.getCentroid(geometry.getInteriorPoint());
        break;
      case "MultiPoint":
        points = geometry.getPoints();
        medianIdx = Math.floor(points.length / 2);
        centroid = Utils.getCentroid(points[medianIdx]);
        break;
      case "MultiLineString":
        lineStrings = geometry.getLineStrings();
        medianIdx = Math.floor(lineStrings.length / 2);
        centroid = Utils.getCentroid(lineStrings[medianIdx]);
        break;
      case "MultiPolygon":
        points = geometry.getInteriorPoints();
        centroid = Utils.getCentroid(points);
        break;
      case "Circle":
        centroid = geometry.getCenter();
        break;
      default:
        return null;
    }
    return centroid;
  }

  /**
   * Get the width of an extent.
   * @public
   * @function
   * @param {ol.Extent} extent Extent.
   * @return {number} Width.
   * @api stable
   */
  static getFeaturesExtent(features) {
    let olFeatures = features.map(f => (f instanceof Feature) ? f.getImpl().getOLFeature() : f);
    let extents = olFeatures.map((feature) => feature.getGeometry().getExtent().slice(0));
    return (extents.length === 0) ? null : extents.reduce((ext1, ext2) => ol.extent.extend(ext1, ext2));
  }


  /**
   * Get the coordinate of centroid
   * @public
   * @function
   * @param {ol.geom} geometry geometry
   * @return {Arra<number>}
   * @api stable
   */
  static getCentroidCoordinate(geometry) {
    let centroid, coordinates, medianIdx, points, lineStrings, geometries;

    // POINT
    if (geometry.getType() === WKT.type.POINT) {
      centroid = geometry.getCoordinates();
    }
    // LINE
    else if (geometry.getType() === WKT.type.LINE_STRING) {
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    } else if (geometry.getType() === WKT.type.LINEAR_RING) {
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    }
    // POLYGON
    else if (geometry.getType() === WKT.type.POLYGON) {
      centroid = Utils.getCentroidCoordinate(geometry.getInteriorPoint());
    }
    // MULTI
    else if (geometry.getType() === WKT.type.MULTI_POINT) {
      points = geometry.getPoints();
      medianIdx = Math.floor(points.length / 2);
      centroid = Utils.getCentroidCoordinate(points[medianIdx]);
    } else if (geometry.getType() === WKT.type.MULTI_LINE_STRING) {
      lineStrings = geometry.getLineStrings();
      medianIdx = Math.floor(lineStrings.length / 2);
      centroid = Utils.getCentroidCoordinate(lineStrings[medianIdx]);
    } else if (geometry.getType() === WKT.type.MULTI_POLYGON) {
      points = geometry.getInteriorPoints();
      centroid = Utils.getCentroidCoordinate(points);
    } else if (geometry.getType() === WKT.type.CIRCLE) {
      centroid = geometry.getCenter();
    } else if (geometry.getType() === WKT.type.GEOMETRY_COLLECTION) {
      geometries = geometry.getGeometries();
      medianIdx = Math.floor(geometries.length / 2);
      centroid = Utils.getCentroidCoordinate(geometries[medianIdx]);
    }
    return centroid;
  }
}
