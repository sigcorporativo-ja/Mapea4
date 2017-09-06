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
    this.olStyleFn_ = this.updateFacadeOptions(options);
  };
  goog.inherits(M.impl.style.Polygon, M.impl.style.Simple);

  /**
   * This function se options to ol style
   *
   * @public
   * @param {object} options - options to style
   * @function
   */
  M.impl.style.Polygon.prototype.updateFacadeOptions = function(options) {
    return function(feature, resolution) {
      if (!(feature instanceof ol.Feature)) {
        resolution = feature;
        feature = this;
      }
      let stroke = options.stroke;
      let label = options.label;
      let fill = options.fill;
      let style = new ol.style.Style();
      let stylePattern = null;
      let styles = [style];
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
        if (!M.utils.isNullOrEmpty(fill.color) || !M.utils.isNullOrEmpty(fill.pacity)) {
          style.setFill(
            new ol.style.Fill({
              color: chroma(M.impl.style.Simple.getValue(fill.color, feature))
                .alpha(M.impl.style.Simple.getValue(fill.opacity, feature)).css()
            }));
        }
        let pattern = fill.pattern;
        if (!M.utils.isNullOrEmpty(fill.pattern)) {
          stylePattern = new ol.style.Style({
            fill: new ol.style.FillPattern({
              pattern: (M.impl.style.Simple.getValue(pattern.name, feature) || "").toLowerCase(),
              color: M.impl.style.Simple.getValue(pattern.color, feature),
              size: M.impl.style.Simple.getValue(pattern.size, feature),
              spacing: M.impl.style.Simple.getValue(pattern.spacing, feature),
              image: (M.impl.style.Simple.getValue(pattern.name, feature) == 'Image') ? new ol.style.Icon({
                src: M.impl.style.Simple.getValue(pattern.src, feature)
              }) : undefined,
              angle: M.impl.style.Simple.getValue(pattern.rotation, feature),
              scale: M.impl.style.Simple.getValue(pattern.scale, feature),
              offset: M.impl.style.Simple.getValue(pattern.offset, feature),
              fill: new ol.style.Fill({
                color: (!M.utils.isNullOrEmpty(M.impl.style.Simple.getValue(pattern.fill, feature)) &&
                    !M.utils.isNullOrEmpty(M.impl.style.Simple.getValue(pattern.fill.color, feature))) ?
                  chroma(M.impl.style.Simple.getValue(pattern.fill.color, feature))
                  .alpha(M.impl.style.Simple.getValue(pattern.fill.opacity, feature)).css() : "rgba(255, 255, 255, 0)"
              }),
            })
          });
          styles.push(stylePattern);
        }
      }
      return styles;
    };
  };
})();
