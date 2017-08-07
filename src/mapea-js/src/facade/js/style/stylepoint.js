goog.provide('M.style.Point');


/**
 * @namespace M.style.Point
 */
(function() {

  /**
   * TODO
   */

  M.style.Point = (function(options) {
    // TODO añadir atributo radius a las opciones pasadas por parametros
    options = options || M.style.Point.OPTS_DEFAULT;
    /**
     * TODO
     */
    var impl = new M.impl.style.Point(options);

    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Point, M.style.Simple);

  /**
   * TODO
   */
  M.style.Point.prototype.applyToFeature = function(feature) {
    this.getImpl().applyToFeature(feature);
  };

  /**
   * TODO
   */
  M.style.Point.prototype.serialize = function() {
    // TODO
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Point.OPTS_DEFAULT = {
    radius: 7
  };
})();
