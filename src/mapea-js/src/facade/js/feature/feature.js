goog.provide('M.Feature');
goog.require('M.facade.Base');
goog.require('M.impl.Feature');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.KML} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  M.Feature = (function (id, geojson, options) {
    this.id_ = id;
    this.GeoJSON_ = geojson;

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.KML}
     */
    var impl = new M.impl.Feature(id, geojson, options);

    goog.base(this, impl);
  });
  goog.inherits(M.Feature, M.facade.Base);

  M.Feature.prototype.setId = function (id) {
    this.id_ = id;
  };

  M.Feature.prototype.getId = function (id) {
    return this.id_;
  };

  M.Feature.prototype.getGeometry = function () {
    return this.GeoJSON_.geometry;
  };

  M.Feature.prototype.getGeoJSON = function () {
    return this.GeoJSON_;
  };

  M.Feature.prototype.setGeoJSON = function (GeoJSON) {
    this.GeoJSON_ = GeoJSON;
  };


})();
