import Composite from './stylecomposite';
import Utils from '../utils/utils';
import ClusterImpl from '../../../impl/js/style/stylecluster';

/**
 * @namespace Cluster
 */
export default class Cluster extends Composite {
  /**
   * @classdesc
   * Main constructor of the class. Creates a style cluster
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Style}
   * @param {object} parameters for style cluster
   * @param {object} specified parameters for class claster depends on its implementation
   * @api stable
   */
  constructor(options = {}, optsVendor = {}) {
    var impl = new ClusterImpl(options, optsVendor);

    // calls the super constructor
    super(options, impl);
    Utils.extends(options, Cluster.DEFAULT);
    Utils.extends(optsVendor, Cluster.DEFAULT_VENDOR);

    /**
     * @private
     * @type {Object}
     */
    this.oldStyle_ = null;


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
    if (!Utils.isNullOrEmpty(this.layer_)) {
      this.unapplySoft(this.layer_);
    }
    return return super.add(styles);
  }

  /**
   * This function apply style to specified layer
   *
   * @function
   * @public
   * @param {M.layer.Vector} layer - Layer to apply the style
   * @api stable
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
   * @api stable
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
   * @api stable
   */
  getRanges() {
    return this.options_.ranges;
  }

  /**
   * This function returns the options of style cluster
   * @function
   * @public
   * @return {object} options of style cluster
   * @api stable
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
   * @api stable
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
   * @api stable
   */
  getRange(min, max) {
    return this.options_.ranges.find(el => (el.min == min && el.max == max));
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
   * @api stable
   */
  updateRange(min, max, newRange) {
    this.getImpl().updateRangeImpl(min, max, newRange, this.layer_, this);
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
   * @api stable
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
   * @api stable
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
    if (!Utils.isNullOrEmpty(this.oldStyle_)) {
      base64Img = this.oldStyle_.toImage();
    } else {
      base64Img = super(this, 'toImage', this);
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
   * @api stable
   */
  refresh() {
    if (!Utils.isNullOrEmpty(this.layer_)) {
      let layer = this.layer_;
      this.unapply(this.layer_);
      this.apply(layer);
      this.updateCanvas();
    }
  }

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
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
        let cluseterFeatures = feature.attribute('features');
        if (!Utils.isNullOrEmpty(cluseterFeatures)) {
          text = cluseterFeatures.length.toString();
        }
        return text;
      },
      color: '#fff',
      font: "bold 15px Arial",
      baseline: 'middle',
      align: "center"
    }
  };

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  Cluster.DEFAULT_VENDOR = {
    animationDuration: 250,
    animationMethod: "linear",
    distanceSelectFeatures: 15,
    convexHullStyle: {
      fill: {
        color: '#fff',
        opacity: 0.25
      },
      stroke: {
        // color: '#425f82'
        color: '#7b98bc'
      }
    }
  };

  /**
   * Default options for range 1 style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  Cluster.RANGE_1_DEFAULT = {
    fill: {
      color: '#81c89a'
    },
    stroke: {
      color: '#6eb988',
      width: 3
    },
    radius: 15
  };

  /**
   * Default options for range 2 style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  Cluster.RANGE_2_DEFAULT = {
    fill: {
      color: '#85b9d2'
    },
    stroke: {
      color: '#6da4be',
      width: 3
    },
    radius: 20,
  };

  /**
   * Default options for range 3 style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  Cluster.RANGE_3_DEFAULT = {
    fill: {
      color: '#938fcf'
    },
    stroke: {
      color: '#827ec5',
      width: 3
    },
    radius: 25
  };

  /**
   * This constant defines the order of style.
   * @constant
   * @public
   * @api stable
   */


  Object.defineProperty(Cluster.prototype, "ORDER", {
    value: 1
  });
}
