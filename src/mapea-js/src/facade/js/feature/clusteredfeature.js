import Feature from('./feature.js');
import Utils from('../utils/utils.js');

export class ClusteredFeature extends Feature {

  constructor(features, attributes) {
    super(this, Utils.generateRandom('_mapea_cluster_'));

    this.setAttributes(attributes);
    this.setAttribute("features", features);
  }

  /**
   * This function return if two features are equals
   * @public
   * @function
   * @param {M.Feature} feature
   * @return {bool} returns the result of comparing two features
   */
  equals(feature) {
    return this.id() === feature.id();
  }
}
