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
     * @api stable
     * @expose
     */
    this.layer_ = null;

    /**
     * TODO
     * @public
     * @type {Map<String,M.Style>}
     * @api stable
     * @expose
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
    // this.updateCanvasPromise_ = new Promise((success, fail) => {
    let maxRadius = 0;
    Object.keys(this.categoryStyles_).forEach(function(category) {
      let radius = 0;
      let icon = this.categoryStyles_[category].get('icon');
      if (!M.utils.isNullOrEmpty(icon)) {
        radius = icon.radius;
      }
      else {
        radius = this.categoryStyles_[category].get('radius');
      }
      maxRadius = maxRadius < radius ? radius : maxRadius;
      if (maxRadius < 25) {
        maxRadius = 25;
      }
    }, this);
    let vectorContext = this.canvas_.getContext('2d');

    let canvasImages = [];
    this.updateCanvasPromise_ = new Promise((success, fail) =>
      this.loadCanvasImages_(0, maxRadius, [0, 0], [(maxRadius * 2 + 10), 0], canvasImages, success));
  };

  /**
   * TODO
   *
   * @function
   * @private
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   */
  M.style.Category.prototype.loadCanvasImages_ = function(currentIndex, maxRadius, imageCoords, textCoords, canvasImages, callbackFn) {
    let categories = this.getCategories();
    let categoryNames = Object.keys(categories);

    // base case
    if (currentIndex === categoryNames.length) {
      this.drawGeometryToCanvas(canvasImages, callbackFn);
    }
    // recursive case
    else {
      let category = categoryNames[currentIndex];
      let style = this.getStyleForCategory(category);
      let radius = null;
      let image = new Image();
      let coordYOffset;
      image.crossOrigin = 'Anonymous';
      if (style instanceof M.style.Point) {
        let icon = style.get('icon');
        if (!M.utils.isNullOrEmpty(icon)) {
          radius = icon.radius;
        }
        else {
          radius = style.get('radius');
        }
        if (M.utils.isNullOrEmpty(radius)) {
          radius = 25;
        }
        textCoords[1] = imageCoords[1] + radius + 5;
        imageCoords[0] = maxRadius - radius;
        coordYOffset = radius * 2 + 9;
      }
      else if (style instanceof M.style.Line) {
        radius = style.canvas_.height;
        textCoords[0] = style.canvas_.width + 8;
        textCoords[1] = imageCoords[1] + radius / 2;
        coordYOffset = radius + 5;
      }
      else if (style instanceof M.style.Polygon) {
        radius = style.canvas_.height;
        textCoords[0] = style.canvas_.width + 10;
        textCoords[1] = imageCoords[1] + radius / 2 + 4;
        coordYOffset = radius + 5;
      }

      let scope_ = this;
      image.onload = function() {
        canvasImages.push({
          'image': this,
          'coordinateX': imageCoords[0],
          'coordinateY': imageCoords[1],
          'categoryName': category,
          'coordXText': textCoords[0],
          'coordYText': textCoords[1]
        });
        scope_.loadCanvasImages_((currentIndex + 1), maxRadius, [imageCoords[0], (imageCoords[1] + coordYOffset)], textCoords, canvasImages, callbackFn);
      };
      image.onerror = function() {
        canvasImages.push({
          'coordinateX': imageCoords[0],
          'coordinateY': imageCoords[1],
          'categoryName': category,
          'coordXText': textCoords[0],
          'coordYText': textCoords[1]
        });
        scope_.loadCanvasImages_((currentIndex + 1), maxRadius, [imageCoords[0], (imageCoords[1] + coordYOffset)], textCoords, canvasImages, callbackFn);
      };
      image.src = style.toImage();
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
  M.style.Category.prototype.drawGeometryToCanvas = function(canvasImages, callbackFn) {
    let vectorContext = this.canvas_.getContext('2d');
    vectorContext.canvas.height = canvasImages.pop()['coordinateY'] + 5;

    canvasImages.forEach(canvasImage => {
      let image = canvasImage['image'];
      let coordinateX = canvasImage['coordinateX'];
      let coordinateY = canvasImage['coordinateY'];
      let categoryName = canvasImage['categoryName'];
      let coordXText = canvasImage['coordXText'];
      let coordYText = canvasImage['coordYText'];
      if (!M.utils.isNullOrEmpty(image)) {
        vectorContext.drawImage(image, coordinateX, coordinateY);
      }
      vectorContext.fillText(categoryName, coordXText, coordYText);
    }, this);

    callbackFn();
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
      this.updateCanvas();
    }
  };
})();
