goog.provide('M.impl.style.Polygon');

goog.require('M.impl.style.Simple');

/**
 * TODO
 * @private
 * @type {M.style.Polygon}
 */

(function() {
  /**
   * Main constructor of the class.
   * @constructor
   * @implements {M.impl.style.Simple}
   * @api stable
   */
  M.impl.style.Polygon = function(options) {
    goog.base(this, options);
  };
  goog.inherits(M.impl.style.Polygon, M.impl.style.Simple);

  /**
   * This function se options to ol style
   *
   * @public
   * @param {object} options - options to style
   * @function
   */
  M.impl.style.Polygon.prototype.parseFacadeOptions_ = function(options) {
    let stroke = options.stroke;
    let label = options.label;
    let fill = options.fill;
    this.style_ = new ol.style.Style();

    // FILL
    if (!M.utils.isNullOrEmpty(fill)) {
      if (!M.utils.isNullOrEmpty(fill.pattern)) {
        this.style_.setFill(new ol.style.FillPattern({
          pattern: (fill.pattern.name || "").toLowerCase(),
          color: chroma(fill.pattern.color).alpha(fill.pattern.opacity).css(),
          size: fill.pattern.size,
          spacing: fill.pattern.spacing,
          image: (fill.pattern.name == 'Image') ? new ol.style.Icon({
            src: fill.pattern.src
          }) : undefined,
          angle: fill.pattern.rotation,
          scale: fill.pattern.scale,
          offset: fill.pattern.offset,
          fill: new ol.style.Fill({
            color: chroma(fill.color).alpha(fill.opacity).css()
          }),
        }));
      }
      else {
        this.style_.setFill(new ol.style.Fill({
          color: chroma(fill.color).alpha(fill.opacity).css()
        }));
      }
    }

    // STROKE
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

    // LABEL
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
    this.styles_ = [this.style_];
  };


  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Polygon.prototype.drawGeometryToCanvas = function(vectorContext) {
    let canvasSize = this.getCanvasSize();

    let maxW = Math.floor(canvasSize[0] * 0.2);
    let maxH = Math.floor(canvasSize[1] * 0.2);

    let minW = (canvasSize[0] - maxW);
    let minH = (canvasSize[1] - maxH);
    vectorContext.drawGeometry(new ol.geom.Polygon([[
      [minW, minH],
       [minW, maxW],
       [maxW, maxW],
       [maxW, minH],
       [minW, minH]
    ]]));
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Polygon.prototype.getCanvasSize = function() {
    return [150, 100];
  };
})();
