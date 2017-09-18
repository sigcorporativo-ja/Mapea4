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

    if (!M.utils.isNullOrEmpty(attributeName)) {
      this.attributeName_ = attributeName;
    }
    else {
      M.exception("No se ha especificado el nombre del atributo.");
    }
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
    this.layer_.redraw();
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
    this.update_();
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
      let vectorContext = this.canvas_.getContext('2d');
      let styles = this.styles_;
      let coordinates = [];
      let maxRadius = 0;
      if (this.styles_.some(style => style instanceof M.style.Point)) {
        for (let i = 0; i < styles.length; i++) {
          if (styles[i].get('radius') > maxRadius) {
            maxRadius = styles[i].get('radius');
          }
        }
      }
      if (this.breakPoints_.length > 0) {
        coordinates = [[0, this.breakPoints_[0]]];
        for (let i = 1; i < this.breakPoints_.length; i++) {
          coordinates.push([this.breakPoints_[i - 1], this.breakPoints_[i]]);
        }
        vectorContext.canvas.height = 40 * styles.length;
        this.drawGeometryToCanvas(styles, coordinates, vectorContext, maxRadius);
      }
    }
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.style.Choropleth.prototype.drawGeometryToCanvas = function(styles, coordinates, vectorContext, maxRadius) {
    let startLimit = null;
    let endLimit = null;
    let coordinateX = 0;
    let coordinateY = 0;
    let coordYText = 0;
    let coordXText = maxRadius * 2 + 10;
    let radius = null;

    for (let i = 0; i < styles.length; i++) {
      startLimit = coordinates[i][0];
      endLimit = coordinates[i][1];
      let image = new Image();
      if (styles[i] instanceof M.style.Point) {
        radius = styles[i].get('radius');
        coordYText = coordinateY + radius + 5;
        coordinateX = maxRadius - radius;
        this.drawImage_(vectorContext, image, [coordinateX, coordinateY], [startLimit, endLimit], [coordXText, coordYText], styles[i]);
        coordinateY = coordinateY + radius * 2 + 9;
      }
      if (styles[i] instanceof M.style.Line) {
        radius = styles[i].canvas_.height;
        coordXText = styles[i].canvas_.width + 8;
        coordYText = coordinateY + radius / 2;
        this.drawImage_(vectorContext, image, [coordinateX, coordinateY], [startLimit, endLimit], [coordXText, coordYText], styles[i]);
        coordinateY = coordinateY + radius + 5;
      }
      if (styles[i] instanceof M.style.Polygon) {
        radius = styles[i].canvas_.height;
        coordXText = styles[i].canvas_.width + 10;
        coordYText = coordinateY + radius / 2 + 4;
        this.drawImage_(vectorContext, image, [coordinateX, coordinateY], [startLimit, endLimit], [coordXText, coordYText], styles[i]);
        coordinateY = coordinateY + radius + 5;
      }
    }
    vectorContext.canvas.height = coordinateY + 10;
  };

  /**
   * This function draw the image style on the vector context
   * @private
   * @function
   * @api stable
   */
  M.style.Choropleth.prototype.drawImage_ = function(vectorContext, image, coordinatesXY, limits, coordXYText, style) {
    image.onload = function() {
      if (limits[0] == 0) {
        vectorContext.fillText("  x  <=  " + limits[1].toString(), coordXYText[0], coordXYText[1]);
      }
      else {
        vectorContext.fillText(limits[0].toString() + "  <  x  <=  " + limits[1].toString(), coordXYText[0], coordXYText[1]);
      }
      vectorContext.drawImage(this, coordinatesXY[0], coordinatesXY[1]);
    };
    image.src = style.toImage();
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
      values = this.layer_.getFeatures().map(function(f) {
        let value;
        try {
          value = parseInt(f.getAttribute(this.attributeName_));
        }
        catch (e) {
          value = null;
          // M.exception('TODO el atributo no es un número válido');
        }
        return value;
      }.bind(this)).filter(value => !M.utils.isNullOrEmpty(value) && !isNaN(value));
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
            (
              M.utils.isString(this.styles_[0]) || M.utils.isString(this.styles_[1])
            )
          )) {
          this.breakPoints_ = this.quantification_(this.dataValues_);
          let firstFeature = features[0];
          let startColor = this.styles_ && this.styles_[0] ? this.styles_[0] : M.style.Choropleth.START_COLOR_DEFAULT;
          let endColor = this.styles_ && this.styles_[1] ? this.styles_[1] : M.style.Choropleth.END_COLOR_DEFAULT;
          let numColors = this.breakPoints_.length;
          let scaleColor = M.utils.generateColorScale(startColor, endColor, numColors);
          if (!M.utils.isArray(scaleColor)) {
            scaleColor = [scaleColor];
          }
          if (firstFeature.getGeometry().type === "Point") {
            this.styles_ = scaleColor.map(c => M.style.Choropleth.DEFAULT_STYLE_POINT(c));
          }
          else if (firstFeature.getGeometry().type === "LineString") {
            this.styles_ = scaleColor.map(c => M.style.Choropleth.DEFAULT_STYLE_LINE(c));
          }
          else if (firstFeature.getGeometry().type === "Polygon") {
            this.styles_ = scaleColor.map(c => M.style.Choropleth.DEFAULT_STYLE_POLYGON(c));
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
    }
    this.updateCanvas();
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
        color: c
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

})();
