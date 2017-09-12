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
      let style = new ol.style.Style();
      let stylePattern = new ol.style.Style();
      if (!M.utils.isNullOrEmpty(options.stroke)) {
        style.setStroke(new ol.style.Stroke({
          color: M.impl.style.Simple.getValue(options.stroke.color, feature),
          width: M.impl.style.Simple.getValue(options.stroke.width, feature),
          lineDash: M.impl.style.Simple.getValue(options.stroke.linedash, feature),
          lineDashOffset: M.impl.style.Simple.getValue(options.stroke.linedashoffset, feature),
          lineCap: M.impl.style.Simple.getValue(options.stroke.linecap, feature),
          lineJoin: M.impl.style.Simple.getValue(options.stroke.linejoin, feature),
          miterLimit: M.impl.style.Simple.getValue(options.stroke.miterlimit, feature)
        }));
      }
      if (!M.utils.isNullOrEmpty(options.label)) {
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
          style.setFill(new ol.style.Fill({
            color: chroma(fillColorValue).alpha(fillOpacityValue).css()
          }));
        }
        if (!M.utils.isNullOrEmpty(options.fill.pattern)) {
          stylePattern.setFill(new ol.style.FillPattern({
            pattern: (M.impl.style.Simple.getValue(options.fill.pattern.name, feature) || "").toLowerCase(),
            color: M.impl.style.Simple.getValue(options.fill.pattern.color, feature),
            size: M.impl.style.Simple.getValue(options.fill.pattern.size, feature),
            spacing: M.impl.style.Simple.getValue(options.fill.pattern.spacing, feature),
            image: (M.impl.style.Simple.getValue(options.fill.pattern.name, feature) == 'Image') ? new ol.style.Icon({
              src: M.impl.style.Simple.getValue(options.fill.pattern.src, feature)
            }) : undefined,
            angle: M.impl.style.Simple.getValue(options.fill.pattern.rotation, feature),
            scale: M.impl.style.Simple.getValue(options.fill.pattern.scale, feature),
            offset: M.impl.style.Simple.getValue(options.fill.pattern.offset, feature),
            fill: new ol.style.Fill({
              color: (!M.utils.isNullOrEmpty(M.impl.style.Simple.getValue(options.fill.pattern.fill, feature)) &&
                  !M.utils.isNullOrEmpty(M.impl.style.Simple.getValue(options.fill.pattern.fill.color, feature))) ?
                chroma(M.impl.style.Simple.getValue(options.fill.pattern.fill.color, feature))
                .alpha(M.impl.style.Simple.getValue(options.fill.pattern.fill.opacity, feature)).css() : "rgba(255, 255, 255, 0)"
            }),
          }));
        }
      }
      return [style, stylePattern];
    };
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
