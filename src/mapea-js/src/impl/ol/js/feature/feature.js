goog.provide('M.impl.Feature');


(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  M.impl.Feature = (function (id, geojson, typeGeom, coordinates, options) {
    let geom = new ol.geom[typeGeom](coordinates.map(coord => ol.proj.transform(coord, 'EPSG:23030', 'EPSG:23030')))
    /**
     * ol feature
     * @private
     * @type {ol.Feature}
     */
    this.olFeature_ = new ol.Feature({
      geometry: geom
    });
    this.olFeature_.setId(id);
  });

  M.impl.Feature.prototype.getOLFeature = function () {
    return this.olFeature_;
  };

})();
