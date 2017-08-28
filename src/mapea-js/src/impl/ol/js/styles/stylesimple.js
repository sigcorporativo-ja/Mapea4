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
    let styles = [];

    if (!M.utils.isNullOrEmpty(this.style_)) {
      styles.push(this.style_);
    }
    if (!M.utils.isNullOrEmpty(this.styleIcon_)) {
      styles.push(this.styleIcon_);
    }

    let layerImpl = layer.getImpl();
    let olLayer = layerImpl.getOL3Layer();
    if (!M.utils.isNullOrEmpty(olLayer)) {
      olLayer.setStyle(styles);
    }
    else {
      //  87548: tiene que asignar el style de alguna manera
      // layerImpl.metodoWhatever()
    }
  };
})();
