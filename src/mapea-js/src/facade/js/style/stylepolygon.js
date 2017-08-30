goog.provide('M.style.Polygon');
goog.require('M.style.Simple');


goog.require('M.style.Simple');

/**
 * @namespace M.style.Polygon
 */
(function() {

  /**
   * @classdesc
   * Creates a style polygon
   * @constructor
   * @extends {M.style.Simple}   *
   * @param {Object} options - options style
   * @api stable
   */
  M.style.Polygon = (function(options) {
    options = options || M.style.Polygon.OPTS_DEFAULT;

    //default stoke
    if (M.utils.isNullOrEmpty(options.stroke)) options.stroke = {};
    if (M.utils.isNullOrEmpty(options.stroke.width)) options.stroke.width = 2;
    if (M.utils.isNullOrEmpty(options.stroke.color)) options.stroke.color = '#67af13';

    //default fill
    if (M.utils.isNullOrEmpty(options.fill)) options.fill = {};
    if (M.utils.isNullOrEmpty(options.fill.color)) options.fill.color = '#67af13';
    if (M.utils.isNullOrEmpty(options.fill.opacity)) options.fill.opacity = 0.2;

    /**
     * TODO
     */
    var impl = new M.impl.style.Polygon(options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Polygon, M.style.Simple);

  /**
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
   */
  M.style.Polygon.prototype.applyToFeature = function(feature) {
    this.getImpl().applyToFeature(feature);
  };

  /**
   * TODO
   */
  M.style.Polygon.prototype.serialize = function() {
    // TODO
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Polygon.OPTS_DEFAULT = {
    stroke: {
      width: 1
    }
  };
})();
