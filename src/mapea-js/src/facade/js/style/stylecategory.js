goog.provide('M.style.Category');
goog.require('M.style.Composite');

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
   * @param {String} attributeName
   * @param {Map<String,M.Style>} categoryStyles
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
     * @type {Map<String,M.Style>}
     * @api stable
     * @expose
     */
    this.categoryStyles_ = categoryStyles;
    goog.base(this, options, {});
  });
  goog.inherits(M.style.Category, M.style.Composite);

  /**
   * This function apply the styleCategory object to specified layer
   *
   * @function
   * @public
   * @param {M.layer.Vector} layer - layer is the layer where we want to apply the new Style
   * @returns {M.style.Category}
   * @api stable
   */
  M.style.Category.prototype.applyInternal_ = function(layer) {
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
   * @public
   * @param {String} attributeName - newAttributeName is the newAttributeName specified by the user
   * @returns {M.style.Category}
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
   * @public
   * @returns {Array<String>}
   * @api stable
   */
  M.style.Category.prototype.getCategories = function() {
    return this.categoryStyles_;
  };

  /**
   * This function sets the object categories
   *
   * @function
   * @public
   * @param {Map<String,M.style>} categories
   * @return {M.style.styleCategory}
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
   * @public
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
   * @public
   * @param {String} category - category is the name of a category value
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
    let canvasImages = [];
    this.updateCanvasPromise_ = new Promise((success, fail) =>
      this.loadCanvasImages_(0, canvasImages, success));
  };

  /**
   * TODO
   *
   * @function
   * @private
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   */
  M.style.Category.prototype.loadCanvasImages_ = function(currentIndex, canvasImages, callbackFn) {
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
      let image = new Image();
      image.crossOrigin = 'Anonymous';
      let scope_ = this;
      image.onload = function() {
        canvasImages.push({
          'image': this,
          'categoryName': category
        });
        scope_.loadCanvasImages_((currentIndex + 1), canvasImages, callbackFn);
      };
      image.onerror = function() {
        canvasImages.push({
          'categoryName': category
        });
        scope_.loadCanvasImages_((currentIndex + 1), canvasImages, callbackFn);
      };
      style.updateCanvas();
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
    let heights = canvasImages.map(canvasImage => canvasImage['image'].height);
    let widths = canvasImages.map(canvasImage => canvasImage['image'].width);

    let vectorContext = this.canvas_.getContext('2d');
    vectorContext.canvas.height = heights.reduce((acc, h) => acc + h + 5);
    vectorContext.textBaseline = "middle";

    let maxWidth = Math.max.apply(widths, widths);
    canvasImages.forEach((canvasImage, index) => {
      let image = canvasImage['image'];
      let categoryName = canvasImage['categoryName'];
      let coordinateY = 0;
      let prevHeights = heights.slice(0, index);
      if (!M.utils.isNullOrEmpty(prevHeights)) {
        coordinateY = prevHeights.reduce((acc, h) => acc + h + 5);
        coordinateY += 5;
      }
      let imageHeight = 0;
      if (!M.utils.isNullOrEmpty(image)) {
        imageHeight = image.height;
        vectorContext.drawImage(image, (maxWidth - image.width) / 2, coordinateY);
      }
      vectorContext.fillText(categoryName, maxWidth + 5, coordinateY + (imageHeight / 2));
    }, this);

    callbackFn();
  };

  /**
   * This function updates the style
   *
   * @function
   * @private
   * @return {M.style.styleCategory}
   * @api stable
   */
  M.style.Category.prototype.update_ = function() {
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      let styleOther = this.categoryStyles_['other'];
      this.layer_.getFeatures().forEach(function(feature) {
        let value = feature.getAttribute(this.attributeName_);
        let style = this.categoryStyles_[value];
        if (!M.utils.isNullOrEmpty(style)) {
          feature.setStyle(style);
        }
        else if (!M.utils.isNullOrEmpty(styleOther)) {
          feature.setStyle(styleOther);
        }
      }.bind(this));
      this.updateCanvas();
    }
  };

  /**
   * @inheritDoc
   */
  M.style.Category.prototype.add = function(styles) {
    if (!M.utils.isArray(styles)) {
      styles = [styles];
    }
    styles = styles.filter(style => style instanceof M.style.Cluster || style instanceof M.style.Proportional);
    return goog.base(this, "add", styles);
  };

  /**
   * This constant defines the order of style.
   * @constant
   * @public
   * @api stable
   */
  Object.defineProperty(M.style.Category.prototype, "ORDER", {
    value: 2
  });
})();
