/**
 * @module M/ClusteredFeature
 */
import Feature from './Feature';
import { generateRandom } from '../util/Utils';

/**
 * @classdesc
 * Main constructor of the class. Creates a Clustered Feature, which is a group
 * of features that will be represented as a single element in the map.
 * @api
 */
class Clustered extends Feature {
  /**
   * @constructor
   * @extends {M.Feature}
   * @param {Array<M.Feature>} features features inside the cluster
   * @param {Object} attributes cluster attributes, as in M.Style.Cluster
   * @api
   */
  constructor(features, attributes) {
    super(generateRandom('_mapea_cluster_'));
    this.setAttributes(attributes);
    this.setAttribute('features', features);
  }
}

export default Clustered;
