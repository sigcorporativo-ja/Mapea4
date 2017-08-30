goog.provide('M.style.Line');
goog.require('M.style.Simple');

/**
 * @namespace M.style.Line
 */
(function() {

  /**
   * @classdesc
   * Main constructor of the class. Creates a categoryStyle
   * with parameters specified by the user
   * for the implementation
   * provided by the user
   *
   * @constructor
   * @extends {M.style.Simple}
   * @param {options} userParameters parameters
   * @api stable
   */

  M.style.Line = (function(options) {
    options = options || M.style.Line.OPTS_DEFAULT;

    //Default stroke
    if (M.utils.isNullOrEmpty(options.stroke)) options.stroke = {};
    if (M.utils.isNullOrEmpty(options.stroke.width)) options.stroke.width = 2;
    if (M.utils.isNullOrEmpty(options.stroke.color)) options.stroke.color = '#67af13';

    var impl = new M.impl.style.Line(options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Line, M.style.Simple);

  /**
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
   * @api stable
   */

  M.style.Line.prototype.applyToFeature = function(feature) {
    this.getImpl().applyToFeature(feature);
  };

  /**
   * TODO
   */
  M.style.Line.prototype.serialize = function() {
    // TODO
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Line.OPTS_DEFAULT = {
    stroke: {
      width: 1
    }
  };
})();
