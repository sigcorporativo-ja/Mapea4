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
  M.style.Line = (function(options = {}) {
    this.extends_(options, M.style.Line.DEFAULT);

    let impl = new M.impl.style.Line(options);
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Line, M.style.Simple);

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Line.DEFAULT = {
    stroke: {
      width: 2
    }
  };
})();
