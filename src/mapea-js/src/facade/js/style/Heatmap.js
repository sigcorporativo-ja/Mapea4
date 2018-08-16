/**
 * @module M/style/Heatmap
 */
import HeatmapImpl from 'impl/style/Heatmap';
import Style from './Style';
import { isString, isFunction, isArray, inverseColor, isNullOrEmpty, generateIntervals, extendsObj } from '../util/Utils';
import Exception from '../exception/exception';

/**
 * @classdesc
 * Main constructor of the class. Creates a style heatmap
 * with parameters specified by the user
 * @api
 */
class Heatmap extends Style {
  /**
   *
   * @constructor
   * @extends {M.Style}
   * @param {string|function} attribute - The feature attribute to use for the weight or a function
   * that returns a weight from a feature. Weight values should range from 0 to 1
   * (and values outside will be clamped to that range). Default is weight. Required.
   * @param {Mx.HeatmapStyleOptions} options - options style
   * @param {object} vendorOptions - vendorOptions style
   * @api
   */
  constructor(attribute, optionsParam = {}, vendorOptionsParam = {}) {
    const options = optionsParam;
    const vendorOptions = vendorOptionsParam;
    if (!(isString(attribute) || isFunction(attribute))) {
      Exception('Attribute parameter can not be empty (string or function)');
    }

    extendsObj(options, Heatmap.DEFAULT_OPTIONS);

    if (!isNullOrEmpty(options.gradient) && !isArray(options.gradient)) {
      options.gradient = [options.gradient];
    }

    options.gradient = options.gradient || Heatmap.DEFAULT_OPTIONS.gradient;

    if (options.gradient.length < 2) {
      const inverseColorParam = inverseColor(options.gradient[0]);
      options.gradient.push(inverseColorParam);
    }

    options.blur = isNullOrEmpty(options.blur) ?
      Heatmap.DEFAULT_OPTIONS.blur : parseFloat(options.blur);
    options.radius = isNullOrEmpty(options.radius) ?
      Heatmap.DEFAULT_OPTIONS.radius : parseFloat(options.radius);
    options.weight = attribute;
    vendorOptions.opacity = Number.isNaN(parseFloat(vendorOptions.opacity)) ?
      1 : parseFloat(vendorOptions.opacity);


    const impl = new HeatmapImpl(attribute, options, vendorOptions);

    // calls the super constructor
    super(options, impl);

    /**
     * @public
     * @type {string|function}
     * @api
     */
    this.attribute_ = attribute;

    /**
     * @private
     * @type {Mx.HeatmapStyleOptions}
     */
    this.options_ = options;

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
   * @api
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
   * @api
   */
  getAttributeName() {
    return this.attribute_;
  }

  /**
   * This function sets the attribute of heatmap style
   * @function
   * @public
   * @param {string|function} attribute - The attribute of heatmap style
   * @api
   */
  setAttributeName(attribute) {
    this.attribute_ = attribute;
    this.options_.weight = this.attribute_;
    this.update_();
  }

  /**
   * This function returns the gradient of heatmap style
   * @function
   * @public
   * @return {Array<string>}
   * @api
   */
  getGradient() {
    return this.options_.gradient;
  }

  /**
   * This function sets the gradient of heatmap style
   * @function
   * @public
   * @param {Array<string>} gradient
   * @api
   */
  setGradient(gradientParam) {
    let gradient = gradientParam;
    if (!isArray(gradient)) {
      gradient = [gradient];
    }
    if (gradient.length < 2) {
      const inverseColorParam = inverseColor(gradient[0]);
      gradient.push(inverseColorParam);
    }
    this.options_.gradient = gradient;
    this.update_();
  }

  /**
   * This function returns the radius of heatmap style
   * @function
   * @public
   * @return {number}
   * @api
   */
  getRadius() {
    return this.options_.radius;
  }

  /**
   * This function sets the radius of heatmap style
   * @function
   * @public
   * @param {number} radius
   * @api
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
   * @api
   */
  getBlurSize() {
    return this.options_.blur;
  }

  /**
   * This function sets the blur of heatmap style
   * @function
   * @public
   * @param {number} blur
   * @api
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
    const styleImpl = this.getImpl();
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
   * @api
   */
  drawGeometryToCanvas() {
    const [minWeight, maxWeight] = [this.getImpl().getMinWeight(), this.getImpl().getMaxWeight()];
    const ctx = this.canvas_.getContext('2d');
    const gradient = ctx.createLinearGradient(0.000, 150.000, 200.000, 150.000);
    const intervals = generateIntervals([0, 1], this.options_.gradient.length);
    this.options_.gradient.forEach((color, i) => gradient.addColorStop(intervals[i], color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 20, 200.000, 30.000);
    ctx.fillStyle = '#000';
    ctx.font = '10px sans-serif';
    ctx.fillText(minWeight, 0, 60);
    ctx.fillText(maxWeight, 199, 60);
  }

  /**
   * This function updates the canvas of style
   *
   * @function
   * @public
   * @api
   */
  updateCanvas() {
    this.drawGeometryToCanvas();
  }
}

/**
 * Default options of style heatmap
 * @constant
 * @public
 * @param {object}
 * @api
 */
Heatmap.DEFAULT_OPTIONS = {
  gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
  blur: 15,
  radius: 10,
};

export default Heatmap;
