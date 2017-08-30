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
  M.impl.style.Simple = (function(options = {}) {
    this.parseFacadeOptions_(options);
  });

  /**
   * This function apply style options facade to impl
   * @private
   * @function
   * @param {Object} options
   * @api stable
   */
  M.impl.style.Simple.prototype.parseFacadeOptions_ = function(options = {}) {};

  /**
   * This function apply style to layer
   * @public
   * @function
   * @param {M.layer.Vector} layer - Layer
   * @api stable
   */
  M.impl.style.Simple.prototype.applyToLayer = function(layer) {
    let styles = [];

    if (!M.utils.isNullOrEmpty(this.style_)) {
      styles.push(this.style_);
    }
    if (!M.utils.isNullOrEmpty(this.styleIcon_)) {
      styles.push(this.styleIcon_);
    }

    layer.getFeatures().forEach(f => f.getImpl().getOLFeature().setStyle(styles));
    // let layerImpl = layer.getImpl();
    // let olLayer = layerImpl.getOL3Layer();
    // if (!M.utils.isNullOrEmpty(olLayer)) {
    //   olLayer.setStyle(function(olFeature, resolution) {
    //     return styles;
    //   });
    // }
    // else {
    //   //  87548: tiene que asignar el style de alguna manera
    //   // layerImpl.metodoWhatever()
    // }
  };
})();
