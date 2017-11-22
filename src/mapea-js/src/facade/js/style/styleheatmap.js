goog.provide('M.style.Heatmap');
goog.require('M.Style');


(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a style heatmap
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Style}
   * @param {string|function} attribute - The feature attribute to use for the weight or a function
   * that returns a weight from a feature. Weight values should range from 0 to 1
   * (and values outside will be clamped to that range). Default is weight. Required.
   * @param {Mx.HeatmapStyleOptions} options - options style
   * @param {object} vendorOptions - vendorOptions style
   * @api stable
   */
  M.style.Heatmap = (function(attribute, options = {}, vendorOptions = {}) {
    if (!(M.utils.isString(attribute) || M.utils.isFunction(attribute))) {
      M.exception('Attribute parameter can not be empty (string or function)');
    }

    M.utils.extends(options, M.style.DEFAULT_OPTIONS);

    /**
     * @public
     * @type {string|function}
     * @api stable
     */
    this.attribute = attribute;

    /**
     * @private
     * @type {Mx.HeatmapStyleOptions}
     */
    this.options_ = options;

    if (!M.utils.isNullOrEmpty(options.gradient) && !M.utils.isArray(options.gradient)) {
      options.gradient = [options.gradient];
    }

    if (options.gradient.length < 2) {
      let inverseColor = M.utils.inverseColor(options.gradient[0]);
      options.gradient.push(inverseColor);
    }

    this.options_.gradient = options.gradient;
    this.options_.blur = options.blur;
    this.options_.radius = options.radius;
    this.options_.weight = this.attribute;

    /**
     * @private
     * @type {object}
     */
    this.vendorOptions_ = vendorOptions;

    let impl = new M.impl.style.Heatmap(attribute, this.options_, this.vendorOptions_);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Heatmap, M.Style);

  /**
   * This function remove the style to specified layer
   * @function
   * @public
   * @param {M.Layer.Vector} layer - Layer where to apply choropleth style
   * @api stable
   */
  M.style.Heatmap.prototype.unapply = function(layer) {
    this.layer_ = null;
    this.getImpl().unapply(layer);
  };

  /**
   * This function returns the attribute of heatmap style
   * @function
   * @public
   * @return {string|function}
   * @api stable
   */
  M.style.Heatmap.prototype.getAttributeName = function() {
    return this.attribute;
  };

  /**
   * This function sets the attribute of heatmap style
   * @function
   * @public
   * @param {string|function} attribute - The attribute of heatmap style
   * @api stable
   */
  M.style.Heatmap.prototype.setAttributeName = function(attribute) {
    this.attribute = attribute;
    this.update_();
  };

  /**
   * This function returns the gradient of heatmap style
   * @function
   * @public
   * @return {Array<string>}
   * @api stable
   */
  M.style.Heatmap.prototype.getGradient = function() {
    return this.options_.gradient;
  };

  /**
   * This function sets the gradient of heatmap style
   * @function
   * @public
   * @param {Array<string>} gradient
   * @api stable
   */
  M.style.Heatmap.prototype.setGradient = function(gradient) {
    if (!M.utils.isArray(gradient)) {
      gradient = [gradient];
    }
    if (gradient.length < 2) {
      let inverseColor = M.utils.inverseColor(gradient[0]);
      gradient.push(inverseColor);
    }
    this.options_.gradient = gradient;
    this.update_();
  };

  /**
   * This function returns the radius of heatmap style
   * @function
   * @public
   * @return {number}
   * @api stable
   */
  M.style.Heatmap.prototype.getRadius = function() {
    return this.options_.radius;
  };

  /**
   * This function sets the radius of heatmap style
   * @function
   * @public
   * @param {number} radius
   * @api stable
   */
  M.style.Heatmap.prototype.setRadius = function(radius) {
    this.options_.radius = radius;
    this.update_();
  };

  /**
   * This function returns the blur of heatmap style
   * @function
   * @public
   * @return {number}
   * @api stable
   */
  M.style.Heatmap.prototype.getBlurSize = function() {
    return this.options_.blur;
  };

  /**
   * This function sets the blur of heatmap style
   * @function
   * @public
   * @param {number} blur
   * @api stable
   */
  M.style.Heatmap.prototype.setBlurSize = function(blur) {
    this.options_.blur = blur;
    this.update_();
  };

  /**
   * This function updates the style heatmap
   * @private
   * @function
   */
  M.style.Heatmap.prototype.update_ = function() {
    let styleImpl = this.getImpl();
    styleImpl.unapply(this.layer_);
    styleImpl.setOptions(this.options_, this.vendorOptions_);
    styleImpl.applyToLayer(this.layer_);
  };

  /**
   * This function draws the style on the canvas
   *
   * @function
   * @public
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   * @api stable
   */
  M.style.Heatmap.prototype.drawGeometryToCanvas = function() {
    let ctx = this.canvas_.getContext('2d');
    let gradient = ctx.createLinearGradient(0.000, 150.000, 200.000, 150.000);
    let intervals = M.utils.generateIntervals([0, 1], this.options_.gradient.length);
    this.options_.gradient.forEach((color, i) => gradient.addColorStop(intervals[i], color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 20, 200.000, 30.000);
    ctx.fillStyle = "#000";
    ctx.font = "10px sans-serif";
    ctx.fillText('0', 0, 60);
    ctx.fillText('1', 199, 60);
  };

  /**
   * This function updates the canvas of style
   *
   * @function
   * @public
   * @api stable
   */
  M.style.Heatmap.prototype.updateCanvas = function() {
    this.drawGeometryToCanvas();
  };

  /**
   * Default options of style heatmap
   * @constant
   * @public
   * @param {object}
   * @api stable
   */
  M.style.Heatmap.DEFAULT_OPTIONS = {
    gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
    blur: 15,
    radius: 10,
  };
})();
