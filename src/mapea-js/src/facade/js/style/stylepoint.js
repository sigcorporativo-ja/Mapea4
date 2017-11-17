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
    if (M.utils.isNullOrEmpty(options)) {
      options = M.style.Point.DEFAULT_NULL;
    }
    else {
      M.utils.extends(options, M.style.Point.DEFAULT);
    }
    var impl = new M.impl.style.Point(options);
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Point, M.style.Simple);

  /**
   * @inheritDoc
   * @api stable
   */
  M.style.Point.prototype.toImage = function() {
    return this.getImpl().toImage(this.canvas_);
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Point.DEFAULT = {

    radius: 5,
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Point.DEFAULT_NULL = {
    fill: {
      color: 'rgba(255, 255, 255, 0.4)',
      opacity: 0.4
    },
    stroke: {
      color: "#3399CC",
      width: 1.5
    },
    radius: 5,
  };



})();
