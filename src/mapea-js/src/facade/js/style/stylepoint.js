goog.provide('M.style.Point');


/**
 * @namespace M.style.Point
 */
(function() {

  /**
   * @classdesc
   * Creates a style point
   * @constructor
   * @extends {M.style.Simple}
   * @param {Object} options - options style
   * @api stable
   */

  M.style.Point = (function(options) {
    options = options || M.style.Point.OPTS_DEFAULT;
    var impl = new M.impl.style.Point(options);

    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Point, M.style.Simple);

  /**
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
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
    stroke: {
      color: 'black',
      width: 1
    },
    radius: 3
  };
})();
