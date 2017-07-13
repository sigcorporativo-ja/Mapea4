goog.provide('M.impl.Polygon');

/**
 * TODO
 */
M.impl.Polygon = function(options) {
  let stroke = options.stroke;
  this.style_ = {
    stroke: new ol.style.Stroke({
      color: stroke.color,
      width: stroke.width
    })
  }
};

/**
 * TODO
 */
M.impl.Polygon.prototype.applyToFeature = function(feature) {
  feature.setStyle(this.style_);
};
