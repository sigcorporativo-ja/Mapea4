goog.provide('M.style.Cluster');

goog.require('M.Style');

/**

 * @namespace M.style.Cluster

 */

(function() {

  /**

   * @classdesc

   * Main constructor of the class. Creates a style cluster

   * with parameters specified by the user

   *

   * @constructor

   * @extends {M.Style}

   * @param {object} parameters for style cluster

   * @param {object} specified parameters for class claster depends on its implementation

   * @api stable

   */

  M.style.Cluster = (function(options = {}, optsVendor = {}) {

    this.options_ = options;

    this.optionsVendor_ = optsVendor;

    /**

     * TODO

     */

    var impl = new M.impl.style.Cluster(this.options_, this.optionsVendor_);

    // calls the super constructor

    goog.base(this, {
      options: options,
      optsVendor: optsVendor
    }, impl);

  });

  goog.inherits(M.style.Cluster, M.Style);

  /**

   * This function apply the style to specified layer

   *

   * @function

   * @api stable

   */

  M.style.Cluster.prototype.apply = function(layer) {

    this.getImpl().apply(layer);

  };

  /**
<<<<<<< HEAD

   * This function apply the style to specified layer

   *

   * @function

   * @api stable

   */

  M.style.Cluster.prototype.unapply = function(layer) {

    this.getImpl().unapply(layer);

  };
  /*
   * This function apply the style to specified layer
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.unapply = function(layer) {
    this.getImpl().unapply(layer);
  };


  /**

   * This function return a set of ranges defined by user

   *

   * @function

   * @api stable

   */

  M.style.Cluster.prototype.getRanges = function() {

    return this.options_.ranges;

  };

  /**

   * This function update a set of ranges  defined by user

   *

   * @function

   * @api stable

   */

  M.style.Cluster.prototype.setRanges = function(newRanges = []) {

    this.options_.ranges = newRanges;

    return this;

  };

  /**

   * This function return a specified range

   *

   * @function

   * @api stable

   */

  M.style.Cluster.prototype.getRange = function(min, max) {

    return this.options_.ranges.find(el => (el.min == min && el.max == max));

  };

  /**

   * This function set a specified range

   *

   * @function

   * @api stable

   */

  M.style.Cluster.prototype.updateRange = function(min, max, newRange) {

    let element = this.options_.ranges.find(el => (el.min == min && el.max == max));

    if (element) {

      element = newRange;

      return this;

    }

    else {

      return false;

    }

  };

  /**

   * This function set if layer must be animated

   *

   * @function

   * @api stable

   */

  M.style.Cluster.prototype.setAnimated = function(animated = true) {

    this.options_.animated = animated;

    return this;

  };

  /**

   * This function return if layer is animated

   *

   * @function

   * @api stable

   */

  M.style.Cluster.prototype.isAnimated = function() {

    return this.options_.animated;

  };

  /**

   * Distance to calculate clusters

   *

   */

  M.style.Cluster.DEFAULT_DISTANCE = 60;

  /**

   * Time to animate cluster when users change of zoom or bbox

   *

   */

  M.style.Cluster.ANIMATION_DURATION = 250;

  /**

   * Effect to animate cluster when users change of zoom or bbox

   * easeIn | easeOut | linear | upAndDown

   *

   */

  M.style.Cluster.ANIMATION_METHOD = 'linear';

})();
