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
    this.style_ = style || new M.style.Point(M.style.Proportional.DEFAULT_STYLE_POINT);

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
     * Layer where style is setted
     * @public
     * @type {M.Layer}
     * @api stable
     * @expose
     */
    this.layer_ = null;

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
    if (!M.utils.isNullOrEmpty(this.style_)) {
      let sizeAttribute = this.getSizeAttribute_();
      let estiloMin = this.style_.clone();
      estiloMin.set(sizeAttribute, this.minRadius_);
      let imagenMin = estiloMin.toImage();
      let estiloMax = this.style_.clone();
      estiloMax.set(sizeAttribute, this.maxRadius_);
      let imagenMax = estiloMax.toImage();
      let vectorContext = this.canvas_.getContext('2d');
      vectorContext.canvas.setAttribute('height', 80 * 2);
      this.drawGeometryToCanvas([imagenMin, imagenMax], [this.getMinRadius(), this.getMaxRadius()], vectorContext);
    }
  };

  /**
   * This function draw the geometry on style canvas
   *
   * @function
   * @public
   * @param {Array<Image>} images - array of style images
   * @param {Array<number>} minMax - array of min radius and max radius
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   * @api stable
   */
  M.style.Proportional.prototype.drawGeometryToCanvas = function(images, minMax, vectorContext) {
    let radius = 0;
    let coordinateX = 0;
    let coordinateY = 0;
    let coordXText = minMax[1] * 2 + 10;
    let coordYText = 0;
    for (let i = images.length - 1; i > -1; i--) {
      radius = minMax[i];
      let imagen = images[i];
      var image = new Image();
      coordYText = coordinateY + radius + 5;
      coordinateX = minMax[1] - radius;
      image.onload = function(vectorContext_, minMax, coordinateX, coordinateY, coordXText, coordYText) {
        if (i == 0) {
          vectorContext_.fillText("  min: " + minMax[i], coordXText, coordYText);
        }
        else {
          vectorContext_.fillText("  max: " + minMax[i], coordXText, coordYText);
        }
        vectorContext_.drawImage(this, coordinateX, coordinateY);
      }.bind(image, vectorContext, minMax, coordinateX, coordinateY, coordXText, coordYText);
      image.src = imagen;
      coordinateY = coordinateY + radius * 2 + 9;
    }
    vectorContext.canvas.height = coordinateY + 10;
  };


  /**
   * This function updates the style
   * @function
   * @private
   * @api stable
   */
  M.style.Proportional.prototype.update_ = function() {
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      this.layerFeatures_ = this.layer_.getFeatures(true);
      this.layer_.removeFeatures(this.layerFeatures_);
      let centroids = this.layerFeatures_;
      if (this.layerFeatures_[0].getGeometry().type !== 'Point') {
        centroids = this.layerFeatures_.map(f => f.getCentroid());
      }
      this.layer_.addFeatures(centroids);
      let features = this.layer_.getFeatures(true);
      let [minRadius, maxRadius] = [this.minRadius_, this.maxRadius_];
      let [minValue, maxValue] = M.style.Proportional.getMinMaxValues_(features, this.attributeName_);
      if (!M.utils.isNullOrEmpty(this.style_.get('icon.src'))) {
        minRadius = minRadius / M.style.Proportional.SCALE_PROPORTION;
        maxRadius = maxRadius / M.style.Proportional.SCALE_PROPORTION;
      }

      this.style_.set(this.getSizeAttribute_(), function(feature) {
        let value = feature.getAttribute(this.attributeName_);
        return this.proportionalFunction_(value, minValue, maxValue, minRadius, maxRadius);
      }.bind(this));
      this.style_.set('zindex', function(feature) {
        return maxValue - feature.getAttribute(this.attributeName_);
      }.bind(this));
      this.layer_.getFeatures().forEach(feature => feature.setStyle(this.style_));
      this.layer_.redraw();
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
      !isNaN(feature.getAttribute(attributeName))).map(f => parseInt(f.getAttribute(attributeName)));
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
   */
  M.style.Proportional.prototype.getSizeAttribute_ = function() {
    let sizeAttribute = 'radius';
    if (!M.utils.isNullOrEmpty(this.style_.get('icon'))) {
      if (!M.utils.isNullOrEmpty(this.style_.get('icon.src'))) {
        sizeAttribute = 'icon.scale';
      }
      else {
        sizeAttribute = 'icon.radius';
      }
    }
    return sizeAttribute;
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.style.Proportional.DEFAULT_STYLE_POINT = {
    fill: {
      color: 'green',
      opacity: 0.5
    },
    stroke: {
      color: 'green'
    }
  };

  /**
   * TODO
   */
  M.style.Proportional.SCALE_PROPORTION = 20;
})();
