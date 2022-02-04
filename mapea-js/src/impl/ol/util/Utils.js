/**
 * @module M/impl/utils
 */
import Feature from 'M/feature/Feature';
import * as WKT from 'M/geom/WKT';
import { isNullOrEmpty, isString, generateRandom } from 'M/util/Utils';
import { getWidth, extend, getCenter } from 'ol/extent';
import { get as getProj, getTransform, transformExtent } from 'ol/proj';
import OLFeature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import GeometryType from 'ol/geom/GeometryType';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import LinearRing from 'ol/geom/LinearRing';
import Polygon from 'ol/geom/Polygon';
import MultiPoint from 'ol/geom/MultiPoint';
import MultiLineString from 'ol/geom/MultiLineString';
import MultiPolygon from 'ol/geom/MultiPolygon';
import GeometryCollection from 'ol/geom/GeometryCollection';
import Circle from 'ol/geom/Circle';

const getUnitsPerMeter = (projectionCode, meter) => {
  const projection = getProj(projectionCode);
  const metersPerUnit = projection.getMetersPerUnit();
  return meter / metersPerUnit;
};

export const geojsonTo4326 = (featuresAsJSON, codeProjection) => {
  const transformFunction = getTransform(codeProjection, 'EPSG:4326');
  const jsonResult = [];
  let jsonFeature = {};
  featuresAsJSON.forEach((featureAsJSON) => {
    const coordinates = [];
    if (Array.isArray(featureAsJSON.geometry.coordinates[0]) &&
      featuresAsJSON.length > 1) { // Type Polygon
      featureAsJSON.geometry.coordinates.forEach((aCoordinates) => {
        if (!Number.isFinite(aCoordinates[0]) && Array.isArray(aCoordinates)) {
          coordinates.push(aCoordinates.map((cord) => {
            const arrayAuxCC = [];
            if (Number.isFinite(cord[0])) {
              arrayAuxCC.push(transformFunction(cord));
            } else {
              cord.forEach((coordinate) => {
                arrayAuxCC.push(transformFunction(coordinate));
              });
            }
            return arrayAuxCC;
          }));
          jsonFeature = {
            ...featureAsJSON,
            geometry: {
              type: featureAsJSON.geometry.type,
              coordinates,
            },
          };
        } else { // type line
          const coordinate = transformFunction(aCoordinates);
          coordinates.push(coordinate);

          jsonFeature = {
            ...featureAsJSON,
            geometry: {
              type: featureAsJSON.geometry.type,
              coordinates,
            },
          };
        }
      }); // Type Point
      jsonResult.push(jsonFeature);
    } else if (featureAsJSON.geometry.coordinates.length === 3) {
      featureAsJSON.geometry.coordinates.pop();
      jsonFeature = {
        ...featureAsJSON,
        geometry: {
          type: featureAsJSON.geometry.type,
          coordinates: transformFunction(featureAsJSON.geometry.coordinates),
        },
      };
      jsonResult.push(jsonFeature);
    } else if (featuresAsJSON.length === 1) { // the layer has only one feature line
      if (featureAsJSON.geometry.coordinates[0].length > 2) {
        const coordinatesPolygon = featureAsJSON.geometry.coordinates[0]
          .map(coord => transformFunction(coord));
        jsonFeature = {
          ...featureAsJSON,
          geometry: {
            type: featureAsJSON.geometry.type,
            coordinates: coordinatesPolygon,
          },
        };
        jsonResult.push(jsonFeature);
      } else {
        jsonFeature = {
          ...featureAsJSON,
          geometry: {
            type: featureAsJSON.geometry.type,
            coordinates: transformFunction(featureAsJSON.geometry.coordinates[0]),
          },
        };
        jsonResult.push(jsonFeature);
      }
    } else if (Number.isFinite(featureAsJSON.geometry.coordinates[0])) {
      const coordTransformed = transformFunction(featureAsJSON.geometry.coordinates);
      jsonFeature = {
        ...featureAsJSON,
        geometry: {
          type: featureAsJSON.geometry.type,
          coordinates: coordTransformed,
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
    if (isNullOrEmpty(geometry)) {
      centroid = null;
    } else if (geometry instanceof RenderFeature) {
      centroid = geometry;
    } else {
      centroid = getCenter(geometry.getExtent());
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
    const sameSrcProjExtent = extent.every((coord, i) => {
      let isProjExtent = false;
      if (i < 2) {
        isProjExtent = (coord <= srcProjExtent[i]);
      } else {
        isProjExtent = (coord >= srcProjExtent[i]);
      }
      return isProjExtent;
    });

    if (sameSrcProjExtent) {
      transformedExtent = olTgtProj.getExtent();
    } else {
      transformedExtent = transformExtent(extent, olSrcProj, olTgtProj);
    }
    return transformedExtent;
  }

  /**
   * Transforms the renderFeature to standard feature.
   * @public
   * @function
   * @param {RenderFeature} olRenderFeature render feature to transform
   * @param {ol.Projection} tileProjection
   * @param {ol.Projection} mapProjection
   * @return {OLFeature} the ol.Feature
   * @api stable
   */
  static olRenderFeature2olFeature(olRenderFeature, tileProjection, mapProjection) {
    let olFeature;

    if (!isNullOrEmpty(olRenderFeature)) {
      const id = olRenderFeature.getId();
      const properties = olRenderFeature.getProperties();
      let geometry;
      if (isNullOrEmpty(tileProjection) && isNullOrEmpty(tileProjection)) {
        geometry = this.getGeometryFromRenderFeature(olRenderFeature.getGeometry());
      } else {
        const tileExtent = tileProjection.getExtent();
        const tileWorldExtent = tileProjection.getWorldExtent();
        if (!isNullOrEmpty(tileExtent) && !isNullOrEmpty(tileWorldExtent)) {
          const clonedOLRenderFeature = this.cloneOLRenderFeature(olRenderFeature);
          clonedOLRenderFeature.transform(tileProjection, mapProjection);
          geometry = this.getGeometryFromRenderFeature(clonedOLRenderFeature.getGeometry());
        }
      }
      olFeature = new OLFeature();
      if (!isNullOrEmpty(id)) {
        olFeature.setId(id);
      } else {
        olFeature.setId(generateRandom('mapea_feature_'));
      }
      olFeature.setProperties(properties, true);
      olFeature.setGeometry(geometry);
    }
    return olFeature;
  }

  /**
   * Clones a renderFeature
   * @public
   * @function
   * @param {RenderFeature} olRenderFeature render feature to clone
   * @return { RenderFeature } a clone
   * @api stable
   */
  static cloneOLRenderFeature(olRenderFeature) {
    const type = olRenderFeature.getType();
    const flatCoordinates = olRenderFeature.getFlatCoordinates();
    const ends = olRenderFeature.getEnds();
    const properties = olRenderFeature.getProperties();
    const id = olRenderFeature.getId();

    const clonedFlatCoordinates = [...flatCoordinates];
    const clonedProperties = Object.assign(properties);
    const clonedEnds = [...ends];
    const clonedOLRenderFeature =
      new RenderFeature(type, clonedFlatCoordinates, clonedEnds, clonedProperties, id);

    return clonedOLRenderFeature;
  }

  /**
   * Creates a OL geometry from a render featuer
   * @public
   * @function
   * @param {RenderFeature} olRenderFeature render feature which will be
   * used in order to build the Geometry
   * @param {function} transform function to reproject the coordinates
   * @return {ol.geom} the geometry of the render feature
   * @api stable
   */
  static getGeometryFromRenderFeature(olRenderFeature) {
    let geometry;
    const coordinates = olRenderFeature.getFlatCoordinates();
    const ends = olRenderFeature.getEnds();
    const endss = olRenderFeature.getEndss();
    const type = olRenderFeature.getType();
    switch (type) {
      case GeometryType.POINT:
        geometry = new Point(coordinates);
        break;
      case GeometryType.LINE_STRING:
        geometry = new LineString(coordinates);
        break;
      case GeometryType.LINEAR_RING:
        geometry = new LinearRing(coordinates);
        break;
      case GeometryType.POLYGON:
        geometry = new Polygon(coordinates);
        break;
      case GeometryType.MULTI_POINT:
        geometry = new MultiPoint(coordinates);
        break;
      case GeometryType.MULTI_LINE_STRING:
        geometry = new MultiLineString(coordinates, undefined, ends);
        break;
      case GeometryType.MULTI_POLYGON:
        geometry = new MultiPolygon(coordinates, undefined, endss);
        break;
      case GeometryType.GEOMETRY_COLLECTION:
        const geometries = olRenderFeature.getGeometries();
        geometry = new GeometryCollection(geometries);
        break;
      case GeometryType.CIRCLE:
        const center = olRenderFeature.getFlatInteriorPoint();
        geometry = new Circle(center);
        break;
      default:
        geometry = null;
    }

    return geometry;
  }

  /**
   * TODO:
   */
  static getWMTSScale(map, exact) {
    const projection = map.getProjection().code;
    const olProj = getProj(projection);
    const mpu = olProj.getMetersPerUnit(); // meters per unit in depending on the CRS;
    const size = map.getMapImpl().getSize();
    const pix = size[0]; // Numero de pixeles en el mapa
    // Extension del mapa en grados (xmin, ymin, xmax, ymax)
    const pix2 = map.getMapImpl().getView().calculateExtent(size);
    // Extension angular del mapa (cuantos grados estan en el mapa)
    const ang = pix2[2] - pix2[0];
    // (numero de metros en el mapa / numero de pixeles) / metros por pixel
    let scale = (((mpu * ang) / pix) * 1000) / 0.28;
    if (!exact === true) {
      if (scale >= 1000 && scale <= 950000) {
        scale = Math.round(scale / 1000) * 1000;
      } else if (scale >= 950000) {
        scale = Math.round(scale / 1000000) * 1000000;
      } else {
        scale = Math.round(scale);
      }
    }
    return Math.trunc(scale);
  }
}

export default Utils;
