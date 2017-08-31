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
    return this.options_.options.ranges;
  };
  /**
   * This function update a set of ranges  defined by user
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.setRanges = function(newRanges) {
    this.getImpl().setRangesImpl(newRanges, this.layer_, this);
    this.unapply(this.layer_);
    this.layer_.setStyle(this);
    return this;
    // this.options_.options.ranges = newRanges;
    // return this.layer_.setStyle(this);
  };
  /**
   * This function return a specified range
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.getRange = function(min, max) {
    return this.options_.options.ranges.find(el => (el.min == min && el.max == max));
  };
  /**
   * This function set a specified range
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.updateRange = function(min, max, newRange) {
    this.getImpl().updateRangeImpl(min, max, newRange, this.layer_, this);
    this.unapply(this.layer_);
    this.layer_.setStyle(this);
    return this;
  };
  // let element = this.options_.options.ranges.find(el => (el.min == min && el.max == max));
  // if (element) {
  //
  //   element.style = newRange;
  //   return this.layer_.setStyle(this);
  // }
  // else {
  //   return false;
  // }

  /**
   * This function set if layer must be animated
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.setAnimated = function(animated) {
    return this.getImpl().setAnimatedImpl(animated, this.layer_, this);
  };
  /*
    this.options_.options.animated = animated;
    if (animated == false) {
      this.getImpl().clusterLayer.set('animationDuration', undefined);
    }
    else {
      this.getImpl().clusterLayer.set('animationDuration', M.style.Cluster.ANIMATION_DURATION);
    }
    return this;
  };*/
  /**
   * This function return if layer is animated
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.isAnimated = function() {
    return this.options_.options.animated;
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
  if (this.isAnimated == true) {
    M.style.Cluster.ANIMATION_METHOD = "linear";
  }
  else {
    M.style.Cluster.ANIMATION_METHOD = null;
  }
})();
