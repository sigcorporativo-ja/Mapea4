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
     * @private
     * @type {Object}
     */
    this.oldStyle_ = null;

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
   * This function apply style
   *
   * @public
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @function
   * @api stable
   */
  M.style.Cluster.prototype.apply = function(layer) {
    let newStyle = layer.getStyle();
    if (!(newStyle instanceof M.style.Cluster)) {
      this.oldStyle_ = layer.getStyle();
    }
    goog.base(this, 'apply', layer);
  };

  /**
   * This function gets the old style of layer
   * @public
   * @function
   * @return {M.Style} the old style of layer
   * @api stable
   */
  M.style.Cluster.prototype.getOldStyle = function() {
    return this.oldStyle_;
  };

  /**
   * This function return a set of ranges defined by user
   *
   * @public
   * @function
   * @return {Array<number>} ranges stablished by user
   * @api stable
   */
  M.style.Cluster.prototype.getRanges = function() {
    return this.options_.ranges;
  };

  /**
   * This function update a set of ranges  defined by user
   *
   * @public
   * @function
   * @param {Array<number>} newRanges
   * @api stable
   */
  M.style.Cluster.prototype.setRanges = function(newRanges) {
    this.getImpl().setRanges(newRanges);
    this.unapply(this.layer_);
    this.layer_.setStyle(this);
    return this;
  };

  /**
   * This function return a specified range
   *
   * @public
   * @function
   * @param {number} min as minimal value in the interval
   * @param {number} max as max value in the interval
   * @api stable
   */
  M.style.Cluster.prototype.getRange = function(min, max) {
    return this.options_.ranges.find(el => (el.min == min && el.max == max));
  };

  /**
   * This function set a specified range
   *
   * @public
   * @function
   * @param {number} min as range minimal value to be overwritten
   * @param {number} max as range max value to be overwritten
   * @param {number} newRange as the new range
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
   * @public
   * @function
   * @param {boolean} animated defining if layer must be animated
   * @api stable
   */
  M.style.Cluster.prototype.setAnimated = function(animated) {
    return this.getImpl().setAnimated(animated, this.layer_, this);
  };

  /**
   * This function return if layer is animated
   *
   * @public
   * @function
   * @return {boolean} A flag indicating if layer is currently being animated
   * @api stable
   */
  M.style.Cluster.prototype.isAnimated = function() {
    return this.options_.animated;
  };

  /**
   * This function returns data url to canvas
   *
   * @protected
   * @function
   * @return {String} data url to canvas
   */
  M.style.Cluster.prototype.toImage = function() {
    let base64Img;
    if (!M.utils.isNullOrEmpty(this.oldStyle_)) {
      base64Img = this.oldStyle_.toImage();
    }
    else {
      base64Img = goog.base(this, 'toImage', this);
    }
    return base64Img;
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Cluster.DEFAULT = {
    hoverInteraction: true,
    displayAmount: true,
    selectInteraction: true,
    distance: 60,
    animated: true,
    maxFeaturesToSelect: 15,
    label: {
      text: function(feature) {
        let text;
        let cluseterFeatures = feature.getAttribute('features');
        if (!M.utils.isNullOrEmpty(cluseterFeatures)) {
          text = cluseterFeatures.length.toString();
        }
        return text;
      },
      font: "bold 15px Arial",
      textBaseline: 'middle',
      textAlign: "center"
    }
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
    animationMethod: "linear",
    distanceSelectFeatures: 15,
    convexHullStyle: {
      fill: {
        color: 'blue',
        opacity: 0.9
      },
      stroke: {
        color: 'red'
      }
    }
  };

  /**
   * Default options for range 1 style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Cluster.RANGE_1_DEFAULT = {
    fill: {
      color: 'green'
    },
    radius: 10
  };

  /**
   * Default options for range 2 style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Cluster.RANGE_2_DEFAULT = {
    fill: {
      color: 'red'
    },
    radius: 15,
  };

  /**
   * Default options for range 3 style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Cluster.RANGE_3_DEFAULT = {
    fill: {
      color: 'blue'
    },
    radius: 20
  };
})();
