/**
 * @module M/RenderFeature
 */
import RenderFeatureImpl from 'impl/feature/RenderFeature';
import Base from '../Base';
import { isNullOrEmpty, generateRandom } from '../util/Utils';

/**
 * @classdesc
 * Main constructor of the class. Create a RenderFeature
 * @api
 */
class RenderFeature extends Base {
  /**
   * @constructor
   * @extends {M.facade.Base}
   * @param {string} id - id to Renderfeature
   * @param {Object} geojson - geojson to feature
   * @api
   */
  constructor() {
    /**
     * Implementation of feature
     * @public
     * @type {M.impl.Feature}
     */
    const impl = new RenderFeatureImpl();
    super(impl);

    /**
     * Identification of the feature
     * @private
     * @type {string}
     * @api
     */
    this.id_ = generateRandom('mapea', 'render_feature');
  }

  /**
   * This function return id feature
   *
   * @public
   * @function
   * @return {string} ID to feature
   * @api
   */
  getId() {
    return this.id_;
  }

  /**
   * This function return geometry feature
   *
   * @public
   * @function
   * @return {object} Geometry feature
   * @api
   */
  getGeometry() {
    return null;
  }

  /**
   * This function return attributes feature
   *
   * @public
   * @function
   * @return {Object} attributes feature
   * @api
   */
  getAttributes() {
    return this.getImpl().getAttributes();
  }

  /**
   * Get geometry type of the feature.
   * @function
   * @public
   * @return {string}
   * @api
   */
  getType() {
    return this.getImpl().getType();
  }

  /**
   * This function returns the value of the indicated attribute
   *
   * @public
   * @function
   * @param {string} attribute - Name attribute
   * @return  {string|number|object} returns the value of the indicated attribute
   * @api
   */
  getAttribute(attribute) {
    let attrValue;

    attrValue = this.getImpl().getAttribute(attribute);
    if (isNullOrEmpty(attrValue)) {
      // we look up the attribute by its path. Example: getAttribute('foo.bar.attr')
      // --> return feature.properties.foo.bar.attr value
      const attrPath = attribute.split('.');
      if (attrPath.length > 1) {
        attrValue = attrPath.reduce((obj, attr) => {
          let attrParam;
          if (!isNullOrEmpty(obj)) {
            if (obj instanceof RenderFeature) {
              attrParam = obj.getAttribute(attr);
            } else {
              attrParam = obj[attr];
            }
          }
          return attrParam;
        }, this);
      }
    }
    return attrValue;
  }

  /**
   * This function return if two features are equals
   * @public
   * @function
   * @param {M.Feature} feature
   * @return {bool} returns the result of comparing two features
   */
  equals(feature) {
    return this.getId() === feature.getId();
  }
}

export default RenderFeature;
