goog.provide('M.style.Heatmap');
goog.require('M.Style');

/**
 * @namespace M.style.Heatmap
 */
(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a style heatmap
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Style}
   * @param {string|function} attribute
   * @param {object} options
   * @api stable
   */
  M.style.Heatmap = (function(attribute, options = {}) {
    if (!(M.utils.isString(attribute) || M.utils.isFunction(attribute))) {
      M.exception('Attribute parameter can not be empty (string or function)');
    }

    /**
     * @public
     * @type {string|function}
     * @api stable
     */
    this.attribute = attribute;

    let impl = new M.impl.style.Heatmap(attribute, options);
    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Heatmap, M.Style);

  /**
   * This function remove the style to specified layer
   * @function
   * @public
   * @param {M.Layer.Vector} layer - Layer where to apply choropleth style
   * @api stable
   */
  M.style.Heatmap.prototype.unapply = function(layer) {
    this.layer_ = null;
    this.getImpl().unapply(layer);
  };

  /**
   * This function returns the attribute of heatmap style
   * @function
   * @public
   * @return {string|function}
   */
  M.style.Heatmap.prototype.getAttribute = function() {
    return this.attribute;
  };

  /**
   * This function sets the attribute of heatmap style
   * @function
   * @public
   * @param {string|function} attribute - attribute of heatmap style
   */
  M.style.Heatmap.prototype.setAttribute = function(attribute) {
    this.attribute = attribute;
    this.impl_ = new M.impl.style.Heatmap(attribute, this.options);
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      this.applyToLayer(this.layer_);
    }
  };
})();
