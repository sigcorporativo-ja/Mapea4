goog.provide('M.impl.style.Simple');

goog.require('M.impl.Style');

/**
 * @namespace M.impl.style.Simple
 */
(function() {
  /**
   * Main constructor of the class.
   * @constructor
   * @api stable
   */
  M.impl.style.Simple = (function(options = {}) {
    this.updateFacadeOptions(options);

    goog.base(this, options);
  });

  /**
   * This function apply style options facade to impl
   * @private
   * @function
   * @param {Object} options
   * @api stable
   */
  M.impl.style.Simple.prototype.updateFacadeOptions = function(options = {}) {};

  /**
   * This function apply style to layer
   * @public
   * @function
   * @param {M.layer.Vector} layer - Layer
   * @api stable
   */
  M.impl.style.Simple.prototype.applyToLayer = function(layer) {
    layer.getFeatures().forEach(this.applyToFeature, this);
  };

  /**
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
   * @api stable
   */
  M.impl.style.Simple.prototype.applyToFeature = function(feature) {
    // Hay que ver como se comporta este método porque no cambia los estilos
    // de las capas. Sin embargo en cluster este comportamiento es el deseado.

    let g = ol.Observable.prototype.changed;
    ol.Observable.prototype.changed = function() {};
    let featureCtx = feature.getImpl().getOLFeature();
    featureCtx.setStyle(this.olStyleFn_.bind(featureCtx));
    ol.Observable.prototype.changed = g;
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
  M.impl.style.Simple.getValue = function(attr, olFeature) {
    let templateRegexp = /^\{\{([^\}]+)\}\}$/;
    let attrFeature = attr;
    if (templateRegexp.test(attr) || M.utils.isFunction(attr)) {
      if (!(olFeature instanceof ol.Feature)) {
        attrFeature = undefined;
      }
      else {
        let feature = M.impl.Feature.olFeature2Facade(olFeature);
        if (templateRegexp.test(attr)) {
          let keyFeature = attr.replace(templateRegexp, '$1');
          attrFeature = feature.getAttribute(keyFeature);
        }
        else if (M.utils.isFunction(attr)) {
          attrFeature = attr(feature);
        }
      }
    }
    if (M.utils.isNullOrEmpty(attrFeature)) {
      attrFeature = undefined;
    }
    return attrFeature;
  };
  goog.inherits(M.impl.style.Simple, M.impl.Style);
})();
