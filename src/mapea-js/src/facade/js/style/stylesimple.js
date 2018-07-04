import Feature from './stylefeature';

export class Simple extends Feature {

  /**
   * Abstract class
   *
   * @api stable
   */
  constructor(options, impl) {
    super(options, impl);
  }

  /**
   * @inheritDoc
   */
  apply(layer, applyToFeature, isNullStyle) {
    this.layer_ = layer;
    this.impl().applyToLayer(layer);
    if (applyToFeature === true) {
      if (isNullStyle) {
        layer.features().forEach(feature => feature.style = null);
      } else {
        layer.getFeatures().forEach(feature => feature.style = this.clone());
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
  Object.defineProperty(M.style.Simple.prototype, "ORDER", {
    value: 1
  });
}
