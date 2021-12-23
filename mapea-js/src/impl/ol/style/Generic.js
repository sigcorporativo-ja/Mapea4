/**
 * @module M/impl/style/Generic
 */
import { isFunction, isUndefined, isDynamic, drawDynamicStyle } from 'M/util/Utils';
import OLFeature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import GeometryType from 'ol/geom/GeometryType';
import OLStyleIcon from 'ol/style/Icon';
import OLGeomPolygon from 'ol/geom/Polygon';
import OLGeomLineString from 'ol/geom/LineString';
import { toContext as toContextRender } from 'ol/render';
import OLStyleFontsSymbol from '../ext/OLStyleFontSymbol';
import Simple from './Simple';
import { getLineStyle, getPointStyle, getPolygonStyle } from './builder';

/**
 * @const
 * @type {object}
 */
const GETTER_BY_GEOM = {
  [GeometryType.POINT]: (...args) => getPointStyle(args[0].point, args[1], args[2]),
  [GeometryType.LINE_STRING]: (...args) => getLineStyle(args[0].line, args[1], args[2]),
  [GeometryType.POLYGON]: (...args) => getPolygonStyle(args[0].polygon, args[1], args[2]),
  [GeometryType.MULTI_POINT]: (...args) => getPointStyle(args[0].point, args[1], args[2]),
  [GeometryType.MULTI_LINE_STRING]: (...args) => getLineStyle(args[0].line, args[1], args[2]),
  [GeometryType.MULTI_POLYGON]: (...args) => getPolygonStyle(args[0].polygon, args[1], args[2]),
};


/**
 * @classdesc
 * @api
 */
class Generic extends Simple {
  /**
   * Main constructor of the class.
   * @constructor
   * @api stable
   */
  constructor(options = {}) {
    super(options);

    /**
     * @private
     * @type {object}
     */
    this.styles_ = {};
  }

  /**
   * This function returns data url to canvas
   *
   * @function
   * @public
   * @return {String} data url to canvas
   * @api
   */
  toImage() {
    const dinamic = drawDynamicStyle();
    const canvasGL = document.createElement('canvas');
    canvasGL.width = 200;
    canvasGL.height = 50;
    const ctxGL = canvasGL.getContext('2d');

    const positions = [0, 60, 120];
    let cont = 0;

    // point
    const imgPoint = new Image();
    imgPoint.width = 30;
    imgPoint.height = 30;
    if (!isUndefined(this.options_.point)) {
      if (isDynamic(this.options_.point) === true) {
        imgPoint.src = dinamic;
      } else {
        const getterPoint = GETTER_BY_GEOM.Point;
        const stylesPoint = getterPoint(this.options_, this, this.layer_);
        stylesPoint[0].getImage().setRadius(5);
        const imageURLPoint = stylesPoint[0].getImage().getImage(1).toDataURL();
        imgPoint.src = imageURLPoint;
      }
      ctxGL.drawImage(imgPoint, positions[cont], 0);
      cont += 1;
    }

    // polygon
    const imgPol = new Image();
    if (!isUndefined(this.options_.polygon)) {
      if (isDynamic(this.options_.polygon) === true) {
        imgPol.src = dinamic;
        imgPol.width = 30;
        imgPol.height = 30;
      } else {
        const getterPolygon = GETTER_BY_GEOM.Polygon;
        const stylesPolygon = getterPolygon(this.options_, this, this.layer_);
        const canvasPO = document.createElement('canvas');
        canvasPO.width = 30;
        canvasPO.height = 30;
        const ctxPO = canvasPO.getContext('2d');
        const vectorContextPol = toContextRender(ctxPO);
        vectorContextPol.setStyle(stylesPolygon[0], 0, 0);
        const canvasSize = [25, 15];
        const maxW = Math.floor(canvasSize[0]);
        const maxH = Math.floor(canvasSize[1]);
        const minW = (canvasSize[0] - maxW);
        const minH = (canvasSize[1] - maxH);
        vectorContextPol.drawGeometry(new OLGeomPolygon([
          [
            [minW + 3, minH + 3],
            [maxW - 3, minH + 3],
            [maxW - 3, maxH - 3],
            [minW + 3, maxH - 3],
            [minW + 3, minH + 3],
          ],
        ]));
        imgPol.src = canvasPO.toDataURL();
      }
      ctxGL.drawImage(imgPol, positions[cont], 0);
      cont += 1;
    }

    // linestring
    const imgLin = new Image();
    if (!isUndefined(this.options_.line)) {
      if (isDynamic(this.options_.line) === true) {
        imgLin.src = dinamic;
        imgLin.width = 30;
        imgLin.height = 30;
      } else {
        const getterLine = GETTER_BY_GEOM.LineString;
        const stylesLine = getterLine(this.options_, this, this.layer_);
        const canvasLI = document.createElement('canvas');
        canvasLI.width = 30;
        canvasLI.height = 30;
        const ctxLI = canvasLI.getContext('2d');
        const vectorContextLin = toContextRender(ctxLI);
        vectorContextLin.setStyle(stylesLine[0], 0, 0);
        const x = 25;
        const y = 15;
        const stroke = isUndefined(stylesLine[0].getStroke()) ?
          1.5 : stylesLine[0].getStroke().getWidth();
        vectorContextLin.drawGeometry(new OLGeomLineString([
          [0 + (stroke / 2), 0 + (stroke / 2)],
          [(x / 3), (y / 2) - (stroke / 2)],
          [(2 * x) / 3, 0 + (stroke / 2)],
          [x - (stroke / 2), (y / 2) - (stroke / 2)],
        ]));
        imgLin.src = canvasLI.toDataURL();
      }
      ctxGL.drawImage(imgLin, positions[cont], 0);
      cont += 1;
    }

    return canvasGL.toDataURL();
  }

  /**
   * This function se options to ol style
   *
   * @private
   * @param {object} options - options to style
   * @function
   * @api
   */
  updateFacadeOptions(options) {
    this.olStyleFn_ = (feature) => {
      const idFeature = JSON.stringify(feature.getProperties());
      let styles = [];
      this.styles_ = [];
      let featureVariable = feature;
      if (!(featureVariable instanceof OLFeature || featureVariable instanceof RenderFeature)) {
        featureVariable = this;
      } else {
        const type = featureVariable.getGeometry().getType();
        const getter = GETTER_BY_GEOM[type];

        if (isFunction(getter)) {
          styles = getter(options, featureVariable, this.layer_);
          this.styles_[idFeature] = styles;
        }
      }
      return styles;
    };
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  drawGeometryToCanvas(vectorContext) {}

  /**
   * This function updates the canvas of style of canvas
   *
   * @public
   * @function
   * @param {HTMLCanvasElement} canvas - canvas of style
   * @api
   */
  updateCanvas(canvas) {}

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  getCanvasSize() {
    return 0;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  getRadius_(image) {
    let r;
    if (image instanceof OLStyleIcon) {
      r = 25;
    } else if (image instanceof OLStyleFontsSymbol) {
      r = image.getRadius();
    } else {
      r = this.olStyleFn_()[0].getImage().getRadius();
    }

    return r;
  }
}


export default Generic;
