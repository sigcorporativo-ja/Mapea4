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
    this.stylePattern_ = null;
    this.styles_ = [this.style_];
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
        textBaseline: (label.baseline || "").toLowerCase(),
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
      if (!M.utils.isNullOrEmpty(fill.color) || !M.utils.isNullOrEmpty(fill.coopacitylor)) {
        this.style_.setFill(
          new ol.style.Fill({
            color: chroma(fill.color).alpha(fill.opacity).css()
          }));
      }
      let pattern = fill.pattern;
      if (!M.utils.isNullOrEmpty(fill.pattern)) {
        this.stylePattern_ = new ol.style.Style({
          fill: new ol.style.FillPattern({
            pattern: (pattern.name || "").toLowerCase(),
            color: pattern.color,
            size: pattern.size,
            spacing: pattern.spacing,
            image: (pattern.name == 'Image') ? new ol.style.Icon({
              src: pattern.src
            }) : undefined,
            angle: pattern.rotation,
            scale: pattern.scale,
            offset: pattern.offset,
            fill: new ol.style.Fill({
              color: (!M.utils.isNullOrEmpty(pattern.fill) && !M.utils.isNullOrEmpty(pattern.fill.color)) ? chroma(pattern.fill.color).alpha(pattern.fill.opacity).css() : "rgba(255, 255, 255, 0)"
            }),
          })
        });
        this.styles_.push(this.stylePattern_);
      }
    }
  };

  /**
   * TODO
   */
  M.impl.style.Polygon.prototype.applyToFeature = function(feature) {
    setTimeout(function() {
      feature.getImpl().getOLFeature().setStyle(this.styles_);
    }.bind(this), 1000);
  };

})();
