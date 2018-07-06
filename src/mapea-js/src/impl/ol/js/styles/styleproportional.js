import Simple from "./stylesimple";
import Utils from "../utils/utils";
import PCircle from "../point/pointcircle";
import PFontsSymbol from "../point/pointfontsymbol";
import PIcon from "../point/pointicon";
import FProportional from "facade/js/style/styleproportional";


/**
 * @namespace M.impl.Style
 */

export default class Proportional extends Simple {
  /**
   * Main constructor of the class.
   * @constructor
   * @api stable
   */
  constructor(attributeName, minRadius, maxRadius, proportionalFunction, options = {}) {

    /**
     * TODO
     * @public
     * @type {String}
     * @api stable
     * @expose
     */
    this.attributeName_ = attributeName;

    /**
     * The minimum radius of the proportionality
     * @private
     * @type {number}
     * @api stable
     * @expose
     */
    this.minRadius_ = parseInt(minRadius) || 5;

    /**
     * The maximum radius of the proportionality
     * @private
     * @type {number}
     * @api stable
     * @expose
     */
    this.maxRadius_ = parseInt(maxRadius) || 15;

    /**
     * the proportionality function
     * @private
     * @type {function}
     * @api stable
     * @expose
     */
    this.proportionalFunction_ = proportionalFunction;

    /**
     * TODO
     */
    this.oldStyles_ = [];
  }

  /**
   * TODO
   */
  createFeatureStyles(feature, minValue, maxValue) {
    let value = feature.get(this.attributeName_);
    let olStyles = typeof feature.getStyle() === 'function' ? feature.getStyle()(feature, 1) : feature.getStyle();
    let cloneStyles = this.proportionalStyles(olStyles, minValue, maxValue, value);
    return cloneStyles;
  }

  applyToLayer(layer) {
    this.layer_ = layer.getImpl().getOL3Layer();
    if (this.layer_ != null) {
      let olFeatures = this.layer_.getSource().getFeatures();
      let [minValue, maxValue] = Proportional.getMinMaxValues_(olFeatures, this.attributeName_);
      this.oldStyles_ = olFeatures.map(feature => feature.getStyle());
      olFeatures.forEach(f => f.setStyle(this.createFeatureStyles(f, minValue, maxValue)));
    }
  }

  /**
   * This function gets the min value of feature's atributte.
   * @function
   * @private
   * @param {Array<M.Feature>} features - array of features
   * @param {String} attributeName - attributeName of style
   * @api stable
   */
  getMinMaxValues_(features, attributeName) {
    let [minValue, maxValue] = [undefined, undefined];
    let filteredFeatures = features.filter(feature =>
      ![NaN, undefined, null].includes(feature.get(attributeName))).map(f => parseFloat(f.get(attributeName)));
    let index = 1;
    if (!Utils.isNullOrEmpty(filteredFeatures)) {
      minValue = filteredFeatures[0];
      maxValue = filteredFeatures[0];
      while (index < filteredFeatures.length - 1) {
        let posteriorValue = filteredFeatures[index + 1];
        minValue = (minValue < posteriorValue) ? minValue : posteriorValue;
        maxValue = (maxValue < posteriorValue) ? posteriorValue : maxValue;
        index++;
      }
    }
    return [minValue, maxValue];
  }

  /**
   * TODO
   */
  proportionalStyles(styles, minValue, maxValue, value) {
    if (!Utils.isArray(styles)) {
      styles = [styles];
    }
    let proportion = this.proportionalFunction_(value, minValue, maxValue, this.minRadius_, this.maxRadius_);
    let cloneStyles = styles.map(style => style.clone()).map(style => {
      style.setZIndex(maxValue - parseFloat(value));
      let image = style.getImage();
      if (image instanceof PCircle) {
        image.setRadius(proportion);
      } else if (image instanceof PIcon) {
        image.setScale(proportion / FProportional.SCALE_PROPORTION);
      } else if (image instanceof PFontsSymbol) {
        image.setScale(proportion);
      }
      return style;
    });
    return cloneStyles;
  }

  /**
   * TODO
   */
  unapply(layer) {
    this.layer_ = null;
    let ol3Layer = layer.getImpl().getOL3Layer();
    if (ol3Layer && ol3Layer.getSource()) {
      ol3Layer.getSource().getFeatures().forEach((feature, i) => feature.setStyle(this.oldStyles_[i]));

    }
  }
}
