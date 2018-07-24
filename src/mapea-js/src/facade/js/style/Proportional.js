import StyleComposite from './Composite';
import StylePoint from './Point';
import StyleSimple from './Simple';
import Utils from '../util/Utils';
import Exception from '../exception/exception';

/**
 * @namespace Proportional
 */
export default class Proportional extends StyleComposite {
  /**
   * @classdesc
   * Main constructor of the class. Creates a style Proportional
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Style}
   * @param {String}
   * @param{number}
   * @param{number}
   * @param {StylePoint}
   * @param {object}
   * @api stable
   */
  constructor(attributeName, minRadius, maxRadius, style, proportionalFunction, options = {}) {
    super(options, {});

    if (Utils.isNullOrEmpty(attributeName)) {
      Exception('No se ha especificado el nombre del atributo.');
    }

    /**
     * TODO
     * @public
     * @type {String}
     * @api stable
     * @expose
     */
    this.attributeName_ = attributeName;

    /**
     * The minimum radius of the proportionality
     * @private
     * @type {number}
     * @api stable
     * @expose
     */
    this.minRadius_ = parseInt(minRadius, 10) || 5;

    /**
     * The maximum radius of the proportionality
     * @private
     * @type {number}
     * @api stable
     * @expose
     */
    this.maxRadius_ = parseInt(maxRadius, 10) || 15;

    /**
     * The style point define by user
     * @private
     * @type {M.Style}
     * @api stable
     * @expose
     */
    this.style_ = style;

    /**
     * the proportionality function
     * @private
     * @type {function}
     * @api stable
     * @expose
     */
    this.proportionalFunction_ =
      proportionalFunction || ((value, minValue, maxValue) =>
        (((value - minValue) * (maxRadius - minRadius)) / (maxValue - minValue)) + minRadius);

    if (this.maxRadius_ < this.minRadius_) {
      this.minRadius_ = maxRadius;
      this.maxRadius_ = minRadius;
    }

    if (!Utils.isNullOrEmpty(this.style_)) {
      this.styles_.push(this.style_);
    }
  }
  /**
   * This function apply the style to specified layer
   * @function
   * @public
   * @param {M.Layer.Vector} layer - Layer where to apply choropleth style
   * @api stable
   */
  applyInternal_(layer) {
    this.layer_ = layer;
    this.update_();
  }

  /**
   * This function apply the style to specified layer
   * @function
   * @public
   * @param {M.Layer.Vector} layer - Layer where to apply choropleth style
   * @api stable
   */
  applyToFeature(feature, resolution) {
    let style = feature.getStyle() ? feature.getStyle() : this.layer_.getStyle();
    if (!Utils.isNullOrEmpty(style)) {
      if (!(style instanceof StylePoint) && style instanceof StyleSimple) {
        style = new StylePoint(style.getOptions());
      }
      else if (style instanceof StyleComposite) {
        style = new StylePoint(style.getOldStyle().getOptions());
      }
      const newStyle = this.calculateStyle_(feature, {
        minRadius: this.minRadius_,
        maxRadius: this.maxRadius_,
        minValue: this.minValue_,
        maxValue: this.maxValue_,
      }, style);
      feature.setStyle(newStyle);
    }
  }

  /**
   * This function updates the style
   * @function
   * @private
   * @api stable
   */
  update_() {
    if (!Utils.isNullOrEmpty(this.layer_)) {
      if (!Utils.isNullOrEmpty(this.style_)) {
        // this.layer_.setStyle(this.style_, true);
      }
      this.oldStyle_ = this.layer_.style() instanceof StyleComposite ? this.layer_.style()
        .getOldStyle() : this.layer_.style();
      [this.minValue_, this.maxValue_] = Proportional.getMinMaxValues_(this.layer_
        .getFeatures(), this.attributeName_);
      this.layer_.getFeatures().forEach(feature => this.applyToFeature(feature, 1));
      let newStyle = this.oldStyle_.clone();
      if (newStyle instanceof StyleSimple) {
        if (!(newStyle instanceof StylePoint)) {
          newStyle = new StylePoint(newStyle.getOptions());
        }
        newStyle.set('zindex', feature => (this.maxValue_ - parseFloat(feature.getAttribute(this.attributeName_))));
        newStyle.set(Proportional.sizeAttribute_(newStyle), (feature) => {
          const proportion = Proportional.SCALE_PROPORTION;
          const value = feature.attribute(this.attributeName_);
          let radius = this.getProportionalFunction_(
            value,
            this.minValue_,
            this.maxValue_,
            this.minRadius_,
            this.maxRadius_,
          );
          if (Proportional.sizeAttribute_(this.oldStyle_) === 'icon.scale') {
            radius = this.getProportionalFunction_(
              value,
              this.minValue_,
              this.maxValue_,
              this.minRadius_ / proportion,
              this.maxRadius_ / proportion,
            );
          }
          return radius;
        });
        this.updateCanvas();
      }
    }
  }

  /**
   * This function returns the attribute name defined by user
   * @function
   * @public
   * @return {String} attribute name of Style
   * @api stable
   */
  getAttributeName() {
    return this.attributeName_;
  }

  /**
   * This function set the attribute name defined by user
   * @function
   * @public
   * @param {String} attributeName - attribute name to set
   * @api stable
   */
  setAttributeName(attributeName) {
    this.attributeName_ = attributeName;
    this.update_();
    return this;
  }

  /**
   * This function returns the style point defined by user
   * @function
   * @public
   * @return {StylePoint} style point of each feature
   * @deprecated
   */

  /* eslint no-console: ["error", {allow: ["warn", "error"]}] */

  getStyle() {
    console.warn('Deprecated function: Use getStyles instead.');
    return this.style_;
  }

  /**
   * This function set the style point defined by user
   * @function
   * @public
   * @param {StylePoint} style - style point to set
   * @api stable
   */
  setStyle(style) {
    this.style_ = style;
    this.update_();
    return this;
  }

  /**
   * This function get the minimum radius of the style point
   * @function
   * @public
   * @return {number} minimum radius of style point
   * @api stable
   */
  getMinRadius() {
    return this.minRadius_;
  }

  /**
   * This function set proportional function
   * @function
   * @public
   * @param {function} proportionalFunction - proportional function
   * @api stable
   */
  setProportionalFunction(proportionalFunction) {
    this.proportionalFunction_ = proportionalFunction;
    this.update_();
  }

  /**
   * This function get proportional function
   * @function
   * @public
   * @return {number} minimum radius of style point
   * @api stable
   */
  getProportionalFunction() {
    return this.proportionalFunction_;
  }

  /**
   * This function set the minimum radius of the style point
   * @function
   * @public
   * @param {number} minRadius - minimum radius of style point
   * @api stable
   */
  setMinRadius(minRadius) {
    this.minRadius_ = parseInt(minRadius, 10);
    if (minRadius >= this.maxRadius_) {
      // this.maxRadius_ = minRadius + 10;
      Exception('No puede establecerse un radio mínimo mayor que el máximo.');
    }
    this.update_();
    return this;
  }

  /**
   * This function get the maximum radius of the style point
   * @function
   * @public
   * @return {number} maximum radius of style point
   * @api stable
   */
  getMaxRadius() {
    return this.maxRadius_;
  }

  /**
   * This function set the maximum radius of the style point
   * @function
   * @public
   * @param {number} minRadius - maximum radius of style point
   * @api stable
   */
  setMaxRadius(maxRadius) {
    this.maxRadius_ = parseInt(maxRadius, 10);
    if (maxRadius <= this.minRadius_) {
      // this.minRadius_ = maxRadius - 10;
      Exception('No puede establecerse un radio máximo menor que el mínimo.');
    }
    this.update_();
    return this;
  }

  /**
   * This function updates the canvas of style
   *
   * @function
   * @public
   * @api stable
   */
  updateCanvas() {
    this.updateCanvasPromise_ = new Promise((success, fail) => {
      if (!Utils.isNullOrEmpty(this.layer_)) {
        const style = !Utils.isNullOrEmpty(this.style_) ? this.style_ : this.layer_.style();

        if (style instanceof StyleSimple) {
          let featureStyle = style.clone();
          if (!(featureStyle instanceof StylePoint)) {
            featureStyle = new StylePoint(featureStyle.getOptions());
          }
          const sizeAttribute = Proportional.getSizeAttribute_(featureStyle);

          const styleMax = featureStyle.clone();
          const styleMin = featureStyle.clone();
          const maxRadius = this.getMaxRadius();
          const minRadius = this.getMinRadius();
          styleMax.set(sizeAttribute, maxRadius);
          styleMin.set(sizeAttribute, minRadius);

          this.loadCanvasImage_(maxRadius, styleMax.toImage(), (canvasImageMax) => {
            this.loadCanvasImage_(minRadius, styleMin.toImage(), (canvasImageMin) => {
              this.drawGeometryToCanvas(canvasImageMax, canvasImageMin, success);
            });
          });
        }
        else if (!Utils.isNullOrEmpty(style)) {
          this.canvas_ = style.canvas_;
          success();
        }
      }
    });
  }

  /**
   * TODO
   *
   * @function
   * @public
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   * @api stable
   */
  loadCanvasImage_(value, url, callbackFn) {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      callbackFn({
        image: this,
        value,
      });

      image.onerror = () => {
        callbackFn({
          value,
        });
      };
      image.src = url;
    };
  }

  /**
   * TODO
   *
   * @function
   * @public
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   * @api stable
   */

  drawGeometryToCanvas(canvasImageMax, canvasImageMin, callbackFn) {
    const maxImage = canvasImageMax.image;
    const minImage = canvasImageMin.image;

    this.canvas_.height = maxImage.height + 5 + minImage.height + 5;
    const vectorContext = this.canvas_.getContext('2d');
    vectorContext.textBaseline = 'middle';

    // MAX VALUE

    let coordXText = 0;
    let coordYText = 0;
    if (!Utils.isNullOrEmpty(maxImage)) {
      coordXText = maxImage.width + 5;
      coordYText = maxImage.height / 2;
      if (/^https?:\/\//i.test(maxImage.src)) {
        this.canvas_.height = 80 + 40 + 10;
        vectorContext.fillText(`  max: ${this.maxValue_}`, 85, 40);
        vectorContext.drawImage(maxImage, 0, 0, 80, 80);
      }
      else {
        vectorContext.fillText(`  max: ${this.maxValue_}`, coordXText, coordYText);
        vectorContext.drawImage(maxImage, 0, 0);
      }
    }

    // MIN VALUE

    if (!Utils.isNullOrEmpty(minImage)) {
      let coordinateX = 0;
      if (!Utils.isNullOrEmpty(maxImage)) {
        coordinateX = (maxImage.width / 2) - (minImage.width / 2);
      }
      const coordinateY = maxImage.height + 5;
      coordYText = coordinateY + (minImage.height / 2);
      if (/^https?:\/\//i.test(minImage.src)) {
        vectorContext.fillText(`  min: ${this.minValue_}`, 85, 105);
        vectorContext.drawImage(minImage, 20, 85, 40, 40);
      }
      else {
        vectorContext.fillText(`  min: ${this.minValue_}`, coordXText, coordYText);
        vectorContext.drawImage(minImage, coordinateX, coordinateY);
      }
    }
    callbackFn();
  }

  /**
   * This function gets the min value of feature's atributte.
   * @function
   * @private
   * @param {Array<M.Feature>} features - array of features
   * @param {String} attributeName - attributeName of style
   * @api stable
   */
  static getMinMaxValues_(features, attributeName) {
    let [minValue, maxValue] = [undefined, undefined];
    const filteredFeatures =
      features.filter((feature) => {
        return ![NaN, undefined, null].includes(feature.getAttribute(attributeName));
      }).map(f => parseInt(f.getAttribute(attributeName), 10));
    let index = 1;
    if (!Utils.isNullOrEmpty(filteredFeatures)) {
      minValue = filteredFeatures[0];
      maxValue = filteredFeatures[0];
      while (index < filteredFeatures.length - 1) {
        const posteriorValue = filteredFeatures[index + 1];
        minValue = (minValue < posteriorValue) ? minValue : posteriorValue;
        maxValue = (maxValue < posteriorValue) ? posteriorValue : maxValue;
        index += 1;
      }
    }
    return [minValue, maxValue];
  }

  /**
   * This function returns the attribute of style point that controls the size
   * @function
   * @private
   * @return {string} the attribute that controls the size
   * @api stable
   */
  static getSizeAttribute_(style) {
    let sizeAttribute = 'radius';
    if (!Utils.isNullOrEmpty(style.get('icon'))) {
      if (!Utils.isNullOrEmpty(style.get('icon.src'))) {
        sizeAttribute = 'icon.scale';
      }
      else {
        sizeAttribute = 'icon.radius';
      }
    }
    return sizeAttribute;
  }

  /**
   * This function returns the proportional style of feature
   * @function
   * @private
   * @param {M.Feature} feature
   * @param {object} options - minRadius, maxRadius, minValue, maxValue
   * @param {StylePoint} style
   * @return {StyleSimple} the proportional style of feature
   * @api stable
   */
  calculateStyle_(feature, options, styleVar) {
    let style = styleVar;
    if (!Utils.isNullOrEmpty(style)) {
      style = style.clone();
      let [minRadius, maxRadius] = [options.minRadius, options.maxRadius];
      if (!Utils.isNullOrEmpty(style.get('icon.src'))) {
        minRadius = options.minRadius / Proportional.SCALE_PROPORTION;
        maxRadius = options.maxRadius / Proportional.SCALE_PROPORTION;
      }
      const value = feature.getAttribute(this.attributeName_);
      if (value == null) {
        console.warn(`Warning: ${this.attributeName_} value is null or empty.`);
      }
      const radius = this.proportionalFunction_(
        value,
        options.minValue,
        options.maxValue,
        minRadius,
        maxRadius,
      );
      const zindex = options.maxValue - parseFloat(feature.getAttribute(this.attributeName_));
      style.set(Proportional.sizeAttribute_(style), radius);
      style.set('zindex', zindex);
    }
    return style;
  }

  /**
   * This constant defines the order of style.
   * @constant
   * @public
   * @api stable
   */
  static get ORDER() {
    return 1;
  }
}

/**
 * This constant defines the scale proportion for iconstyle in Proportional.
 * @constant
 * @public
 * @api stable
 */
Proportional.SCALE_PROPORTION = 20;
