goog.provide('M.impl.style.Simple');

/**
 * @namespace M.impl.style.Simple
 */

(function() {
  /**
   * Main constructor of the class.
   * @constructor
   * @api stable
   */
  M.impl.style.Simple = (function() {});

  /**
   * This function apply style to layer
   * @public
   * @function
   * @param {M.layer.Vector} layer - Layer
   * @api stable
   */
  M.impl.style.Simple.prototype.applyToLayer = function(layer) {
    let style = this.olStyleFn_;
    let layerImpl = layer.getImpl();
    let olLayer = layerImpl.getOL3Layer();
    if (!M.utils.isNullOrEmpty(olLayer)) {
      olLayer.setStyle(function(olFeature, resolution) {
        return style.bind(olFeature)(resolution);
      });
    }
    else {
      //  tiene que asignar el style de alguna manera
      // layerImpl.metodoWhatever()
    }
  };

  /**
   * This function get the value of the feature which key match with
   * the attr param
   * @public
   * @function
   * @param {string|number|function} attr - attribute or function
   * @param {M.Feature}  feature - Feature
   * @api stable
   */
  M.impl.style.Simple.getValue = function(attr, feature) {
    let regexp = /^\{\{([^\}]+)\}\}$/;
    let attrFeature = attr;
    if (regexp.test(attr)) {
      let keyFeature = attr.replace(regexp, '$1');
      attrFeature = feature.getProperties()[keyFeature];
    }
    else if (M.utils.isFunction(attr)) {
      attrFeature = attr(feature);
    }
    if (M.utils.isNullOrEmpty(attrFeature)) {
      attrFeature = undefined;
    }
    return attrFeature;
  }
})();
