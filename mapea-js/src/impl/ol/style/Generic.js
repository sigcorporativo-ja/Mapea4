/**
 * @module M/impl/style/Generic
 */
import {
  isFunction, isUndefined, isDynamic, drawDynamicStyle, concatUrlPaths, addParameters, getImageSize,
} from 'M/util/Utils';
import OLFeature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
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
  Point: (...args) => getPointStyle(args[0].point, args[1], args[2]),
  LineString: (...args) => getLineStyle(args[0].line, args[1], args[2]),
  Polygon: (...args) => getPolygonStyle(args[0].polygon, args[1], args[2]),
  MultiPoint: (...args) => getPointStyle(args[0].point, args[1], args[2]),
  MultiLineString: (...args) => getLineStyle(args[0].line, args[1], args[2]),
  MultiPolygon: (...args) => getPolygonStyle(args[0].polygon, args[1], args[2]),
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
    const imgSizeWidth = 30;
    const imgSizeHeight = 10;
    let loadImagePoint = null;
    let loadImagePoly = null;
    let loadImageLine = null;
    const dinamic = drawDynamicStyle();
    const promises = [];

    // Polygon image
    if (!isUndefined(this.options_.polygon)) {
      loadImagePoly = (d) => new Promise((resolve, reject) => {
        const img = new Image();

        // onload / onerror
        img.onload = () => resolve(img);
        img.onerror = reject;

        // img

        const optionsMod = { ...this.options_ };
        delete optionsMod.label;
        if (isDynamic(optionsMod) === true) {
          img.src = d;
          img.width = imgSizeWidth;
          img.height = imgSizeWidth;
        } else {
          const getterPolygon = GETTER_BY_GEOM.Polygon;
          const stylesPolygon = getterPolygon(this.options_, this, this.layer_);
          const canvasPolygon = document.createElement('canvas');
          canvasPolygon.width = 30;
          canvasPolygon.height = 10;
          const contextPolygon = canvasPolygon.getContext('2d');
          const vectorContextPol = toContextRender(contextPolygon);
          vectorContextPol.setStyle(stylesPolygon[0], 0, 0);
          const canvasSize = [20, 7];
          const maxW = Math.floor(canvasSize[0]);
          const maxH = Math.floor(canvasSize[1]);
          const minW = (canvasSize[0] - maxW);
          const minH = (canvasSize[1] - maxH);
          vectorContextPol.drawGeometry(new OLGeomPolygon([
            [
              [minW + 1, minH + 1],
              [maxW - 1, minH + 1],
              [maxW - 1, maxH - 1],
              [minW + 1, maxH - 1],
              [minW + 1, minH + 1],
            ],
          ]));
          img.src = canvasPolygon.toDataURL();
        }
      });
      promises.push(loadImagePoly(dinamic));
    }

    // Line image
    if (!isUndefined(this.options_.line)) {
      loadImageLine = (d) => new Promise((resolve, reject) => {
        const img = new Image();

        // onload / onerror
        img.onload = () => resolve(img);
        img.onerror = reject;

        // img
        if (isDynamic(this.options_.line) === true) {
          img.src = d;
          img.width = 30;
          img.height = 30;
        } else {
          const getterLine = GETTER_BY_GEOM.LineString;
          const stylesLine = getterLine(this.options_, this, this.layer_);
          const canvasLine = document.createElement('canvas');
          canvasLine.width = 30;
          canvasLine.height = 15;
          const contextLine = canvasLine.getContext('2d');
          const vectorContextLin = toContextRender(contextLine);
          vectorContextLin.setStyle(stylesLine[0], 0, 0);
          const x = 20;
          const y = 10;
          const stroke = isUndefined(stylesLine[0].getStroke())
            ? 1.5 : stylesLine[0].getStroke().getWidth();
          vectorContextLin.drawGeometry(new OLGeomLineString([
            [0 + (stroke / 2), 0 + (stroke / 2)],
            [(x / 3), (y / 2) - (stroke / 2)],
            [(2 * x) / 3, 0 + (stroke / 2)],
            [x - (stroke / 2), (y / 2) - (stroke / 2)],
          ]));
          img.src = canvasLine.toDataURL();
        }
      });
      promises.push(loadImageLine(dinamic));
    }

    // Point image
    if (!isUndefined(this.options_.point)) {
      loadImagePoint = (d) => new Promise((resolve, reject) => {
        const img = new Image();
        if (this.options_.point.icon) {
          if (this.options_.point.icon.src) {
            if (!this.options_.point.icon.src.startsWith(window.location.origin)) {
              getImageSize(this.options_.point.icon.src).then((imgx) => {
                img.onload = () => resolve(img);
                img.onerror = reject;
                const proxyImageURL = concatUrlPaths([M.config.PROXY_URL, '/image']);
                img.crossOrigin = 'anonymous';
                img.src = addParameters(proxyImageURL, {
                  url: this.options_.point.icon.src,
                });
                img.width = imgSizeWidth;
                img.height = imgSizeWidth;
                const calc1 = (imgSizeWidth / (imgx.width / imgx.height));
                img.height = imgx.width > imgx.height ? calc1 : img.height;
                img.width = imgx.height > imgx.width ? (imgSizeWidth / (imgx.height / imgx.width))
                  : img.width;
              });
            } else {
              img.src = this.options_.point.icon.src;
            }
          } else if (this.options_.point.icon.form) { // es un FORM
            img.onload = () => resolve(img);
            img.width = imgSizeWidth;
            img.height = imgSizeWidth;
            const getterPoint = GETTER_BY_GEOM.Point;
            const stylesPoint = getterPoint(this.options_, this, this.layer_);
            const imageFormPoint = stylesPoint[1].getImage().getImage(1);
            if (imageFormPoint != null && imageFormPoint) {
              img.src = imageFormPoint.toDataURL();
            }
          }
        } else {
          // onload / onerror
          img.onload = () => resolve(img);
          img.onerror = reject;

          // img
          img.width = imgSizeHeight;
          img.height = imgSizeHeight;

          if (isDynamic(this.options_.point) === true) {
            img.src = d;
          } else {
            const getterPoint = GETTER_BY_GEOM.Point;
            const stylesPoint = getterPoint(this.options_, this, this.layer_);
            stylesPoint[0].getImage().setRadius(5);
            const imageURLPoint = stylesPoint[0].getImage().getImage(1).toDataURL();
            img.src = imageURLPoint;
          }
        }
      });
      promises.push(loadImagePoint(dinamic));
    }

    // Canvas / Context
    const canvasGL = document.createElement('canvas');
    canvasGL.height = 20;
    const ctxGL = canvasGL.getContext('2d');

    const positions = [0, 35, 70];
    let cont = 0;

    // Loading images
    return Promise.all(promises).then((values) => {
      const lngt = values.length;
      if (lngt === 1) {
        canvasGL.width = 35;
      } else if (lngt === 2) {
        canvasGL.width = 70;
      } else {
        canvasGL.width = 100;
      }
      let height = 0;
      values.forEach((image) => {
        if (image.height > height) {
          height = image.height;
        }
      });
      canvasGL.height = height;
      values.forEach((image) => {
        ctxGL.drawImage(image, positions[cont], 0, image.width, image.height);
        cont += 1;
      });
      return canvasGL.toDataURL();
    });
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
