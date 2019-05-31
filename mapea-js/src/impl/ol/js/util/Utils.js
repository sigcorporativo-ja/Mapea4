/**
 * @module M/impl/utils
 */
import Feature from 'M/feature/Feature';
import * as WKT from 'M/geom/WKT';
import { isNullOrEmpty, isString } from 'M/util/Utils';
import { getWidth, extend } from 'ol/extent';
import { get as getProj, getTransform, transformExtent } from 'ol/proj';

const getUnitsPerMeter = (projectionCode, meter) => {
  const projection = getProj(projectionCode);
  const metersPerUnit = projection.getMetersPerUnit();
  return meter / metersPerUnit;
};

export const geojsonTo4326 = (featuresAsJSON, codeProjection) => {
  const transformFunction = getTransform(codeProjection, 'EPSG:4326');
  const jsonResult = [];
  featuresAsJSON.forEach((featureAsJSON) => {
    const coordinates = [];
    if (Array.isArray(featureAsJSON.geometry.coordinates[0])) { // Type Polygon
      featureAsJSON.geometry.coordinates.forEach((aCoordinates) => {
        if (Array.isArray(aCoordinates)) {
          coordinates.push(aCoordinates.map((cord) => {
            const arrayAuxCC = [];
            cord.forEach((coordinate) => {
              arrayAuxCC.push(transformFunction(coordinate));
            });
            return arrayAuxCC;
          }));

          const jsonFeature = {
            ...featureAsJSON,
            geometry: {
              type: featureAsJSON.geometry.type,
              coordinates,
            },
          };

          jsonResult.push(jsonFeature);
        }
      }); // Type Point
    } else {
      if (featureAsJSON.geometry.coordinates.length === 3) { // Type Point && KML
        featureAsJSON.geometry.coordinates.pop();
      }
      const jsonFeature = {
        ...featureAsJSON,
        geometry: {
          type: featureAsJSON.geometry.type,
          coordinates: transformFunction(featureAsJSON.geometry.coordinates),
        },
      };
      jsonResult.push(jsonFeature);
    }
  });
  return jsonResult;
};


/**
 * @classdesc
 * Static utils class.
 * @api
 */
class Utils {
  /**
   *
   * @function
   * @api stable
   */
  static generateResolutions(projection, extent, minZoom, maxZoom) {
    let newExtent;
    let newMinZoom;
    let newMaxZoom;
    const generatedResolutions = [];
    const defaultMaxZoom = 28;
    // extent
    if (isNullOrEmpty(extent)) {
      newExtent = projection.getExtent();
    }
    // size
    const size = getWidth(newExtent) / 256;

    if (isNullOrEmpty(minZoom)) {
      // ol.DEFAULT_MIN_ZOOM;
      newMinZoom = 0;
    }
    if (isNullOrEmpty(maxZoom)) {
      newMaxZoom = defaultMaxZoom;
    }
    const zoomLevels = newMaxZoom - newMinZoom;

    for (let i = 0; i < zoomLevels; i += 1) {
      generatedResolutions[i] = size / (2 ** i);
    }

    return generatedResolutions;
  }

  /**
   *
   * @function
   * @api stable
   */
  static addOverlayImage(overlayImage, map) {
    map.getMapImpl().updateSize();
    const mapSize = map.getMapImpl().getSize();
    const screenXY = overlayImage.screenXY;
    const screenXUnits = overlayImage.screenXUnits;
    const screenYUnits = overlayImage.screenYUnits;
    const overlayXY = overlayImage.overlayXY;
    const overlayXUnits = overlayImage.overlayXUnits;
    const overlayYUnits = overlayImage.overlayYUnits;
    const size = overlayImage.size;
    const src = overlayImage.src;

    // src
    const img = document.createElement('img');
    img.src = src;

    // size
    img.style.width = `${size[0]}px`;
    img.style.height = `${size[1]}px`;

    // position
    let offsetX = overlayXY[0];
    if (overlayXUnits === 'fraction') {
      offsetX *= size[0];
    }
    let offsetY = overlayXY[1];
    if (overlayYUnits === 'fraction') {
      offsetY = (size[1] - (offsetY * size[1]));
    }
    img.style.position = 'absolute';
    let left = screenXY[0];
    if (screenXUnits === 'fraction') {
      left = (left * mapSize[0]) - offsetX;
    }
    let top = screenXY[1];
    if (screenYUnits === 'fraction') {
      top = (mapSize[1] - (top * mapSize[1])) - offsetY;
    }
    img.style.top = `${top}px`;
    img.style.left = `${left}px`;

    // parent
    const container = map.getMapImpl().getOverlayContainerStopEvent();
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
    let centroid;
    let coordinates;
    let medianIdx;
    let points;
    let lineStrings;
    if (isNullOrEmpty(geometry)) {
      return null;
    }
    switch (geometry.getType()) {
      case 'Point':
        centroid = geometry.getCoordinates();
        break;
      case 'LineString':
      case 'LinearRing':
        coordinates = geometry.getCoordinates();
        medianIdx = Math.floor(coordinates.length / 2);
        centroid = coordinates[medianIdx];
        break;
      case 'Polygon':
        centroid = Utils.getCentroid(geometry.getInteriorPoint());
        break;
      case 'MultiPoint':
        points = geometry.getPoints();
        medianIdx = Math.floor(points.length / 2);
        centroid = Utils.getCentroid(points[medianIdx]);
        break;
      case 'MultiLineString':
        lineStrings = geometry.getLineStrings();
        medianIdx = Math.floor(lineStrings.length / 2);
        centroid = Utils.getCentroid(lineStrings[medianIdx]);
        break;
      case 'MultiPolygon':
        points = geometry.getInteriorPoints();
        centroid = Utils.getCentroid(points);
        break;
      case 'Circle':
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
  static getFeaturesExtent(features, projectionCode) {
    const olFeatures = features.map(f => (f instanceof Feature ? f.getImpl().getOLFeature() : f));
    let extents = olFeatures.map(feature => feature.getGeometry().getExtent().slice(0));
    if (extents.length === 1) {
      const geometry = olFeatures[0].getGeometry();
      if (geometry.getType() === 'Point') {
        const units = getUnitsPerMeter(projectionCode, 1000);
        const coordX = geometry.getCoordinates()[0];
        const coordY = geometry.getCoordinates()[1];
        extents = [
          [
            coordX - units,
            coordY - units,
            coordX + units,
            coordY + units,
          ],
        ];
      }
    }
    return extents.length === 0 ? null : extents.reduce((ext1, ext2) => extend(ext1, ext2));
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
    let centroid;
    let coordinates;
    let medianIdx;
    let points;
    let lineStrings;
    let geometries;

    // POINT
    if (geometry.getType() === WKT.POINT) {
      centroid = geometry.getCoordinates();
    } else if (geometry.getType() === WKT.LINE_STRING) {
      // LINE
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    } else if (geometry.getType() === WKT.LINEAR_RING) {
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    } else if (geometry.getType() === WKT.POLYGON) {
      // POLYGON
      centroid = Utils.getCentroidCoordinate(geometry.getInteriorPoint());
    } else if (geometry.getType() === WKT.MULTI_POINT) {
      // MULTI
      points = geometry.getPoints();
      medianIdx = Math.floor(points.length / 2);
      centroid = Utils.getCentroidCoordinate(points[medianIdx]);
    } else if (geometry.getType() === WKT.MULTI_LINE_STRING) {
      lineStrings = geometry.getLineStrings();
      medianIdx = Math.floor(lineStrings.length / 2);
      centroid = Utils.getCentroidCoordinate(lineStrings[medianIdx]);
    } else if (geometry.getType() === WKT.MULTI_POLYGON) {
      points = geometry.getInteriorPoints();
      centroid = Utils.getCentroidCoordinate(points);
    } else if (geometry.getType() === WKT.CIRCLE) {
      centroid = geometry.getCenter();
    } else if (geometry.getType() === WKT.GEOMETRY_COLLECTION) {
      geometries = geometry.getGeometries();
      medianIdx = Math.floor(geometries.length / 2);
      centroid = Utils.getCentroidCoordinate(geometries[medianIdx]);
    }
    return centroid;
  }

  /**
   * Transform the extent. If the extent it is the same
   * than source proj extent then the target proj extent
   * will be returned
   * @public
   * @function
   * @param {ol.Extent} extent Extent to transform.
   * @param {String} srcProj source projection.
   * @param {String} tgtProj target projection.
   * @return {ol.Extent} transformed extent.
   * @api stable
   */
  static transformExtent(extent, srcProj, tgtProj) {
    let transformedExtent;

    const olSrcProj = isString(srcProj) ? getProj(srcProj) : srcProj;
    const olTgtProj = isString(tgtProj) ? getProj(tgtProj) : tgtProj;

    // checks if the extent to transform is the same
    // than source projection extent
    const srcProjExtent = olSrcProj.getExtent();
    const sameSrcProjExtent = extent.every((coord, i) => coord === srcProjExtent[i]);

    if (sameSrcProjExtent) {
      transformedExtent = olTgtProj.getExtent();
    } else {
      transformedExtent = transformExtent(extent, olSrcProj, olTgtProj);
    }
    return transformedExtent;
  }
}

export default Utils;
