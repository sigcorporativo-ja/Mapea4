/**
 * @module M/style/Simple
 */
import { defineFunctionFromString, isDynamic, drawDynamicStyle } from '../util/Utils';
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
   * This function returns data url to canvas
   *
   * @function
   * @public
   * @return {String} data url to canvas
   */
  toImage() {
    let styleImgB64 = super.toImage();

    if (isDynamic(this.options_) === true) {
      styleImgB64 = drawDynamicStyle(this.canvas_);
    }

    return styleImgB64;
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

  /**
   * This function returns the style instance of the serialization
   * @function
   * @public
   * @param {string} serializedStyle - serialized style
   * @param {string} className - class name of the style child
   * @return {M.style.Simple}
   */
  static deserialize(serializedParams, className) {
    const parameters = defineFunctionFromString(serializedParams);
    const parameterArgs = parameters.map((p, i) => `arg${i}`);
    const parameterArgsString = parameterArgs.reduce((acc, param) => acc.concat(', ').concat(param));
    /* eslint-disable */
    const styleFn = new Function(parameterArgs, `return new ${className}(${parameterArgsString})`);
    /* eslint-enable */
    return styleFn(...parameters);
  }
}

export default Simple;
