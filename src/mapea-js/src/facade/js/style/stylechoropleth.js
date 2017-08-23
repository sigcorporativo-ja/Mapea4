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
    this.setStyles(this.styles_);
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
    this.setStyles(this.styles_);
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
    this.setStyles(this.styles_);
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
    let features = this.layer_.getFeatures();
    if (!M.utils.isNullOrEmpty(features)) {
      this.dataValues_ = this.getValues();
      let firstFeature = features[0];
      if (!M.utils.isNullOrEmpty(styles)) {
        if (!M.utils.isArray(styles)) {
          styles = [styles];
        }
        this.styles_ = styles;
        this.breakPoints_ = this.quantification_(this.dataValues_, this.styles_.length);
      }
      else {
        this.breakPoints_ = this.quantification_(this.dataValues_);
        let color1 = M.style.Choropleth.DEFAULT_COLOR1;
        let color2 = M.style.Choropleth.DEFAULT_COLOR2;
        let numColors = this.breakPoints_.length;
        let scaleColor = M.utils.generateColorScale(color1, color2, numColors);
        if (!M.utils.isArray(scaleColor)) {
          scaleColor = [scaleColor];
        }
        if (firstFeature.getGeometry().type === "Point") {
          this.styles_ = scaleColor.map(c => M.style.Choropleth.DEFAULT_STYLE_POINT(c));
        }
        else if (firstFeature.getGeometry().type === "LineString") {
          this.styles_ = scaleColor.map(c => M.style.Choropleth.DEFAULT_STYLE_LINE(c));
        }
        else {
          this.styles_ = scaleColor.map(c => M.style.Choropleth.DEFAULT_STYLE_POLYGON(c));
        }
      }
      this.update_();
    }
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
    let layer = this.layer_;
    let values = [];
    let attributeName = this.attributeName_;
    if (!M.utils.isNullOrEmpty(layer)) {
      values = layer.getFeatures().map(function(f) {
        let value;
        try {
          value = parseInt(f.getAttribute(attributeName));
        }
        catch (e) {
          value = null;
          // M.exception('TODO el atributo no es un número válido');
        }
        return value;
      }).filter(v => !M.utils.isNullOrEmpty(v) && !isNaN(v));
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
    let features = this.layer_.getFeatures();
    for (let i = this.breakPoints_.length - 1; i > -1; i--) {
      let filterLTE = new M.filter.LTE(this.attributeName_, this.breakPoints_[i]);
      let filteredFeatures = filterLTE.execute(features);
      let style = this.styles_[i];
      filteredFeatures.forEach(f => f.setStyle(style));
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
        color: c
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
      fill: {
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
        color: c
      },
      stroke: {
        color: 'black',
        width: 1
      }
    });
  };
  /** Color style by default
   * @constant
   * @api stable
   */
  M.style.Choropleth.DEFAULT_COLOR1 = 'red';

  /**
   * Color style by default
   * @constant
   * @api stable
   */
  M.style.Choropleth.DEFAULT_COLOR2 = 'black';

})();
