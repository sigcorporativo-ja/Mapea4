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

    //{ranges: [{min:0, max:10, style: M.style.Point({})}, {min:10, max:20, style: M.style.Point({})}],
    //animated: true|false}
    this.ranges_ = options.ranges;
    this.animated_ = options.animated;
    this.optionsVendor_ = optsVendor;

    /**
     * Implementation of this layer
     * @public
     * @type {M.style.Cluster}
     */
    var impl = new M.impl.style.Cluster(this.ranges_, this.animated_, this.optionsVendor_);
    // calls the super constructor
    goog.base(this, this, impl);
  });
  goog.inherits(M.style.Cluster, M.Style);

  /**
   * This function apply the style to specified layer
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.apply = function(layer, map) {
    this.getImpl().apply(layer, map);
  };


  /**
   * This function return a set of ranges defined by user
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.getRanges = function() {
    return this.ranges_;
  };

  /**
   * This function update a set of ranges  defined by user
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.setRanges = function(newRanges = []) {
    this.ranges_ = newRanges;
    return this;
  };

  /**
   * This function return a specified range
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.getRange = function(min, max) {
    return this.ranges_.find(el => (el.min == min && el.max == max));
  };

  /**
   * This function set a specified range
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.updateRange = function(min, max, newRange) {
    let element = this.ranges_.find(el => (el.min == min && el.max == max));
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
    this.animated_ = animated;
    return this;
  };

  /**
   * This function return if layer is animated
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.isAnimated = function() {
    return this.animated_;
  };

  /**
   * Distance to calculate clusters
   *
   */
  M.style.Cluster.prototype.DEFAULT_DISTANCE = 60;

  /**
   * Time to animate cluster when users change of zoom or bbox
   *
   */
  M.style.Cluster.prototype.ANIMATION_DURATION = 250;

  /**
   * Effect to animate cluster when users change of zoom or bbox
   * easeIn | easeOut | linear | upAndDown
   *
   */
  M.style.Cluster.prototype.ANIMATION_METHOD = 'linear';


})();
