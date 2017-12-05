goog.provide('M.style.Composite');

goog.require('M.Style');

(function() {

  /**
   * Abstract class
   * @constructor
   * @api stable
   */
  M.style.Composite = (function(options, impl) {

    /**
     * Array of styles.
     * @type {Array<M.Style>}
     */
    this.styles_ = [];

    // calls the super constructor
    goog.base(this, options, impl);
  });
  goog.inherits(M.style.Composite, M.Style);

  /**
   * This function apply style
   *
   * @public
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @function
   * @api stable
   */
  M.style.Composite.prototype.apply = function(layer) {
    this.layer_ = layer;
    if (!M.utils.isNullOrEmpty(layer)) {
      this.oldStyle_ = layer.getStyle();
      this.updateInternal_();
    }
  };

  /**
   * This function adds styles of style Composite
   *
   * @public
   * @function
   * @param {M.style|Array<M.Style>} styles
   * @returns {M.style.Composite}
   * @api stable
   */
  M.style.Composite.prototype.add = function(styles) {
    if (!M.utils.isArray(styles)) {
      styles = [styles];
    }
    if (!M.utils.isNullOrEmpty(styles.find(style => style instanceof M.style.Feature || style instanceof M.style.Choropleth || style instanceof M.style.Category))) {
      this.styles_ = this.styles_.filter(style => style instanceof M.style.Cluster || style instanceof M.style.Proportional);
    }
    styles.forEach(style => {
      this.styles_ = this.styles_.filter(s => s.constructor !== style.constructor);
    })
    this.styles_ = this.styles_.concat(styles);
    this.updateInternal_();
  };

  /**
   * This function remove styles of style Composite
   *
   * @public
   * @function
   * @param {M.style|Array<M.Style>} styles
   * @returns {M.style.Composite}
   * @api stable
   */
  M.style.Composite.prototype.remove = function(styles) {
    if (!M.utils.isArray(styles)) {
      styles = [styles];
    }
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      let stylecluster = this.styles_.find(style => style instanceof M.style.Cluster);
      if (!M.utils.isNullOrEmpty(stylecluster)) {
        stylecluster.unapplySoft(this.layer_);
      }
    }
    this.styles_ = this.styles_.filter(style => !styles.includes(style));
    this.updateInternal_();
  };

  /**
   * This function returns the array of styles.
   *
   * @function
   * @public
   * @return {Array<M.Style>} array styles
   */
  M.style.Composite.prototype.getStyles = function() {
    return this.styles_;
  };

  /**
   * This function clears the style Composite
   * @function
   * @public
   * @api stable
   */
  M.style.Composite.prototype.clear = function() {
    this.remove(this.styles_);
    this.updateInternal_();
  };

  /**
   * This function updates the style
   * @function
   * @private
   * @api stable
   */
  M.style.Composite.prototype.unapply = function(layer) {
    this.layer_ = null;
    let stylecluster = this.styles_.find(style => style instanceof M.style.Cluster);
    if (!M.utils.isNullOrEmpty(stylecluster)) {
      stylecluster.unapply(layer);
    }
  };

  /**
   * TODO
   */
  M.style.Composite.prototype.updateInternal_ = function() {
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      let styles = this.styles_.concat(this).sort((style, style2) => M.utils.styleComparator(style, style2));
      styles.forEach(style => {
        if (style instanceof M.style.Composite) {
          style.applyInternal_(this.layer_);
        }
        else if (style instanceof M.Style) {
          style.apply(this.layer_, true);
        }
      });
    }
  };
})();
