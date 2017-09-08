goog.provide('M.impl.style.Line');

goog.require('M.impl.style.Simple');
goog.require('M.impl.style.TextPath');


/**
 * @classdesc
 *
 */


(function() {
  /**
   * Main constructor of the class.
   * @constructor
   * @implements {M.impl.style.Simple}
   * @api stable
   */
  M.impl.style.Line = function(options) {
    goog.base(this, options);
  };
  goog.inherits(M.impl.style.Line, M.impl.style.Simple);

  /**
   * This function se options to ol style
   *
   * @public
   * @param {object} options - options to style
   * @function
   * @api stable
   */
  M.impl.style.Line.prototype.parseFacadeOptions_ = function(options) {
    let stroke = options.stroke;
    let label = options.label;
    let fill = options.fill;
    this.style_ = new ol.style.Style();
    this.styleStroke_ = new ol.style.Style();
    this.styles_ = [this.style_, this.styleStroke_];
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
        offset: [label.offsetX, label.offsetY],
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
      this.styleStroke_.setStroke(
        new ol.style.Stroke({
          color: chroma(fill.color).alpha(fill.opacity).css(),
          width: fill.width
        })
      );
    }
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Line.prototype.drawGeometryToCanvas = function(vectorContext) {
    vectorContext.drawGeometry(new ol.geom.LineString([[10, 10], [30, 100], [80, 10], [130, 90]]));
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Line.prototype.getCanvasSize = function() {
    return [150, 100];
  };
})();
