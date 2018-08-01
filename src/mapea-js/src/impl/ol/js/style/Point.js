import chroma from 'chroma-js';
import Config from 'configuration';
import Baseline from 'facade/js/style/Baseline';
import Align from 'facade/js/style/Align';
import Utils from 'facade/js/util/Utils';
import Simple from './Simple';
import Centroid from './Centroid';
import PointFontSymbol from '../point/FontSymbol';
import PointIcon from '../point/Icon';
import PointCircle from '../point/Circle';

/**
 * @namespace Point
 */

export default class Point extends Simple {
  /**
   * This function returns data url to canvas
   *
   * @function
   * @public
   * @return {String} data url to canvas
   * @api stable
   */
  toImage() {
    if (Utils.isNullOrEmpty(this.olStyleFn_)) {
      return null;
    }
    let style = this.olStyleFn_()[1];
    let image = null;
    if (style.getImage && style.getImage() != null && style.getImage() instanceof ol.style.Image) {
      // see https://github.com/openlayers/openlayers/blob/master/src/ol/style/regularshape.js#L205
      if (style.getImage() instanceof PointFontSymbol) {
        const imageCanvas = style.getImage().getImage();
        if (imageCanvas != null && imageCanvas) {
          image = imageCanvas.toDataURL();
        }
      }
      else if (style.getImage() instanceof PointIcon) {
        const imageStyle = style.getImage();
        // let canvasSize = this.getCanvasSize();
        // canvasSize[0] / size[0]) * size[0]
        // let [size, scale] = [imageStyle.getSize(), imageStyle.getScale()];
        // ctx.drawImage(imageStyle.getImage(), 0, 0, ctx.canvas.height, ctx.canvas.width);
        if (!Utils.isNullOrEmpty(imageStyle)) {
          image = imageStyle.getSrc();
          if (!image.startsWith(window.location.origin)) {
            const proxyImageURL = Utils.concatUrlPaths([Config.PROXY_URL, '/image']);
            image = Utils.addParameters(proxyImageURL, {
              url: image,
            });
          }
        }
      }
    }
    else {
      style = this.olStyleFn_()[0];
      if (style.getImage() != null && style.getImage().getStroke() != null) {
        if (style.getImage().getStroke().getWidth() > Point.DEFAULT_WIDTH_POINT) {
          style.getImage().getStroke().setWidth(Point.DEFAULT_WIDTH_POINT);
        }
        style.getImage().render();
      }
      const imageCanvas = style.getImage().getImage();
      if (imageCanvas != null) {
        image = imageCanvas.toDataURL();
      }
    }
    return image;
  }

  /**
   * This function se options to ol style
   *
   * @private
   * @param {object} options - options to style
   * @function
   * @api stable
   */
  updateFacadeOptions(options) {
    this.olStyleFn_ = (feature) => {
      let featureVariable = feature;
      if (!(featureVariable instanceof ol.Feature)) {
        featureVariable = this;
      }
      const style = new Centroid({
        zIndex: Simple.getValue(options.zindex, featureVariable),
      });
      const styleIcon = new Centroid();
      let fill;
      if (!Utils.isNullOrEmpty(options.fill)) {
        const fillColorValue = Simple.getValue(options.fill.color, featureVariable);
        const fillOpacityValue = Simple.getValue(options.fill.opacity, featureVariable) || 1;
        if (!Utils.isNullOrEmpty(fillColorValue)) {
          fill = new ol.style.Fill({
            color: chroma(fillColorValue)
              .alpha(fillOpacityValue).css(),
          });
        }
      }
      let stroke;
      if (!Utils.isNullOrEmpty(options.stroke)) {
        const strokeColorValue = Simple.getValue(options.stroke.color, featureVariable);
        if (!Utils.isNullOrEmpty(strokeColorValue)) {
          stroke = new ol.style.Stroke({
            color: strokeColorValue,
            width: Simple.getValue(options.stroke.width, featureVariable),
            lineDash: Simple.getValue(options.stroke.linedash, featureVariable),
            lineDashOffset: Simple.getValue(options.stroke.linedashoffset, featureVariable),
            lineCap: Simple.getValue(options.stroke.linecap, featureVariable),
            lineJoin: Simple.getValue(options.stroke.linejoin, featureVariable),
            miterLimit: Simple.getValue(options.stroke.miterlimit, featureVariable),
          });
        }
      }
      if (!Utils.isNullOrEmpty(options.label)) {
        const textLabel = Simple.getValue(options.label.text, featureVariable);
        const align = Simple.getValue(options.label.align, featureVariable);
        const baseline = Simple.getValue(options.label.baseline, featureVariable);
        const labelText = new ol.style.Text({
          font: Simple.getValue(options.label.font, featureVariable),
          rotateWithView: Simple.getValue(options.label.rotate, featureVariable),
          scale: Simple.getValue(options.label.scale, featureVariable),
          offsetX: Simple.getValue(options.label.offset ?
            options.label.offset[0] : undefined, featureVariable),
          offsetY: Simple.getValue(options.label.offset ?
            options.label.offset[1] : undefined, featureVariable),
          fill: new ol.style.Fill({
            color: Simple.getValue(options.label.color || '#000000', featureVariable),
          }),
          textAlign: Object.values(Align).includes(align) ? align : 'center',
          textBaseline: Object.values(Baseline).includes(baseline) ? baseline : 'top',
          text: textLabel === undefined ? undefined : String(textLabel),
          rotation: Simple.getValue(options.label.rotation, featureVariable),
        });
        if (!Utils.isNullOrEmpty(options.label.stroke)) {
          labelText.setStroke(new ol.style.Stroke({
            color: Simple.getValue(options.label.stroke.color, featureVariable),
            width: Simple.getValue(options.label.stroke.width, featureVariable),
            lineCap: Simple.getValue(options.label.stroke.linecap, featureVariable),
            lineJoin: Simple.getValue(options.label.stroke.linejoin, featureVariable),
            lineDash: Simple.getValue(options.label.stroke.linedash, featureVariable),
            lineDashOffset: Simple.getValue(options.label.stroke.linedashoffset, featureVariable),
            miterLimit: Simple.getValue(options.label.stroke.miterlimit, featureVariable),
          }));
        }
        style.setText(labelText);
      }
      style.setImage(new PointCircle({
        fill,
        stroke,
        radius: Simple.getValue(options.radius, featureVariable),
        snapToPixel: Simple.getValue(options.snapToPixel, featureVariable),
        // forceGeometryRender: options.forceGeometryRender
      }));
      if (!Utils.isNullOrEmpty(options.icon)) {
        if (!Utils.isNullOrEmpty(options.icon.src)) {
          styleIcon.setImage(new PointIcon({
            anchor: Simple.getValue(options.icon.anchor, featureVariable),
            anchorXUnits: Simple.getValue(options.icon.anchorxunits, featureVariable),
            anchorYUnits: Simple.getValue(options.icon.anchoryunits, featureVariable),
            src: Simple.getValue(options.icon.src, featureVariable),
            opacity: Simple.getValue(options.icon.opacity, featureVariable),
            scale: Simple.getValue(options.icon.scale, featureVariable),
            rotation: Simple.getValue(options.icon.rotation, featureVariable),
            rotateWithView: Simple.getValue(options.icon.rotate, featureVariable),
            snapToPixel: Simple.getValue(options.icon.snaptopixel, featureVariable),
            offsetOrigin: Simple.getValue(options.icon.offsetorigin, featureVariable),
            offset: Simple.getValue(options.icon.offset, featureVariable),
            crossOrigin: Simple.getValue(options.icon.crossorigin, featureVariable),
            anchorOrigin: Simple.getValue(options.icon.anchororigin, featureVariable),
            size: Simple.getValue(options.icon.size, featureVariable),
          }));
        }
        else if (!Utils.isNullOrEmpty(options.icon.form)) {
          styleIcon.setImage(new PointFontSymbol({
            form: Utils.isNullOrEmpty(Simple.getValue(options.icon.form, featureVariable)) ? '' : Simple.getValue(options.icon.form, featureVariable).toLowerCase(),
            gradient: Simple.getValue(options.icon.gradient, featureVariable),
            glyph: Simple.getValue(options.icon.class, featureVariable),
            fontSize: Simple.getValue(options.icon.fontsize, featureVariable),
            radius: Simple.getValue(options.icon.radius, featureVariable),
            rotation: Simple.getValue(options.icon.rotation, featureVariable),
            rotateWithView: Simple.getValue(options.icon.rotate, featureVariable),
            offsetX: Simple.getValue(options.icon.offset ?
              options.icon.offset[0] : undefined, featureVariable),
            offsetY: Simple.getValue(options.icon.offset ?
              options.icon.offset[1] : undefined, featureVariable),
            fill: new ol.style.Fill({
              color: Simple.getValue(options.icon.fill, featureVariable),
            }),
            stroke: options.icon.gradientcolor ? new ol.style.Stroke({
              color: Simple.getValue(options.icon.gradientcolor, featureVariable),
              width: 1,
            }) : undefined,
            anchor: Simple.getValue(options.icon.anchor, featureVariable),
            anchorXUnits: Simple.getValue(options.icon.anchorxunits, featureVariable),
            anchorYUnits: Simple.getValue(options.icon.anchoryunits, featureVariable),
            src: Simple.getValue(options.icon.src, featureVariable),
            opacity: Simple.getValue(options.icon.opacity, featureVariable),
            scale: Simple.getValue(options.icon.scale, featureVariable),
            snapToPixel: Simple.getValue(options.icon.snaptopixel, featureVariable),
            offsetOrigin: Simple.getValue(options.icon.offsetorigin, featureVariable),
            offset: Simple.getValue(options.icon.offset, featureVariable),
            crossOrigin: Simple.getValue(options.icon.crossorigin, featureVariable),
            anchorOrigin: Simple.getValue(options.icon.anchororigin, featureVariable),
            size: Simple.getValue(options.icon.size, featureVariable),
            // forceGeometryRender: options.forceGeometryRender
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
      vectorContext.drawCircle(new ol.geom.Circle([this.getCanvasSize()[0] / 2,
        this.getCanvasSize()[1] / 2], this.getRadius_()));
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
    const canvasSize = this.getCanvasSize();
    const vectorContext = ol.render.toContext(canvas.getContext('2d'), {
      size: canvasSize,
    });
    let applyStyle = this.olStyleFn_()[0];
    if (!Utils.isNullOrEmpty(applyStyle.getText())) {
      applyStyle.setText(null);
    }
    if (!Utils.isNullOrEmpty(this.olStyleFn_()[1]) &&
      this.olStyleFn_()[1].getImage() instanceof ol.style.FontSymbol) {
      applyStyle = this.olStyleFn_()[1];
    }
    const stroke = applyStyle.getImage().getStroke();
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
    const image = this.olStyleFn_()[1].getImage();
    let size;
    if (image instanceof ol.style.FontSymbol) {
      size = [90, 90];
    }
    else {
      const radius = this.getRadius_(image);
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
    else if (image instanceof ol.style.FontSymbol) {
      r = image.getRadius();
    }
    else {
      r = this.olStyleFn_()[0].getImage().getRadius();
    }

    return r;
  }
}
Point.DEFAULT_WIDTH_POINT = 3;