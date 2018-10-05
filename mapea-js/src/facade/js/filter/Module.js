/**
 * @module M/filter/spatial
 */
import { GeoJSONReader } from 'jsts/org/locationtech/jts/io';
import RelateOp from 'jsts/org/locationtech/jts/operation/relate/RelateOp';
import Spatial from './Spatial';
import WKT from '../format/WKT';
import { isArray, isObject } from '../util/Utils';
import Vector from '../layer/Vector';
import Feature from '../feature/Feature';


/**
 * TODO
 *
 * @function
 * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param -
 * Layer or geometry on which the query is performed
 * @return {Spatial} Space filter
 * @api
 */
export const parseParamToGeometries = (paramParameter) => {
  let param = paramParameter;
  let geometries = [];
  if (param instanceof Vector) {
    geometries = [...param.getFeatures().map(feature => feature.getGeometry())];
  } else {
    if (!isArray(param)) {
      param = [param];
    }
    geometries = param.map((p) => {
      let geom;
      if (p instanceof Feature) {
        geom = p.getGeometry();
      } else if (isObject(p)) {
        geom = p;
      }
      return geom;
    });
  }

  return geometries;
};

/**
 * TODO
 *
 * @private
 * @function
 * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param -
 *  Layer or geometry on which the query is performed
 * @return {Spatial} Space filter
 */
const toCQLFilter = (operation, geometries) => {
  let cqlFilter = '';
  const wktFormat = new WKT();
  geometries.forEach((value, index) => {
    if (index !== 0) {
      // es un OR porque se hace una interseccion completa con todas
      // las geometries
      cqlFilter += ' OR ';
    }
    const geometry = value;
    if (geometry.type.toLowerCase() === 'point') {
      geometry.coordinates.length = 2;
    }
    const formatedGeometry = wktFormat.write(geometry);
    cqlFilter += `${operation}({{geometryName}}, ${formatedGeometry})`;
  });
  return cqlFilter;
};

/**
 * This function creates a spatial filter to know which features contain another feature or layer
 *
 * @function
 * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
 * @return {Spatial} Space filter
 * @api
 */
export const CONTAIN = (param) => {
  const geometries = parseParamToGeometries(param);
  return new Spatial((geometryToFilter, index) => {
    const geojsonParser = new GeoJSONReader();
    const jtsGeomToFilter = geojsonParser.read(geometryToFilter);
    return geometries.some((geom) => {
      const jtsGeom = geojsonParser.read(geom);
      return RelateOp.contains(jtsGeom, jtsGeomToFilter);
    });
  }, {
    cqlFilter: toCQLFilter('CONTAINS', geometries),
  });
};

/**
 * This function creates a spatial filter to know which features disjoint another feature or layer
 *
 * @function
 * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
 * @return {Spatial} Space filter
 * @api
 */
export const DISJOINT = (param) => {
  const geometries = parseParamToGeometries(param);
  return new Spatial((geometryToFilter, index) => {
    const geojsonParser = new GeoJSONReader();
    const jtsGeomToFilter = geojsonParser.read(geometryToFilter);
    return geometries.some((geom) => {
      const jtsGeom = geojsonParser.read(geom);
      return !(RelateOp.intersects(jtsGeomToFilter, jtsGeom));
    });
  }, {
    cqlFilter: toCQLFilter('DISJOINT', geometries),
  });
};

/**
 * This function creates a spatial filter to know which features within another feature or layer
 *
 * @function
 * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
 * @return {Spatial} Space filter
 * @api
 */
export const WITHIN = (param) => {
  const geometries = parseParamToGeometries(param);
  return new Spatial((geometryToFilter, index) => {
    const geojsonParser = new GeoJSONReader();
    const jtsGeomToFilter = geojsonParser.read(geometryToFilter);
    return geometries.some((geom) => {
      const jtsGeom = geojsonParser.read(geom);
      return RelateOp.contains(jtsGeom, jtsGeomToFilter);
    });
  }, {
    cqlFilter: toCQLFilter('WITHIN', geometries),
  });
};

/**
 * This function creates a spatial filter to know which features intersects
 * another feature or layer
 *
 * @function
 * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param -
 * Layer or geometry on which the query is performed
 * @return {Spatial} Space filter
 * @api
 */
export const INTERSECT = (param) => {
  const geometries = parseParamToGeometries(param);
  return new Spatial((geometryToFilter, index) => {
    const geojsonParser = new GeoJSONReader();
    const jtsGeomToFilter = geojsonParser.read(geometryToFilter);
    return geometries.some((geom) => {
      const jtsGeom = geojsonParser.read(geom);
      return RelateOp.intersects(jtsGeomToFilter, jtsGeom);
    });
  }, {
    cqlFilter: toCQLFilter('INTERSECTS', geometries),
  });
};
