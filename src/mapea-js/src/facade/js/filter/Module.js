import Spatial from './Spatial';
import { isArray, isObject } from '../util/Utils';
import Vector from '../layer/Vector';
import Feature from '../feature/Feature';
import WKT from '../format/WKT';
import jsts from "jsts";

export default class Module {
  /**
   * This function creates a spatial filter to know which features contain another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {Spatial} Space filter
   * @api stable
   */
  static CONTAIN(param) {
    let geometries = Spatial.parseParamToGeometries(param);
    return new Spatial((geometryToFilter, index) => {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.contains(jtsGeom);
      });
    }, {
      cqlFilter: Module.toCQLFilter_("CONTAINS", geometries)
    });
  }

  /**
   * This function creates a spatial filter to know which features disjoint another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {Spatial} Space filter
   * @api stable
   */
  static DISJOINT(param) {
    let geometries = Spatial.parseParamToGeometries(param);
    return new Spatial((geometryToFilter, index) => {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.disjoint(jtsGeom);
      });
    }, {
      cqlFilter: Module.toCQLFilter_("DISJOINT", geometries)
    });
  }

  /**
   * This function creates a spatial filter to know which features within another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {Spatial} Space filter
   * @api stable
   */
  static WITHIN(param) {
    let geometries = Spatial.parseParamToGeometries(param);
    return new Spatial((geometryToFilter, index) => {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.within(jtsGeom);
      });
    }, {
      cqlFilter: Module.toCQLFilter_("WITHIN", geometries)
    });
  }

  /**
   * This function creates a spatial filter to know which features intersects another feature or layer
   *
   * @function
   * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param - Layer or geometry on which the query is performed
   * @return {Spatial} Space filter
   * @api stable
   */
  static INTERSECT(param) {
    let geometries = Spatial.parseParamToGeometries(param);
    return new Spatial((geometryToFilter, index) => {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.intersects(jtsGeom);
      });
    }, {
      cqlFilter: Module.toCQLFilter_("INTERSECTS", geometries)
    });
  }

  /**
   * TODO
   *
   * @function
   * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param - Layer or geometry on which the query is performed
   * @return {Spatial} Space filter
   * @api stable
   */
  static parseParamToGeometries(param) {
    let geometries = [];
    if (param instanceof Vector) {
      geometries = [...param.getFeatures().map(feature => feature.getGeometry())];
    } else {
      if (!Utils.isArray(param)) {
        param = [param];
      }
      geometries = param.map(p => {
        let geom;
        if (p instanceof Feature) {
          geom = p.getGeometry();
        } else if (Utils.isObject(p)) {
          geom = p;
        }
        return geom;
      });
    }

    return geometries;
  }

  /**
   * TODO
   *
   * @private
   * @function
   * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param - Layer or geometry on which the query is performed
   * @return {Spatial} Space filter
   */
  static toCQLFilter_(operation, geometries) {
    let cqlFilter = "";
    let wktFormat = new WKT();
    geometries.forEach(value) {
      if (value !== 0) {
        // es un OR porque se hace una interseccion completa con todas
        // las geometries
        cqlFilter += " OR ";
      }
      let geometry = geometries[value];
      if (geometry.type.toLowerCase() === "point") {
        geometry.coordinates.length = 2;
      }
      cqlFilter += operation + "({{geometryName}}, " + wktFormat.write(geometry) + ")";
    }
    return cqlFilter;
  }
}
