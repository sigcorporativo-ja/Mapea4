goog.provide('M.impl.style.Point');

goog.require('M.impl.style.Simple');

/**
 * @namespace M.impl.style.Point
 */

(function() {
  /**
   * Main constructor of the class.
   * @constructor
   * @implements {M.impl.style.Simple}
   * @api stable
   */
  M.impl.style.Point = (function(options) {
    this.olStyleFn_ = null;
    goog.base(this, options);
  });
  goog.inherits(M.impl.style.Point, M.impl.style.Simple);

  /**
   * This function se options to ol style
   *
   * @private
   * @param {object} options - options to style
   * @function
   * @api stable
   */
  M.impl.style.Point.prototype.updateFacadeOptions = function(options) {

    this.olStyleFn_ = function(feature, resolution) {
      if (!(feature instanceof ol.Feature)) {
        resolution = feature;
        feature = this;
      }
      let style = new ol.style.Style({
        zIndex: M.impl.style.Simple.getValue(options.zindex, feature)
      });
      let styleIcon = new ol.style.Style();
      let styles = [];
      if (!M.utils.isNullOrEmpty(options.stroke)) {
        let strokeColorValue = M.impl.style.Simple.getValue(options.stroke.color, feature);
        if (!M.utils.isNullOrEmpty(strokeColorValue)) {
          style.setStroke(new ol.style.Stroke({
            color: strokeColorValue,
            width: M.impl.style.Simple.getValue(options.stroke.width, feature),
            lineDash: M.impl.style.Simple.getValue(options.stroke.linedash, feature),
            lineDashOffset: M.impl.style.Simple.getValue(options.stroke.linedashoffset, feature),
            lineCap: M.impl.style.Simple.getValue(options.stroke.linecap, feature),
            lineJoin: M.impl.style.Simple.getValue(options.stroke.linejoin, feature),
            miterLimit: M.impl.style.Simple.getValue(options.stroke.miterlimit, feature)
          }));
        }
      }
      if (!M.utils.isNullOrEmpty(options.fill)) {
        let fillColorValue = M.impl.style.Simple.getValue(options.fill.color, feature);
        let fillOpacityValue = M.impl.style.Simple.getValue(options.fill.opacity, feature) || 1;
        if (!M.utils.isNullOrEmpty(fillColorValue)) {
          style.setFill(new ol.style.Fill({
            color: chroma(fillColorValue)
              .alpha(fillOpacityValue).css()
          }));
        }
      }

      if (!M.utils.isNullOrEmpty(options.label)) {
        let labelText = new ol.style.Text({
          font: M.impl.style.Simple.getValue(options.label.font, feature),
          rotateWithView: M.impl.style.Simple.getValue(options.label.rotate, feature),
          scale: M.impl.style.Simple.getValue(options.label.scale, feature),
          offsetX: M.impl.style.Simple.getValue(options.label.offset ? options.label.offset[0] : undefined, feature),
          offsetY: M.impl.style.Simple.getValue(options.label.ofsset ? options.label.offset[1] : undefined, feature),
          fill: new ol.style.Fill({
            color: M.impl.style.Simple.getValue(options.label.color, feature)
          }),
          textAlign: M.impl.style.Simple.getValue(options.label.align, feature),
          textBaseline: (M.impl.style.Simple.getValue(options.label.baseline, feature) || "").toLowerCase(),
          text: M.impl.style.Simple.getValue(options.label.text, feature),
          rotation: M.impl.style.Simple.getValue(options.label.rotation, feature)
        });
        if (!M.utils.isNullOrEmpty(options.label.stroke)) {
          labelText.setStroke(new ol.style.Stroke({
            color: M.impl.style.Simple.getValue(options.label.stroke.color, feature),
            width: M.impl.style.Simple.getValue(options.label.stroke.width, feature),
            lineCap: M.impl.style.Simple.getValue(options.label.stroke.linecap, feature),
            lineJoin: M.impl.style.Simple.getValue(options.label.stroke.linejoin, feature),
            lineDash: M.impl.style.Simple.getValue(options.label.stroke.linedash, feature),
            lineDashOffset: M.impl.style.Simple.getValue(options.label.stroke.linedashoffset, feature),
            miterLimit: M.impl.style.Simple.getValue(options.label.stroke.miterlimit, feature)
          }));
        }
        style.setText(labelText);
      }

      style.setImage(new ol.style.Circle({
        fill: style.getFill(),
        stroke: style.getStroke(),
        radius: M.impl.style.Simple.getValue(options.radius, feature),
        snapToPixel: M.impl.style.Simple.getValue(options.snapToPixel, feature)
      }));

      if (!M.utils.isNullOrEmpty(options.icon)) {
        if (!M.utils.isNullOrEmpty(options.icon.src)) {
          styleIcon.setImage(new ol.style.Icon({
            anchor: M.impl.style.Simple.getValue(options.icon.anchor, feature),
            anchorXUnits: M.impl.style.Simple.getValue(options.icon.anchorxunits, feature),
            anchorYUnits: M.impl.style.Simple.getValue(options.icon.anchoryunits, feature),
            src: M.impl.style.Simple.getValue(options.icon.src, feature),
            opacity: M.impl.style.Simple.getValue(options.icon.opacity, feature),
            scale: M.impl.style.Simple.getValue(options.icon.scale, feature),
            rotation: M.impl.style.Simple.getValue(options.icon.rotation, feature),
            rotateWithView: M.impl.style.Simple.getValue(options.icon.rotate, feature),
            snapToPixel: M.impl.style.Simple.getValue(options.icon.snaptopixel, feature),
            offsetOrigin: M.impl.style.Simple.getValue(options.icon.offsetorigin, feature),
            offset: M.impl.style.Simple.getValue(options.icon.offset, feature),
            crossOrigin: M.impl.style.Simple.getValue(options.icon.crossorigin, feature),
            anchorOrigin: M.impl.style.Simple.getValue(options.icon.anchororigin, feature),
            size: M.impl.style.Simple.getValue(options.icon.size, feature)
          }));
        }
        else {
          styleIcon.setImage(new ol.style.FontSymbol({
            form: M.impl.style.Simple.getValue(options.icon.form, feature).toLowerCase(),
            gradient: M.impl.style.Simple.getValue(options.icon.gradient, feature),
            glyph: M.impl.style.Simple.getValue(options.icon.class, feature),
            fontSize: M.impl.style.Simple.getValue(options.icon.fontsize, feature),
            radius: M.impl.style.Simple.getValue(options.icon.radius, feature),
            rotation: M.impl.style.Simple.getValue(options.icon.rotation, feature),
            rotateWithView: M.impl.style.Simple.getValue(options.icon.rotate, feature),
            offsetY: M.impl.style.Simple.getValue(options.icon.offset[0], feature),
            offsetX: M.impl.style.Simple.getValue(options.icon.offset[1], feature),
            color: M.impl.style.Simple.getValue(options.icon.color, feature),
            fill: new ol.style.Fill({
              color: M.impl.style.Simple.getValue(options.icon.fill, feature)
            }),
            stroke: new ol.style.Stroke({
              color: M.impl.style.Simple.getValue(options.icon.gradientcolor, feature),
              width: 1
            }),
            anchor: M.impl.style.Simple.getValue(options.icon.anchor, feature),
            anchorXUnits: M.impl.style.Simple.getValue(options.icon.anchorxunits, feature),
            anchorYUnits: M.impl.style.Simple.getValue(options.icon.anchoryunits, feature),
            src: M.impl.style.Simple.getValue(options.icon.src, feature),
            opacity: M.impl.style.Simple.getValue(options.icon.opacity, feature),
            scale: M.impl.style.Simple.getValue(options.icon.scale, feature),
            snapToPixel: M.impl.style.Simple.getValue(options.icon.snaptopixel, feature),
            offsetOrigin: M.impl.style.Simple.getValue(options.icon.offsetorigin, feature),
            offset: M.impl.style.Simple.getValue(options.icon.offset, feature),
            crossOrigin: M.impl.style.Simple.getValue(options.icon.crossorigin, feature),
            anchorOrigin: M.impl.style.Simple.getValue(options.icon.anchororigin, feature),
            size: M.impl.style.Simple.getValue(options.icon.size, feature)
          }));

          styleIcon = new ol.style.Style({
            image: new ol.style.FontSymbol({
              form: M.impl.style.Simple.getValue(options.icon.form, feature).toLowerCase(),
              gradient: M.impl.style.Simple.getValue(options.icon.gradient, feature),
              glyph: M.impl.style.Simple.getValue(options.icon.class, feature),
              fontSize: M.impl.style.Simple.getValue(options.icon.fontsize, feature),
              radius: M.impl.style.Simple.getValue(options.icon.radius, feature),

              rotation: M.impl.style.Simple.getValue(options.icon.rotation, feature),
              rotateWithView: M.impl.style.Simple.getValue(options.icon.rotate, feature),
              offsetY: M.impl.style.Simple.getValue(options.icon.offset[0], feature),
              offsetX: M.impl.style.Simple.getValue(options.icon.offset[1], feature),
              color: M.impl.style.Simple.getValue(options.icon.color, feature),
              fill: new ol.style.Fill({
                color: M.impl.style.Simple.getValue(options.icon.fill, feature)
              }),
              stroke: new ol.style.Stroke({
                color: M.impl.style.Simple.getValue(options.icon.gradientcolor, feature),
                width: 1
              }),
              anchor: M.impl.style.Simple.getValue(options.icon.anchor, feature),
              anchorXUnits: M.impl.style.Simple.getValue(options.icon.anchorxunits, feature),
              anchorYUnits: M.impl.style.Simple.getValue(options.icon.anchoryunits, feature),
              src: M.impl.style.Simple.getValue(options.icon.src, feature),
              opacity: M.impl.style.Simple.getValue(options.icon.opacity, feature),
              scale: M.impl.style.Simple.getValue(options.icon.scale, feature),
              snapToPixel: M.impl.style.Simple.getValue(options.icon.snaptopixel, feature),
              offsetOrigin: M.impl.style.Simple.getValue(options.icon.offsetorigin, feature),
              offset: M.impl.style.Simple.getValue(options.icon.offset, feature),
              crossOrigin: M.impl.style.Simple.getValue(options.icon.crossorigin, feature),
              anchorOrigin: M.impl.style.Simple.getValue(options.icon.anchororigin, feature),
              size: M.impl.style.Simple.getValue(options.icon.size, feature)
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
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Point.prototype.drawGeometryToCanvas = function(vectorContext) {
    vectorContext.drawGeometry(new ol.geom.Point([50, 50]));
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Point.prototype.getCanvasSize = function() {
    return [150, 100];
  };
})();
