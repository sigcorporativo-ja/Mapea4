goog.provide('M.impl.style.Polygon');

/**
 * @namespace M.style.Polygon
 */
(function() {
  M.impl.style.Polygon = function(options) {
    let stroke = options.stroke;
    let label = options.label;
    let fill = options.fill;
    this.style_ = new ol.style.Style();
    if (!M.utils.isNullOrEmpty(stroke)) {
      this.style_.setStroke(new ol.style.Stroke({
        color: stroke.color,
        width: stroke.width,
        lineCap: stroke.linecap,
        lineJoin: stroke.linejoin,
        lineDash: stroke.linedash,
        lineDashOffset: stroke.linedashoffset,
        miterLimit: stroke.miterlimit,
      }));
    }
    if (!M.utils.isNullOrEmpty(label)) {
      this.style_.setText(new ol.style.Text({
        font: label.font,
        rotateWithView: label.rotate,
        scale: label.scale,
        offsetX: label.offset[0],
        offsetY: label.offset[1],
        fill: new ol.style.Fill({
          color: label.color
        }),
        textAlign: label.align,
        textBaseline: label.baseline,
        text: label.text,
        rotation: label.rotation
      }));
      if (!M.utils.isNullOrEmpty(label.stroke)) {
        this.style_.getText().setStroke(new ol.style.Stroke({
          color: label.stroke.color,
          width: label.stroke.width,
          lineCap: label.stroke.linecap,
          lineJoin: label.stroke.linejoin,
          lineDash: label.stroke.linedash,
          lineDashOffset: label.stroke.linedashoffset,
          miterLimit: label.stroke.miterlimit,
        }));
      }
    }
    if (!M.utils.isNullOrEmpty(fill)) {
      this.style_.setFill(
        new ol.style.Fill({
          color: chroma(fill.color).alpha(fill.opacity).css()
        }));
    }
  };

  /**
   * TODO
   */
  M.impl.style.Polygon.prototype.applyToFeature = function(feature) {
    feature.getImpl().getOLFeature().setStyle(this.style_);
  };

})();
