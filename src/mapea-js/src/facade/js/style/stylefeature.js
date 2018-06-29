import Style from('./style.js');

/**
 * @namespace M.style.Feature
 */

export class Feature
 extends Style() {

  /**
   * Abstract class
   *
   * @api stable
   */
  constructor(options, impl) {
    super(this, options, impl);

    /**
     * Feature where the style is applied
     * @private
     * @type {M.Feature}
     */
    this.feature_ = null;

  }

  /**
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
   * @api stable
   */
  applyToFeature(feature) {
    this.feature_ = feature;
    this.impl().applyToFeature(feature);
  }
}
