goog.provide('M.style.Line');
goog.require('M.style.Simple');


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
    var impl = new M.impl.style.Line(options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Line, M.style.Simple);

  /**
   * This function gets the Name
   *
   * @function
   * @param {M.Feature}
   * @returns {M.style.Line}
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

  M.style.Line.OPTS_DEFAULT = {
    stroke: {
      width: 1
    }
  };
})();
