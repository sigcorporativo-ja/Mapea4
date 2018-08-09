import { isNullOrEmpty, isFunction } from 'facade/js/util/Utils';
import OLFeature from 'ol/Feature';
import OLStyleStroke from 'ol/style/Stroke';
import OLStyleFill from 'ol/style/Fill';
import { unByKey as unByKeyObservable } from 'ol/Observable';
import { toContext as toContextRender } from 'ol/render';
import OLGeomLineString from 'ol/geom/LineString';
import chroma from 'chroma-js';
import Centroid from './Centroid';
import Path from './Path';
import Simple from './Simple';
import Render from '../util/render';

/**
 * @namespace M.impl.style.Line
 *
 */

export default class Line extends Simple {
  /**
   * Main constructor of the class.
   * @constructor
   * @implements {M.impl.style.Simple}
   * @api stable
   */
  constructor(options) {
    super(options);
    this.olStyleFn_ = this.updateFacadeOptions(options);
  }

  /**
   * This function se options to ol style
   *
   * @public
   * @param {object} options - options to style
   * @function
   * @api stable
   */
  updateFacadeOptions(options) {
    return (feature) => {
      let featureVariable = feature;
      if (!(featureVariable instanceof OLFeature)) {
        featureVariable = this;
      }
      const stroke = options.stroke;
      const label = options.label;
      // const fill = options.fill;
      const style = new Centroid();
      const styleStroke = new Centroid();
      const getValue = Simple.getValue;
      if (!isNullOrEmpty(stroke)) {
        style.setStroke(new OLStyleStroke({
          color: getValue(stroke.color, featureVariable),
          width: getValue(stroke.width, featureVariable),
          lineDash: getValue(stroke.linedash, featureVariable),
          lineDashOffset: getValue(stroke.linedashoffset, featureVariable),
          lineCap: getValue(stroke.linecap, featureVariable),
          lineJoin: getValue(stroke.linejoin, featureVariable),
          miterLimit: getValue(stroke.miterlimit, featureVariable),
        }));
      }
      if (!isNullOrEmpty(label)) {
        const textPathConfig = {
          text: getValue(label.text, featureVariable) === undefined ?
            undefined : String(getValue(label.text, featureVariable)),
          font: getValue(label.font, featureVariable),
          fill: new OLStyleFill({
            color: getValue(label.color || '#000000', featureVariable),
          }),
          textBaseline: (getValue(label.baseline, featureVariable) || '').toLowerCase(),
          textAlign: getValue(label.align, featureVariable),
          rotateWithView: getValue(label.rotate, featureVariable) || false,
          textOverflow: getValue(label.textoverflow, featureVariable) || '',
          minWidth: getValue(label.minwidth, featureVariable) || 0,
          geometry: getValue(label.geometry, featureVariable),
          offsetX: getValue(options.label.offset ? options.label.offset[0] :
            undefined, featureVariable),
          offsetY: getValue(options.label.offset ? options.label.offset[1] :
            undefined, featureVariable),
        };
        const textPathStyle = new Path(textPathConfig);
        if (!isNullOrEmpty(label.stroke)) {
          textPathStyle.setStroke(new OLStyleStroke({
            color: getValue(label.stroke.color, featureVariable),
            width: getValue(label.stroke.width, featureVariable),
            lineCap: getValue(label.stroke.linecap, featureVariable),
            lineJoin: getValue(label.stroke.linejoin, featureVariable),
            lineDash: getValue(label.stroke.linedash, featureVariable),
            lineDashOffset: getValue(label.stroke.linedashoffset, featureVariable),
            miterLimit: getValue(label.stroke.miterlimit, featureVariable),
          }));
        }
        const applyPath = getValue(label.path, featureVariable);
        // we will use a flag into de options object to set pathstyle or ol.text style
        if (typeof applyPath === 'boolean' && applyPath) {
          style.textPath = textPathStyle;
          if (!isNullOrEmpty(label.smooth) && label.smooth === true &&
            isFunction(featureVariable.getGeometry)) {
            style.setGeometry(featureVariable.getGeometry().cspline());
          }
        } else {
          style.setText(textPathStyle);
        }
      }
      let fill;
      if (!isNullOrEmpty(options.fill)) {
        const fillColorValue = Simple.getValue(options.fill.color, featureVariable);
        const fillOpacityValue = Simple.getValue(options.fill.opacity, featureVariable) || 1;
        const widthValue = Simple.getValue(options.fill.width, featureVariable);
        if (!isNullOrEmpty(fillColorValue)) {
          fill = new OLStyleStroke({
            color: chroma(fillColorValue)
              .alpha(fillOpacityValue).css(),
            width: widthValue,
          });
        }
      }
      styleStroke.setStroke(fill);
      return [style, styleStroke];
    };
  }

  /**
   * This function apply style to layer
   * @public
   * @function
   * @param {M.layer.Vector} layer - Layer
   * @api stable
   */
  applyToLayer(layer) {
    super.applyToLayer(layer);

    const olLayer = layer.getImpl().getOL3Layer();
    if (!isNullOrEmpty(olLayer)) {
      this.postComposeEvtKey_ = olLayer.on('postcompose', Render.postRender, olLayer);
    }
  }

  /**
   * This function apply style
   *
   * @function
   * @protected
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @api stable
   */
  unapply() {
    unByKeyObservable.unByKey(this.postComposeEvtKey_);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  drawGeometryToCanvas(vectorContext, canvas, style, stroke) {
    let x = Line.getCanvasSize()[0];
    let y = Line.getCanvasSize()[1];
    vectorContext.drawGeometry(new OLGeomLineString([[0 + (stroke / 2), 0 + (stroke / 2)],
      [(x / 3), (y / 2) - (stroke / 2)],
      [(2 * x) / 3, 0 + (stroke / 2)],
      [x - (stroke / 2), (y / 2) - (stroke / 2)]]));
    if (!isNullOrEmpty(style)) {
      const width = style.width;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = style.width;
      x = vectorContext.context_.canvas.width;
      y = vectorContext.context_.canvas.height;
      ctx.strokeStyle = style.color;
      ctx.beginPath();
      ctx.lineTo(0 + width, 0 + width);
      ctx.lineTo((x / 3), (y / 2) - width);
      ctx.lineTo(((2 * x) / 3), 0 + (width));
      ctx.lineTo(x - width, (y / 2) - width);
      ctx.stroke();
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  updateCanvas(canvas) {
    const canvasSize = Line.getCanvasSize();
    const vectorContext = toContextRender(canvas.getContext('2d'), {
      size: canvasSize,
    });
    let optionsStyle;
    const style = this.olStyleFn_()[1];
    if (!isNullOrEmpty(style) && !isNullOrEmpty(style.getStroke())) {
      optionsStyle = {
        color: style.getStroke().getColor(),
        width: 1,
      };
    }
    const applyStyle = this.olStyleFn_()[0];
    if (!isNullOrEmpty(applyStyle.getText())) {
      applyStyle.setText(null);
    }
    const stroke = applyStyle.getStroke();
    let width;
    if (!isNullOrEmpty(stroke)) {
      if (!isNullOrEmpty(stroke.getWidth())) {
        width = stroke.getWidth();
        if (stroke.getWidth() > Line.DEFAULT_WIDTH_LINE) {
          width = Line.DEFAULT_WIDTH_LINE;
        }
      } else {
        width = 1;
      }
      optionsStyle = {
        color: applyStyle.getStroke().getColor(),
        width,
      };
      applyStyle.getStroke().setWidth(width);
      vectorContext.setStyle(applyStyle);
    }
    this.drawGeometryToCanvas(vectorContext, canvas, optionsStyle, width);
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  static getCanvasSize() {
    return [25, 15];
  }
}

Line.DEFAULT_WIDTH_LINE = 3;
