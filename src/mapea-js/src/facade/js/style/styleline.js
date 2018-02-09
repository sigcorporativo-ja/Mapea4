goog.provide('M.style.Line');
goog.require('M.style.Simple');

/**
 * @namespace M.style.Line
 */
(function() {

  /**
   * @classdesc
   * TODO Main constructor of the class. Creates a categoryStyle
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
    if (M.utils.isNullOrEmpty(options)) {
      options = M.style.Line.DEFAULT_NULL;
    }
    options = M.utils.extends({}, options);
    let impl = new M.impl.style.Line(options);
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Line, M.style.Simple);

  /**
   * This function apply style
   *
   * @function
   * @protected
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @api stable
   */
  M.style.Line.prototype.unapply = function(layer) {
    this.getImpl().unapply(layer);
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Line.DEFAULT_NULL = {
    fill: {
      color: 'rgba(255, 255, 255, 0.4)',
      opacity: 0.4
    },
    stroke: {
      color: "#3399CC",
      width: 1.5
    }
  };
})();
