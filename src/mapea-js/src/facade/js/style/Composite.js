/**
 * @module M/style/Composite
 */
import StyleBase from './Style';
import { isNullOrEmpty, isArray, styleComparator } from '../util/Utils';
// import StyleCluster from './Cluster';
// import StyleProportional from './Proportional';

/**
 * @classdesc
 * @api
 */
class Composite extends StyleBase {
  /**
   * @constructor
   * @api
   */
  constructor(options, impl) {
    // calls the super constructor
    super(options, impl);

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
   * @api
   */
  apply(layer) {
    this.layer_ = layer;
    if (!isNullOrEmpty(layer)) {
      const style = layer.getStyle();
      this.oldStyle_ = style;
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
   * @api
   */
  add(stylesPara) {
    let styles = stylesPara;
    const layer = this.layer_;
    this.unapplyInternal(this.layer_);
    if (!isArray(styles)) {
      styles = [styles];
    }
    styles = styles.filter(style => style.constructor !== this.constructor);
    if (!isNullOrEmpty(styles.find(style => !(style instanceof StyleCluster ||
        style instanceof StyleProportional)))) {
      this.styles_ = this.styles_.filter(style => style instanceof StyleCluster ||
        style instanceof StyleProportional);
    }
    styles.forEach((style) => {
      this.styles_ = this.styles_.filter(s => s.constructor !== style.constructor);
    });
    this.styles_ = this.styles_.concat(styles);
    if (!isNullOrEmpty(layer)) {
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
   * @api
   */
  remove(stylesPara) {
    let styles = stylesPara;
    const layer = this.layer_;
    if (!isArray(styles)) {
      styles = [styles];
    }
    if (!isNullOrEmpty(this.layer_)) {
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
   * @api
   */
  getStyles() {
    return this.styles_;
  }

  /**
   * This function returns the old style of layer..
   *
   * @function
   * @public
   * @return {M.Style} array styles
   * @api
   */
  getOldStyle() {
    return this.oldStyle_;
  }

  /**
   * This function clears the style Composite
   * @function
   * @public
   * @api
   */
  clear() {
    this.remove(this.styles_);
  }

  /**
   * This function updates the style
   * @function
   * @private
   * @api
   */
  unapplyInternal(layer) {
    const styles = this.styles_.concat(this).sort((style, style2) =>
      styleComparator(style2, style));
    styles.forEach((style) => {
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
   * @api
   */
  unapplySoft(layer) {}

  /**
   * This function unapply the style to specified layer
   * @function
   * @public
   * @param {M.layer.Vector} layer layer to unapply his style
   * @api
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
   * @api
   */

  updateInternal_(layer) {
    const styles = this.styles_.concat(this).sort((style, style2) =>
      styleComparator(style, style2));
    styles.forEach((style) => {
      if (style instanceof Composite) {
        style.applyInternal_(layer);
      } else if (style instanceof StyleBase) {
        style.apply(layer, true);
      }
    });
  }
}

export default Composite;
