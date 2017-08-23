goog.provide('M.style.Point');

goog.require('M.style.Simple');

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

    //default stroke
    if (M.utils.isNullOrEmpty(options.stroke)) options.stroke = {};
    if (M.utils.isNullOrEmpty(options.stroke.width)) options.stroke.width = 2;
    if (M.utils.isNullOrEmpty(options.stroke.color)) options.stroke.color = '#67af13';

    //default fill
    if (M.utils.isNullOrEmpty(options.fill)) options.fill = {};
    if (M.utils.isNullOrEmpty(options.fill.color)) options.fill.color = '#67af13';
    if (M.utils.isNullOrEmpty(options.fill.opacity)) options.fill.opacity = 0.2;

    //default radius
    if (M.utils.isNullOrEmpty(options.radius)) options.radius = 6;

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
