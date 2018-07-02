goog.provide('M.format.WKT');

(function () {

  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @param {string|Object} userParameters parameters
   * provided by the user
   * @api stable
   */
  M.format.WKT = (function (options = {}) {
    // checks if the implementation can create format GeoJSON
    if (M.utils.isUndefined(M.impl.format.WKT)) {
      M.exception('La implementación usada no puede M.impl.format.WKT');
    }

    /**
     * Implementation of this formatter
     * @public
     * @type {M.impl.format.WKT}
     */
    var impl = new M.impl.format.WKT(options);

    // calls the super constructor
    goog.base(this, impl);
  });
  goog.inherits(M.format.WKT, M.facade.Base);

  /**
   * TODO
   *
   * @public
   * @function
   * @param {Array<M.Feature>} features features array to parsed
   * as a GeoJSON FeatureCollection
   * @return {Array<Object>}
   * @api stable
   */
  M.format.WKT.prototype.write = function (geomtry) {
    return this.getImpl().write(geomtry);
  };
})();
