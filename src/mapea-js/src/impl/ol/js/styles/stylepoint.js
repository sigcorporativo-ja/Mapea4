goog.provide('M.impl.style.Point');

goog.require('M.impl.style.Simple');
goog.require('M.impl.style.CentroidStyle');
goog.require('M.impl.style.PointCircle');
goog.require('M.impl.style.PointIcon');
goog.require('M.impl.style.PointFontSymbol');

/**
 * @namespace M.impl.style.Point
 */

(function() {
  /**
   * Main constructor of the class.
   * @constructor
   * @implements {M.impl.style.Simple}
   * @api stable
   */
  M.impl.style.Point = (function(options) {
    this.olStyleFn_ = null;
    goog.base(this, options);
  });
  goog.inherits(M.impl.style.Point, M.impl.style.Simple);

  /**
   * This function returns data url to canvas
   *
   * @function
   * @public
   * @return {String} data url to canvas
   * @api stable
   */
  M.impl.style.Point.prototype.toImage = function(canvas) {
    if (M.utils.isNullOrEmpty(this.olStyleFn_)) {
      return null;
    }
    let style = this.olStyleFn_()[1];
    let image = null;
    if (style.getImage && style.getImage() != null && style.getImage() instanceof ol.style.Image) {
      // see https://github.com/openlayers/openlayers/blob/master/src/ol/style/regularshape.js#L205
      if (style.getImage() instanceof M.impl.style.PointFontSymbol) {
        let imageCanvas = style.getImage().getImage();
        if (imageCanvas != null && imageCanvas) {
          image = imageCanvas.toDataURL();
        }
      }
      else if (style.getImage() instanceof M.impl.style.PointIcon) {
        let imageStyle = style.getImage();
        let ctx = canvas.getContext('2d');
        //let canvasSize = this.getCanvasSize();
        // canvasSize[0] / size[0]) * size[0]
        // let [size, scale] = [imageStyle.getSize(), imageStyle.getScale()];
        ctx.drawImage(imageStyle.getImage(), 0, 0, ctx.canvas.height, ctx.canvas.width);
        image = canvas.toDataURL('png');
      }
    }
    else {
      style = this.olStyleFn_()[0];
      if (style.getImage() != null && style.getImage().getStroke() != null) {
        if (style.getImage().getStroke().getWidth() > this.DEFAULT_WIDTH_POINT) {
          style.getImage().getStroke().setWidth(this.DEFAULT_WIDTH_POINT); // TODO @albertoibiza parameterize this value
        }
        style.getImage().render_();
      }
      let imageCanvas = style.getImage().getImage();
      if (imageCanvas != null) {
        image = imageCanvas.toDataURL();
      }
    }
    return image;
  };

  /**
   * This function se options to ol style
   *
   * @private
   * @param {object} options - options to style
   * @function
   * @api stable
   */
  M.impl.style.Point.prototype.updateFacadeOptions = function(options) {
    this.olStyleFn_ = function(feature, resolution) {
      if (!(feature instanceof ol.Feature)) {
        resolution = feature;
        feature = this;
      }
      let style = new M.impl.style.CentroidStyle({
        zIndex: M.impl.style.Simple.getValue(options.zindex, feature)
      });
      let styleIcon = new M.impl.style.CentroidStyle();
      let fill;
      if (!M.utils.isNullOrEmpty(options.fill)) {
        let fillColorValue = M.impl.style.Simple.getValue(options.fill.color, feature);
        let fillOpacityValue = M.impl.style.Simple.getValue(options.fill.opacity, feature) || 1;
        if (!M.utils.isNullOrEmpty(fillColorValue)) {
          fill = new ol.style.Fill({
            color: chroma(fillColorValue)
              .alpha(fillOpacityValue).css()
          });
        }
      }
      let stroke;
      if (!M.utils.isNullOrEmpty(options.stroke)) {
        let strokeColorValue = M.impl.style.Simple.getValue(options.stroke.color, feature);
        if (!M.utils.isNullOrEmpty(strokeColorValue)) {
          stroke = new ol.style.Stroke({
            color: strokeColorValue,
            width: M.impl.style.Simple.getValue(options.stroke.width, feature),
            lineDash: M.impl.style.Simple.getValue(options.stroke.linedash, feature),
            lineDashOffset: M.impl.style.Simple.getValue(options.stroke.linedashoffset, feature),
            lineCap: M.impl.style.Simple.getValue(options.stroke.linecap, feature),
            lineJoin: M.impl.style.Simple.getValue(options.stroke.linejoin, feature),
            miterLimit: M.impl.style.Simple.getValue(options.stroke.miterlimit, feature)
          });
        }
      }
      if (!M.utils.isNullOrEmpty(options.label)) {
        let labelText = new ol.style.Text({
          font: M.impl.style.Simple.getValue(options.label.font, feature),
          rotateWithView: M.impl.style.Simple.getValue(options.label.rotate, feature),
          scale: M.impl.style.Simple.getValue(options.label.scale, feature),
          offsetX: M.impl.style.Simple.getValue(options.label.offset ? options.label.offset[0] : undefined, feature),
          offsetY: M.impl.style.Simple.getValue(options.label.offset ? options.label.offset[1] : undefined, feature),
          fill: new ol.style.Fill({
            color: M.impl.style.Simple.getValue(options.label.color || '#000000', feature)
          }),
          textAlign: M.impl.style.Simple.getValue(options.label.align, feature),
          textBaseline: (M.impl.style.Simple.getValue(options.label.baseline, feature) || "").toLowerCase(),
          text: M.impl.style.Simple.getValue(options.label.text, feature),
          rotation: M.impl.style.Simple.getValue(options.label.rotation, feature)
        });
        if (!M.utils.isNullOrEmpty(options.label.stroke)) {
          labelText.setStroke(new ol.style.Stroke({
            color: M.impl.style.Simple.getValue(options.label.stroke.color, feature),
            width: M.impl.style.Simple.getValue(options.label.stroke.width, feature),
            lineCap: M.impl.style.Simple.getValue(options.label.stroke.linecap, feature),
            lineJoin: M.impl.style.Simple.getValue(options.label.stroke.linejoin, feature),
            lineDash: M.impl.style.Simple.getValue(options.label.stroke.linedash, feature),
            lineDashOffset: M.impl.style.Simple.getValue(options.label.stroke.linedashoffset, feature),
            miterLimit: M.impl.style.Simple.getValue(options.label.stroke.miterlimit, feature)
          }));
        }
        style.setText(labelText);
      }
      style.setImage(new M.impl.style.PointCircle({
        fill: fill,
        stroke: stroke,
        radius: M.impl.style.Simple.getValue(options.radius, feature),
        snapToPixel: M.impl.style.Simple.getValue(options.snapToPixel, feature),
        //forceGeometryRender: options.forceGeometryRender
      }));
      if (!M.utils.isNullOrEmpty(options.icon)) {
        if (!M.utils.isNullOrEmpty(options.icon.src)) {
          styleIcon.setImage(new M.impl.style.PointIcon({
            anchor: M.impl.style.Simple.getValue(options.icon.anchor, feature),
            anchorXUnits: M.impl.style.Simple.getValue(options.icon.anchorxunits, feature),
            anchorYUnits: M.impl.style.Simple.getValue(options.icon.anchoryunits, feature),
            src: M.impl.style.Simple.getValue(options.icon.src, feature),
            opacity: M.impl.style.Simple.getValue(options.icon.opacity, feature),
            scale: M.impl.style.Simple.getValue(options.icon.scale, feature),
            rotation: M.impl.style.Simple.getValue(options.icon.rotation, feature),
            rotateWithView: M.impl.style.Simple.getValue(options.icon.rotate, feature),
            snapToPixel: M.impl.style.Simple.getValue(options.icon.snaptopixel, feature),
            offsetOrigin: M.impl.style.Simple.getValue(options.icon.offsetorigin, feature),
            offset: M.impl.style.Simple.getValue(options.icon.offset, feature),
            crossOrigin: M.impl.style.Simple.getValue(options.icon.crossorigin, feature),
            anchorOrigin: M.impl.style.Simple.getValue(options.icon.anchororigin, feature),
            size: M.impl.style.Simple.getValue(options.icon.size, feature),
            //forceGeometryRender: options.forceGeometryRender
          }));
        }
        else {
          styleIcon.setImage(new M.impl.style.PointFontSymbol({
            form: M.impl.style.Simple.getValue(options.icon.form, feature).toLowerCase(),
            gradient: M.impl.style.Simple.getValue(options.icon.gradient, feature),
            glyph: M.impl.style.Simple.getValue(options.icon.class, feature),
            fontSize: M.impl.style.Simple.getValue(options.icon.fontsize, feature),
            radius: M.impl.style.Simple.getValue(options.icon.radius, feature),
            rotation: M.impl.style.Simple.getValue(options.icon.rotation, feature),
            rotateWithView: M.impl.style.Simple.getValue(options.icon.rotate, feature),
            offsetX: M.impl.style.Simple.getValue(options.icon.offset ? options.icon.offset[0] : undefined, feature),
            offsetY: M.impl.style.Simple.getValue(options.icon.offset ? options.icon.offset[1] : undefined, feature),
            fill: new ol.style.Fill({
              color: M.impl.style.Simple.getValue(options.icon.fill, feature)
            }),
            stroke: options.icon.gradientcolor ? new ol.style.Stroke({
              color: M.impl.style.Simple.getValue(options.icon.gradientcolor, feature),
              width: 1
            }) : undefined,
            anchor: M.impl.style.Simple.getValue(options.icon.anchor, feature),
            anchorXUnits: M.impl.style.Simple.getValue(options.icon.anchorxunits, feature),
            anchorYUnits: M.impl.style.Simple.getValue(options.icon.anchoryunits, feature),
            src: M.impl.style.Simple.getValue(options.icon.src, feature),
            opacity: M.impl.style.Simple.getValue(options.icon.opacity, feature),
            scale: M.impl.style.Simple.getValue(options.icon.scale, feature),
            snapToPixel: M.impl.style.Simple.getValue(options.icon.snaptopixel, feature),
            offsetOrigin: M.impl.style.Simple.getValue(options.icon.offsetorigin, feature),
            offset: M.impl.style.Simple.getValue(options.icon.offset, feature),
            crossOrigin: M.impl.style.Simple.getValue(options.icon.crossorigin, feature),
            anchorOrigin: M.impl.style.Simple.getValue(options.icon.anchororigin, feature),
            size: M.impl.style.Simple.getValue(options.icon.size, feature),
            //forceGeometryRender: options.forceGeometryRender
          }));
        }
      }
      return [style, styleIcon];
    };
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Point.prototype.drawGeometryToCanvas = function(vectorContext) {
    if (this.olStyleFn_()[1].getImage() instanceof ol.style.FontSymbol) {
      vectorContext.drawGeometry(new ol.geom.Point([10, 10]));
    }
    else {
      vectorContext.drawCircle(new ol.geom.Circle([this.getCanvasSize()[0] / 2, this.getCanvasSize()[1] / 2], this.getRadius_()));
    }

  };

  /**
   * This function updates the canvas of style of canvas
   *
   * @public
   * @function
   * @param {HTMLCanvasElement} canvas - canvas of style
   * @api stable
   */
  M.impl.style.Point.prototype.updateCanvas = function(canvas) {
    let canvasSize = this.getCanvasSize();
    let vectorContext = ol.render.toContext(canvas.getContext('2d'), {
      size: canvasSize
    });
    let applyStyle = this.olStyleFn_()[0];
    if (!M.utils.isNullOrEmpty(applyStyle.getText())) {
      applyStyle.setText(null);
    }
    if (!M.utils.isNullOrEmpty(this.olStyleFn_()[1]) && this.olStyleFn_()[1].getImage() instanceof ol.style.FontSymbol) {
      applyStyle = this.olStyleFn_()[1];
    }
    let stroke = applyStyle.getImage().getStroke();
    if (!M.utils.isNullOrEmpty(stroke) && !M.utils.isNullOrEmpty(stroke.getWidth())) {
      stroke.setWidth(3);
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
  M.impl.style.Point.prototype.getCanvasSize = function() {
    let image = this.olStyleFn_()[1].getImage();
    let size;
    if (image instanceof ol.style.FontSymbol) {
      size = [90, 90];
    }
    else {
      let radius = this.getRadius_(image);
      size = [(radius * 2) + 4, (radius * 2) + 4];
    }
    return size;
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Point.prototype.getRadius_ = function(image) {
    let r;
    if (image instanceof ol.style.Icon) {
      r = 25;
    }
    else {
      if (image instanceof ol.style.FontSymbol) {
        r = image.getRadius();
      }
      else {
        r = this.olStyleFn_()[0].getImage().getRadius();
      }
    }
    return r;
  };

  M.impl.style.Point.prototype.DEFAULT_WIDTH_POINT = 3;

})();
