import Feature from './Feature';
import Utils from '../util/Utils';

export default class Clustered extends Feature {
  /**
   * @classdesc
   * Main constructor of the class. Create a clustered Feature
   *
   * @constructor
   * @extends {M.Feature}
   * @param {Array<M.Feature>} features - array of features
   * @param {Object} attributes - attributes
   * @api stable
   */
  constructor(features, attributes) {
    super(Utils.generateRandom('_mapea_cluster_'));
    this.setAttributes(attributes);
    this.setAttribute('features', features);
  }

  /**
   * This function return if two features are equals
   * @public
   * @function
   * @param {M.Feature} feature
   * @return {bool} returns the result of comparing two features
   */
  equals(feature) {
    return this.id === feature.id;
  }
}
