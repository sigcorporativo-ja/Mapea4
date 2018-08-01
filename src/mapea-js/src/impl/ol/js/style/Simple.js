import Utils from 'facade/js/util/Utils';
import Style from './Style';
import Feature from '../feature/Feature';

/**
 * @namespace M.impl.style.Simple
 */
export default class Simple extends Style {
  /**
   * Main constructor of the class.
   * @constructor
   * @api stable
   */
  constructor(options = {}) {
    super(options);
    this.updateFacadeOptions(options);
  }

  /**
   * This function gets the ol style function of impl
   * @public
   * @function
   * @api stable
   */
  get olStyleFn() {
    return this.olStyleFn_;
  }

  /**
   * This function apply style to layer
   * @public
   * @function
   * @param {M.layer.Vector} layer - Layer
   * @api stable
   */
  applyToLayer(layer) {
    // we will apply the style on the ol3 layer
    const olLayer = layer.getImpl().getOL3Layer();
    if (!Utils.isNullOrEmpty(olLayer)) {
      olLayer.setStyle(this.olStyleFn_);
      // layer.getFeatures().forEach(this.applyToFeature, this);
    }
  }

  /**
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
   * @api stable
   */
  applyToFeature(feature) {
    feature.getImpl().getOLFeature().setStyle(this.olStyleFn_);
  }

  /**
   * This function get the value of the feature which key match with
   * the attr param
   * @public
   * @function
   * @param {string|number|function} attr - attribute or function
   * @param {M.Feature}  feature - Feature
   * @api stable
   */
  static getValue(attr, olFeature) {
    const templateRegexp = /^\{\{([^}]+)\}\}$/;
    let attrFeature = attr;
    if (templateRegexp.test(attr) || Utils.isFunction(attr)) {
      if (!(olFeature instanceof ol.Feature)) {
        attrFeature = undefined;
      }
      else {
        const feature = Feature.olFeature2Facade(olFeature, false);
        if (templateRegexp.test(attr)) {
          const keyFeature = attr.replace(templateRegexp, '$1');
          attrFeature = feature.getAttribute(keyFeature);
        }
        else if (Utils.isFunction(attr)) {
          attrFeature = attr(feature);
        }
      }
    }
    if (Utils.isNullOrEmpty(attrFeature)) {
      attrFeature = undefined;
    }
    return attrFeature;
  }
}