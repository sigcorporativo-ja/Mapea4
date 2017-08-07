goog.provide('M.impl.style.Point');

/**
 * @namespace M.style.Point
 */
(function() {
  M.impl.style.Point = function(options) {
    let stroke = options.stroke;
    let radius = options.radius;
    let fill = options.fill;
    let label = options.label;
    let icon = options.icon;
    let snaptopixel = options.snaptopixel;
    this.style_ = null;
    this.styleIcon_ = null;

    if (!M.utils.isNullOrEmpty(stroke)) {
      stroke = new ol.style.Stroke({
        color: stroke.color,
        width: stroke.width,
        lineDash: stroke.linedash,
        lineDashOffset: stroke.linedashoffset,
        lineCap: stroke.linecap,
        lineJoin: stroke.linejoin,
        miterLimit: stroke.miterlimit
      });
    }
    else {
      stroke = null;
    }

    if (!M.utils.isNullOrEmpty(fill)) {
      fill = new ol.style.Fill({
        color: chroma(fill.color).alpha(fill.opacity).css()
      });
    }
    else {
      fill = null;
    }

    if (!M.utils.isNullOrEmpty(label)) {
      let labelText = new ol.style.Text({
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
      });
      if (!M.utils.isNullOrEmpty(label.stroke)) {
        labelText.setStroke(new ol.style.Stroke({
          color: label.stroke.color,
          width: label.stroke.width,
          lineCap: label.stroke.linecap,
          lineJoin: label.stroke.linejoin,
          lineDash: label.stroke.linedash,
          lineDashOffset: label.stroke.linedashoffset,
          miterLimit: label.stroke.miterlimit,
        }));
      }
      label = labelText;
    }
    else {
      label = null;
    }

    if (!M.utils.isNullOrEmpty(stroke) || !M.utils.isNullOrEmpty(radius) || !M.utils.isNullOrEmpty(fill)) {
      this.style_ = new ol.style.Style({
        stroke: stroke,
        fill: fill,
        image: new ol.style.Circle({
          stroke: stroke,
          fill: fill,
          radius: radius,
          snapToPixel: snaptopixel
        }),
        text: label
      });
    }

    if (!M.utils.isNullOrEmpty(icon)) {
      if (!M.utils.isNullOrEmpty(icon.src)) {
        this.styleIcon_ = new ol.style.Style({
          image: new ol.style.Icon({
            anchor: icon.anchor,
            anchorXUnits: icon.anchorxunits,
            anchorYUnits: icon.anchoryunits,
            src: icon.src,
            opacity: icon.opacity,
            scale: icon.scale,
            rotation: icon.rotation,
            rotateWithView: icon.rotate,
            snapToPixel: icon.snaptopixel,
            offsetOrigin: icon.offsetorigin,
            offset: icon.offset,
            crossOrigin: icon.crossorigin,
            anchorOrigin: icon.anchororigin,
            size: icon.size,
          })
        });
      }
      else {
        this.styleIcon_ = new ol.style.Style({
          image: new ol.style.FontSymbol({
            form: icon.form.toLowerCase(),
            gradient: icon.gradient,
            glyph: icon.class,
            fontSize: icon.fontsize,
            radius: icon.radius,
            rotation: icon.rotation,
            rotateWithView: icon.rotate,
            offsetY: icon.offset[0],
            offsetX: icon.offset[1],
            color: icon.color,
            fill: new ol.style.Fill({
              color: icon.fill
            }),
            stroke: new ol.style.Stroke({
              color: icon.gradientcolor,
              width: 1
            }),
            anchor: icon.anchor,
            anchorXUnits: icon.anchorxunits,
            anchorYUnits: icon.anchoryunits,
            src: icon.src,
            opacity: icon.opacity,
            scale: icon.scale,
            snapToPixel: icon.snaptopixel,
            offsetOrigin: icon.offsetorigin,
            offset: icon.offset,
            crossOrigin: icon.crossorigin,
            anchorOrigin: icon.anchororigin,
            size: icon.size
          })
        });
      }
    }
  };

  /**
   * TODO
   */
  M.impl.style.Point.prototype.applyToFeature = function(feature) {
    // REVISION #86837 Probar que pasa cuando style_ y styleIcon_ son nulos
    feature.getImpl().getOLFeature().setStyle(this.style_);
  };


  /**
   * TODO
   */
  // M.impl.style.Point.prototype.applyToLayer = function(layer);
})();
