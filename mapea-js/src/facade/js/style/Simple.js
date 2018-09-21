/**
 * @module M/style/Simple
 */
import StyleFeature from './Feature';

/**
 * @classdesc
 * @api
 */
class Simple extends StyleFeature {
  /**
   * @inheritDoc
   */
  apply(layer, applyToFeature, isNullStyle) {
    this.layer_ = layer;
    this.getImpl().applyToLayer(layer);
    if (applyToFeature === true) {
      if (isNullStyle) {
        layer.getFeatures().forEach((featureVar) => {
          const feature = featureVar;
          feature.style = null;
        });
      } else {
        layer.getFeatures().forEach((featureVar) => {
          const feature = featureVar;
          feature.setStyle(this.clone());
        });
      }
    }
    this.updateCanvas();
  }

  /**
   * This constant defines the order of style.
   * @constant
   * @public
   * @api
   */
  get ORDER() {
    return 1;
  }
}

export default Simple;
