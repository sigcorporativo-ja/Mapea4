goog.provide('M.impl.utils');

goog.require('goog.style');

/**
 * @namespace M.impl.utils
 */
(function() {

  /**
   *
   * @function
   * @api stable
   */
  M.impl.utils.generateResolutions = function(projection, extent, minZoom, maxZoom) {
    var generatedResolutions, defaultMaxZoom = 28;

    // extent
    if (M.utils.isNullOrEmpty(extent)) {
      extent = projection.getExtent();
    }
    // size
    var size = ol.extent.getWidth(extent) / 256;

    // zoom levels
    var zoomLevels;
    if (M.utils.isNullOrEmpty(minZoom)) {
      minZoom = ol.DEFAULT_MIN_ZOOM;
    }
    if (M.utils.isNullOrEmpty(maxZoom)) {
      maxZoom = defaultMaxZoom;
    }
    zoomLevels = maxZoom - minZoom;

    generatedResolutions = new Array(zoomLevels);
    for (var i = 0; i < zoomLevels; i++) {
      generatedResolutions[i] = size / Math.pow(2, i);
    }

    return generatedResolutions;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.impl.utils.addOverlayImage = function(overlayImage, map) {
    var mapSize = map.getMapImpl().getSize();

    var screenXY = overlayImage['screenXY'];
    var screenXUnits = overlayImage['screenXUnits'];
    var screenYUnits = overlayImage['screenYUnits'];
    var overlayXY = overlayImage['overlayXY'];
    var overlayXUnits = overlayImage['overlayXUnits'];
    var overlayYUnits = overlayImage['overlayYUnits'];
    var size = overlayImage['size'];
    var src = overlayImage['src'];

    // src
    var img = goog.dom.createDom('img', {
      'src': src
    });
    // size
    goog.style.setWidth(img, size[0]);
    goog.style.setHeight(img, size[1]);

    // position
    var offsetX = overlayXY[0];
    if (overlayXUnits === ol.style.IconAnchorUnits.FRACTION) {
      offsetX = offsetX * size[0];
    }
    var offsetY = overlayXY[1];
    if (overlayYUnits === ol.style.IconAnchorUnits.FRACTION) {
      offsetY = (size[1] - (offsetY * size[1]));
    }
    goog.style.setStyle(img, 'position', 'absolute');
    var left = screenXY[0];
    if (screenXUnits === ol.style.IconAnchorUnits.FRACTION) {
      left = (left * mapSize[0]) - offsetX;
    }
    var top = screenXY[1];
    if (screenYUnits === ol.style.IconAnchorUnits.FRACTION) {
      top = (mapSize[1] - (top * mapSize[1])) - offsetY;
    }
    goog.style.setPosition(img, left, top);

    // parent
    var container = map.getMapImpl().getOverlayContainerStopEvent();
    container.appendChild(img);

    return img;
  };


  /**
   * Get the height of an extent.
   * @public
   * @function
   * @param {ol.Extent} extent Extent.
   * @return {number} Height.
   * @api stable
   */
  M.impl.utils.getExtentHeight = function(extent) {
    return extent[3] - extent[1];
  };

  /**
   * Get the width of an extent.
   * @public
   * @function
   * @param {ol.Extent} extent Extent.
   * @return {number} Width.
   * @api stable
   */
  M.impl.utils.getExtentWidth = function(extent) {
    return extent[2] - extent[0];
  };

  /**
   * Calcs the geometry center
   * @public
   * @function
   * @param {ol.geom} geom the ol geometry
   * @return {Array<number>} center coordinates
   * @api stable
   */
  M.impl.utils.getCentroid = function(geometry) {
    let centroid, coordinates, medianIdx, points, lineStrings;
    if (M.utils.isNullOrEmpty(geometry)) {
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
        centroid = M.impl.utils.getCentroid(geometry.getInteriorPoint());
        break;
      case "MultiPoint":
        points = geometry.getPoints();
        medianIdx = Math.floor(points.length / 2);
        centroid = M.impl.utils.getCentroid(points[medianIdx]);
        break;
      case "MultiLineString":
        lineStrings = geometry.getLineStrings();
        medianIdx = Math.floor(lineStrings.length / 2);
        centroid = M.impl.utils.getCentroid(lineStrings[medianIdx]);
        break;
      case "MultiPolygon":
        points = geometry.getInteriorPoints();
        centroid = M.impl.utils.getCentroid(points);
        break;
      case "Circle":
        centroid = geometry.getCenter();
        break;
      default:
        return null;
    }
    return centroid;
  };

  /**
   * Get the width of an extent.
   * @public
   * @function
   * @param {ol.Extent} extent Extent.
   * @return {number} Width.
   * @api stable
   */
  M.impl.utils.getFeaturesExtent = function(features) {
    let olFeatures = features.map(f => (f instanceof M.Feature) ? f.getImpl().getOLFeature() : f);
    let extents = olFeatures.map((feature) => feature.getGeometry().getExtent().slice(0));
    return (extents.length === 0) ? null : extents.reduce((ext1, ext2) => ol.extent.extend(ext1, ext2));
  };
  /**
   * Get the coordinate of centroid
   * @public
   * @function
   * @param {ol.geom} geometry geometry
   * @return {Arra<number>}
   * @api stable
   */
  M.impl.utils.getCentroidCoordinate = function(geometry) {
    var centroid, coordinates, medianIdx, points, lineStrings, geometries;

    // POINT
    if (geometry.getType() === M.geom.wkt.type.POINT) {
      centroid = geometry.getCoordinates();
    }
    // LINE
    else if (geometry.getType() === M.geom.wkt.type.LINE_STRING) {
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    }
    else if (geometry.getType() === M.geom.wkt.type.LINEAR_RING) {
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    }
    // POLYGON
    else if (geometry.getType() === M.geom.wkt.type.POLYGON) {
      centroid = M.impl.utils.getCentroidCoordinate(geometry.getInteriorPoint());
    }
    // MULTI
    else if (geometry.getType() === M.geom.wkt.type.MULTI_POINT) {
      points = geometry.getPoints();
      medianIdx = Math.floor(points.length / 2);
      centroid = M.impl.utils.getCentroidCoordinate(points[medianIdx]);
    }
    else if (geometry.getType() === M.geom.wkt.type.MULTI_LINE_STRING) {
      lineStrings = geometry.getLineStrings();
      medianIdx = Math.floor(lineStrings.length / 2);
      centroid = M.impl.utils.getCentroidCoordinate(lineStrings[medianIdx]);
    }
    else if (geometry.getType() === M.geom.wkt.type.MULTI_POLYGON) {
      points = geometry.getInteriorPoints();
      centroid = M.impl.utils.getCentroidCoordinate(points);
    }
    else if (geometry.getType() === M.geom.wkt.type.CIRCLE) {
      centroid = geometry.getCenter();
    }
    else if (geometry.getType() === M.geom.wkt.type.GEOMETRY_COLLECTION) {
      geometries = geometry.getGeometries();
      medianIdx = Math.floor(geometries.length / 2);
      centroid = M.impl.utils.getCentroidCoordinate(geometries[medianIdx]);
    }
    return centroid;
  };
})();
