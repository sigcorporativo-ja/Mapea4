import FilterSpatial from('./filterspatial.js');
import Utils from('../utils/utils.js');
import Vector from('../layers/vector.js');
import Feature from('../feature/feature.js');

export class FilterModule {
  /**
   * This function creates a spatial filter to know which features contain another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {FilterSpatial} Space filter
   * @api stable
   */
  static CONTAIN(param) {
    let geometries = FilterSpatial.parseParamToGeometries(param);
    return new FilterSpatial((geometryToFilter, index) => {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.contains(jtsGeom);
      });
    }, {
      cqlFilter: FilterSpatial.toCQLFilter_("CONTAINS", geometries)
    });
  }

  /**
   * This function creates a spatial filter to know which features disjoint another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {FilterSpatial} Space filter
   * @api stable
   */
  static DISJOINT(param) {
    let geometries = FilterSpatial.parseParamToGeometries(param);
    return new FilterSpatial((geometryToFilter, index) => {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.disjoint(jtsGeom);
      });
    }, {
      cqlFilter: FilterSpatial.toCQLFilter_("DISJOINT", geometries)
    });
  }

  /**
   * This function creates a spatial filter to know which features within another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {FilterSpatial} Space filter
   * @api stable
   */
  static WITHIN(param) {
    let geometries = FilterSpatial.parseParamToGeometries(param);
    return new FilterSpatial((geometryToFilter, index) => {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.within(jtsGeom);
      });
    }, {
      cqlFilter: FilterSpatial.toCQLFilter_("WITHIN", geometries)
    });
  }

  /**
   * This function creates a spatial filter to know which features intersects another feature or layer
   *
   * @function
   * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param - Layer or geometry on which the query is performed
   * @return {FilterSpatial} Space filter
   * @api stable
   */
  static INTERSECT(param) {
    let geometries = FilterSpatial.parseParamToGeometries(param);
    return new FilterSpatial((geometryToFilter, index) => {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.intersects(jtsGeom);
      });
    }, {
      cqlFilter: FilterSpatial.toCQLFilter_("INTERSECTS", geometries)
    });
  }

  /**
   * TODO
   *
   * @function
   * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param - Layer or geometry on which the query is performed
   * @return {FilterSpatial} Space filter
   * @api stable
   */
  static parseParamToGeometries(param) {
    let geometries = [];
    if (param instanceof Vector) {
      geometries = [...param.features().map(feature => feature.geometry())];
    } else {
      if (!Utils.isArray(param)) {
        param = [param];
      }
      geometries = param.map(p => {
        let geom;
        if (p instanceof Feature) {
          geom = p.geometry();
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
   * @return {FilterSpatial} Space filter
   */
  static toCQLFilter_(operation, geometries) {
    let cqlFilter = "";
    let wktFormat = new M.format.WKT();
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
