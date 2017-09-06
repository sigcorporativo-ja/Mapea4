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
  M.style.Point = (function(options = {}) {
    //  this.extends_(options, M.style.Point.DEFAULT);

    var impl = new M.impl.style.Point(options);

    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Point, M.style.Simple);

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
  M.style.Point.DEFAULT = {
    stroke: {
      color: '#67af13',
      width: 2
    },
    radius: 6,
    fill: {
      color: '#67af13',
      opacity: 0.2
    },
    label: {
      offset: [0, 0]
    }
  };
})();
