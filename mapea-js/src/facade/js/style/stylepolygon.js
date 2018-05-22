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
   * @extends {M.style.Simple}
   * @param {Object} options - options style
   * @api stable
   */
  M.style.Polygon = (function(options) {
    if (M.utils.isNullOrEmpty(options)) {
      options = M.style.Polygon.DEFAULT_NULL;
    }

    options = M.utils.extends({}, options);
    var impl = new M.impl.style.Polygon(options);
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Polygon, M.style.Simple);




  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Polygon.DEFAULT_NULL = {
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
