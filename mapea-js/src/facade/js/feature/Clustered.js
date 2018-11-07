/**
 * @module M/ClusteredFeature
 */
import Feature from './Feature';
import { generateRandom } from '../util/Utils';

/**
 * @classdesc
 * Main constructor of the class. Create a clustered Feature
 * @api
 */
class Clustered extends Feature {
  /**
   * @constructor
   * @extends {M.Feature}
   * @param {Array<M.Feature>} features - array of features
   * @param {Object} attributes - attributes
   * @api
   */
  constructor(features, attributes) {
    super(generateRandom('_mapea_cluster_'));
    this.setAttributes(attributes);
    this.setAttribute('features', features);
  }
}

export default Clustered;
