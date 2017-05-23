goog.provide('M.filter.spatial');
goog.require('M.filter.Spatial');

/**
 * @namespace M.filter.spatial
 */
(function () {
  /**
   * This function creates a spatial filter to know which features contain another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {M.filter.Spatial} Space filter
   * @api stable
   */
  M.filter.spatial.CONTAIN = function (param) {
    return new M.filter.Spatial(param, function (geometryToFilter, index) {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return this.geometries_.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeom.contains(jtsGeomToFilter);
      });
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
  M.filter.spatial.DISJOINT = function (param) {
    return new M.filter.Spatial(param, function (geometryToFilter, index) {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return this.geometries_.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeom.disjoint(jtsGeomToFilter);
      });
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
  M.filter.spatial.WITHIN = function (param) {
    return new M.filter.Spatial(param, function (geometryToFilter, index) {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return this.geometries_.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeom.within(jtsGeomToFilter);
      });
    });
  };

  /**
   * This function creates a spatial filter to know which features intersects another feature or layer
   *
   * @function
   * @param {M.layer.Vector|object} param - Layer or geometry on which the query is performed
   * @return {M.filter.Spatial} Space filter
   * @api stable
   */
  M.filter.spatial.INTERSECT = function (param) {
    return new M.filter.Spatial(param, function (geometryToFilter, index) {
      let geojsonParser = new jsts.io.GeoJSONReader();
      let jtsGeomToFilter = geojsonParser.read(geometryToFilter);
      return this.geometries_.some(geom => {
        let jtsGeom = geojsonParser.read(geom);
        return jtsGeom.intersects(jtsGeomToFilter);
      });
    });
  };

})();
