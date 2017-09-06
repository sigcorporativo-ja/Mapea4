goog.provide('M.impl.style.Line');

goog.require('M.impl.style.Simple');


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
      let stroke = options.stroke;
      let label = options.label;
      let fill = options.fill;
      let style = new ol.style.Style();
      let styleStroke = new ol.style.Style();
      if (!M.utils.isNullOrEmpty(stroke)) {
        style.setStroke(new ol.style.Stroke({
          color: M.impl.style.Simple.getValue(stroke.color, feature),
          width: M.impl.style.Simple.getValue(stroke.width, feature),
          lineDash: M.impl.style.Simple.getValue(stroke.lineDash, feature),
          lineDashOffset: M.impl.style.Simple.getValue(stroke.lineDashOffset, feature),
          lineCap: M.impl.style.Simple.getValue(stroke.lineCap, feature),
          lineJoin: M.impl.style.Simple.getValue(stroke.lineJoin, feature),
          miterLimit: M.impl.style.Simple.getValue(stroke.miterLimit, feature)
        }));
      }
      if (!M.utils.isNullOrEmpty(label)) {
        style.setText(new ol.style.Text({
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
        }));
        if (!M.utils.isNullOrEmpty(label.stroke)) {
          style.getText().setStroke(new ol.style.Stroke({
            color: M.impl.style.Simple.getValue(label.stroke.color, feature),
            width: M.impl.style.Simple.getValue(label.stroke.width, feature),
            lineCap: M.impl.style.Simple.getValue(label.stroke.linecap, feature),
            lineJoin: M.impl.style.Simple.getValue(label.stroke.linejoin, feature),
            lineDash: M.impl.style.Simple.getValue(label.stroke.linedash, feature),
            lineDashOffset: M.impl.style.Simple.getValue(label.stroke.linedashoffset, feature),
            miterLimit: M.impl.style.Simple.getValue(label.stroke.miterlimit, feature)
          }));
        }
      }

      if (!M.utils.isNullOrEmpty(fill)) {
        styleStroke.setStroke(
          new ol.style.Stroke({
            color: chroma(M.impl.style.Simple.getValue(fill.color, feature))
              .alpha(M.impl.style.Simple.getValue(fill.opacity, feature)).css(),
            width: M.impl.style.Simple.getValue(fill.width, feature)
          })
        );
      }
      return [style, styleStroke];
    };
  };
})();
