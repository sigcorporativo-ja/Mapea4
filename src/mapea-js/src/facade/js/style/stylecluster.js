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
    this.extends_(options, M.style.Cluster.DEFAULT);
    this.extends_(optsVendor, M.style.Cluster.DEFAULT_VENDOR);

    /**
     * TODO
     */
    var impl = new M.impl.style.Cluster(options, optsVendor);

    // calls the super constructor
    goog.base(this, options, impl);
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
    return this.options_.ranges;
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
    this.getImpl().updateRangeImpl(min, max, newRange, this.layer_, this);
    this.unapply(this.layer_);
    this.layer_.setStyle(this);
    return this;
  };

  /**
   * This function set if layer must be animated
   *
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.setAnimated = function(animated) {
    return this.getImpl().setAnimated(animated, this.layer_, this);
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
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Cluster.DEFAULT = {
    // this.numFeaturesToDoCluster = 0;
    // this.styleCache = [];
    // this.olLayerOld = null;
    // this.vectorCover = null;
    // this.optionsVendor = optionsVendor;
    // this.options = options;
    hoverInteraction: true,
    displayAmount: true,
    selectedInteraction: true,
    distance: 60,
    animated: true
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Cluster.DEFAULT_VENDOR = {
    animationDuration: 250,
    animationMethod: "linear"
  };
})();
