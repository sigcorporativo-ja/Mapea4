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
(function() {
  M.impl.layer.Heatmap = function(options = {}) {
    ol.layer.Heatmap.call(this, options);

    let weight = options.weight ? options.weight : 'weight';
    let weightFunction;
    if (typeof weight === 'string') {
      let maxWeight = 1;
      let features = this.getSource().getFeatures();
      if (features.length > 0) {
        maxWeight = features
          .map(feature => feature.get(options.weight))
          .filter(weight => weight != null)
          .reduce((current, next) => Math.max(current, next));
        this.maxWeight_ = maxWeight;
        this.minWeight_ = features
          .map(feature => feature.get(options.weight))
          .filter(weight => weight != null)
          .reduce((current, next) => Math.min(current, next));
        weightFunction = function(feature) {
          let value;
          if (feature instanceof ol.Feature) {
            value = feature.get(weight);
          }
          else if (feature instanceof M.Feature) {
            value = feature.getAttribute(weight);
          }
          return parseFloat(value / maxWeight);
        };
      }
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
    }.bind(this));
  };
  goog.inherits(M.impl.layer.Heatmap, ol.layer.Heatmap);

  M.impl.layer.Heatmap.prototype.getMinWeight = function() {
    return this.minWeight_;
  };

  M.impl.layer.Heatmap.prototype.getMaxWeight = function() {
    return this.maxWeight_;
  };
})();
