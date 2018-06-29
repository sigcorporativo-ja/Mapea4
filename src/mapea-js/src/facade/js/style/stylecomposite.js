import Style from('./style.js');
import Utils from('../utils/utils.js');
import Cluster from('./stylecluster.js');
import Proportional from('./styleproportional.js');

export class Composite extends Style {

  /**
   * Abstract class
   * @constructor
   * @api stable
   */
  constructor(options, impl) {
    // calls the super constructor
    super(this, options, impl);

    /**
     * Array of styles.
     * @type {Array<M.Style>}
     */
    this.styles_ = [];

  }

  /**
   * This function apply style
   *
   * @public
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @function
   * @api stable
   */
  apply(layer) {
    this.layer_ = layer;
    if (!Utils.isNullOrEmpty(layer)) {
      let style = layer.style();
      this.oldStyle_ = style instanceof Cluster ? style.oldStyle() : style;
      this.updateInternal_(layer);
    }
  }

  /**
   * This function adds styles of style Composite
   *
   * @public
   * @function
   * @param {M.style|Array<M.Style>} styles
   * @returns {M.style.Composite}
   * @api stable
   */
  add(styles) {
    let layer = this.layer_;
    this.unapplyInternal(this.layer_);
    if (!Utils.isArray(styles)) {
      styles = [styles];
    }
    styles = styles.filter(style => style.constructor !== this.constructor);
    if (!Utils.isNullOrEmpty(styles.find(style => !(style instanceof Cluster || style instanceof Proportional)))) {
      this.styles_ = this.styles_.filter(style => style instanceof Cluster || style instanceof Proportional);
    }
    styles.forEach(style => {
      this.styles_ = this.styles_.filter(s => s.constructor !== style.constructor);
    });
    this.styles_ = this.styles_.concat(styles);
    if (!Utils.isNullOrEmpty(layer)) {
      this.updateInternal_(layer);
    }
    return this;
  }

  /**
   * This function remove styles of style Composite
   *
   * @public
   * @function
   * @param {M.style|Array<M.Style>} styles
   * @returns {M.style.Composite}
   * @api stable
   */
  remove(styles) {
    let layer = this.layer_;
    if (!Utils.isArray(styles)) {
      styles = [styles];
    }
    if (!Utils.isNullOrEmpty(this.layer_)) {
      this.unapplyInternal(this.layer_);
    }
    this.styles_ = this.styles_.filter(style => !styles.includes(style));
    layer.setStyle(this.oldStyle_, true);
    layer.setStyle(this);
  }

  /**
   * This function returns the array of styles.
   *
   * @function
   * @public
   * @return {Array<M.Style>} array styles
   * @api stable
   */
  get styles() {
    return this.styles_;
  }

  /**
   * This function returns the old style of layer..
   *
   * @function
   * @public
   * @return {M.Style} array styles
   * @api stable
   */
  get oldStyle() {
    return this.oldStyle_;
  }

  /**
   * This function clears the style Composite
   * @function
   * @public
   * @api stable
   */
  clear() {
    this.remove(this.styles_);
  }

  /**
   * This function updates the style
   * @function
   * @private
   * @api stable
   */
  unapplyInternal(layer) {
    let styles = this.styles_.concat(this).sort((style, style2) => Utils.styleComparator(style2, style));
    styles.forEach(style => {
      if (style instanceof Composite) {
        style.unapplySoft(layer);
      }
    });
  }

  /**
   * This function unapply the style to specified layer
   * @function
   * @public
   * @param {M.layer.Vector} layer layer to unapply his style
   * @api stable
   */
  unapplySoft(layer) {}

  /**
   * This function unapply the style to specified layer
   * @function
   * @public
   * @param {M.layer.Vector} layer layer to unapply his style
   * @api stable
   */
  unapply(layer) {
    this.unapplyInternal(layer);
    this.layer_ = null;
  }

  /**
   * This function update internally the style composite.
   * @function
   * @private
   * @param {M.layer.Vector} layer layer to update the style
   * @api stable
   */

  updateInternal_(layer) {
    let styles = this.styles_.concat(this).sort((style, style2) => Utils.styleComparator(style, style2));
    styles.forEach(style => {
      if (style instanceof Composite) {
        style.applyInternal_(layer);
      } else if (style instanceof Style) {
        style.apply(layer, true);
      }
    });
  }
}
