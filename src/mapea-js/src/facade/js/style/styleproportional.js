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
  M.style.Proportional = (function(attributeName, minRadius, maxRadius, style, proportionalFunction, options) {

    /**
     * @public
     * @type {String}
     * @api stable
     * @expose
     */
    this.attributeName_ = attributeName;

    /**
     * @public
     * @type {number}
     * @api stable
     * @expose
     */
    this.minRadius_ = minRadius || 5;

    /**
     * @public
     * @type {number}
     * @api stable
     * @expose
     */
    this.maxRadius_ = maxRadius || 15;

    /**
     * @public
     * @type {M.Style}
     * @api stable
     * @expose
     */
    this.style_ = style || new M.style.Point(M.style.Proportional.DEFAULT_STYLE_POINT);

    /**
     *
     */
    this.proportionalFunction_ = (value, minValue, maxValue, minRadius, maxRadius) =>
      (((value - minValue) * (maxRadius - minRadius)) / (maxValue - minValue)) + minRadius;

    /**
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

    options = options || {};

    if (M.utils.isNullOrEmpty(attributeName)) {
      M.exception('El attribute name no puede ser nulo o vacío');
    }

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
    this.layerFeatures_ = layer.getFeatures(true);
    layer.removeFeatures(this.layerFeatures_);
    this.layerFeatures_.forEach(f => layer.addFeatures(f.getCentroid()));
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



  M.style.Proportional.prototype.updateCanvas = function() {
    if (!M.utils.isNullOrEmpty(this.style_)) {
      let min_max = [this.getMinRadius(), this.getMaxRadius()];

      let estilo_min = this.getStyle().set("radius", min_max[0]);
      let imagen_min = estilo_min.toImage();


      let estilo_max = this.getStyle().set("radius", min_max[1]);


      let imagen_max = estilo_max.toImage();

      let imagenes = [imagen_min, imagen_max];
      let c = this.canvas_.getContext('2d');



      c.canvas.height = 80 * 2;
      this.drawGeometryToCanvas(imagenes, min_max, c);
    }




  };


  M.style.Proportional.prototype.drawGeometryToCanvas = function(imagenes, min_max, c) {
    let length = imagenes.length;

    let x = c.canvas.width;
    let y = c.canvas.height;


    for (let i = 0; i < imagenes.length; i++) {
      let imagen = imagenes[i];
      var image = new Image();
      image.height = 100;
      (function(min_max) {
        image.onload = function() {
          c.textAlign = 'letf';
          c.font = "12px Arial";
          c.textBaseline = "middle";
          if (i == 0) {
            c.fillText("min: " + min_max[i], x / 2, ((i / length) * y * 0.8) + image.height / 2);


          }
          else {
            c.fillText("max: " + min_max[i], x / 2, ((i / length) * y * 0.8) + image.height / 2);


          }
          c.drawImage(this, 0, (i / length) * y * 0.8);
        };
      })(min_max);

      image.src = imagen;
    }


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
   * This function set the minimum radius of the style point
   * @function
   * @public
   * @param {number} minRadius - minimum radius of style point
   * @api stable
   */
  M.style.Proportional.prototype.setMinRadius = function(minRadius) {
    this.minRadius_ = minRadius;
    if (minRadius >= this.maxRadius_) {
      this.maxRadius_ = minRadius + 10;
    }
    this.update_();
    return this;
  };

  M.style.Proportional.prototype.updateCanvas = function() {};

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
      this.minRadius_ = maxRadius - 10;
    }
    this.update_();
    return this;
  };

  /**
   * This function updates the style
   * @function
   * @public
   * @api stable
   */
  M.style.Proportional.prototype.update_ = function() {
    let features = this.layer_.getFeatures(true);
    let [minRadius, maxRadius] = [this.minRadius_, this.maxRadius_];
    let attributeName = this.attributeName_;
    let [minValue, maxValue] = M.style.Proportional.getMinMaxValues_(features, attributeName);
    let style = this.style_;
    style.set('radius', function(feature) {
      let value = feature.getAttribute(attributeName);
      return this.proportionalFunction_(value, minValue, maxValue, minRadius, maxRadius);
    }.bind(this));
    features.forEach(feature => feature.setStyle(style));
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      // this.layer_.redraw();
    }

  };

  /**
   * This function gets the min value of feature's atributte.
   * @function
   * @private
   * @api stable
   */
  M.style.Proportional.getMinMaxValues_ = function(features, attributeName) {
    let [minValue, maxValue] = [undefined, undefined];
    let filteredFeatures = features.filter(feature => !isNaN(feature.getAttribute(attributeName))).map(f => parseInt(f.getAttribute(attributeName)));
    let index = 1;
    if (!M.utils.isNullOrEmpty(filteredFeatures)) {
      minValue = filteredFeatures[0];
      maxValue = filteredFeatures[0];
      while (index < filteredFeatures.length - 1) {
        let posteriorValue = filteredFeatures[index + 1];
        minValue = minValue < posteriorValue ? minValue : posteriorValue;
        maxValue = maxValue < posteriorValue ? posteriorValue : maxValue;
        index++;
      }
    }
    return [minValue, maxValue];
  };

  /**
   * TODO
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
})();
