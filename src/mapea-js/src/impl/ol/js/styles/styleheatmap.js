goog.provide('M.impl.style.Heatmap');
goog.require('M.impl.Style');
goog.require('ol.layer.Heatmap');
(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Heatmap
   * control
   *
   * @constructor
   * @param {Object} options - config options of user
   * @api stable
   */
  M.impl.style.Heatmap = function(attribute, options) {

    /**
     * @private
     * @type {ol.layer.Heatmap}
     */
    this.heatmapLayer_ = null;
    /**
     * @private
     * @type {string}
     */
    this.attribute_ = attribute;

    /**
     * @private
     * @type {object}
     */
    this.options_ = options;

    /**
     * @private
     * @type {ol.layer.Vector}
     *
     */
    this.oldOLLayer_ = null;

    goog.base(this, {});
  };
  goog.inherits(M.impl.style.Heatmap, M.impl.Style);

  /**
   * This function apply the style to specified layer
   * @function
   * @public
   * @param{M.layer.Vector}
   * @api stable
   */
  M.impl.style.Heatmap.prototype.applyToLayer = function(layer) {
    this.layer_ = layer;
    if (!M.utils.isNullOrEmpty(layer)) {
      this.oldOLLayer_ = this.layer_.getImpl().getOL3Layer();
      let features = this.layer_.getFeatures();
      let olFeatures = features.map(f => f.getImpl().getOLFeature());
      olFeatures.forEach(f => f.setStyle(null));
      this.getHeatmapLayer_(olFeatures);
      this.layer_.getImpl().setOL3Layer(this.heatmapLayer_);
    }
  };

  /**
   * This function remove the style to specified layer
   * @function
   * @public
   * @api stable
   */
  M.impl.style.Heatmap.prototype.unapply = function(layer) {
    if (!M.utils.isNullOrEmpty(this.oldOLLayer_)) {
      this.layer_.getImpl().setOL3Layer(this.oldOLLayer_);
      this.layer_ = null;
      this.oldOLLayer_ = null;
    }
  };

  /**
   * This function creates a heatmap layer
   * @function
   * @private
   * @api stable
   */
  M.impl.style.Heatmap.prototype.getHeatmapLayer_ = function(olFeatures) {
    const defaultOptions = M.style.Heatmap.DEFAULT_OPTIONS;
    this.heatmapLayer_ = new ol.layer.Heatmap({
      source: new ol.source.Vector({
        features: olFeatures,
      }),
      weight: this.attribute_,
      gradient: ['#af3', '#0b3', '#f03', '#dd3', '#ff0'],
      radius: this.options_.radius || defaultOptions.radius,
      blur: this.options_.blur || defaultOptions.blur,
      shadow: this.options_.shadow || defaultOptions.shadow,
      opacity: this.options_.opacity || defaultOptions.opacity
    });
  };

  /**
   * This function
   * @public
   * @param {object} canvas
   * @function
   * @api stable
   */
  M.impl.style.Heatmap.prototype.updateCanvas = function(canvas) {};

  /**
   * Default options of style heatmap
   * @constant
   * @public
   * @param {object}
   * @api stable
   */
  M.style.Heatmap.DEFAULT_OPTIONS = {
    gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
    radius: 10,
    blur: 15,
    shadow: 200,
    minResolution: undefined,
    maxResolution: undefined,
    opacity: 1
  };
})();
