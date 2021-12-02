/**
 * @module M/impl/style/Simple
 */
import OLFeature from 'ol/Feature';
import { isFunction, isNullOrEmpty } from 'M/util/Utils';
import RenderFeature from 'ol/render/Feature';
import Style from './Style';
import Feature from '../feature/Feature';

/**
 * @classdesc
 * @api
 * @namespace M.impl.style.Simple
 */
class Simple extends Style {
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
    this.layer_ = layer;
    // we will apply the style on the ol3 layer
    const olLayer = layer.getImpl().getOLLayer();
    if (!isNullOrEmpty(olLayer)) {
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
   * @param {ol.Feature}  feature - OpenLayer Feature
   * @param {M.layer.Vector} layer - Layer
   * @api stable
   */
  static getValue(attr, olFeature, layer) {
    const templateRegexp = /^\{\{([^}]+)\}\}$/;
    let attrFeature = attr;
    if (templateRegexp.test(attr) || isFunction(attr)) {
      if (!(olFeature instanceof OLFeature || olFeature instanceof RenderFeature)) {
        attrFeature = undefined;
      } else {
        const feature = Feature.olFeature2Facade(olFeature, false);
        if (templateRegexp.test(attr)) {
          const keyFeature = attr.replace(templateRegexp, '$1');
          attrFeature = feature.getAttribute(keyFeature);
        } else if (isFunction(attr)) {
          let facadeMap;
          if (!isNullOrEmpty(layer)) {
            facadeMap = layer.getImpl().getMap();
          }
          attrFeature = attr(feature, facadeMap);
        }
      }
    }
    if (isNullOrEmpty(attrFeature)) {
      attrFeature = undefined;
    }
    return attrFeature;
  }
}

export default Simple;
