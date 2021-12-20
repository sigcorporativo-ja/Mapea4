/**
 * @module M/style/Category
 */
import StyleBase from './Style.js';
import Composite from './Composite.js';
import { isNullOrEmpty, getImageSize, isArray, extendsObj, stringifyFunctions, defineFunctionFromString } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import StyleProportional from './Proportional.js';
import StyleCluster from './Cluster.js';
import Utils from './utils.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a category style
 * with parameters specified by the user
 * @api
 */
class Category extends Composite {
  /**
   * @constructor
   * @extends {M.Style}
   * @param {String} attributeName
   * @param {object} categoryStyles
   * @param {object} options
   * @api
   */
  constructor(attributeName, categoryStyles, options = {}) {
    super(options, {});
    if (isNullOrEmpty(attributeName)) {
      Exception(getValue('exception').no_attr_name);
    }

    /**
     * Attribute name of category
     * @public
     * @type {String}
     * @api
     */
    this.attributeName_ = attributeName;

    /**
     * An object that relate category with a style
     * @public
     * @type {Map<String,M.Style>}
     * @api
     */
    this.categoryStyles_ = categoryStyles;
  }

  /**
   * This constant defines the order of style.
   * @public
   * @api
   */
  get ORDER() {
    return 2;
  }

  /**
   * This function apply the Category object to specified layer
   *
   * @function
   * @public
   * @param {M.layer.Vector} layer - layer is the layer where we want to apply the new Style
   * @returns {M.style.Category}
   * @api
   */
  applyInternal(layer) {
    this.layer_ = layer;
    this.update_();
  }
  /**
   * This function return the AttributeName
   *
   * @function
   * @public
   * @returns {String}
   * @api
   */
  getAttributeName() {
    return this.attributeName_;
  }

  /**
   * This function set the AttributeName defined by user
   *
   * @function
   * @public
   * @param {String} attributeName - newAttributeName is the newAttributeName specified by the user
   * @returns {M.style.Category}
   * @api
   */
  setAttributeName(attributeName) {
    this.attributeName_ = attributeName;
    this.update_();
    this.refresh();
    return this;
  }

  /**
   * This function return an Array with the diferents Categories
   *
   * @function
   * @public
   * @returns {Array<String>}
   * @api
   */
  getCategories() {
    return this.categoryStyles_;
  }

  /**
   * This function sets the object categories
   *
   * @function
   * @public
   * @param {Map<String,M.style>} categories
   * @return {M.style.Category}
   * @api
   */
  setCategories(categories) {
    this.categoryStyles_ = categories;
    this.update_();
    this.refresh();
    return this;
  }

  /**
   * This function return the style of a specified Category defined by user
   *
   * @function
   * @public
   * @param {String} string - string is the name of a category value
   * @returns {M.style}
   * @api
   */
  getStyleForCategory(category) {
    return this.categoryStyles_[category];
  }

  /**
   * This function set the style of a specified Category defined by user
   *
   * @function
   * @public
   * @param {String} category - category is the name of a category value
   * @param {M.style.Simple} style - style is the new style to switch
   * @returns {M.style.Category}
   * @api
   */
  setStyleForCategory(category, style) {
    this.categoryStyles_[category] = style;
    this.update_();
    this.refresh();
    return this;
  }

  /**
   * This function updates the canvas of style
   *
   * @function
   * @public
   * @api
   */
  updateCanvas() {
    const canvasImages = [];
    this.updateCanvasPromise_ = new Promise((success, fail) =>
      this.loadCanvasImages_(0, canvasImages, success));
  }

  /**
   * Load the canvas image style
   *
   * @function
   * @private
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   */
  loadCanvasImages_(currentIndex, canvasImages, callbackFn) {
    const categories = this.getCategories();
    const categoryNames = Object.keys(categories);

    // base case
    if (currentIndex === categoryNames.length) {
      this.drawGeometryToCanvas(canvasImages, callbackFn);
    } else {
      // recursive case
      const category = categoryNames[currentIndex];
      const style = this.getStyleForCategory(category);
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        canvasImages.push({
          image,
          categoryName: category,
        });
        this.loadCanvasImages_((currentIndex + 1), canvasImages, callbackFn);
      };
      image.onerror = () => {
        canvasImages.push({
          categoryName: category,
        });
        this.loadCanvasImages_((currentIndex + 1), canvasImages, callbackFn);
      };
      style.updateCanvas();
      if (style.get('icon.src')) {
        getImageSize(style.get('icon.src')).then((img) => {
          image.width = style.get('icon.scale') ? img.width * style.get('icon.scale') : img.width;
          image.height = style.get('icon.scale') ? img.height * style.get('icon.scale') : img.height;
          image.src = style.toImage();
        });
      } else {
        image.src = style.toImage();
      }
    }
  }

  /**
   * Draw the geometry into the canvas style
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
      const categoryName = canvasImage.categoryName;
      let coordinateY = 0;
      const prevHeights = heights.slice(0, index);
      if (!isNullOrEmpty(prevHeights)) {
        coordinateY = prevHeights.reduce((acc, h) => acc + h + 5);
        coordinateY += 5;
      }
      let imageHeight = 0;
      if (!isNullOrEmpty(image)) {
        imageHeight = image.height;
        const calculateWidth = (maxWidth - image.width) / 2;
        vectorContext.drawImage(image, calculateWidth, coordinateY, image.width, image.height);
      }
      vectorContext.fillText(categoryName, maxWidth + 5, coordinateY + (imageHeight / 2));
    });

    callbackFn();
  }

  /**
   * This function updates the style
   *
   * @function
   * @private
   * @return {M.style.Category}
   * @api
   */
  update_() {
    if (!isNullOrEmpty(this.layer_)) {
      if (isNullOrEmpty(this.categoryStyles_) || Object.keys(this.categoryStyles_).length === 0) {
        this.categoryStyles_ = this.generateRandomCategories_();
      }
      const styleOther = this.categoryStyles_.other;
      this.layer_.getFeatures().forEach((feature) => {
        const value = feature.getAttribute(this.attributeName_);
        const style = this.categoryStyles_[value];
        if (!isNullOrEmpty(style)) {
          feature.setStyle(style);
        } else if (!isNullOrEmpty(styleOther)) {
          feature.setStyle(styleOther);
        }
      });
      this.updateCanvas();
    }
  }

  /**
   * This function adds styles of style Composite
   *
   * @public
   * @function
   * @param {M.style|Array<M.Style>} styles
   * @returns {M.style.Composite}
   * @api
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
   * This function updates the style
   *
   * @function
   * @private
   * @return {object}
   * @api
   */
  generateRandomCategories_() {
    const categories = {};
    if (!isNullOrEmpty(this.layer_)) {
      this.layer_.getFeatures().forEach((feature) => {
        const value = feature.getAttribute(this.attributeName_);
        if (!Object.prototype.hasOwnProperty.call(categories, value)) {
          categories[value] = Utils.default.generateRandomStyle({
            feature,
            radius: Category.RANDOM_RADIUS_OPTION,
            strokeColor: Category.RANDOM_STROKE_COLOR_OPTION,
            strokeWidth: Category.RANDOM_STROKE_WIDTH_OPTION,
          });
        }
      });
    }
    return categories;
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
    const categoryStyles = this.getCategories();
    const serializedCategoryStyles = {};
    Object.keys(categoryStyles).forEach((category) => {
      serializedCategoryStyles[category] = categoryStyles[category].serialize();
    });
    let options = extendsObj({}, this.getOptions());
    options = stringifyFunctions(options);
    const compStyles = this.getStyles().map(style => style.serialize());

    const parameters = [attributeName, serializedCategoryStyles, options, compStyles];
    const deserializedMethod = 'M.style.Category.deserialize';
    return { parameters, deserializedMethod };
  }

  /**
   * This function returns the style instance of the serialization
   * @function
   * @public
   * @param {Array} parametrers - parameters to deserialize and create
   * the instance
   * @return {M.style.Category}
   */
  static deserialize([serializedAttributeName, serializedCategoryStyles,
    serializedOptions, serializedCompStyles,
  ]) {
    const attributeName = serializedAttributeName;
    const categoryStyles = serializedCategoryStyles;
    Object.keys(serializedCategoryStyles).forEach((category) => {
      categoryStyles[category] = StyleBase.deserialize(serializedCategoryStyles[category]);
    });
    const options = defineFunctionFromString(serializedOptions);
    /* eslint-disable */
    const styleFn = new Function(['attributeName', 'categoryStyles', 'options'], `return new M.style.Category(attributeName, categoryStyles, options)`);
    /* eslint-enable */
    const deserializedStyle = styleFn(attributeName, categoryStyles, options);

    const compStyles = serializedCompStyles.map(serializedStyle =>
      StyleBase.deserialize(serializedStyle));
    deserializedStyle.add(compStyles);

    return deserializedStyle;
  }
}

/**
 * This constant defines the radius of random category style.
 * @const
 * @type {number}
 * @public
 * @api
 */
Category.RANDOM_RADIUS_OPTION = 10;

/**
 * This constant defines the stroke width of random category style.
 * @const
 * @type {number}
 * @public
 * @api
 */
Category.RANDOM_STROKE_WIDTH_OPTION = 1;

/**
 * This constant defines the stroke color of random category style.
 * @const
 * @public
 * @type {string}
 * @api
 */
Category.RANDOM_STROKE_COLOR_OPTION = 'black';

export default Category;
