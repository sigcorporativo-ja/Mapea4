import Style from './style';
import Utils from '../utils/utils';
import Exception from '../exception/exception';
import HeatmapImpl from '../../../impl/js/style/styleheatmap';



export default class Heatmap extends Style {
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
  constructor(attribute, options = {}, vendorOptions = {}) {

    let impl = new HeatmapImpl(attribute, this.options_, this.vendorOptions_);

    // calls the super constructor
    super(options, impl);

    if (!(Utils.isString(attribute) || Utils.isFunction(attribute))) {
      Exception('Attribute parameter can not be empty (string or function)');
    }

    Utils.extends(options, Style.DEFAULT_OPTIONS);

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

    if (!Utils.isNullOrEmpty(options.gradient) && !Utils.isArray(options.gradient)) {
      options.gradient = [options.gradient];
    }
    this.options_.gradient = options.gradient || Heatmap.DEFAULT_OPTIONS.gradient;

    if (this.options_.gradient.length < 2) {
      let inverseColor = Utils.inverseColor(options.gradient[0]);
      this.options_.gradient.push(inverseColor);
    }

    this.options_.blur = parseFloat(options.blur) || Heatmap.DEFAULT_OPTIONS.blur;
    this.options_.radius = parseFloat(options.radius) || Heatmap.DEFAULT_OPTIONS.radius;
    this.options_.weight = this.attribute;

    vendorOptions.opacity = isNaN(vendorOptions.opacity) ? 1 : parseFloat(vendorOptions.opacity);
    /**
     * @private
     * @type {object}
     */
    this.vendorOptions_ = vendorOptions;

  }

  /**
   * This function remove the style to specified layer
   * @function
   * @public
   * @param {M.Layer.Vector} layer - Layer where to apply choropleth style
   * @api stable
   */
  unapply(layer) {
    this.layer_ = null;
    this.getImpl().unapply(layer);
  }

  /**
   * This function returns the attribute of heatmap style
   * @function
   * @public
   * @return {string|function}
   * @api stable
   */
  getAttributeName() {
    return this.attribute;
  }

  /**
   * This function sets the attribute of heatmap style
   * @function
   * @public
   * @param {string|function} attribute - The attribute of heatmap style
   * @api stable
   */
  setAttributeName(attribute) {
    this.attribute = attribute;
    this.options_.weight = this.attribute;
    this.update_();
  }

  /**
   * This function returns the gradient of heatmap style
   * @function
   * @public
   * @return {Array<string>}
   * @api stable
   */
  getGradient() {
    return this.options_.gradient;
  }

  /**
   * This function sets the gradient of heatmap style
   * @function
   * @public
   * @param {Array<string>} gradient
   * @api stable
   */
  setGradient(gradient) {
    if (!Utils.isArray(gradient)) {
      gradient = [gradient];
    }
    if (gradient.length < 2) {
      let inverseColor = Utils.inverseColor(gradient[0]);
      gradient.push(inverseColor);
    }
    this.options_.gradient = gradient;
    this.update_();
  }

  /**
   * This function returns the radius of heatmap style
   * @function
   * @public
   * @return {number}
   * @api stable
   */
  getRadius() {
    return this.options_.radius;
  }

  /**
   * This function sets the radius of heatmap style
   * @function
   * @public
   * @param {number} radius
   * @api stable
   */
  setRadius(radius) {
    this.options_.radius = radius;
    this.update_();
  }

  /**
   * This function returns the blur of heatmap style
   * @function
   * @public
   * @return {number}
   * @api stable
   */
  getBlurSize() {
    return this.options_.blur;
  }

  /**
   * This function sets the blur of heatmap style
   * @function
   * @public
   * @param {number} blur
   * @api stable
   */
  setBlurSize(blur) {
    this.options_.blur = blur;
    this.update_();
  }

  /**
   * This function updates the style heatmap
   * @private
   * @function
   */
  update_() {
    let styleImpl = this.getImpl();
    styleImpl.unapply(this.layer_);
    styleImpl.setOptions(this.options_, this.vendorOptions_);
    styleImpl.applyToLayer(this.layer_);
  }

  /**
   * This function draws the style on the canvas
   *
   * @function
   * @public
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   * @api stable
   */
  drawGeometryToCanvas() {
    let [minWeight, maxWeight] = [this.getImpl().getMinWeight(), this.getImpl().getMaxWeight()];
    let ctx = this.canvas_.getContext('2d');
    let gradient = ctx.createLinearGradient(0.000, 150.000, 200.000, 150.000);
    let intervals = Utils.generateIntervals([0, 1], this.options_.gradient.length);
    this.options_.gradient.forEach((color, i) => gradient.addColorStop(intervals[i], color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 20, 200.000, 30.000);
    ctx.fillStyle = "#000";
    ctx.font = "10px sans-serif";
    ctx.fillText(minWeight, 0, 60);
    ctx.fillText(maxWeight, 199, 60);
  }

  /**
   * This function updates the canvas of style
   *
   * @function
   * @public
   * @api stable
   */
  updateCanvas() {
    this.drawGeometryToCanvas();
  }

  /**
   * Default options of style heatmap
   * @constant
   * @public
   * @param {object}
   * @api stable
   */
  Heatmap.DEFAULT_OPTIONS = {
    gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
    blur: 15,
    radius: 10,
  }
}
