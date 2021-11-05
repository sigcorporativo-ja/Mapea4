/**
 * @module M/impl/style/Generic
 */
import { isFunction, isNullOrEmpty } from 'M/util/Utils';
import OLFeature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import GeometryType from 'ol/geom/GeometryType';
import OLStyleIcon from 'ol/style/Icon';
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
  toImage(canvas) {}

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
      const idFeature = feature.getId();
      const storedStyles = this.styles_[idFeature];
      let styles = [];
      if (!isNullOrEmpty(storedStyles)) {
        styles = storedStyles;
      } else {
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
