import StyleFeature from './Feature';

export default class Simple extends StyleFeature {
  /**
   * Abstract class
   *
   * @api stable
   */
  /**
   * @inheritDoc
   */
  apply(layer, applyToFeature, isNullStyle) {
    this.layer_ = layer;
    this.getImpl().applyToLayer(layer);
    if (applyToFeature === true) {
      if (isNullStyle) {
        layer.features().forEach((featureVar) => {
          const feature = featureVar;
          feature.style = null;
        });
      }
      else {
        layer.getFeatures().forEach((featureVar) => {
          const feature = featureVar;
          feature.style = this.clone();
        });
      }
    }
    this.updateCanvas();
  }

  /**
   * This constant defines the order of style.
   * @constant
   * @public
   * @api stable
   */
  static get ORDER() {
    return 1;
  }
}
