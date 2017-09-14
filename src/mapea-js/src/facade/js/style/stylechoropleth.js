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
      let c = this.canvas_.getContext('2d');
      let styles = this.styles_;
      let imagenes = [];
      let parejas = [];
      let mayor_radius = 0;


      for (let i = 0; i < styles.length; i++) {
        let r = styles[i].options_.radius;
        if (r > mayor_radius) {
          mayor_radius = r;
        }
      }

      if (mayor_radius == undefined) {
        mayor_radius = 5;
      }

      // for (let i = 0; i < styles.length; i++) {
      //   let image = styles[i].toImage();
      //   let r = styles[i].options_.radius;
      //   if (r > mayor_radius) {
      //     mayor_radius = r;
      //   }
      //   imagenes.push(image);
      // }





      let breakPoints = this.breakPoints_;
      if (breakPoints.length > 0) {

        for (let i = 0; i < breakPoints.length; i++) {
          let pareja = [];
          if (i == 0) {
            pareja.push(0, breakPoints[i]);
          }
          else {
            pareja.push(breakPoints[i - 1], breakPoints[i])
          }

          parejas.push(pareja);

        }

        let num_stilos = styles.length;
        c.canvas.height = 40 * num_stilos;
        // this.drawGeometryToCanvas(imagenes, parejas, c, mayor_radius);
        this.drawGeometryToCanvas(styles, parejas, c, mayor_radius);

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
  M.style.Choropleth.prototype.drawGeometryToCanvas = function(styles, parejas, c, mayor_radius) {
    let x = c.canvas.width;

    let pareja_ini = null;
    let pareja_fin = null;

    let cont = 1;
    // let y = c.canvas.height;
    let categoria = null;
    let imagen = null;
    let eje_imagenes = mayor_radius;

    let y = 0;
    let y_text = 0;
    let x_text = mayor_radius * 2 + 10;
    let radius = null;

    for (let i = 0; i < styles.length; i++) {
      let pareja = parejas[i];
      pareja_ini = pareja[0];
      pareja_fin = pareja[1];

      if (styles[i] instanceof M.style.Point) {
        radius = styles[i].options_.radius;
        var image = new Image();
        y_text = y + radius + 5;
        let x = 0 + mayor_radius - radius;
        (function(x, y, pareja_ini, pareja_fin, y_text, x_text) {
          image.onload = function() {
            if (pareja_ini == 0) {
              c.fillText("  x  <=  " + pareja_fin.toString(), x_text, y_text);
            }
            else {
              c.fillText(pareja_ini.toString() + "  <  x  <=  " + pareja_fin.toString(), x_text, y_text);
            }
            c.drawImage(this, x, y);
          };
        })(x, y, pareja_ini, pareja_fin, y_text, x_text);
        image.src = styles[i].toImage();
        y = y + radius * 2 + 9;

      }


      if (styles[i] instanceof M.style.Line) {
        radius = styles[i].canvas_.height;
        let x_text = styles[i].canvas_.width + 8;
        var image = new Image();
        y_text = y + radius / 2;
        let x = 0;
        (function(x, y, pareja_ini, pareja_fin, y_text, x_text) {
          image.onload = function() {
            if (pareja_ini == 0) {
              c.fillText("  x  <=  " + pareja_fin.toString(), x_text, y_text);
            }
            else {
              c.fillText(pareja_ini.toString() + "  <  x  <=  " + pareja_fin.toString(), x_text, y_text);
            }
            c.drawImage(this, x, y);
          };
        })(x, y, pareja_ini, pareja_fin, y_text, x_text);
        image.src = styles[i].toImage();
        y = y + radius + 5;
      }

      if (styles[i] instanceof M.style.Polygon) {
        radius = styles[i].canvas_.height;
        let x_text = styles[i].canvas_.width + 10;
        var image = new Image();
        y_text = y + radius / 2 + 4;
        let x = 0;
        (function(x, y, pareja_ini, pareja_fin, y_text, x_text) {
          image.onload = function() {
            if (pareja_ini == 0) {
              c.fillText("  x  <=  " + pareja_fin.toString(), x_text, y_text);
            }
            else {
              c.fillText(pareja_ini.toString() + "  <  x  <=  " + pareja_fin.toString(), x_text, y_text);
            }
            c.drawImage(this, x, y);
          };
        })(x, y, pareja_ini, pareja_fin, y_text, x_text);
        image.src = styles[i].toImage();
        y = y + radius + 5;
      }







    }
    c.canvas.height = y + 10;
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
    let layer = this.layer_;
    if (!M.utils.isNullOrEmpty(layer)) {
      let features = layer.getFeatures();
      if (!M.utils.isNullOrEmpty(features)) {
        this.dataValues_ = this.getValues();
        if (M.utils.isNullOrEmpty(this.styles_) || (!M.utils.isNullOrEmpty(this.styles_) &&
            (
              typeof(this.styles_[0]) === "string" || typeof(this.styles_[1]) === "string"
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
          else {
            this.styles_ = scaleColor.map(c => M.style.Choropleth.DEFAULT_STYLE_POLYGON(c));
          }
        }
        else {
          this.breakPoints_ = this.quantification_(this.dataValues_, this.styles_.length);
        }
      }
      for (let i = this.breakPoints_.length - 1; i > -1; i--) {
        let filterLTE = new M.filter.LTE(this.attributeName_, this.breakPoints_[i]);
        let filteredFeatures = filterLTE.execute(features);
        let style = this.styles_[i];
        filteredFeatures.forEach(f => f.setStyle(style));
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
