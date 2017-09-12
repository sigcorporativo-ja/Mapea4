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
  M.impl.style.Line.prototype.updateFacadeOptions = function(options) {
    return function(feature, resolution) {
      if (!(feature instanceof ol.Feature)) {
        resolution = feature;
        feature = this;
      }
      let stroke, label, fill;
      let style = new ol.style.Style();
      let styleStroke = new ol.style.Style();
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
      if (!M.utils.isNullOrEmpty(label)) {
        style.setText(new ol.style.Text({
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
        }));
        if (!M.utils.isNullOrEmpty(options.label.stroke)) {
          style.getText().setStroke(new ol.style.Stroke({
            color: M.impl.style.Simple.getValue(options.label.stroke.color, feature),
            width: M.impl.style.Simple.getValue(options.label.stroke.width, feature),
            lineCap: M.impl.style.Simple.getValue(options.label.stroke.linecap, feature),
            lineJoin: M.impl.style.Simple.getValue(options.label.stroke.linejoin, feature),
            lineDash: M.impl.style.Simple.getValue(options.label.stroke.linedash, feature),
            lineDashOffset: M.impl.style.Simple.getValue(options.label.stroke.linedashoffset, feature),
            miterLimit: M.impl.style.Simple.getValue(options.label.stroke.miterlimit, feature)
          }));
        }
      }

      if (!M.utils.isNullOrEmpty(options.fill)) {
        let fillColorValue = M.impl.style.Simple.getValue(options.fill.color, feature);
        let fillOpacityValue = M.impl.style.Simple.getValue(options.fill.opacity, feature) || 1;
        if (!M.utils.isNullOrEmpty(fillColorValue)) {
          styleStroke.setStroke(
            new ol.style.Stroke({
              color: chroma(fillColorValue).alpha(fillOpacityValue).css(),
              width: M.impl.style.Simple.getValue(options.fill.width, feature)
            })
          );
        }
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
