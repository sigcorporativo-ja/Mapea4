import Simple from "./Simple";
import Centroid from "./Centroid";
import Utils from "facade/js/util/Utils";
import PointFontSymbol from "../point/FontSymbol";
import PointIcon from "../point/Icon";
import Config from "configuration";
import Baseline from "facade/js/style/Baseline";
import Align from "facade/js/style/Align";

/**
 * @namespace Point
 */

export default class Point extends Simple {
  /**
   * Main constructor of the class.
   * @constructor
   * @implements {Simple}
   * @api stable
   */
  constructor(options) {
    super(options);
    this.olStyleFn_ = null;
  }

  /**
   * This function returns data url to canvas
   *
   * @function
   * @public
   * @return {String} data url to canvas
   * @api stable
   */
  toImage(canvas) {
    if (Utils.isNullOrEmpty(this.olStyleFn_)) {
      return null;
    }
    let style = this.olStyleFn_()[1];
    let image = null;
    if (style.getImage && style.getImage() != null && style.getImage() instanceof ol.style.Image) {
      // see https://github.com/openlayers/openlayers/blob/master/src/ol/style/regularshape.js#L205
      if (style.getImage() instanceof PointFontsSymbol) {
        let imageCanvas = style.getImage().getImage();
        if (imageCanvas != null && imageCanvas) {
          image = imageCanvas.toDataURL();
        }
      }
      else if (style.getImage() instanceof PointIcon) {
        let imageStyle = style.getImage();
        //let canvasSize = this.getCanvasSize();
        // canvasSize[0] / size[0]) * size[0]
        // let [size, scale] = [imageStyle.getSize(), imageStyle.getScale()];
        // ctx.drawImage(imageStyle.getImage(), 0, 0, ctx.canvas.height, ctx.canvas.width);
        if (!Utils.isNullOrEmpty(imageStyle)) {
          image = imageStyle.getSrc();
          if (!image.startsWith(window.location.origin)) {
            let proxyImageURL = Utils.concatUrlPaths([Config.PROXY_URL, "/image"]);
            image = Utils.addParameters(proxyImageURL, {
              "url": image
            });
          }
        }
      }
    }
    else {
      style = this.olStyleFn_()[0];
      if (style.getImage() != null && style.getImage().getStroke() != null) {
        if (style.getImage().getStroke().getWidth() > Point.DEFAULT_WIDTH_POINT) {
          style.getImage().getStroke().setWidth(Point.DEFAULT_WIDTH_POINT); // TODO @albertoibiza parametrize this value
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
  updateFacadeOptions(options) {
    this.olStyleFn_ = (feature, resolution) => {
      if (!(feature instanceof ol.Feature)) {
        resolution = feature;
        feature = this;
      }
      let style = new Centroid({
        zIndex: Simple.getValue(options.zindex, feature)
      });
      let styleIcon = new Centroid();
      let fill;
      if (!Utils.isNullOrEmpty(options.fill)) {
        let fillColorValue = Simple.getValue(options.fill.color, feature);
        let fillOpacityValue = Simple.getValue(options.fill.opacity, feature) || 1;
        if (!Utils.isNullOrEmpty(fillColorValue)) {
          fill = new ol.style.Fill({
            color: chroma(fillColorValue)
              .alpha(fillOpacityValue).css()
          });
        }
      }
      let stroke;
      if (!Utils.isNullOrEmpty(options.stroke)) {
        let strokeColorValue = Simple.getValue(options.stroke.color, feature);
        if (!Utils.isNullOrEmpty(strokeColorValue)) {
          stroke = new ol.style.Stroke({
            color: strokeColorValue,
            width: Simple.getValue(options.stroke.width, feature),
            lineDash: Simple.getValue(options.stroke.linedash, feature),
            lineDashOffset: Simple.getValue(options.stroke.linedashoffset, feature),
            lineCap: Simple.getValue(options.stroke.linecap, feature),
            lineJoin: Simple.getValue(options.stroke.linejoin, feature),
            miterLimit: Simple.getValue(options.stroke.miterlimit, feature)
          });
        }
      }
      if (!Utils.isNullOrEmpty(options.label)) {
        let textLabel = Simple.getValue(options.label.text, feature);
        let align = Simple.getValue(options.label.align, feature);
        let baseline = Simple.getValue(options.label.baseline, feature);
        let labelText = new ol.style.Text({
          font: Simple.getValue(options.label.font, feature),
          rotateWithView: Simple.getValue(options.label.rotate, feature),
          scale: Simple.getValue(options.label.scale, feature),
          offsetX: Simple.getValue(options.label.offset ? options.label.offset[0] : undefined, feature),
          offsetY: Simple.getValue(options.label.offset ? options.label.offset[1] : undefined, feature),
          fill: new ol.style.Fill({
            color: Simple.getValue(options.label.color || '#000000', feature)
          }),
          textAlign: Object.values(Align).includes(align) ? align : 'center',
          textBaseline: Object.values(Baseline).includes(baseline) ? baseline : 'top',
          text: textLabel === undefined ? undefined : String(textLabel),
          rotation: Simple.getValue(options.label.rotation, feature)
        });
        if (!Utils.isNullOrEmpty(options.label.stroke)) {
          labelText.setStroke(new ol.style.Stroke({
            color: Simple.getValue(options.label.stroke.color, feature),
            width: Simple.getValue(options.label.stroke.width, feature),
            lineCap: Simple.getValue(options.label.stroke.linecap, feature),
            lineJoin: Simple.getValue(options.label.stroke.linejoin, feature),
            lineDash: Simple.getValue(options.label.stroke.linedash, feature),
            lineDashOffset: Simple.getValue(options.label.stroke.linedashoffset, feature),
            miterLimit: Simple.getValue(options.label.stroke.miterlimit, feature)
          }));
        }
        style.setText(labelText);
      }
      style.setImage(new PointIcon({
        fill: fill,
        stroke: stroke,
        radius: Simple.getValue(options.radius, feature),
        snapToPixel: Simple.getValue(options.snapToPixel, feature),
        //forceGeometryRender: options.forceGeometryRender
      }));
      if (!Utils.isNullOrEmpty(options.icon)) {
        if (!Utils.isNullOrEmpty(options.icon.src)) {
          styleIcon.setImage(new PointIcon({
            anchor: Simple.getValue(options.icon.anchor, feature),
            anchorXUnits: Simple.getValue(options.icon.anchorxunits, feature),
            anchorYUnits: Simple.getValue(options.icon.anchoryunits, feature),
            src: Simple.getValue(options.icon.src, feature),
            opacity: Simple.getValue(options.icon.opacity, feature),
            scale: Simple.getValue(options.icon.scale, feature),
            rotation: Simple.getValue(options.icon.rotation, feature),
            rotateWithView: Simple.getValue(options.icon.rotate, feature),
            snapToPixel: Simple.getValue(options.icon.snaptopixel, feature),
            offsetOrigin: Simple.getValue(options.icon.offsetorigin, feature),
            offset: Simple.getValue(options.icon.offset, feature),
            crossOrigin: Simple.getValue(options.icon.crossorigin, feature),
            anchorOrigin: Simple.getValue(options.icon.anchororigin, feature),
            size: Simple.getValue(options.icon.size, feature),
          }));
        }
        else if (!Utils.isNullOrEmpty(options.icon.form)) {
          styleIcon.setImage(new PointFontSymbol({
            form: Utils.isNullOrEmpty(Simple.getValue(options.icon.form, feature)) ? "" : Simple.getValue(options.icon.form, feature).toLowerCase(),
            gradient: Simple.getValue(options.icon.gradient, feature),
            glyph: Simple.getValue(options.icon.class, feature),
            fontSize: Simple.getValue(options.icon.fontsize, feature),
            radius: Simple.getValue(options.icon.radius, feature),
            rotation: Simple.getValue(options.icon.rotation, feature),
            rotateWithView: Simple.getValue(options.icon.rotate, feature),
            offsetX: Simple.getValue(options.icon.offset ? options.icon.offset[0] : undefined, feature),
            offsetY: Simple.getValue(options.icon.offset ? options.icon.offset[1] : undefined, feature),
            fill: new ol.style.Fill({
              color: Simple.getValue(options.icon.fill, feature)
            }),
            stroke: options.icon.gradientcolor ? new ol.style.Stroke({
              color: Simple.getValue(options.icon.gradientcolor, feature),
              width: 1
            }) : undefined,
            anchor: Simple.getValue(options.icon.anchor, feature),
            anchorXUnits: Simple.getValue(options.icon.anchorxunits, feature),
            anchorYUnits: Simple.getValue(options.icon.anchoryunits, feature),
            src: Simple.getValue(options.icon.src, feature),
            opacity: Simple.getValue(options.icon.opacity, feature),
            scale: Simple.getValue(options.icon.scale, feature),
            snapToPixel: Simple.getValue(options.icon.snaptopixel, feature),
            offsetOrigin: Simple.getValue(options.icon.offsetorigin, feature),
            offset: Simple.getValue(options.icon.offset, feature),
            crossOrigin: Simple.getValue(options.icon.crossorigin, feature),
            anchorOrigin: Simple.getValue(options.icon.anchororigin, feature),
            size: Simple.getValue(options.icon.size, feature),
            //forceGeometryRender: options.forceGeometryRender
          }));
        }
      }
      return [style, styleIcon];
    };
  }
  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  drawGeometryToCanvas(vectorContext) {
    if (this.olStyleFn_()[1].getImage() instanceof ol.style.FontSymbol) {
      vectorContext.drawGeometry(new ol.geom.Point([10, 10]));
    }
    else {
      vectorContext.drawCircle(new ol.geom.Circle([this.getCanvasSize()[0] / 2, this.getCanvasSize()[1] / 2], this.getRadius_()));
    }

  }

  /**
   * This function updates the canvas of style of canvas
   *
   * @public
   * @function
   * @param {HTMLCanvasElement} canvas - canvas of style
   * @api stable
   */
  updateCanvas(canvas) {
    let canvasSize = this.getCanvasSize();
    let vectorContext = ol.render.toContext(canvas.getContext('2d'), {
      size: canvasSize
    });
    let applyStyle = this.olStyleFn_()[0];
    if (!Utils.isNullOrEmpty(applyStyle.getText())) {
      applyStyle.setText(null);
    }
    if (!Utils.isNullOrEmpty(this.olStyleFn_()[1]) && this.olStyleFn_()[1].getImage() instanceof ol.style.FontSymbol) {
      applyStyle = this.olStyleFn_()[1];
    }
    let stroke = applyStyle.getImage().getStroke();
    if (!Utils.isNullOrEmpty(stroke) && !Utils.isNullOrEmpty(stroke.getWidth())) {
      stroke.setWidth(3);
    }
    vectorContext.setStyle(applyStyle);
    this.drawGeometryToCanvas(vectorContext);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getCanvasSize() {
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
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getRadius_(image) {
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
  }
}
Point.DEFAULT_WIDTH_POINT = 3;
