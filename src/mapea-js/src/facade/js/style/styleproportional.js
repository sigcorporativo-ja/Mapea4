goog.provide('M.style.Proportional');

goog.require('M.Style');
goog.require('M.style.Point');

/**
 * @namespace M.style.Proportional
 */
(function() {


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
   * @param {M.style.Point}
   * @param {object}
   * @api stable
   */
  M.style.Proportional = (function(attributeName, minRadius, maxRadius, style, proportionalFunction, options = {}) {
    if (M.utils.isNullOrEmpty(attributeName)) {
      M.exception("No se ha especificado el nombre del atributo.");
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
    this.minRadius_ = minRadius || 5;

    /**
     * The maximum radius of the proportionality
     * @private
     * @type {number}
     * @api stable
     * @expose
     */
    this.maxRadius_ = maxRadius || 15;

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
    this.proportionalFunction_ = proportionalFunction || ((value, minValue, maxValue, minRadius, maxRadius) =>
      (((value - minValue) * (maxRadius - minRadius)) / (maxValue - minValue)) + minRadius);

    /**
     * @public
     * @type {Array<M.Feature>}
     * @api stable
     * @expose
     */
    this.layerFeatures_ = [];

    if (this.maxRadius_ < this.minRadius_) {
      this.minRadius_ = maxRadius;
      this.maxRadius_ = minRadius;
    }

    goog.base(this, options, {});
  });

  goog.inherits(M.style.Proportional, M.Style);

  /**
   * This function apply the style to specified layer
   * @function
   * @public
   * @param {M.Layer.Vector} layer - Layer where to apply choropleth style
   * @api stable
   */
  M.style.Proportional.prototype.apply = function(layer) {
    this.layer_ = layer;
    this.update_();
  };

  /**
   * This function returns the attribute name defined by user
   * @function
   * @public
   * @return {String} attribute name of Style
   * @api stable
   */
  M.style.Proportional.prototype.getAttributeName = function() {
    return this.attributeName_;
  };

  /**
   * This function set the attribute name defined by user
   * @function
   * @public
   * @param {String} attributeName - attribute name to set
   * @api stable
   */
  M.style.Proportional.prototype.setAttributeName = function(attributeName) {
    this.attributeName_ = attributeName;
    this.update_();
    return this;
  };

  /**
   * This function returns the style point defined by user
   * @function
   * @public
   * @return {M.style.Point} style point of each feature
   */
  M.style.Proportional.prototype.getStyle = function() {
    return this.style_;
  };

  /**
   * This function set the style point defined by user
   * @function
   * @public
   * @param {M.style.Point} style - style point to set
   * @api stable
   */
  M.style.Proportional.prototype.setStyle = function(style) {
    this.style_ = style;
    this.update_();
    return this;
  };

  /**
   * This function get the minimum radius of the style point
   * @function
   * @public
   * @return {number} minimum radius of style point
   * @api stable
   */
  M.style.Proportional.prototype.getMinRadius = function() {
    return this.minRadius_;
  };

  /**
   * This function set proportional function
   * @function
   * @public
   * @param {function} proportionalFunction - proportional function
   * @api stable
   */
  M.style.Proportional.prototype.setProportionalFunction = function(proportionalFunction) {
    this.proportionalFunction_ = proportionalFunction;
    this.update_();
  };

  /**
   * This function get proportional function
   * @function
   * @public
   * @return {number} minimum radius of style point
   * @api stable
   */
  M.style.Proportional.prototype.getProportionalFunction = function() {
    return this.proportionalFunction_;
  };

  /**
   * This function set the minimum radius of the style point
   * @function
   * @public
   * @param {number} minRadius - minimum radius of style point
   * @api stable
   */
  M.style.Proportional.prototype.setMinRadius = function(minRadius) {
    this.minRadius_ = minRadius;
    if (minRadius >= this.maxRadius_) {
      // this.maxRadius_ = minRadius + 10;
      M.exception("No puede establecerse un radio mínimo mayor que el máximo.");
    }
    this.update_();
    return this;
  };

  /**
   * This function get the maximum radius of the style point
   * @function
   * @public
   * @return {number} maximum radius of style point
   * @api stable
   */
  M.style.Proportional.prototype.getMaxRadius = function() {
    return this.maxRadius_;
  };

  /**
   * This function set the maximum radius of the style point
   * @function
   * @public
   * @param {number} minRadius - maximum radius of style point
   * @api stable
   */
  M.style.Proportional.prototype.setMaxRadius = function(maxRadius) {
    this.maxRadius_ = maxRadius;
    if (maxRadius <= this.minRadius_) {
      // this.minRadius_ = maxRadius - 10;
      M.exception("No puede establecerse un radio máximo menor que el mínimo.");
    }
    this.update_();
    return this;
  };

  /**
   * This function updates the canvas of style
   *
   * @function
   * @public
   * @api stable
   */
  M.style.Proportional.prototype.updateCanvas = function() {
    this.updateCanvasPromise_ = new Promise((success, fail) => {
      if (!M.utils.isNullOrEmpty(this.layer_)) {
        let style = !M.utils.isNullOrEmpty(this.style_) ? this.style_ : this.layer_.getStyle();

        if (style instanceof M.style.Simple) {
          let featureStyle = style.clone();
          if (!(featureStyle instanceof M.style.Point)) {
            featureStyle = new M.style.Point(featureStyle.options_);
          }
          let sizeAttribute = M.style.Proportional.getSizeAttribute_(featureStyle);

          let styleMax = featureStyle.clone();
          let styleMin = featureStyle.clone();
          let maxRadius = this.getMaxRadius();
          let minRadius = this.getMinRadius();
          styleMax.set(sizeAttribute, maxRadius);
          styleMin.set(sizeAttribute, minRadius);

          this.loadCanvasImage_(maxRadius, styleMax.toImage(), (canvasImageMax) => {
            this.loadCanvasImage_(minRadius, styleMin.toImage(), (canvasImageMin) => {
              this.drawGeometryToCanvas(canvasImageMax, canvasImageMin, success);
            });
          });
        }
        else if (!M.utils.isNullOrEmpty(style)) {
          this.canvas_ = style.canvas_;
          success();
        }
      }
    });
  };

  /**
   * TODO
   *
   * @function
   * @public
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   * @api stable
   */
  M.style.Proportional.prototype.loadCanvasImage_ = function(value, url, callbackFn) {
    let image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function() {
      callbackFn({
        'image': this,
        'value': value
      });
    };
    image.onerror = function() {
      callbackFn({
        'value': value
      });
    };
    image.src = url;
  };

  /**
   * TODO
   *
   * @function
   * @public
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   * @api stable
   */
  M.style.Proportional.prototype.drawGeometryToCanvas = function(canvasImageMax, canvasImageMin, callbackFn) {
    let maxImage = canvasImageMax['image'];
    let minImage = canvasImageMin['image'];

    this.canvas_.height = maxImage.height + 5 + minImage.height + 5;
    let vectorContext = this.canvas_.getContext('2d');
    vectorContext.textBaseline = "middle";

    // MAX VALUE
    let maxValue = canvasImageMax['value'];
    let coordXText = 0;
    let coordYText = 0;
    if (!M.utils.isNullOrEmpty(maxImage)) {
      coordXText = maxImage.width + 5;
      coordYText = maxImage.height / 2;
      if (/^https?\:\/\//i.test(maxImage.src)) {
        this.canvas_.height = 80 + 40 + 10;
        vectorContext.fillText(`  max: ${maxValue}`, 85, 40);
        vectorContext.drawImage(maxImage, 0, 0, 80, 80);
      }
      else {
        vectorContext.fillText(`  max: ${maxValue}`, coordXText, coordYText);
        vectorContext.drawImage(maxImage, 0, 0);
      }
    }

    // MIN VALUE
    let minValue = canvasImageMin['value'];
    if (!M.utils.isNullOrEmpty(minImage)) {
      let coordinateX = 0;
      if (!M.utils.isNullOrEmpty(maxImage)) {
        coordinateX = (maxImage.width / 2) - (minImage.width / 2);
      }
      let coordinateY = maxImage.height + 5;
      coordYText = coordinateY + (minImage.height / 2);
      if (/^https?\:\/\//i.test(minImage.src)) {
        vectorContext.fillText(`  min: ${minValue}`, 85, 105);
        vectorContext.drawImage(minImage, 20, 85, 40, 40);
      }
      else {
        vectorContext.fillText(`  min: ${minValue}`, coordXText, coordYText);
        vectorContext.drawImage(minImage, coordinateX, coordinateY);
      }
    }
    callbackFn();
  };

  /**
   * This function updates the style
   * @function
   * @private
   * @api stable
   */
  M.style.Proportional.prototype.update_ = function() {
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      let features = this.layer_.getFeatures();
      let [minRadius, maxRadius] = [this.minRadius_, this.maxRadius_];
      let [minValue, maxValue] = M.style.Proportional.getMinMaxValues_(features, this.attributeName_);
      features.forEach(function(feature) {
        let style = !M.utils.isNullOrEmpty(this.style_) ? this.style_.clone() : feature.getStyle().clone();
        let featureStyle = style;
        if (!(featureStyle instanceof M.style.Point)) {
          featureStyle = new M.style.Point(featureStyle.options_);
        }
        style = this.calculateStyle_(feature, {
          minRadius: minRadius,
          maxRadius: maxRadius,
          minValue: minValue,
          maxValue: maxValue,
        }, featureStyle);
        feature.setStyle(style);
      }, this);
      this.updateCanvas();
    }
  };

  /**
   * This function gets the min value of feature's atributte.
   * @function
   * @private
   * @param {Array<M.Feature>} features - array of features
   * @param {String} attributeName - attributeName of style
   * @api stable
   */
  M.style.Proportional.getMinMaxValues_ = function(features, attributeName) {
    let [minValue, maxValue] = [undefined, undefined];
    let filteredFeatures = features.filter(feature =>
      ![NaN, undefined, null].includes(feature.getAttribute(attributeName))).map(f => parseInt(f.getAttribute(attributeName)));
    let index = 1;
    if (!M.utils.isNullOrEmpty(filteredFeatures)) {
      minValue = filteredFeatures[0];
      maxValue = filteredFeatures[0];
      while (index < filteredFeatures.length - 1) {
        let posteriorValue = filteredFeatures[index + 1];
        minValue = (minValue < posteriorValue) ? minValue : posteriorValue;
        maxValue = (maxValue < posteriorValue) ? posteriorValue : maxValue;
        index++;
      }
    }
    return [minValue, maxValue];
  };

  /**
   * This function returns the attribute of style point that controls the size
   * @function
   * @private
   * @return {string} the attribute that controls the size
   * @api stable
   */
  M.style.Proportional.getSizeAttribute_ = function(style) {
    let sizeAttribute = 'radius';
    if (!M.utils.isNullOrEmpty(style.get('icon'))) {
      if (!M.utils.isNullOrEmpty(style.get('icon.src'))) {
        sizeAttribute = 'icon.scale';
      }
      else {
        sizeAttribute = 'icon.radius';
      }
    }
    return sizeAttribute;
  };

  /**
   * This function returns the proportional style of feature
   * @function
   * @private
   * @param {M.Feature} feature
   * @param {object} options - minRadius, maxRadius, minValue, maxValue
   * @param {M.style.Point} style
   * @return {M.style.Simple} the proportional style of feature
   * @api stable
   */
  M.style.Proportional.prototype.calculateStyle_ = function(feature, options, style) {
    if (!M.utils.isNullOrEmpty(style)) {
      let [minRadius, maxRadius] = [options.minRadius, options.maxRadius];
      if (!M.utils.isNullOrEmpty(style.get('icon.scale'))) {
        minRadius = options.minRadius / M.style.Proportional.SCALE_PROPORTION;
        maxRadius = options.maxRadius / M.style.Proportional.SCALE_PROPORTION;
      }
      let value = feature.getAttribute(this.attributeName_);
      if (value == null) {
        console.warn(`Warning: ${this.attributeName_} value is null or empty.`)
      }
      let radius = this.proportionalFunction_(value, options.minValue, options.maxValue,
        minRadius, maxRadius);
      let zindex = options.maxValue - parseFloat(feature.getAttribute(this.attributeName_));
      style.set(M.style.Proportional.getSizeAttribute_(style), radius);
      style.set('zindex', zindex);
    }
    return style;
  };

  /**
   * TODO
   */
  M.style.Proportional.SCALE_PROPORTION = 20;
})();
