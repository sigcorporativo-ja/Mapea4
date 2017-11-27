goog.provide('M.impl.Style');

goog.require('ol.render');

/**
 * @namespace M.impl.Style
 */

(function() {
  /**
   * Main constructor of the class.
   * @constructor
   * @api stable
   */
  M.impl.Style = (function(options = {}) {

    /**
     * User options for this style
     * @private
     * @type {Object}
     */
    this.options_ = options;

    /**
     * Layer which this style is applied
     * @private
     * @type {M.layer.Vector}
     */
    this.layer_ = null;

    this.updateFacadeOptions(options);
  });

  /**
   * This function apply style options facade to impl
   * @public
   * @function
   * @param {Object} options
   * @api stable
   */
  M.impl.Style.prototype.updateFacadeOptions = function(options = {}) {};

  /**
   * This function apply style to layer
   * @public
   * @function
   * @param {M.layer.Vector} layer - Layer
   * @api stable
   */
  M.impl.Style.prototype.applyToLayer = function(layer) {
    this.layer_ = layer;
    layer.getFeatures().forEach(this.applyToFeature, this);
  };

  /**
   * This function apply style to feature
   *
   * @public
   * @function
   * @param {M.Feature} feature - Feature to apply style
   * @api stable
   */
  M.impl.Style.prototype.applyToFeature = function(feature) {
    feature.getImpl().getOLFeature().setStyle(this.olStyleFn_);
  };

  /**
   * This function updates the canvas of style of canvas
   *
   * @public
   * @function
   * @param {HTMLCanvasElement} canvas - canvas of style
   * @api stable
   */
  M.impl.Style.prototype.updateCanvas = function(canvas) {
    let canvasSize = this.getCanvasSize();
    let vectorContext = ol.render.toContext(canvas.getContext('2d'), {
      size: canvasSize
    });
    vectorContext.setStyle(this.olStyleFn_()[0]);
    this.drawGeometryToCanvas(vectorContext);
  };

  /**
   * This function draw the geometry on canvas of style
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.Style.prototype.drawGeometryToCanvas = function(vectorContext) {};

  /**
   * This function gets the canvas size
   *
   * @public
   * @function
   * @return {Array<number>} canvas size
   * @api stable
   */
  M.impl.Style.prototype.getCanvasSize = function() {
    return [100, 100];
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.Style.prototype.clone = function() {
    return new this.constructor(Object.assign({}, this.options_));
  };
})();
