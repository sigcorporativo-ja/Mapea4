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
          color: M.impl.style.Simple.getValue(stroke.color, this),
          width: M.impl.style.Simple.getValue(stroke.width, this),
          lineDash: M.impl.style.Simple.getValue(stroke.lineDash, this),
          lineDashOffset: M.impl.style.Simple.getValue(stroke.lineDashOffset, this),
          lineCap: M.impl.style.Simple.getValue(stroke.lineCap, this),
          lineJoin: M.impl.style.Simple.getValue(stroke.lineJoin, this),
          miterLimit: M.impl.style.Simple.getValue(stroke.miterLimit, this)
        }));
      }
      if (!M.utils.isNullOrEmpty(label)) {
        style.setText(new ol.style.Text({
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
        }));
        if (!M.utils.isNullOrEmpty(label.stroke)) {
          style.getText().setStroke(new ol.style.Stroke({
            color: M.impl.style.Simple.getValue(label.stroke.color, this),
            width: M.impl.style.Simple.getValue(label.stroke.width, this),
            lineCap: M.impl.style.Simple.getValue(label.stroke.linecap, this),
            lineJoin: M.impl.style.Simple.getValue(label.stroke.linejoin, this),
            lineDash: M.impl.style.Simple.getValue(label.stroke.linedash, this),
            lineDashOffset: M.impl.style.Simple.getValue(label.stroke.linedashoffset, this),
            miterLimit: M.impl.style.Simple.getValue(label.stroke.miterlimit, this)
          }));
        }
      }

      if (!M.utils.isNullOrEmpty(fill)) {
        styleStroke.setStroke(
          new ol.style.Stroke({
            color: chroma(M.impl.style.Simple.getValue(fill.color, this))
              .alpha(M.impl.style.Simple.getValue(fill.opacity, this)).css(),
            width: M.impl.style.Simple.getValue(fill.width, this)
          })
        );
      }
      return [style, styleStroke];
    };
  };
})();
