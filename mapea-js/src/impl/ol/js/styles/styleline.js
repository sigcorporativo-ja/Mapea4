goog.provide('M.impl.style.Line');

goog.require('M.impl.style.CentroidStyle');
goog.require('M.impl.style.Simple');
goog.require('M.impl.style.TextPath');
goog.require('ol.geometry.Cspline');

/**
 * @namespace M.impl.style.Line
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
      let style = new M.impl.style.CentroidStyle();
      let styleStroke = new M.impl.style.CentroidStyle();
      const getValue = M.impl.style.Simple.getValue;
      if (!M.utils.isNullOrEmpty(stroke)) {
        style.setStroke(new ol.style.Stroke({
          color: getValue(stroke.color, feature),
          width: getValue(stroke.width, feature),
          lineDash: getValue(stroke.linedash, feature),
          lineDashOffset: getValue(stroke.linedashoffset, feature),
          lineCap: getValue(stroke.linecap, feature),
          lineJoin: getValue(stroke.linejoin, feature),
          miterLimit: getValue(stroke.miterlimit, feature)
        }));
      }
      if (!M.utils.isNullOrEmpty(label)) {
        let textPathConfig = {
          text: getValue(label.text, feature) === undefined ? undefined : String(getValue(label.text, feature)),
          font: getValue(label.font, feature),
          fill: new ol.style.Fill({
            color: getValue(label.color || '#000000', feature)
          }),
          textBaseline: (getValue(label.baseline, feature) || '').toLowerCase(),
          textAlign: getValue(label.align, feature),
          rotateWithView: getValue(label.rotate, feature) || false,
          textOverflow: getValue(label.textoverflow, feature) || '',
          minWidth: getValue(label.minwidth, feature) || 0,
          geometry: getValue(label.geometry, feature),
          offsetX: M.impl.style.Simple.getValue(options.label.offset ? options.label.offset[0] : undefined, feature),
          offsetY: M.impl.style.Simple.getValue(options.label.offset ? options.label.offset[1] : undefined, feature),
        };
        let textPathStyle = new M.impl.style.TextPath(textPathConfig);
        if (!M.utils.isNullOrEmpty(label.stroke)) {
          textPathStyle.setStroke(new ol.style.Stroke({
            color: getValue(label.stroke.color, feature),
            width: getValue(label.stroke.width, feature),
            lineCap: getValue(label.stroke.linecap, feature),
            lineJoin: getValue(label.stroke.linejoin, feature),
            lineDash: getValue(label.stroke.linedash, feature),
            lineDashOffset: getValue(label.stroke.linedashoffset, feature),
            miterLimit: getValue(label.stroke.miterlimit, feature)
          }));
        }
        let applyPath = getValue(label.path, feature);
        // we will use a flag into de options object to set pathstyle or ol.text style
        if (typeof applyPath === 'boolean' && applyPath) {
          style.textPath = textPathStyle;
          if (!M.utils.isNullOrEmpty(label.smooth) && label.smooth === true && M.utils.isFunction(feature.getGeometry)) {
            style.setGeometry(feature.getGeometry().cspline());
          }
        }
        else {
          style.setText(textPathStyle);
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
   * This function apply style to layer
   * @public
   * @function
   * @param {M.layer.Vector} layer - Layer
   * @api stable
   */
  M.impl.style.Line.prototype.applyToLayer = function(layer) {
    goog.base(this, 'applyToLayer', layer);

    let olLayer = layer.getImpl().getOL3Layer();
    if (!M.utils.isNullOrEmpty(olLayer)) {
      this.postComposeEvtKey_ = olLayer.on('postcompose', M.impl.renderutils.postRender, olLayer);
    }
  };

  /**
   * This function apply style
   *
   * @function
   * @protected
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @api stable
   */
  M.impl.style.Line.prototype.unapply = function(layer) {
    ol.Observable.unByKey(this.postComposeEvtKey_);
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Line.prototype.drawGeometryToCanvas = function(vectorContext, canvas, style, stroke) {
    let x = this.getCanvasSize()[0];
    let y = this.getCanvasSize()[1];
    vectorContext.drawGeometry(new ol.geom.LineString([[0 + stroke / 2, 0 + stroke / 2], [(x / 3), (y / 2) - stroke / 2], [(2 * x / 3), 0 + stroke / 2], [x - stroke / 2, (y / 2) - stroke / 2]]));
    if (!M.utils.isNullOrEmpty(style)) {
      let width = style.width;
      var ctx = canvas.getContext("2d");
      ctx.lineWidth = style.width;
      x = vectorContext.context_.canvas.width;
      y = vectorContext.context_.canvas.height;
      ctx.strokeStyle = style.color;
      ctx.beginPath();
      ctx.lineTo(0 + width, 0 + width);
      ctx.lineTo((x / 3), (y / 2) - width);
      ctx.lineTo((2 * x / 3), 0 + (width));
      ctx.lineTo(x - width, (y / 2) - width);
      ctx.stroke();
    }
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Line.prototype.updateCanvas = function(canvas) {
    let canvasSize = this.getCanvasSize();
    let vectorContext = ol.render.toContext(canvas.getContext('2d'), {
      size: canvasSize
    });
    let optionsStyle;
    let style = this.olStyleFn_()[1];
    if (!M.utils.isNullOrEmpty(style) && !M.utils.isNullOrEmpty(style.getStroke())) {
      optionsStyle = {
        color: style.getStroke().getColor(),
        width: 1
      };
    }
    let applyStyle = this.olStyleFn_()[0];
    if (!M.utils.isNullOrEmpty(applyStyle.getText())) {
      applyStyle.setText(null);
    }
    let stroke = applyStyle.getStroke();
    let width;
    if (!M.utils.isNullOrEmpty(stroke)) {
      if (!M.utils.isNullOrEmpty(stroke.getWidth())) {
        width = stroke.getWidth();
        if (stroke.getWidth() > this.DEFAULT_WIDTH_LINE) {
          width = this.DEFAULT_WIDTH_LINE;
        }
      }
      else {
        width = 1;
      }
      optionsStyle = {
        color: applyStyle.getStroke().getColor(),
        width: width
      };
      applyStyle.getStroke().setWidth(width);
      vectorContext.setStyle(applyStyle);
    }
    this.drawGeometryToCanvas(vectorContext, canvas, optionsStyle, width);
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Line.prototype.getCanvasSize = function() {
    return [25, 15];
  };


  M.impl.style.Line.prototype.DEFAULT_WIDTH_LINE = 3;
})();
