goog.provide('M.style.Choropleth');

goog.require('M.Style');
goog.require('M.style.quantification');

/**
 * @namespace M.style.Choropleth
 */
(function() {


  /**
   * @classdesc
   * Main constructor of the class. Creates a style choropleth
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Style}
   * @param {String}
   * @param {Array<Style>}
   * @param {M.style.quantification}
   * @param {object}
   * @api stable
   */
  M.style.Choropleth = (function(attributeName, styles, quantification = M.style.quantification.JENKS(), options = {}) {
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
     * @public
     * @type {Array<M.Style>}
     * @api stable
     * @expose
     */
    this.styles_ = styles;

    /**
     * @public
     * @type {M.quantification|function}
     * @api stable
     * @expose
     */
    this.quantification_ = quantification;

    /**
     * @public
     * @type {M.layer.Vector}
     * @api stable
     * @expose
     */
    this.layer_ = null;

    /**
     * @public
     * @type {Array<Number>}
     * @api stable
     * @expose
     */
    this.dataValues_ = [];

    /**
     * @public
     * @type{Array<Number>}
     * @api stable
     * @expose
     */
    this.breakPoints_ = [];

    goog.base(this, options, {});
  });
  goog.inherits(M.style.Choropleth, M.Style);

  /**
   * This function apply the style to specified layer
   * @function
   * @public
   * @param {M.Layer.Vector} layer - Layer where to apply choropleth style
   * @api stable
   */
  M.style.Choropleth.prototype.apply = function(layer) {
    this.layer_ = layer;
    this.update_();
  };

  /**
   * This function return the attribute name defined by user
   * @function
   * @public
   * @return {String} attribute name of Style
   * @api stable
   */
  M.style.Choropleth.prototype.getAttributeName = function() {
    return this.attributeName_;
  };

  /**
   * This function set the attribute name defined by user
   * @function
   * @public
   * @param {String} attributeName - attribute name to set
   * @api stable
   */
  M.style.Choropleth.prototype.setAttributeName = function(attributeName) {
    this.attributeName_ = attributeName;
    this.update_();
    return this;
  };

  /**
   * This function return quantification function defined by user
   * @function
   * @public
   * @return {M.style.quantification|function} quantification function of style
   * @api stable
   */
  M.style.Choropleth.prototype.getQuantification = function() {
    return this.quantification_;
  };

  /**
   * This function set quantification function defined by user
   * @function
   * @public
   * @param {M.style.quantification|function} quantification - quantification function of style
   * @api stable
   */
  M.style.Choropleth.prototype.setQuantification = function(quantification) {
    this.quantification_ = quantification;
    if (!this.styles_.some(style => M.utils.isString(style))) {
      if (this.styles_.length < this.quantification_().length) {
        let [startStyle, endStyle] = this.styles_;
        let startColor = startStyle.get('fill.color');
        let endColor = endStyle.get('fill.color');
        if (M.utils.isNullOrEmpty(startColor)) {
          startColor = startStyle.get('stroke.color');
        }
        if (M.utils.isNullOrEmpty(endColor)) {
          endColor = endStyle.get('stroke.color');
        }
        this.styles_ = [startColor, endColor];
      }
      else {
        this.styles_ = this.styles_.slice(0, this.quantification_().length);
      }
      this.update_();
    }
    return this;
  };

  /**
   * This function returns the styles defined by user
   * @function
   * @public
   * @return {Array(M.Style)|null} returns the styles defined by user
   * @api stable
   */
  M.style.Choropleth.prototype.getStyles = function() {
    return this.styles_;
  };

  /**
   * This function sets the styles defined by user
   * @function
   * @public
   * @param {Array<M.style.Point>|Array<M.style.Line>|Array<M.style.Polygon>} styles - styles defined by user
   * @api stable
   */
  M.style.Choropleth.prototype.setStyles = function(styles) {
    if (!M.utils.isArray(styles)) {
      styles = [styles];
    }
    this.styles_ = styles;
    this.update_();
    return this;
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */

  M.style.Choropleth.prototype.updateCanvas = function() {
    if (!M.utils.isNullOrEmpty(this.styles_)) {
      if (this.breakPoints_.length > 0) {
        coordinates = [[0, this.breakPoints_[0]]];
        for (let i = 1; i < this.breakPoints_.length; i++) {
          coordinates.push([this.breakPoints_[i - 1], this.breakPoints_[i]]);
        }

        let vectorContext = this.canvas_.getContext('2d');
        let canvasImages = [];
        this.updateCanvasPromise_ = new Promise((success, fail) =>
          this.loadCanvasImages_(0, canvasImages, success));
      }
    }
  };

  /**
   * TODO
   *
   * @function
   * @private
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   */
  M.style.Choropleth.prototype.loadCanvasImages_ = function(currentIndex, canvasImages, callbackFn) {
    // base case
    if (currentIndex === this.styles_.length) {
      this.drawGeometryToCanvas(canvasImages, callbackFn);
    }
    // recursive case
    else {
      let startLimit = -1;
      if (currentIndex > 0) {
        startLimit = this.breakPoints_[currentIndex - 1];
      }
      let endLimit = this.breakPoints_[currentIndex];
      let image = new Image();
      image.crossOrigin = 'Anonymous';
      let scope_ = this;
      image.onload = function() {
        canvasImages.push({
          'image': this,
          'startLimit': M.style.Choropleth.CALC_CANVAS_NUMBER_(startLimit),
          'endLimit': M.style.Choropleth.CALC_CANVAS_NUMBER_(endLimit)
        });
        scope_.loadCanvasImages_((currentIndex + 1), canvasImages, callbackFn);
      };
      image.onerror = function() {
        canvasImages.push({
          'startLimit': M.style.Choropleth.CALC_CANVAS_NUMBER_(startLimit),
          'endLimit': M.style.Choropleth.CALC_CANVAS_NUMBER_(endLimit)
        });
        scope_.loadCanvasImages_((currentIndex + 1), canvasImages, callbackFn);
      };
      image.src = this.styles_[currentIndex].toImage();
    }
  };

  /**
   * TODO
   *
   * @function
   * @public
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   * @api stable
   */
  M.style.Choropleth.prototype.drawGeometryToCanvas = function(canvasImages, callbackFn) {
    let heights = canvasImages.map(canvasImage => canvasImage['image'].height);
    let widths = canvasImages.map(canvasImage => canvasImage['image'].width);

    let vectorContext = this.canvas_.getContext('2d');
    vectorContext.canvas.height = heights.reduce((acc, h) => acc + h + 5);
    vectorContext.textBaseline = "middle";

    let maxWidth = Math.max.apply(widths, widths);

    canvasImages.forEach((canvasImage, index) => {
      let image = canvasImage['image'];
      let startLimit = canvasImage['startLimit'];
      let endLimit = canvasImage['endLimit'];

      let coordinateY = 0;
      let prevHeights = heights.slice(0, index);
      if (!M.utils.isNullOrEmpty(prevHeights)) {
        coordinateY = prevHeights.reduce((acc, h) => acc + h + 5);
        coordinateY += 5;
      }
      let imageHeight = 0;
      if (!M.utils.isNullOrEmpty(image)) {
        imageHeight = image.height;
        vectorContext.drawImage(image, 0, coordinateY);
      }
      if (startLimit < 0) {
        vectorContext.fillText(` x  <=  ${endLimit}`, maxWidth + 5, coordinateY + (imageHeight / 2));
      }
      else {
        vectorContext.fillText(`${startLimit} <  x  <=  ${endLimit}`, maxWidth + 5, coordinateY + (imageHeight / 2));
      }
    }, this);

    callbackFn();
  };

  /**
   * This function gets the numeric features values of layer which attribute
   * is equal to attribute specified by user
   * @function
   * @public
   * @return {Array<number>} numeric features values of layer
   * @api stable
   */
  M.style.Choropleth.prototype.getValues = function() {
    let values = [];
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      this.layer_.getFeatures().forEach(function(f) {
        try {
          let value = parseFloat(f.getAttribute(this.attributeName_));
          if (!isNaN(value)) {
            values.push(value);
          }
        }
        catch (e) {
          // M.exception('TODO el atributo no es un número válido');
        }
      }, this);
    }
    return values;
  };

  /**
   * This function updates the style
   * @function
   * @private
   * @api stable
   */
  M.style.Choropleth.prototype.update_ = function() {
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      let features = this.layer_.getFeatures();
      if (!M.utils.isNullOrEmpty(features)) {
        this.dataValues_ = this.getValues();
        if (M.utils.isNullOrEmpty(this.styles_) || (!M.utils.isNullOrEmpty(this.styles_) &&
            (M.utils.isString(this.styles_[0]) || M.utils.isString(this.styles_[1])))) {
          this.breakPoints_ = this.quantification_(this.dataValues_);
          let startColor = this.styles_ && this.styles_[0] ? this.styles_[0] : M.style.Choropleth.START_COLOR_DEFAULT;
          let endColor = this.styles_ && this.styles_[1] ? this.styles_[1] : M.style.Choropleth.END_COLOR_DEFAULT;
          let numColors = this.breakPoints_.length;
          let scaleColor = M.utils.generateColorScale(startColor, endColor, numColors);
          if (!M.utils.isArray(scaleColor)) {
            scaleColor = [scaleColor];
          }
          let geometryType = M.utils.getGeometryType(this.layer_);
          const generateStyle = (scale, defaultStyle) => (scale.map(c => defaultStyle(c)));
          switch (geometryType) {
            case M.geom.geojson.type.POINT:
            case M.geom.geojson.type.MULTI_POINT:
              this.styles_ = generateStyle(scaleColor, M.style.Choropleth.DEFAULT_STYLE_POINT);
              break;
            case M.geom.geojson.type.LINE_STRING:
            case M.geom.geojson.type.MULTI_LINE_STRING:
              this.styles_ = generateStyle(scaleColor, M.style.Choropleth.DEFAULT_STYLE_LINE);
              break;
            case M.geom.geojson.type.POLYGON:
            case M.geom.geojson.type.MULTI_POLYGON:
              this.styles_ = generateStyle(scaleColor, M.style.Choropleth.DEFAULT_STYLE_POLYGON);
              break;
            default:
              return null;
          }
        }
        else {
          this.breakPoints_ = this.quantification_(this.dataValues_, this.styles_.length);
        }
      }
      for (let i = this.breakPoints_.length - 1; i > -1; i--) {
        let filterLTE = new M.filter.LTE(this.attributeName_, this.breakPoints_[i]);
        filterLTE.execute(features).forEach(f => f.setStyle(this.styles_[i]));
      }
      this.updateCanvas();
    }
  };

  /**
   * This functions returns a point style by default
   * @function
   * @public
   * @param {String} c - color in hexadecimal format
   * @return {M.style.Point}
   * @api stable
   */
  M.style.Choropleth.DEFAULT_STYLE_POINT = function(c) {
    return new M.style.Point({
      fill: {
        color: c,
        opacity: 1
      },
      stroke: {
        color: 'black',
        width: 1
      },
      radius: 5
    });
  };

  /**
   * This functions returns a line style by default
   * @function
   * @public
   * @param {String} c - color in hexadecimal format
   * @return {M.style.Line}
   * @api stable
   */
  M.style.Choropleth.DEFAULT_STYLE_LINE = function(c) {
    return new M.style.Line({
      stroke: {
        color: c,
        width: 1
      }
    });
  };

  /**
   * This functions returns a polygon style by default
   * @function
   * @public
   * @param {String} c - color in hexadecimal format
   * @return {M.style.Polygon}
   * @api stable
   */
  M.style.Choropleth.DEFAULT_STYLE_POLYGON = function(c) {
    return new M.style.Polygon({
      fill: {
        color: c,
        opacity: 1
      },
      stroke: {
        color: c,
        width: 1
      }
    });
  };

  /** Color style by default
   * @constant
   * @api stable
   */
  M.style.Choropleth.START_COLOR_DEFAULT = 'red';

  /**
   * Color style by default
   * @constant
   * @api stable
   */
  M.style.Choropleth.END_COLOR_DEFAULT = 'brown';

  /**
   * Accuracy of numbers on canvas
   * @constant
   * @api stable
   */
  M.style.Choropleth.ACCURACY_NUMBER_CANVAS = 2;

  /**
   * Returns the calculation of the numbers of the canvas
   * with a given precision
   *  @function
   * @api stable
   */
  M.style.Choropleth.CALC_CANVAS_NUMBER_ = function(number) {
    let powPrecision = Math.pow(10, M.style.Choropleth.ACCURACY_NUMBER_CANVAS);
    return Math.round(number * powPrecision) / powPrecision;
  };

})();
