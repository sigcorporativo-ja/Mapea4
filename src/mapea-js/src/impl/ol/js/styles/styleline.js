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
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Line.prototype.drawGeometryToCanvas = function(vectorContext, canvas, style) {
    let x = this.getCanvasSize()[0];
    let y = this.getCanvasSize()[1];
    vectorContext.drawGeometry(new ol.geom.LineString([[0, (y / 4)], [x / 4, y / 2], [x / 2, y / 4], [(x * 3 / 4), y / 2]]));
    if (!M.utils.isNullOrEmpty(style)) {
      var ctx = canvas.getContext("2d");
      ctx.lineWidth = style.width;
      ctx.setLineDash([0, 0]);
      ctx.strokeStyle = style.color;
      ctx.beginPath();
      ctx.lineTo(0, (y / 4));
      ctx.lineTo(x / 4, y / 2);
      ctx.lineTo(x / 2, y / 4);
      ctx.lineTo((x * 3 / 4), y / 2);
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
    let opt_style = null;
    let style = this.olStyleFn_()[1];
    if (!M.utils.isNullOrEmpty(style) && !M.utils.isNullOrEmpty(style.getStroke())) {
      opt_style = {
        color: style.getStroke().getColor(),
        width: style.getStroke().getWidth()
      };
    }
    // let style = Object.assign(new ol.style.Style({}), this.olStyleFn_()[0]);
    // style.setText(null);
    vectorContext.setStyle(this.olStyleFn_()[0]);
    this.drawGeometryToCanvas(vectorContext, canvas, opt_style);
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
})();
