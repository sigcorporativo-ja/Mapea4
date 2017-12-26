goog.provide('M.impl.style.Heatmap');
goog.require('M.impl.Style');
goog.require('M.impl.layer.Heatmap');

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
  M.impl.style.Heatmap = function(attribute, options, vendorOptions) {

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
    this.opt_options_ = M.utils.extends(options, vendorOptions);

    this.opt_options_.zIndex = 999999;
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
      let ol3Layer = this.layer_.getImpl().getOL3Layer();
      if (!(ol3Layer instanceof ol.layer.Heatmap)) {
        this.oldOLLayer_ = ol3Layer;
      }
      let features = this.layer_.getFeatures();
      let olFeatures = features.map(f => f.getImpl().getOLFeature());
      olFeatures.forEach(f => f.setStyle(null));
      this.createHeatmapLayer_(olFeatures);
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
      this.layer_.redraw();
      this.layer_ = null;
      this.oldOLLayer_ = null;
      this.heatmapLayer_ = null;
    }
  };

  /**
   * This function creates a heatmap layer
   * @function
   * @private
   * @api stable
   */
  M.impl.style.Heatmap.prototype.createHeatmapLayer_ = function(olFeatures) {
    this.opt_options_.source = new ol.source.Vector({
      features: olFeatures,
    });
    this.heatmapLayer_ = new M.impl.layer.Heatmap(this.opt_options_);
  };

  /**
   * This function
   * @public
   * @param {object} options_
   * @param {object} vendorOptions
   * @function
   */
  M.impl.style.Heatmap.prototype.setOptions = function(options, vendorOptions) {
    this.opt_options_ = M.utils.extends(options, vendorOptions);
  };
})();
