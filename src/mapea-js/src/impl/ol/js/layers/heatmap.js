goog.provide('M.impl.layer.Heatmap');
goog.require('ol.layer.Heatmap');

/**
 * @classdesc
 * Main constructor of the class. Creates a Heatmap layer
 * with parameters specified by the user
 *
 * @constructor
 * @api stable
 */
M.impl.layer.Heatmap = function(options = {}) {
  ol.layer.Heatmap.call(this, options);

  let weight = options.weight ? options.weight : 'weight';
  let weightFunction;
  if (typeof weight === 'string') {
    let maxWeight = this.getSource().getFeatures()
      .map(feature => feature.get(options.weight))
      .filter(weight => weight != null)
      .reduce((current, next) => Math.max(current, next));

    weightFunction = function(feature) {
      return parseFloat(feature.get(weight) / maxWeight);
    };
  }
  else {
    weightFunction = weight;
  }
  this.setStyle(function(feature, resolution) {
    let weight = M.impl.style.Simple.getValue(weightFunction, feature);
    let opacity = weight !== undefined ? ol.math.clamp(weight, 0, 1) : 1;
    // cast to 8 bits
    let index = (255 * opacity) | 0;
    let style = this.styleCache_[index];
    if (!style) {
      style = [
        new ol.style.Style({
          image: new ol.style.Icon({
            opacity: opacity,
            src: this.circleImage_
          })
        })
      ];
      this.styleCache_[index] = style;
    }
    return style;
  }.bind(this))
};
goog.inherits(M.impl.layer.Heatmap, ol.layer.Heatmap);
