/**
 * @module M/style/Choropleth
 */
import StyleBase from './Style.js';
import StyleComposite from './Composite.js';
import * as StyleQuantification from './Quantification.js';
import { extendsObj, isNullOrEmpty, generateColorScale, isArray, isString, stringifyFunctions, defineFunctionFromString } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import * as geometry from '../geom/GeoJSON.js';
import * as Filter from '../filter/Filter.js';
import StyleCluster from './Cluster.js';
import StyleProportional from './Proportional.js';
import StylePolygon from './Polygon.js';
import StyleLine from './Line.js';
import StylePoint from './Point.js';
import { getValue } from '../i18n/language.js';

/**
 * Accuracy of numbers on canvas
 * @constant
 * @api
 */
const ACCURACY_NUMBER_CANVAS = 2;

/**
 * Returns the calculation of the numbers of the canvas
 * with a given precision
 *  @function
 */
const calcCanvasNumber = (number) => {
  const powPrecision = 10 ** ACCURACY_NUMBER_CANVAS;
  return Math.round(number * powPrecision) / powPrecision;
};

/**
 * @classdesc
 * Main constructor of the class. Creates a style choropleth
 * with parameters specified by the user
 * @api
 */
class Choropleth extends StyleComposite {
  /**
   * @constructor
   * @extends {Style}
   * @param {String}
   * @param {Array<Style>}
   * @param {Style.quantification}
   * @param {object}
   * @api
   */
  constructor(attributeName, styles, quantification = StyleQuantification.JENKS(), options = {}) {
    super(options, {});
    if (isNullOrEmpty(attributeName)) {
      Exception(getValue('exception').no_attr_name);
    }

    /**
     * TODO
     * @public
     * @type {String}
     * @api
     * @expose
     */
    this.attributeName_ = attributeName;

    /**
     * @public
     * @type {Array<Style.Simple>}
     * @api
     * @expose
     */
    this.choroplethStyles_ = styles;

    /**
     * @public
     * @type {M.quantification|function}
     * @api
     * @expose
     */
    this.quantification_ = quantification;

    /**
     * @public
     * @type {Array<Number>}
     * @api
     * @expose
     */
    this.dataValues_ = [];

    /**
     * @public
     * @type{Array<Number>}
     * @api
     * @expose
     */
    this.breakPoints_ = [];
  }

  /**
   * This function apply the style to specified layer
   * @function
   * @public
   * @param {M.Layer.Vector} layer - Layer where to apply choropleth style
   * @api
   */
  applyInternal(layer) {
    this.layer_ = layer;
    this.update_();
  }

  /**
   * This function return the attribute name defined by user
   * @function
   * @public
   * @return {String} attribute name of Style
   * @api
   */
  getAttributeName() {
    return this.attributeName_;
  }

  /**
   * This function set the attribute name defined by user
   * @function
   * @public
   * @param {String} attributeName - attribute name to set
   * @api
   */
  setAttributeName(attributeName) {
    this.attributeName_ = attributeName;
    this.update_();
    this.refresh();
    return this;
  }

  /**
   * This function return quantification function defined by user
   * @function
   * @public
   * @return {Style.quantification|function} quantification function of style
   * @api
   */
  getQuantification() {
    return this.quantification_;
  }

  /**
   * This function set quantification function defined by user
   * @function
   * @public
   * @param {Style.quantification|function} quantification - quantification function of style
   * @api
   */
  setQuantification(quantification) {
    this.quantification_ = quantification;
    if (!this.choroplethStyles_.some(style => isString(style))) {
      if (this.choroplethStyles_.length < this.quantification_().length) {
        const [startStyle, endStyle] = this.choroplethStyles_;
        let startColor = startStyle.get('fill.color');
        let endColor = endStyle.get('fill.color');
        if (isNullOrEmpty(startColor)) {
          startColor = startStyle.get('stroke.color');
        }
        if (isNullOrEmpty(endColor)) {
          endColor = endStyle.get('stroke.color');
        }
        this.choroplethStyles_ = [startColor, endColor];
      } else {
        this.choroplethStyles_ = this.choroplethStyles_.slice(0, this.quantification_().length);
      }
      this.update_();
      this.refresh();
    }
    return this;
  }

  /**
   * This function returns the styles defined by user
   * @function
   * @public
   * @return {Array(Style)|null} returns the styles defined by user
   * @api
   */
  getChoroplethStyles() {
    return this.choroplethStyles_;
  }

  /**
   * This function sets the styles defined by user
   * @function
   * @public
   * @param {Array<StylePoint>|Array<StyleLine>|Array<StylePolygon>} styles - styles defined by user
   * @api
   */
  setStyles(stylesParam) {
    let styles = stylesParam;
    if (!isArray(styles)) {
      styles = [styles];
    }
    this.choroplethStyles_ = styles;
    this.update_();
    this.refresh();
    return this;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */

  updateCanvas() {
    if (!isNullOrEmpty(this.choroplethStyles_)) {
      if (this.breakPoints_.length > 0) {
        const canvasImages = [];
        this.updateCanvasPromise_ = new Promise((success, fail) =>
          this.loadCanvasImages_(0, canvasImages, success));
      }
    }
  }

  /**
   * TODO
   *
   * @function
   * @private
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   */
  loadCanvasImages_(currentIndex, canvasImages, callbackFn) {
    // base case
    if (currentIndex === this.choroplethStyles_.length) {
      this.drawGeometryToCanvas(canvasImages, callbackFn);
    } else {
      // recursive case
      let startLimit = -1;
      if (currentIndex > 0) {
        startLimit = this.breakPoints_[currentIndex - 1];
      }
      const endLimit = this.breakPoints_[currentIndex];
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        canvasImages.push({
          image,
          startLimit: calcCanvasNumber(startLimit),
          endLimit: calcCanvasNumber(endLimit),
        });
        this.loadCanvasImages_((currentIndex + 1), canvasImages, callbackFn);
      };
      image.onerror = () => {
        canvasImages.push({
          startLimit: calcCanvasNumber(startLimit),
          endLimit: calcCanvasNumber(endLimit),
        });
        this.loadCanvasImages_((currentIndex + 1), canvasImages, callbackFn);
      };
      this.choroplethStyles_[currentIndex].updateCanvas();
      image.src = this.choroplethStyles_[currentIndex].toImage();
    }
  }

  /**
   * TODO
   *
   * @function
   * @public
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   * @api
   */
  drawGeometryToCanvas(canvasImages, callbackFn) {
    const heights = canvasImages.map(canvasImage => canvasImage.image.height);
    const widths = canvasImages.map(canvasImage => canvasImage.image.width);

    const vectorContext = this.canvas_.getContext('2d');
    vectorContext.canvas.height = heights.reduce((acc, h) => acc + h + 5);
    vectorContext.textBaseline = 'middle';

    const maxWidth = Math.max.apply(widths, widths);

    canvasImages.forEach((canvasImage, index) => {
      const image = canvasImage.image;
      const startLimit = canvasImage.startLimit;
      const endLimit = canvasImage.endLimit;

      let coordinateY = 0;
      const prevHeights = heights.slice(0, index);
      if (!isNullOrEmpty(prevHeights)) {
        coordinateY = prevHeights.reduce((acc, h) => acc + h + 5);
        coordinateY += 5;
      }
      let imageHeight = 0;
      if (!isNullOrEmpty(image)) {
        imageHeight = image.height;
        vectorContext.drawImage(image, 0, coordinateY);
      }
      if (startLimit < 0) {
        vectorContext.fillText(` x  <=  ${endLimit}`, maxWidth + 5, coordinateY + (imageHeight / 2));
      } else {
        vectorContext.fillText(`${startLimit} <  x  <=  ${endLimit}`, maxWidth + 5, coordinateY + (imageHeight / 2));
      }
    }, this);

    callbackFn();
  }

  /**
   * This function gets the numeric features values of layer which attribute
   * is equal to attribute specified by user
   * @function
   * @public
   * @return {Array<number>} numeric features values of layer
   * @api
   */
  getValues() {
    const values = [];
    if (!isNullOrEmpty(this.layer_)) {
      this.layer_.getFeatures().forEach((f) => {
        try {
          const value = parseFloat(f.getAttribute(this.attributeName_));
          if (!Number.isNaN(value)) {
            values.push(value);
          }
        } catch (e) {
          // Exception('TODO el atributo no es un número válido');
        }
      }, this);
    }
    return values;
  }

  /**
   * This function updates the style
   * @function
   * @private
   * @api
   */
  update_() {
    if (!isNullOrEmpty(this.layer_)) {
      const features = this.layer_.getFeatures();
      if (!isNullOrEmpty(features)) {
        this.dataValues_ = this.getValues();
        if (isNullOrEmpty(this.choroplethStyles_) || (!isNullOrEmpty(this.choroplethStyles_) &&
            (isString(this.choroplethStyles_[0]) || isString(this.choroplethStyles_[1])))) {
          this.breakPoints_ = this.quantification_(this.dataValues_);
          const startColor = this.choroplethStyles_ && this.choroplethStyles_[0] ?
            this.choroplethStyles_[0] : Choropleth.START_COLOR_DEFAULT;
          const endColor = this.choroplethStyles_ && this.choroplethStyles_[1] ?
            this.choroplethStyles_[1] : Choropleth.END_COLOR_DEFAULT;
          const numColors = this.breakPoints_.length;
          let scaleColor = generateColorScale(startColor, endColor, numColors);
          if (!isArray(scaleColor)) {
            scaleColor = [scaleColor];
          }
          const geometryType = this.layer_.getGeometryType();
          const generateStyle = (scale, defaultStyle) => (scale.map(c => defaultStyle(c)));
          switch (geometryType) {
            case geometry.POINT:
            case geometry.MULTI_POINT:
              this.choroplethStyles_ = generateStyle(scaleColor, Choropleth.DEFAULT_STYLE_POINT);
              break;
            case geometry.LINE_STRING:
            case geometry.MULTI_LINE_STRING:
              this.choroplethStyles_ = generateStyle(scaleColor, Choropleth.DEFAULT_STYLE_LINE);
              break;
            case geometry.POLYGON:
            case geometry.MULTI_POLYGON:
              this.choroplethStyles_ = generateStyle(scaleColor, Choropleth.DEFAULT_STYLE_POLYGON);
              break;
            default:
              this.choroplethStyles_ = [];
          }
        } else {
          this.breakPoints_ = this.quantification_(this.dataValues_, this.choroplethStyles_.length);
        }
      }
      for (let i = this.breakPoints_.length - 1; i > -1; i -= 1) {
        const filterLTE = new Filter.LTE(this.attributeName_, this.breakPoints_[i]);
        filterLTE.execute(features).forEach(f => f.setStyle(this.choroplethStyles_[i]));
      }
      this.updateCanvas();
    }
  }

  /**
   * This functions returns a point style by default
   * @function
   * @public
   * @param {String} c - color in hexadecimal format
   * @return {Style.Point}
   * @api
   */
  static DEFAULT_STYLE_POINT(c) {
    return new StylePoint({
      fill: {
        color: c,
        opacity: 1,
      },
      stroke: {
        color: 'black',
        width: 1,
      },
      radius: 5,
    });
  }

  /**
   * This functions returns a line style by default
   * @function
   * @public
   * @param {String} c - color in hexadecimal format
   * @return {Style.Line}
   * @api
   */
  static DEFAULT_STYLE_LINE(c) {
    return new StyleLine({
      stroke: {
        color: c,
        width: 1,
      },
    });
  }

  /**
   * This functions returns a polygon style by default
   * @function
   * @public
   * @param {String} c - color in hexadecimal format
   * @return {Style.Polygon}
   * @api
   */
  static DEFAULT_STYLE_POLYGON(c) {
    return new StylePolygon({
      fill: {
        color: c,
        opacity: 1,
      },
      stroke: {
        color: c,
        width: 1,
      },
    });
  }

  /**
   * @inheritDoc
   */
  add(stylesParam) {
    let styles = stylesParam;
    if (!isArray(styles)) {
      styles = [styles];
    }
    styles = styles.filter((style) => {
      return style instanceof StyleCluster || style instanceof StyleProportional;
    });
    return super.add(styles);
  }

  /**
   * This constant defines the order of style.
   * @constant
   * @public
   * @api
   */
  get ORDER() {
    return 2;
  }

  /**
   * This function implements the mechanism to
   * generate the JSON of this instance
   *
   * @public
   * @return {object}
   * @function
   * @api
   */
  toJSON() {
    const attributeName = this.getAttributeName();
    const styles = this.getChoroplethStyles().map(style => style.serialize());
    let quantification = this.getQuantification();
    if (isNullOrEmpty(quantification.name)) {
      quantification = stringifyFunctions(quantification);
    } else {
      quantification = quantification.name;
    }
    let options = extendsObj({}, this.getOptions());
    options = stringifyFunctions(options);
    const compStyles = this.getStyles().map(style => style.serialize());

    const parameters = [attributeName, styles, quantification, options, compStyles];
    const deserializedMethod = 'M.style.Choropleth.deserialize';
    return { parameters, deserializedMethod };
  }

  /**
   * This function returns the style instance of the serialization
   * @function
   * @public
   * @param {Array} parametrers - parameters to deserialize and create
   * the instance
   * @return {M.style.Choropleth}
   */
  static deserialize([serializedAttributeName, serializedStyles,
    serializedQuantification, serializedOptions, serializedCompStyles,
  ]) {
    const attributeName = serializedAttributeName;
    const styles = serializedStyles.map(serializedStyle =>
      StyleBase.deserialize(serializedStyle));
    let quantification;
    if (serializedQuantification === 'jenks') {
      quantification = StyleQuantification.JENKS();
    } else if (serializedQuantification === 'quantile') {
      quantification = StyleQuantification.QUANTILE();
    } else {
      quantification = defineFunctionFromString(serializedQuantification);
    }
    const options = defineFunctionFromString(serializedOptions);
    /* eslint-disable */
    const styleFn = new Function(['attributeName', 'styles', 'quantification', 'options'], `return new M.style.Choropleth(attributeName, styles, quantification, options)`);
    /* eslint-enable */
    const deserializedStyle = styleFn(attributeName, styles, quantification, options);

    const compStyles = serializedCompStyles.map(serializedStyle =>
      StyleBase.deserialize(serializedStyle));
    deserializedStyle.add(compStyles);

    return deserializedStyle;
  }
}

/** Color style by default
 * @constant
 * @api
 */
Choropleth.START_COLOR_DEFAULT = 'red';

/**
 * Color style by default
 * @constant
 * @api
 */
Choropleth.END_COLOR_DEFAULT = 'brown';

export default Choropleth;
