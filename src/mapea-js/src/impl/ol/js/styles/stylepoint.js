goog.provide('M.impl.style.Point');

goog.require('M.impl.style.Simple');

/**
 * TODO
 * @private
 * @type {M.style.Point}
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
    this.olStyleFn_ = null;
    goog.base(this, options);
  });
  goog.inherits(M.impl.style.Point, M.impl.style.Simple);

  /**
   * This function se options to ol style
   *
   * @public
   * @param {object} options - options to style
   * @function
   */
  M.impl.style.Point.prototype.updateFacadeOptions = function(options) {

    this.olStyleFn_ = function(feature, resolution) {
      if (!(feature instanceof ol.Feature)) {
        resolution = feature;
        feature = this;
      }
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
          color: M.impl.style.Simple.getValue(stroke.color, feature),
          width: M.impl.style.Simple.getValue(stroke.width, feature),
          lineDash: M.impl.style.Simple.getValue(stroke.lineDash, feature),
          lineDashOffset: M.impl.style.Simple.getValue(stroke.lineDashOffset, feature),
          lineCap: M.impl.style.Simple.getValue(stroke.lineCap, feature),
          lineJoin: M.impl.style.Simple.getValue(stroke.lineJoin, feature),
          miterLimit: M.impl.style.Simple.getValue(stroke.miterLimit, feature)
        });
      }
      else {
        stroke = null;
      }

      if (!M.utils.isNullOrEmpty(fill)) {
        fill = new ol.style.Fill({
          color: chroma(M.impl.style.Simple.getValue(fill.color, feature))
            .alpha(M.impl.style.Simple.getValue(fill.opacity, feature)).css()
        });
      }
      else {
        fill = null;
      }

      if (!M.utils.isNullOrEmpty(label)) {
        let labelText = new ol.style.Text({
          font: M.impl.style.Simple.getValue(label.font, feature),
          rotateWithView: M.impl.style.Simple.getValue(label.rotate, feature),
          scale: M.impl.style.Simple.getValue(label.scale, feature),
          offsetX: M.impl.style.Simple.getValue(label.offset ? label.offset[0] : undefined, feature),
          offsetY: M.impl.style.Simple.getValue(label.ofsset ? label.offset[1] : undefined, feature),
          fill: new ol.style.Fill({
            color: M.impl.style.Simple.getValue(label.color, feature)
          }),
          textAlign: M.impl.style.Simple.getValue(label.align, feature),
          textBaseline: (M.impl.style.Simple.getValue(label.baseline, feature) || "").toLowerCase(),
          text: M.impl.style.Simple.getValue(label.text, feature),
          rotation: M.impl.style.Simple.getValue(label.rotation, feature)
        });
        if (!M.utils.isNullOrEmpty(label.stroke)) {
          labelText.setStroke(new ol.style.Stroke({
            color: M.impl.style.Simple.getValue(label.stroke.color, feature),
            width: M.impl.style.Simple.getValue(label.stroke.width, feature),
            lineCap: M.impl.style.Simple.getValue(label.stroke.linecap, feature),
            lineJoin: M.impl.style.Simple.getValue(label.stroke.linejoin, feature),
            lineDash: M.impl.style.Simple.getValue(label.stroke.linedash, feature),
            lineDashOffset: M.impl.style.Simple.getValue(label.stroke.linedashoffset, feature),
            miterLimit: M.impl.style.Simple.getValue(label.stroke.miterlimit, feature)
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
            radius: M.impl.style.Simple.getValue(radius, feature),
            snapToPixel: snaptopixel
          }),
          text: label
        });
      }

      if (!M.utils.isNullOrEmpty(icon)) {
        if (!M.utils.isNullOrEmpty(icon.src)) {
          styleIcon = new ol.style.Style({
            image: new ol.style.Icon({
              anchor: M.impl.style.Simple.getValue(icon.anchor, feature),
              anchorXUnits: M.impl.style.Simple.getValue(icon.anchorxunits, feature),
              anchorYUnits: M.impl.style.Simple.getValue(icon.anchoryunits, feature),
              src: M.impl.style.Simple.getValue(icon.src, feature),
              opacity: M.impl.style.Simple.getValue(icon.opacity, feature),
              scale: M.impl.style.Simple.getValue(icon.scale, feature),
              rotation: M.impl.style.Simple.getValue(icon.rotation, feature),
              rotateWithView: M.impl.style.Simple.getValue(icon.rotate, feature),
              snapToPixel: M.impl.style.Simple.getValue(icon.snaptopixel, feature),
              offsetOrigin: M.impl.style.Simple.getValue(icon.offsetorigin, feature),
              offset: M.impl.style.Simple.getValue(icon.offset, feature),
              crossOrigin: M.impl.style.Simple.getValue(icon.crossorigin, feature),
              anchorOrigin: M.impl.style.Simple.getValue(icon.anchororigin, feature),
              size: M.impl.style.Simple.getValue(icon.size, feature)
            })
          });
        }
        else {
          styleIcon = new ol.style.Style({
            image: new ol.style.FontSymbol({
              form: M.impl.style.Simple.getValue(icon.form, feature).toLowerCase(),
              gradient: M.impl.style.Simple.getValue(icon.gradient, feature),
              glyph: M.impl.style.Simple.getValue(icon.class, feature),
              fontSize: M.impl.style.Simple.getValue(icon.fontsize, feature),
              radius: M.impl.style.Simple.getValue(icon.radius, feature),
              rotation: M.impl.style.Simple.getValue(icon.rotation, feature),
              rotateWithView: M.impl.style.Simple.getValue(icon.rotate, feature),
              offsetY: M.impl.style.Simple.getValue(icon.offset[0], feature),
              offsetX: M.impl.style.Simple.getValue(icon.offset[1], feature),
              color: M.impl.style.Simple.getValue(icon.color, feature),
              fill: new ol.style.Fill({
                color: M.impl.style.Simple.getValue(icon.fill, feature)
              }),
              stroke: new ol.style.Stroke({
                color: M.impl.style.Simple.getValue(icon.gradientcolor, feature),
                width: 1
              }),
              anchor: M.impl.style.Simple.getValue(icon.anchor, feature),
              anchorXUnits: M.impl.style.Simple.getValue(icon.anchorxunits, feature),
              anchorYUnits: M.impl.style.Simple.getValue(icon.anchoryunits, feature),
              src: M.impl.style.Simple.getValue(icon.src, feature),
              opacity: M.impl.style.Simple.getValue(icon.opacity, feature),
              scale: M.impl.style.Simple.getValue(icon.scale, feature),
              snapToPixel: M.impl.style.Simple.getValue(icon.snaptopixel, feature),
              offsetOrigin: M.impl.style.Simple.getValue(icon.offsetorigin, feature),
              offset: M.impl.style.Simple.getValue(icon.offset, feature),
              crossOrigin: M.impl.style.Simple.getValue(icon.crossorigin, feature),
              anchorOrigin: M.impl.style.Simple.getValue(icon.anchororigin, feature),
              size: M.impl.style.Simple.getValue(icon.size, feature)
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
})();
