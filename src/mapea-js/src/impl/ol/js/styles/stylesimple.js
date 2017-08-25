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
      //  tiene que asignar el style de alguna manera
      // layerImpl.metodoWhatever()
    }
  };

  /**
   * TODO
   */
  M.impl.style.Simple.getValue = function(attr, feature) {
    let regexp = /^\{\{.+\}\}$/;
    let attrOptions = {};
    let attrValues = [];
    if (typeof attr === 'object') {
      for (let key in attr) {
        if (attr.hasOwnProperty(key)) {
          let value = attr[key]
          attrValues.push([key, value]);
        }
      }
    }
    else {
      attrValues.push(attr);
    }
    for (var i = 0; i < attrValues.length; i++) {
      let key = attrValues[i][0];
      let value = attrValues[i][1];
      if (regexp.test(value)) {
        let len = value.length - 2;
        value = value.substring(2, len);
        let valueFeature = feature.getAttribute(value);
        attrOptions.key = valueFeature;
      }
    }

    return attrOptions;

  }

})();
