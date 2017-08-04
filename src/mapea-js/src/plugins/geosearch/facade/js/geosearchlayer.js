goog.provide('P.layer.Geosearch');

(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.GeoJSON} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  M.layer.Geosearch = (function(parameters = {}, options = {}, impl = new M.impl.layer.Geosearch()) {
    // checks if the implementation can create KML layers
    if (M.utils.isUndefined(M.impl.layer.Geosearch)) {
      M.exception('La implementación usada no puede crear capas Geosearch');
    }

    // calls the super constructor
    goog.base(this, this, options, impl);
  });
  goog.inherits(M.layer.Geosearch, M.layer.Vector);

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @public
   * @param {object} obj - Object to compare
   * @api stable
   */
  M.layer.Geosearch.prototype.equals = function(obj) {
    var equals = false;
    if (obj instanceof M.layer.Geosearch) {}
    return equals;
  };
})();
