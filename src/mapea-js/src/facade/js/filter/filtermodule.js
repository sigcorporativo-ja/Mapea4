goog.provide('M.filter.spatial');

goog.require('M.filter.Spatial');


/**
 * @namespace M.filter.spatial
 */
(function() {
  /**
   * This function creates a spatial filter to know which features contain another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {M.filter.Spatial} Space filter
   * @api stable
   */
  M.filter.spatial.CONTAIN = function(param) {
    let geometries = M.filter.spatial.parseParamToGeometries(param);
    return new M.filter.Spatial(function(geometryToFilter, index) {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.contains(jtsGeom);
      });
    }, {
      cqlFilter: M.filter.spatial.toCQLFilter_("CONTAINS", geometries)
    });
  };

  /**
   * This function creates a spatial filter to know which features disjoint another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {M.filter.Spatial} Space filter
   * @api stable
   */
  M.filter.spatial.DISJOINT = function(param) {
    let geometries = M.filter.spatial.parseParamToGeometries(param);
    return new M.filter.Spatial(function(geometryToFilter, index) {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.disjoint(jtsGeom);
      });
    }, {
      cqlFilter: M.filter.spatial.toCQLFilter_("DISJOINT", geometries)
    });
  };

  /**
   * This function creates a spatial filter to know which features within another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {M.filter.Spatial} Space filter
   * @api stable
   */
  M.filter.spatial.WITHIN = function(param) {
    let geometries = M.filter.spatial.parseParamToGeometries(param);
    return new M.filter.Spatial(function(geometryToFilter, index) {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.within(jtsGeom);
      });
    }, {
      cqlFilter: M.filter.spatial.toCQLFilter_("WITHIN", geometries)
    });
  };

  /**
   * This function creates a spatial filter to know which features intersects another feature or layer
   *
   * @function
   * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param - Layer or geometry on which the query is performed
   * @return {M.filter.Spatial} Space filter
   * @api stable
   */
  M.filter.spatial.INTERSECT = function(param) {
    let geometries = M.filter.spatial.parseParamToGeometries(param);
    return new M.filter.Spatial(function(geometryToFilter, index) {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return geometries.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeomToFilter.intersects(jtsGeom);
      });
    }, {
      cqlFilter: M.filter.spatial.toCQLFilter_("INTERSECTS", geometries)
    });
  };

  /**
   * TODO
   *
   * @function
   * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param - Layer or geometry on which the query is performed
   * @return {M.filter.Spatial} Space filter
   * @api stable
   */
  M.filter.spatial.parseParamToGeometries = function(param) {
    let geometries = [];
    if (param instanceof M.layer.Vector) {
      geometries = [...param.getFeatures().map(feature => feature.getGeometry())];
    }
    else {
      if (!M.utils.isArray(param)) {
        param = [param];
      }
      geometries = param.map(p => {
        let geom;
        if (p instanceof M.Feature) {
          geom = p.getGeometry();
        }
        else if (M.utils.isObject(p)) {
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
   * @param {M.layer.Vector|M.Feature|object|Array<M.Feature|object>} param - Layer or geometry on which the query is performed
   * @return {M.filter.Spatial} Space filter
   */
  M.filter.spatial.toCQLFilter_ = function(operation, geometries) {
    let cqlFilter = "";
    let wktFormat = new M.format.WKT();
    for (let i = 0; i < geometries.length; i++) {
      if (i !== 0) {
        // es un OR porque se hace una interseccion completa con todas
        // las geometries
        cqlFilter += " OR ";
      }
      let geometry = geometries[i];
      if (geometry.type.toLowerCase() === "point") {
        geometry.coordinates.length = 2;
      }
      cqlFilter += operation + "({{geometryName}}, " + wktFormat.write(geometry) + ")";
    }
    return cqlFilter;
  };
})();
