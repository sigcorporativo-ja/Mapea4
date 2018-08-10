/**
 * @module M/style/Feature
 */
import StyleBase from './Style';

/**
 * @classdesc
 * @api
 */
class Feature extends StyleBase {
  /**
   * @constructor
   * @api
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
   * @api
   */
  applyToFeature(feature) {
    this.feature_ = feature;
    this.getImpl().applyToFeature(feature);
  }
}

export default Feature;
