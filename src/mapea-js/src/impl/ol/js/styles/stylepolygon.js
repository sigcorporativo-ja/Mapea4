goog.provide('M.impl.style.Polygon');

goog.require('M.impl.style.Simple');
goog.require('M.impl.style.CentroidStyle');

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
      let style = new M.impl.style.CentroidStyle();
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
        let align = M.impl.style.Simple.getValue(options.label.align, feature);
        let baseline = M.impl.style.Simple.getValue(options.label.baseline, feature);
        style.setText(new ol.style.Text({
          font: M.impl.style.Simple.getValue(options.label.font, feature),
          rotateWithView: M.impl.style.Simple.getValue(options.label.rotate, feature),
          scale: M.impl.style.Simple.getValue(options.label.scale, feature),
          offsetX: M.impl.style.Simple.getValue(options.label.offset ? options.label.offset[0] : undefined, feature),
          offsetY: M.impl.style.Simple.getValue(options.label.ofsset ? options.label.offset[1] : undefined, feature),
          fill: new ol.style.Fill({
            color: M.impl.style.Simple.getValue(options.label.color || '#000000', feature)
          }),
          textAlign: Object.values(M.style.align).includes(align) ? align : 'center',
          textBaseline: Object.values(M.style.baseline).includes(baseline) ? baseline : 'top',
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
        let fill;
        if (!M.utils.isNullOrEmpty(fillColorValue)) {
          fill = new ol.style.Fill({
            color: chroma(fillColorValue).alpha(fillOpacityValue).css()
          });
        }
        if (!M.utils.isNullOrEmpty(options.fill.pattern)) {
          let fillColorPatternValue = "#000";
          let fillOpacityPatternValue = 1;
          if (!M.utils.isNullOrEmpty(options.fill.pattern.fill)) {
            fillColorPatternValue = M.impl.style.Simple.getValue(options.fill.pattern.fill.color, feature);
            fillOpacityPatternValue = M.impl.style.Simple.getValue(options.fill.pattern.fill.opacity, feature);
          }
          let fillPattern = new ol.style.Fill({
            color: chroma(fillColorPatternValue).alpha(fillOpacityPatternValue).css()
          });
          let color = null;
          if (!M.utils.isNullOrEmpty(options.fill.pattern.color)) {
            let opacity = M.impl.style.Simple.getValue(options.fill.pattern.opacity, feature) || 1;
            color = chroma(options.fill.pattern.color).alpha(opacity).css();
          }
          style.setFill(new ol.style.FillPattern({
            pattern: (M.impl.style.Simple.getValue(options.fill.pattern.name, feature) || "").toLowerCase(),
            color: color,
            size: M.impl.style.Simple.getValue(options.fill.pattern.size, feature),
            spacing: M.impl.style.Simple.getValue(options.fill.pattern.spacing, feature),
            image: (M.impl.style.Simple.getValue(options.fill.pattern.name, feature) == 'Image') ? new ol.style.Icon({
              src: M.impl.style.Simple.getValue(options.fill.pattern.src, feature)
            }) : undefined,
            angle: M.impl.style.Simple.getValue(options.fill.pattern.rotation, feature),
            scale: M.impl.style.Simple.getValue(options.fill.pattern.scale, feature),
            offset: M.impl.style.Simple.getValue(options.fill.pattern.offset, feature),
            fill: fillPattern,
          }));
        }
        else {
          style.setFill(fill);
        }
      }
      return [style];
    };
  };

  /**
   * This function updates the canvas of style of canvas
   *
   * @public
   * @function
   * @param {HTMLCanvasElement} canvas - canvas of style
   * @api stable
   */
  M.impl.style.Polygon.prototype.updateCanvas = function(canvas) {
    let canvasSize = this.getCanvasSize();
    let vectorContext = ol.render.toContext(canvas.getContext('2d'), {
      size: canvasSize
    });
    let applyStyle = this.olStyleFn_()[0];
    if (!M.utils.isNullOrEmpty(applyStyle.getText())) {
      applyStyle.setText(null);
    }
    let stroke = applyStyle.getStroke();
    if (!M.utils.isNullOrEmpty(stroke) && !M.utils.isNullOrEmpty(stroke.getWidth())) {
      if (stroke.getWidth() > this.DEFAULT_WIDTH_POLYGON) {
        applyStyle.getStroke().setWidth(this.DEFAULT_WIDTH_POLYGON);
      }
    }

    vectorContext.setStyle(applyStyle);
    this.drawGeometryToCanvas(vectorContext);
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
    let maxW = Math.floor(canvasSize[0]);
    let maxH = Math.floor(canvasSize[1]);
    let minW = (canvasSize[0] - maxW);
    let minH = (canvasSize[1] - maxH);
    vectorContext.drawGeometry(new ol.geom.Polygon([[
         [minW + 3, minH + 3],
          [maxW - 3, minH + 3],
          [maxW - 3, maxH - 3],
          [minW + 3, maxH - 3],
          [minW + 3, minH + 3]
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
    return [25, 15];
  };

  M.impl.style.Polygon.prototype.DEFAULT_WIDTH_POLYGON = 3;
})();
