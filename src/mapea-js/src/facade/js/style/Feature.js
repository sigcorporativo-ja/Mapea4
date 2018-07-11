import StyleBase from './Base';

/**
 * @namespace M.style.Feature
 */

export default class Feature extends StyleBase {

  /**
   * Abstract class
   *
   * @api stable
   */
  constructor(options, impl) {
    super(options, impl);

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
    this.getImpl().applyToFeature(feature);
  }
}
