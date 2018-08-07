import StyleComposite from './Composite';
import StyleQuantification from './Quantification';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import GeomGeoJSON from "../geom/GeoJSON";
import Filter from "../filter/Filter";
import StyleCluster from './Cluster';
import StyleProportional from './Proportional';
import StylePolygon from "./Polygon";
import StyleLine from "./Line";
import StylePoint from "./Point";

/**
 * @namespace Choropleth
 */
export default class Choropleth extends StyleComposite {
  /**
   * @classdesc
   * Main constructor of the class. Creates a style choropleth
   * with parameters specified by the user
   *
   * @constructor
   * @extends {Style}
   * @param {String}
   * @param {Array<Style>}
   * @param {Style.quantification}
   * @param {object}
   * @api stable
   */
  constructor(attributeName, styles, quantification = StyleQuantification.JENKS(), options = {}) {
    super(options, {});
    if (Utils.isNullOrEmpty(attributeName)) {
      Exception('No se ha especificado el nombre del atributo.');
    }

    /**
     * TODO
     * @public
     * @type {String}
     * @api stable
     * @expose
     */
    this.attributeName_ = attributeName;

    /**
     * @public
     * @type {Array<Style.Simple>}
     * @api stable
     * @expose
     */
    this.choroplethStyles_ = styles;

    /**
     * @public
     * @type {M.quantification|function}
     * @api stable
     * @expose
     */
    this.quantification_ = quantification;

    /**
     * @public
     * @type {Array<Number>}
     * @api stable
     * @expose
     */
    this.dataValues_ = [];

    /**
     * @public
     * @type{Array<Number>}
     * @api stable
     * @expose
     */
    this.breakPoints_ = [];
  }

  /**
   * This function apply the style to specified layer
   * @function
   * @public
   * @param {M.Layer.Vector} layer - Layer where to apply choropleth style
   * @api stable
   */
  applyInternal_(layer) {
    this.layer_ = layer;
    this.update_();
  }

  /**
   * This function return the attribute name defined by user
   * @function
   * @public
   * @return {String} attribute name of Style
   * @api stable
   */
  getAttributeName() {
    return this.attributeName_;
  }

  /**
   * This function set the attribute name defined by user
   * @function
   * @public
   * @param {String} attributeName - attribute name to set
   * @api stable
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
   * @api stable
   */
  getQuantification() {
    return this.quantification_;
  }

  /**
   * This function set quantification function defined by user
   * @function
   * @public
   * @param {Style.quantification|function} quantification - quantification function of style
   * @api stable
   */
  setQuantification(quantification) {
    this.quantification_ = quantification;
    if (!this.choroplethStyles_.some(style => Utils.isString(style))) {
      if (this.choroplethStyles_.length < this.quantification_().length) {
        let [startStyle, endStyle] = this.choroplethStyles_;
        let startColor = startStyle.get('fill.color');
        let endColor = endStyle.get('fill.color');
        if (Utils.isNullOrEmpty(startColor)) {
          startColor = startStyle.get('stroke.color');
        }
        if (Utils.isNullOrEmpty(endColor)) {
          endColor = endStyle.get('stroke.color');
        }
        this.choroplethStyles_ = [startColor, endColor];
      }
      else {
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
   * @api stable
   */
  getChoroplethStyles() {
    return this.choroplethStyles_;
  }

  /**
   * This function sets the styles defined by user
   * @function
   * @public
   * @param {Array<Style.Point>|Array<Style.Line>|Array<Style.Polygon>} styles - styles defined by user
   * @api stable
   */
  setStyles(styles) {
    if (!Utils.isArray(styles)) {
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
   * @api stable
   */

  updateCanvas() {
    if (!Utils.isNullOrEmpty(this.choroplethStyles_)) {
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
    }
    // recursive case
    else {
      let startLimit = -1;
      if (currentIndex > 0) {
        startLimit = this.breakPoints_[currentIndex - 1];
      }
      let endLimit = this.breakPoints_[currentIndex];
      let image = new Image();
      image.crossOrigin = 'Anonymous';
      let scope_ = this;
      image.onload = () => {
        canvasImages.push({
          image,
          'startLimit': Choropleth.CALC_CANVAS_NUMBER_(startLimit),
          'endLimit': Choropleth.CALC_CANVAS_NUMBER_(endLimit)
        });
        scope_.loadCanvasImages_((currentIndex + 1), canvasImages, callbackFn);
      }
      image.onerror = () => {
        canvasImages.push({
          'startLimit': Choropleth.CALC_CANVAS_NUMBER_(startLimit),
          'endLimit': Choropleth.CALC_CANVAS_NUMBER_(endLimit)
        });
        scope_.loadCanvasImages_((currentIndex + 1), canvasImages, callbackFn);
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
   * @api stable
   */
  drawGeometryToCanvas(canvasImages, callbackFn) {
    let heights = canvasImages.map(canvasImage => canvasImage['image'].height);
    let widths = canvasImages.map(canvasImage => canvasImage['image'].width);

    let vectorContext = this.canvas_.getContext('2d');
    vectorContext.canvas.height = heights.reduce((acc, h) => acc + h + 5);
    vectorContext.textBaseline = "middle";

    let maxWidth = Math.max.apply(widths, widths);

    canvasImages.forEach((canvasImage, index) => {
      let image = canvasImage['image'];
      let startLimit = canvasImage['startLimit'];
      let endLimit = canvasImage['endLimit'];

      let coordinateY = 0;
      let prevHeights = heights.slice(0, index);
      if (!Utils.isNullOrEmpty(prevHeights)) {
        coordinateY = prevHeights.reduce((acc, h) => acc + h + 5);
        coordinateY += 5;
      }
      let imageHeight = 0;
      if (!Utils.isNullOrEmpty(image)) {
        imageHeight = image.height;
        vectorContext.drawImage(image, 0, coordinateY);
      }
      if (startLimit < 0) {
        vectorContext.fillText(` x  <=  ${endLimit}`, maxWidth + 5, coordinateY + (imageHeight / 2));
      }
      else {
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
   * @api stable
   */
  getValues() {
    let values = [];
    if (!Utils.isNullOrEmpty(this.layer_)) {
      this.layer_.getFeatures().forEach((f) => {
        try {
          let value = parseFloat(f.getAttribute(this.attributeName_));
          if (!isNaN(value)) {
            values.push(value);
          }
        }
        catch (e) {
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
   * @api stable
   */
  update_() {
    if (!Utils.isNullOrEmpty(this.layer_)) {
      let features = this.layer_.getFeatures();
      if (!Utils.isNullOrEmpty(features)) {
        this.dataValues_ = this.getValues();
        if (Utils.isNullOrEmpty(this.choroplethStyles_) || (!Utils.isNullOrEmpty(this.choroplethStyles_) &&
            (Utils.isString(this.choroplethStyles_[0]) || Utils.isString(this.choroplethStyles_[1])))) {
          this.breakPoints_ = this.quantification_(this.dataValues_);
          let startColor = this.choroplethStyles_ && this.choroplethStyles_[0] ? this.choroplethStyles_[0] : Choropleth.START_COLOR_DEFAULT;
          let endColor = this.choroplethStyles_ && this.choroplethStyles_[1] ? this.choroplethStyles_[1] : Choropleth.END_COLOR_DEFAULT;
          let numColors = this.breakPoints_.length;
          let scaleColor = Utils.generateColorScale(startColor, endColor, numColors);
          if (!Utils.isArray(scaleColor)) {
            scaleColor = [scaleColor];
          }
          let geometryType = Utils.getGeometryType(this.layer_);
          const generateStyle = (scale, defaultStyle) => (scale.map(c => defaultStyle(c)));
          switch (geometryType) {
            case GeomGeoJSON.POINT:
            case GeomGeoJSON.MULTI_POINT:
              this.choroplethStyles_ = generateStyle(scaleColor, Choropleth.DEFAULT_STYLE_POINT);
              break;
            case GeomGeoJSON.LINE_STRING:
            case GeomGeoJSON.MULTI_LINE_STRING:
              this.choroplethStyles_ = generateStyle(scaleColor, Choropleth.DEFAULT_STYLE_LINE);
              break;
            case GeomGeoJSON.POLYGON:
            case GeomGeoJSON.MULTI_POLYGON:
              this.choroplethStyles_ = generateStyle(scaleColor, Choropleth.DEFAULT_STYLE_POLYGON);
              break;
            default:
              return null;
          }
        }
        else {
          this.breakPoints_ = this.quantification_(this.dataValues_, this.choroplethStyles_.length);
        }
      }
      for (let i = this.breakPoints_.length - 1; i > -1; i--) {
        let filterLTE = new Filter.LTE(this.attributeName_, this.breakPoints_[i]);
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
   * @api stable
   */
  static DEFAULT_STYLE_POINT(c) {
    return new StylePoint({
      fill: {
        color: c,
        opacity: 1
      },
      stroke: {
        color: 'black',
        width: 1
      },
      radius: 5
    });
  }

  /**
   * This functions returns a line style by default
   * @function
   * @public
   * @param {String} c - color in hexadecimal format
   * @return {Style.Line}
   * @api stable
   */
  static DEFAULT_STYLE_LINE(c) {
    return new StyleLine({
      stroke: {
        color: c,
        width: 1
      }
    });
  }

  /**
   * This functions returns a polygon style by default
   * @function
   * @public
   * @param {String} c - color in hexadecimal format
   * @return {Style.Polygon}
   * @api stable
   */
  static DEFAULT_STYLE_POLYGON(c) {
    return new StylePolygon({
      fill: {
        color: c,
        opacity: 1
      },
      stroke: {
        color: c,
        width: 1
      }
    });
  }

  /**
   * Returns the calculation of the numbers of the canvas
   * with a given precision
   *  @function
   * @api stable
   */
  static CALC_CANVAS_NUMBER_(number) {
    let powPrecision = Math.pow(10, Choropleth.ACCURACY_NUMBER_CANVAS);
    return Math.round(number * powPrecision) / powPrecision;
  }

  /**
   * @inheritDoc
   */
  add(styles) {
    if (!Utils.isArray(styles)) {
      styles = [styles];
    }
    styles = styles.filter(style => style instanceof StyleCluster || style instanceof StyleProportional);
    return super.add(styles);
  }

  /**
   * This constant defines the order of style.
   * @constant
   * @public
   * @api stable
   */
  get ORDER() {
    return 1;
  }
}

/** Color style by default
 * @constant
 * @api stable
 */
Choropleth.START_COLOR_DEFAULT = 'red';

/**
 * Color style by default
 * @constant
 * @api stable
 */
Choropleth.END_COLOR_DEFAULT = 'brown';

/**
 * Accuracy of numbers on canvas
 * @constant
 * @api stable
 */
Choropleth.ACCURACY_NUMBER_CANVAS = 2;
