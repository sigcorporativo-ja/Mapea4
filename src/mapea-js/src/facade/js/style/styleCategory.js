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

  M.style.Category = (function(AttributeName_, categoryStyles_) {
    /**
     * TODO
     * @public
     * @type {String}
     */
    this.AttributeName_ = AttributeName_;
    /**
     * TODO
     * @public
     * @type {M.layer.Vector}
     */
    this.layer = null;
    /**
     * TODO
     * @public
     * @type {Map<String,M.Style>}
     */
    this.categoryStyles_ = categoryStyles_;
    var impl = new M.impl.style.Category(AttributeName_, categoryStyles_);
    goog.base(this, this, impl);
  });

  goog.inherits(M.style.Category, M.Style);


  /**
   * This function apply the styleCategory object to specified layer
   * @function
   * @param {M.layer.Vector}
   * @returns {M.style.Category}
   * @api stable
   */
  M.style.Category.prototype.apply_ = function(layer) {
    this.layer_ = layer;
    return this.getImpl().applyToLayer(layer);
  };


  /**
   *
   * This function return the AttributeName
   * @function
   * @returns {String}
   * @api stable
   */
  M.style.Category.prototype.getAttributeName = function() {
    return this.getImpl().getAttributeName(this);
  };

  /**
   *
   * This function set the AttributeName defined by user
   * @function
   * @param {String}
   * @returns {Array<String>}
   * @api stable
   */
  M.style.Category.prototype.setAttributeName = function(newAttributeName) {
    return this.getImpl().setAttributeName(this, newAttributeName);
  };



  /**
   * This function return an Array with the diferents Categories
   *
   * @function
   * @returns {Array<String>}
   * @api stable
   */

  M.style.Category.prototype.getCategories = function() {
    return this.getImpl().getCategories(this);
  };

  /**
   * This function return the style of a specified Category defined by user
   *
   * @function
   * @param {String}
   *@returns {M.style}
   * @api stable
   */

  M.style.Category.prototype.getStyleForCategories = function(string) {
    return this.getImpl().getStyleForCategories(this, string);
  };

  /**
   *
   * This function set the style of a specified Category defined by user
   * @function
   * @param {String|M.style.Simple}
   * @returns {M.style.Category}
   * @api stable
   */

  M.style.Category.prototype.setStyleForCategories = function(string, style) {
    return this.getImpl().setStyleForCategories(this, string, style);
  };


  M.style.Category.prototype.serialize = function() {};

})();
