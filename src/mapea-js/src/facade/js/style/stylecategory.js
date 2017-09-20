goog.provide('M.style.Category');
goog.require('M.Style');

/**
 * @namespace M.style.Category
 */
(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a categoryStyle
   * with parameters specified by the user
   * for the implementation
   * provided by the user
   * @constructor
   * @extends {M.Style}
   * @param {String}
   * @param {object}
   * @api stable
   */
  M.style.Category = (function(attributeName, categoryStyles, options = {}) {
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
     * TODO
     * @public
     * @type {M.layer.Vector}
     */
    this.layer_ = null;

    /**
     * TODO
     * @public
     * @type {Map<String,M.Style>}
     */
    this.categoryStyles_ = categoryStyles;
    goog.base(this, options, {});
  });
  goog.inherits(M.style.Category, M.Style);

  /**
   * This function apply the styleCategory object to specified layer
   *
   * @function
   * @public
   * @param {M.layer.Vector} layer - layer is the layer where we want to apply the new Style
   * @returns {M.style.Category}
   * @api stable
   */
  M.style.Category.prototype.apply = function(layer) {
    this.layer_ = layer;
    this.update_();
    this.updateCanvas();
  };
  /**
   * This function return the AttributeName
   *
   * @function
   * @public
   * @returns {String}
   * @api stable
   */
  M.style.Category.prototype.getAttributeName = function() {
    return this.attributeName_;
  };

  /**
   * This function set the AttributeName defined by user
   *
   * @function
   * @param {String} attributeName - newAttributeName is the newAttributeName specified by the user
   * @returns {M.style.Category}
   * @public
   * @api stable
   */
  M.style.Category.prototype.setAttributeName = function(attributeName) {
    this.attributeName_ = attributeName;
    this.update_();
    return this;
  };

  /**
   * This function return an Array with the diferents Categories
   *
   * @function
   * @returns {Array<String>}
   * @api stable
   */
  M.style.Category.prototype.getCategories = function() {
    return this.categoryStyles_;
  };
  /**
   * This function sets the style categories
   * @function
   * @public
   * @param {object}
   * @api stable
   *
   */
  M.style.Category.prototype.setCategories = function(categories) {
    this.categoryStyles_ = categories;
    this.update_();
    return this;
  };

  /**
   * This function return the style of a specified Category defined by user
   *
   * @function
   * @param {String} string - string is the name of a category value
   * @returns {M.style}
   * @api stable
   */
  M.style.Category.prototype.getStyleForCategory = function(category) {
    return this.categoryStyles_[category];
  };

  /**
   * This function set the style of a specified Category defined by user
   *
   * @function
   * @param {String} string - string is the name of a category value
   * @param {M.style.Simple} style - style is the new style to switch
   * @returns {M.style.Category}
   * @api stable
   */
  M.style.Category.prototype.setStyleForCategory = function(category, style) {
    this.categoryStyles_[category] = style;
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
  M.style.Category.prototype.updateCanvas = function() {
    let maxRadius = 0;
    Object.keys(this.categoryStyles_).forEach(function(category) {
      let radius;
      let icon = this.categoryStyles_[category].get('icon');
      if (!M.utils.isNullOrEmpty(icon)) {
        radius = icon.radius;
      }
      else {
        radius = this.categoryStyles_[category].get('radius');
      }
      maxRadius = maxRadius < radius ? radius : maxRadius;
    }, this);
    let vectorContext = this.canvas_.getContext('2d');
    let styles = Object.keys(this.categoryStyles_).map((categoryName) =>
      ([categoryName, this.categoryStyles_[categoryName].toImage(), this.categoryStyles_[categoryName]]));
    vectorContext.canvas.height = 80 * styles.length;
    this.drawGeometryToCanvas(styles, vectorContext, maxRadius);
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
  M.style.Category.prototype.drawGeometryToCanvas = function(styles, vectorContext, maxRadius) {
    let coordinateX = 0;
    let coordinateY = 0;
    let coordXText = maxRadius * 2 + 10;
    let coordYText = 0;
    styles.forEach(function(category) {
      let radius = null;
      let style = category[2];
      var image = new Image();
      if (style instanceof M.style.Point) {
        let icon = style.get('icon');
        if (!M.utils.isNullOrEmpty(icon)) {
          radius = icon.radius;
        }
        else {
          radius = style.get('radius');
        }
        coordYText = coordinateY + radius + 5;
        coordinateX = maxRadius - radius;
        this.drawImage_(vectorContext, image, category, coordinateX, coordinateY, coordXText, coordYText);
        coordinateY = coordinateY + radius * 2 + 9;
      }
      if (style instanceof M.style.Line) {
        radius = style.canvas_.height;
        coordXText = style.canvas_.width + 8;
        coordYText = coordinateY + radius / 2;
        this.drawImage_(vectorContext, image, category, coordinateX, coordinateY, coordXText, coordYText);
        coordinateY = coordinateY + radius + 5;
      }
      if (style instanceof M.style.Polygon) {
        radius = style.canvas_.height;
        coordXText = style.canvas_.width + 10;
        coordYText = coordinateY + radius / 2 + 4;
        this.drawImage_(vectorContext, image, category, coordinateX, coordinateY, coordXText, coordYText);
        coordinateY = coordinateY + radius + 5;
      }
    }, this);
    vectorContext.canvas.height = coordinateY + 10;
  };

  /**
   * This function draw the image style on the vector context
   * @private
   * @function
   * @api stable
   */
  M.style.Category.prototype.drawImage_ = function(vectorContext, image, category, coordinateX, coordinateY, coordXText, coordYText) {
    image.onload = function() {
      vectorContext.drawImage(this, coordinateX, coordinateY);
      vectorContext.fillText(category[0], coordXText, coordYText);
    };
    image.src = category[1];
  };

  /**
   * This function updates the style
   *
   * @private
   * @function
   * @api stable
   */
  M.style.Category.prototype.update_ = function() {
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      this.layer_.getFeatures().forEach(function(feature) {
        let value = feature.getAttribute(this.attributeName_);
        let style = this.categoryStyles_[value];
        if (!M.utils.isNullOrEmpty(style)) {
          feature.setStyle(style);
        }
      }.bind(this));
      this.layer_.redraw();
    }
  };
})();
