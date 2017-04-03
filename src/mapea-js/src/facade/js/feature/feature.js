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
    this.GeoJSON = geojson;
    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.KML}
     */
    var impl = new M.impl.Feature(options);

    goog.base(this, impl);
  });
  goog.inherits(M.Feature, M.facade.Base);

  M.Feature.prototype.setId = function (id) {
    this.id_ = id;
  };

  M.Feature.prototype.getId = function (id) {
    return this.id_;
  };

})();
