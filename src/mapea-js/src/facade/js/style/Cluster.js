/**
 * @module M/style/Cluster
 */
import ClusterImpl from 'impl/style/Cluster';
import Composite from './Composite';
import { extendsObj, isNullOrEmpty } from '../util/Utils';

/**
 * @classdesc
 * Main constructor of the class. Creates a style cluster
 * with parameters specified by the user
 * @api
 */
class Cluster extends Composite {
  /**
   * @constructor
   * @extends {M.Style}
   * @param {object} parameters for style cluster
   * @param {object} specified parameters for class claster depends on its implementation
   * @api
   */
  constructor(options = {}, optsVendor = {}) {
    const impl = new ClusterImpl(options, optsVendor);

    // calls the super constructor
    super(options, impl);

    extendsObj(options, Cluster.DEFAULT);
    extendsObj(optsVendor, Cluster.DEFAULT_VENDOR);

    /**
     * @private
     * @type {Object}
     */
    this.oldStyle_ = null;
  }

  apply(layer) {
    super.apply(layer);
    const style = layer.getStyle();
    this.oldStyle_ = style instanceof Cluster ? style.getOldStyle() : style;
  }

  /**
   * @inheritDoc
   */
  unapplySoft(layer) {
    this.getImpl().unapply();
  }

  /**
   * @inheritDoc
   */
  add(styles) {
    if (!isNullOrEmpty(this.layer_)) {
      this.unapplySoft(this.layer_);
    }
    return super.add(styles);
  }

  /**
   * This function apply style to specified layer
   *
   * @function
   * @public
   * @param {M.layer.Vector} layer - Layer to apply the style
   * @api
   */
  applyInternal_(layer) {
    this.layer_ = layer;
    this.getImpl().applyToLayer(layer);
    this.updateCanvas();
  }

  /**
   * This function gets the old style of layer
   * @function
   * @public
   * @return {M.Style} the old style of layer
   * @api
   */
  getOldStyle() {
    return this.oldStyle_;
  }

  /**
   * This function return a set of ranges defined by user
   *
   * @function
   * @public
   * @return {Array<Object>} ranges stablished by user
   * @api
   */
  getRanges() {
    return this.options_.ranges;
  }

  /**
   * This function returns the options of style cluster
   * @function
   * @public
   * @return {object} options of style cluster
   * @api
   */
  getOptions() {
    return this.options_;
  }

  /**
   * This function update a set of ranges  defined by user
   *
   * @function
   * @public
   * @param {Array<Object>} newRanges as new Ranges
   * @return {Cluster}
   * @api
   */
  setRanges(newRanges) {
    this.getImpl().ranges = newRanges;
    this.unapply(this.layer_);
    this.layer_.style = this;
    return this;
  }

  /**
   * This function return a specified range
   *
   * @function
   * @public
   * @param {number} min as minimal value in the interval
   * @param {number} max as max value in the interval
   * @return {Object}
   * @api
   */
  getRange(min, max) {
    return this.options_.ranges.find(el => (el.min === min && el.max === max));
  }

  /**
   * This function set a specified range
   *
   * @function
   * @public
   * @param {number} min as range minimal value to be overwritten
   * @param {number} max as range max value to be overwritten
   * @param {number} newRange as the new range
   * @return {Cluster}
   * @api
   */
  updateRange(min, max, newRange) {
    ClusterImpl.updateRangeImpl(min, max, newRange, this.layer_, this);
    this.unapply(this.layer_);
    this.layer_.style = this;
    return this;
  }

  /**
   * This function set if layer must be animated
   *
   * @function
   * @public
   * @param {boolean} animated defining if layer must be animated
   * @return {Cluster}
   * @api
   */
  setAnimated(animated) {
    return this.getImpl().setAnimated(animated, this.layer_, this);
  }

  /**
   * This function return if layer is animated
   *
   * @function
   * @public
   * @return {boolean} A flag indicating if layer is currently being animated
   * @api
   */
  isAnimated() {
    return this.options_.animated;
  }

  /**
   * This function returns data url to canvas
   *
   * @function
   * @protected
   * @return {String} data url to canvas
   */
  toImage() {
    let base64Img;
    if (!isNullOrEmpty(this.oldStyle_)) {
      base64Img = this.oldStyle_.toImage();
    } else {
      base64Img = super.toImage();
    }
    return base64Img;
  }

  /**
   * This function updates the style of the
   * layer
   *
   * @public
   * @function
   * @return {String} data url to canvas
   * @api
   */
  refresh() {
    if (!isNullOrEmpty(this.layer_)) {
      const layer = this.layer_;
      this.unapply(this.layer_);
      this.apply(layer);
      this.updateCanvas();
    }
  }

  /**
   * This constant defines the order of style.
   * @constant
   * @public
   * @api
   */
  static get ORDER() {
    return 1;
  }
}

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api
 */
Cluster.DEFAULT = {
  hoverInteraction: true,
  displayAmount: true,
  selectInteraction: true,
  distance: 60,
  animated: true,
  maxFeaturesToSelect: 15,
  label: {
    text: (feature) => {
      let text;
      const cluseterFeatures = feature.attribute('features');
      if (!isNullOrEmpty(cluseterFeatures)) {
        text = cluseterFeatures.length.toString();
      }
      return text;
    },
    color: '#fff',
    font: 'bold 15px Arial',
    baseline: 'middle',
    align: 'center',
  },
};

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api
 */
Cluster.DEFAULT_VENDOR = {
  animationDuration: 250,
  animationMethod: 'linear',
  distanceSelectFeatures: 15,
  convexHullStyle: {
    fill: {
      color: '#fff',
      opacity: 0.25,
    },
    stroke: {
      // color: '#425f82'
      color: '#7b98bc',
    },
  },
};

/**
 * Default options for range 1 style
 * @const
 * @type {object}
 * @public
 * @api
 */
Cluster.RANGE_1_DEFAULT = {
  fill: {
    color: '#81c89a',
  },
  stroke: {
    color: '#6eb988',
    width: 3,
  },
  radius: 15,
};

/**
 * Default options for range 2 style
 * @const
 * @type {object}
 * @public
 * @api
 */
Cluster.RANGE_2_DEFAULT = {
  fill: {
    color: '#85b9d2',
  },
  stroke: {
    color: '#6da4be',
    width: 3,
  },
  radius: 20,
};

/**
 * Default options for range 3 style
 * @const
 * @type {object}
 * @public
 * @api
 */
Cluster.RANGE_3_DEFAULT = {
  fill: {
    color: '#938fcf',
  },
  stroke: {
    color: '#827ec5',
    width: 3,
  },
  radius: 25,
};

export default Cluster;
