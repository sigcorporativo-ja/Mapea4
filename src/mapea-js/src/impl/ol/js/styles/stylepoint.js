goog.provide('M.impl.style.Point');

goog.require('M.impl.style.Simple');
/**
 * @namespace M.style.Point
 */
(function() {
  /**
   * Main constructor of the class.
   * @constructor
   * @implements {
     M.impl.style.Simple
   }   * @api stable
   */
  M.impl.style.Point = (function(options) {
    this.olStyleFn_ = this.setOptionsToOLStyle(options);
  });
  goog.inherits(M.impl.style.Point, M.impl.style.Simple);

  /**
   * This function se options to ol style
   *
   * @public
   * @param {object} options - options to style
   * @function
   */
  M.impl.style.Point.prototype.setOptionsToOLStyle = function(options) {
    return function(resolution) {
      let stroke = options.stroke;
      let radius = options.radius;
      let fill = options.fill;
      let label = options.label;
      let icon = options.icon;
      let snaptopixel = options.snaptopixel;
      let style = null;
      let styleIcon = null;
      let styles = [];
      if (!M.utils.isNullOrEmpty(stroke)) {
        stroke = new ol.style.Stroke({
          color: M.impl.style.Simple.getValue(stroke.color, this),
          width: M.impl.style.Simple.getValue(stroke.width, this),
          lineDash: M.impl.style.Simple.getValue(stroke.lineDash, this),
          lineDashOffset: M.impl.style.Simple.getValue(stroke.lineDashOffset, this),
          lineCap: M.impl.style.Simple.getValue(stroke.lineCap, this),
          lineJoin: M.impl.style.Simple.getValue(stroke.lineJoin, this),
          miterLimit: M.impl.style.Simple.getValue(stroke.miterLimit, this)
        });
      }
      else {
        stroke = null;
      }

      if (!M.utils.isNullOrEmpty(fill)) {
        fill = new ol.style.Fill({
          color: chroma(M.impl.style.Simple.getValue(fill.color, this))
            .alpha(M.impl.style.Simple.getValue(fill.opacity, this)).css()
        });
      }
      else {
        fill = null;
      }

      if (!M.utils.isNullOrEmpty(label)) {
        let labelText = new ol.style.Text({
          font: M.impl.style.Simple.getValue(label.font, this),
          rotateWithView: M.impl.style.Simple.getValue(label.rotate, this),
          scale: M.impl.style.Simple.getValue(label.scale, this),
          offsetX: M.impl.style.Simple.getValue(label.offset ? label.offset[0] : undefined, this),
          offsetY: M.impl.style.Simple.getValue(label.ofsset ? label.offset[1] : undefined, this),
          fill: new ol.style.Fill({
            color: M.impl.style.Simple.getValue(label.color, this)
          }),
          textAlign: M.impl.style.Simple.getValue(label.align, this),
          textBaseline: (M.impl.style.Simple.getValue(label.baseline, this) || "").toLowerCase(),
          text: M.impl.style.Simple.getValue(label.text, this),
          rotation: M.impl.style.Simple.getValue(label.rotation, this)
        });
        if (!M.utils.isNullOrEmpty(label.stroke)) {
          labelText.setStroke(new ol.style.Stroke({
            color: M.impl.style.Simple.getValue(label.stroke.color, this),
            width: M.impl.style.Simple.getValue(label.stroke.width, this),
            lineCap: M.impl.style.Simple.getValue(label.stroke.linecap, this),
            lineJoin: M.impl.style.Simple.getValue(label.stroke.linejoin, this),
            lineDash: M.impl.style.Simple.getValue(label.stroke.linedash, this),
            lineDashOffset: M.impl.style.Simple.getValue(label.stroke.linedashoffset, this),
            miterLimit: M.impl.style.Simple.getValue(label.stroke.miterlimit, this)
          }));
        }
        label = labelText;
      }
      else {
        label = null;
      }
      if (!M.utils.isNullOrEmpty(stroke) || !M.utils.isNullOrEmpty(radius) || !M.utils.isNullOrEmpty(fill)) {
        style = new ol.style.Style({
          stroke: stroke,
          fill: fill,
          image: new ol.style.Circle({
            stroke: stroke,
            fill: fill,
            radius: M.impl.style.Simple.getValue(radius, this),
            snapToPixel: snaptopixel
          }),
          text: label
        });
      }

      if (!M.utils.isNullOrEmpty(icon)) {
        if (!M.utils.isNullOrEmpty(icon.src)) {
          styleIcon = new ol.style.Style({
            image: new ol.style.Icon({
              anchor: M.impl.style.Simple.getValue(icon.anchor, this),
              anchorXUnits: M.impl.style.Simple.getValue(icon.anchorxunits, this),
              anchorYUnits: M.impl.style.Simple.getValue(icon.anchoryunits, this),
              src: M.impl.style.Simple.getValue(icon.src, this),
              opacity: M.impl.style.Simple.getValue(icon.opacity, this),
              scale: M.impl.style.Simple.getValue(icon.scale, this),
              rotation: M.impl.style.Simple.getValue(icon.rotation, this),
              rotateWithView: M.impl.style.Simple.getValue(icon.rotate, this),
              snapToPixel: M.impl.style.Simple.getValue(icon.snaptopixel, this),
              offsetOrigin: M.impl.style.Simple.getValue(icon.offsetorigin, this),
              offset: M.impl.style.Simple.getValue(icon.offset, this),
              crossOrigin: M.impl.style.Simple.getValue(icon.crossorigin, this),
              anchorOrigin: M.impl.style.Simple.getValue(icon.anchororigin, this),
              size: M.impl.style.Simple.getValue(icon.size, this)
            })
          });
        }
        else {
          styleIcon = new ol.style.Style({
            image: new ol.style.FontSymbol({
              form: M.impl.style.Simple.getValue(icon.form, this).toLowerCase(),
              gradient: M.impl.style.Simple.getValue(icon.gradient, this),
              glyph: M.impl.style.Simple.getValue(icon.class, this),
              fontSize: M.impl.style.Simple.getValue(icon.fontsize, this),
              radius: M.impl.style.Simple.getValue(icon.radius, this),
              rotation: M.impl.style.Simple.getValue(icon.rotation, this),
              rotateWithView: M.impl.style.Simple.getValue(icon.rotate, this),
              offsetY: M.impl.style.Simple.getValue(icon.offset[0], this),
              offsetX: M.impl.style.Simple.getValue(icon.offset[1], this),
              color: M.impl.style.Simple.getValue(icon.color, this),
              fill: new ol.style.Fill({
                color: M.impl.style.Simple.getValue(icon.fill, this)
              }),
              stroke: new ol.style.Stroke({
                color: M.impl.style.Simple.getValue(icon.gradientcolor, this),
                width: 1
              }),
              anchor: M.impl.style.Simple.getValue(icon.anchor, this),
              anchorXUnits: M.impl.style.Simple.getValue(icon.anchorxunits, this),
              anchorYUnits: M.impl.style.Simple.getValue(icon.anchoryunits, this),
              src: M.impl.style.Simple.getValue(icon.src, this),
              opacity: M.impl.style.Simple.getValue(icon.opacity, this),
              scale: M.impl.style.Simple.getValue(icon.scale, this),
              snapToPixel: M.impl.style.Simple.getValue(icon.snaptopixel, this),
              offsetOrigin: M.impl.style.Simple.getValue(icon.offsetorigin, this),
              offset: M.impl.style.Simple.getValue(icon.offset, this),
              crossOrigin: M.impl.style.Simple.getValue(icon.crossorigin, this),
              anchorOrigin: M.impl.style.Simple.getValue(icon.anchororigin, this),
              size: M.impl.style.Simple.getValue(icon.size, this)
            })
          });
        }
      }

      if (!M.utils.isNullOrEmpty(style)) {
        styles.push(style);
      }
      if (!M.utils.isNullOrEmpty(styleIcon)) {
        styles.push(styleIcon);
      }
      return styles;
    };
  };

  /**
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
   */
  M.impl.style.Point.prototype.applyToFeature = function(feature) {
    let olFeature = feature.getImpl().getOLFeature();
    olFeature.setStyle(this.olStyleFn_);
  };
})();
