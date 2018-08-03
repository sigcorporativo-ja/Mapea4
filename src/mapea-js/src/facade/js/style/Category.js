import Composite from './Composite';
import { isNullOrEmpty, generateRandomStyle, getImageSize, isArray } from '../util/Utils';
import Exception from '../exception/exception';
import StyleProportional from './Proportional';
import StyleCluster from './Cluster';

export default class Category extends Composite {
  /**
   * @classdesc
   * Main constructor of the class. Creates a categoryStyle
   * with parameters specified by the user
   * for the implementation
   * provided by the user
   * @constructor
   * @extends {M.Style}
   * @param {String} attributeName
   * @param {Map<String,M.Style>} categoryStyles
   * @api stable
   */
  constructor(attributeName, categoryStyles, options = {}) {
    super(options, {});
    if (isNullOrEmpty(attributeName)) {
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
     * TODO
     * @public
     * @type {Map<String,M.Style>}
     * @api stable
     * @expose
     */
    this.categoryStyles_ = categoryStyles;
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

  /**
   * This function apply the Category object to specified layer
   *
   * @function
   * @public
   * @param {M.layer.Vector} layer - layer is the layer where we want to apply the new Style
   * @returns {M.style.Category}
   * @api stable
   */
  applyInternal_(layer) {
    this.layer_ = layer;
    this.update_();
  }
  /**
   * This function return the AttributeName
   *
   * @function
   * @public
   * @returns {String}
   * @api stable
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
   * @api stable
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
   * @api stable
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
   * @api stable
   *
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
   * @api stable
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
   * @api stable
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
   * @api stable
   */
  updateCanvas() {
    const canvasImages = [];
    this.updateCanvasPromise_ = new Promise((success, fail) =>
      this.loadCanvasImages_(0, canvasImages, success));
  }

  /**
   * TODO
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
   * TODO
   *
   * @function
   * @public
   * @param {CanvasRenderingContext2D} vectorContext - context of style canvas
   * @api stable
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
        vectorContext.drawImage(
          image, (maxWidth - image.width) / 2,
          coordinateY,
          image.width,
          image.height,
        );
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
   * @api stable
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
   * This function updates the style
   *
   * @function
   * @private
   * @return {object}
   * @api stable
   */
  generateRandomCategories_() {
    const categories = {};
    if (!isNullOrEmpty(this.layer_)) {
      this.layer_.getFeatures().forEach((feature) => {
        const value = feature.getAttribute(this.attributeName_);
        if (!Object.prototype.hasOwnProperty.call(categories, value)) {
          categories[value] = generateRandomStyle(
            feature,
            Category.RANDOM_RADIUS_OPTION,
            Category.RANDOM_STROKE_WIDTH_OPTION,
            Category.RANDOM_STROKE_COLOR_OPTION,
          );
        }
      });
    }
    return categories;
  }
}

/**
 * This constant defines the radius of random category style.
 * @constant
 * @public
 * @api stable
 */
Category.RANDOM_RADIUS_OPTION = 10;

/**
 * This constant defines the stroke width of random category style.
 * @constant
 * @public
 * @api stable
 */
Category.RANDOM_STROKE_WIDTH_OPTION = 1;

/**
 * This constant defines the stroke color of random category style.
 * @constant
 * @public
 * @api stable
 */
Category.RANDOM_STROKE_COLOR_OPTION = 'black';
