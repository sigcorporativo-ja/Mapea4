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
      this.updateInternal_(layer);
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
    let layer = this.layer_;
    this.unapplyInternal(this.layer_);
    if (!M.utils.isArray(styles)) {
      styles = [styles];
    }
    styles = styles.filter(style => style.constructor !== this.constructor);
    if (!M.utils.isNullOrEmpty(styles.find(style => !(style instanceof M.style.Cluster || style instanceof M.style.Proportional)))) {
      this.styles_ = this.styles_.filter(style => style instanceof M.style.Cluster || style instanceof M.style.Proportional);
    }
    styles.forEach(style => {
      this.styles_ = this.styles_.filter(s => s.constructor !== style.constructor);
    });
    this.styles_ = this.styles_.concat(styles);
    if (!M.utils.isNullOrEmpty(layer)) {
      this.updateInternal_(layer);
    }
    return this;
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
    let layer = this.layer_;
    if (!M.utils.isArray(styles)) {
      styles = [styles];
    }
    if (!M.utils.isNullOrEmpty(this.layer_)) {
      this.unapplyInternal(this.layer_);
    }
    this.styles_ = this.styles_.filter(style => !styles.includes(style));
    layer.setStyle(this.oldStyle_, true);
    layer.setStyle(this);
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
   * This function returns the old style of layer..
   *
   * @function
   * @public
   * @return {M.Style} array styles
   */
  M.style.Composite.prototype.getOldStyle = function() {
    return this.oldStyle_;
  };

  /**
   * This function clears the style Composite
   * @function
   * @public
   * @api stable
   */
  M.style.Composite.prototype.clear = function() {
    this.remove(this.styles_);
  };

  /**
   * This function updates the style
   * @function
   * @private
   * @api stable
   */
  M.style.Composite.prototype.unapplyInternal = function(layer) {
    let styles = this.styles_.concat(this).sort((style, style2) => M.utils.styleComparator(style2, style));
    styles.forEach(style => {
      if (style instanceof M.style.Composite) {
        style.unapplySoft(layer);
      }
    });
  };

  /**
   * This function unapply the style to specified layer
   * @function
   * @public
   * @param {M.layer.Vector} layer layer to unapply his style
   * @api stable
   */
  M.style.Composite.prototype.unapplySoft = function(layer) {};

  /**
   * This function unapply the style to specified layer
   * @function
   * @public
   * @param {M.layer.Vector} layer layer to unapply his style
   * @api stable
   */
  M.style.Composite.prototype.unapply = function(layer) {
    this.unapplyInternal(layer);
    this.layer_ = null;
  };

  /**
   * This function update internally the style composite.
   * @function
   * @private
   * @param {M.layer.Vector} layer layer to update the style
   * @api stable
   */
  M.style.Composite.prototype.updateInternal_ = function(layer) {
    let styles = this.styles_.concat(this).sort((style, style2) => M.utils.styleComparator(style, style2));
    styles.forEach(style => {
      if (style instanceof M.style.Composite) {
        style.applyInternal_(layer);
      }
      else if (style instanceof M.Style) {
        style.apply(layer, true);
      }
    });
  };
})();
