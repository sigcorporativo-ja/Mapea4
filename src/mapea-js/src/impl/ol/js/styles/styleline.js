goog.provide('M.impl.style.Line');

goog.require('M.impl.style.Simple');
goog.require('M.impl.style.TextPath');


/**
 * @classdesc
 *
 */


(function () {
  /**
   * Main constructor of the class.
   * @constructor
   * @implements {M.impl.style.Simple}
   * @api stable
   */
  M.impl.style.Line = function (options) {
    goog.base(this, options);
    this.olStyleFn_ = this.updateFacadeOptions(options);
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
  M.impl.style.Line.prototype.updateFacadeOptions = function (options) {
    return function (feature, resolution) {
      if (!(feature instanceof ol.Feature)) {
        resolution = feature;
        feature = this;
      }
      let stroke = options.stroke;
      let label = options.label;
      let fill = options.fill;
      let style = new ol.style.Style();
      let styleStroke = new ol.style.Style();
      const getValue = M.impl.style.Simple.getValue;
      if (!M.utils.isNullOrEmpty(stroke)) {
        style.setStroke(new ol.style.Stroke({
          color: getValue(stroke.color, feature),
          width: getValue(stroke.width, feature),
          lineDash: getValue(stroke.lineDash, feature),
          lineDashOffset: getValue(stroke.lineDashOffset, feature),
          lineCap: getValue(stroke.lineCap, feature),
          lineJoin: getValue(stroke.lineJoin, feature),
          miterLimit: getValue(stroke.miterLimit, feature)
        }));
      }
      if (!M.utils.isNullOrEmpty(label)) {
        let textPathConfig = {
          text: getValue(label.text, feature),
          font: getValue(label.font, feature),
          fill: new ol.style.Fill({
            color: getValue(label.color, feature)
          }),
          textBaseline: (getValue(label.baseline, feature) || '').toLowerCase(),
          textAlign: getValue(label.align, feature),
          rotateWithView: getValue(label.rotate, feature) || false,
          textOverflow: getValue(label.textOverflow, feature) || 'custom',
          minWidth: getValue(label.minWidth, feature) || 0
        };

        style.setText(new M.impl.style.TextPath(textPathConfig));

        if (!M.utils.isNullOrEmpty(label.stroke)) {
          style.getText().setStroke(new ol.style.Stroke({
            color: getValue(label.stroke.color, feature),
            width: getValue(label.stroke.width, feature),
            lineCap: getValue(label.stroke.linecap, feature),
            lineJoin: getValue(label.stroke.linejoin, feature),
            lineDash: getValue(label.stroke.linedash, feature),
            lineDashOffset: getValue(label.stroke.linedashoffset, feature),
            miterLimit: getValue(label.stroke.miterlimit, feature)
          }));
        }
      }

      if (!M.utils.isNullOrEmpty(fill)) {
        styleStroke.setStroke(
          new ol.style.Stroke({
            color: chroma(getValue(fill.color, feature))
              .alpha(getValue(fill.opacity, feature)).css(),
            width: getValue(fill.width, feature)
          })
        );
      }
      return [style, styleStroke];
    };
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Line.prototype.drawGeometryToCanvas = function (vectorContext) {
    vectorContext.drawGeometry(new ol.geom.LineString([[10, 10], [30, 100], [80, 10], [130, 90]]));
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Line.prototype.getCanvasSize = function () {
    return [150, 100];
  };
})();
