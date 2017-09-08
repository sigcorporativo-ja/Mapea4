goog.provide('M.style.Category');
goog.require('M.Style');

(function() {
  /**   * @classdesc
   * Main constructor of the class. Creates a categoryStyle
   * with parameters specified by the user
   * for the implementation
   * provided by the user
   *
   * @constructor
   * @extends {M.Style}
   * @param {string|Map<String,M.Style>} userParameters parameters
   * @api stable
   */
  M.style.Category = (function(attributeName, categoryStyles) {
    /**
     * TODO
     * @public
     * @type {String}
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
    var impl = new M.impl.style.Category(attributeName, categoryStyles);
    goog.base(this, this, impl);
  });

  goog.inherits(M.style.Category, M.Style);

  /**
   * This function apply the styleCategory object to specified layer
   * @function
   * @param {M.layer.Vector} layer - layer is the layer where we want to apply the new Style
   * @returns {M.style.Category}
   * @api stable
   */
  M.style.Category.prototype.apply = function(layer) {
    this.layer_ = layer;
    this.update_();
  };
  /**
   *
   * This function return the AttributeName
   * @function
   * @returns {String}
   * @api stable
   */
  M.style.Category.prototype.getAttributeName = function() {
    return this.AttributeName_;
  };

  /**
   * This function set the AttributeName defined by user
   * @function
   * @param {String} attributeName - newAttributeName is the newAttributeName specified by the user
   * @returns {M.style.Category}
   * @private
   * @api stable
   */
  M.style.Category.prototype.setAttributeName = function(attributeName) {
    this.attributeName = attributeName;
    this.update_();
    return this;
  };

  /**
   * This function return an Array with the diferents Categories
   * @function
   * @returns {Array<String>}
   * @api stable
   */
  M.style.Category.prototype.getCategories = function() {
    return this.categoryStyles_;
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
   *
   * This function set the style of a specified Category defined by user
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
   * This function updates the style
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
