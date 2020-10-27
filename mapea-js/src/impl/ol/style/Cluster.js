/**
 * @module M/impl/style/Cluster
 */
import { unByKey } from 'ol/Observable';
import { getCenter } from 'ol/extent';
import LayerVector from 'M/layer/Vector';
import OLSourceCluster from 'ol/source/Cluster';
import OLSourceVector from 'ol/source/Vector';
import * as OLeasing from 'ol/easing';
import OLFeature from 'ol/Feature';
import OLGeomPolygon from 'ol/geom/Polygon';
import OLGeomPoint from 'ol/geom/Point';
import Polygon from 'M/style/Polygon';
import StylePoint from 'M/style/Point';
import FacadeCluster from 'M/style/Cluster';
import { inverseColor, extendsObj, isFunction, isNullOrEmpty } from 'M/util/Utils';
import * as EventType from 'M/event/eventtype';
import ClusteredFeature from 'M/feature/Clustered';
import Style from './Style';
import AnimatedCluster from '../layer/AnimatedCluster';
import SelectCluster from '../interaction/SelectedCluster';
import Centroid from './Centroid';
import Feature from '../feature/Feature';
import coordinatesConvexHull from '../util/convexhull';

/**
 * @classdesc
 * @api
 * @namespace M.style.Cluster
 */

class Cluster extends Style {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Cluster
   * control
   *
   * @constructor
   * @param {Object} options - config options of user
   * @param {Object} optionsVendor - specified options from ol
   * @api stable
   */
  constructor(options, optionsVendor) {
    super({});

    /**
     *
     * @private
     * @type {M.layer.Vector}
     * @expose
     */
    this.convexHullLayer_ = null;


    /**
     *
     * @private
     * @type {ol.layer.Vector}
     * @expose
     */
    this.oldOLLayer_ = null;

    /**
     *
     * @private
     * @type {Object}
     * @expose
     */
    this.optionsVendor_ = optionsVendor;

    /**
     *
     * @private
     * @type {Object}
     * @expose
     */
    this.options_ = options;

    /**
     *
     * @private
     * @type {AnimatedCluster}
     * @expose
     */
    this.clusterLayer_ = null;

    /**
     *
     * @private
     * @type {M.impl.interaction.SelectCluster}
     * @expose
     */
    this.selectClusterInteraction_ = null;

    /**
     *
     * @private
     * @type {ol.interaction.Hover}
     * @expose
     */
    this.hoverInteraction_ = null;
  }

  /**
   * Apply the style cluster to layer vectorresolution
   *
   * @function
   * @public
   * @param {M.layer.Vector} layer layer where the user apply the cluster
   * @param {M.Map} map
   * @api stable
   * @export
   */
  applyToLayer(layer, map) {
    this.layer_ = layer;
    this.options_ = this.updateLastRange_();
    if (!isNullOrEmpty(this.selectClusterInteraction_)) {
      this.selectClusterInteraction_.clear();
    }
    this.updateCanvas();
    const features = layer.getFeatures();
    if (features.length > 0) {
      this.clusterize_(features);
    } else {
      this.layer_.on(EventType.LOAD, this.clusterize_.bind(this), this);
    }
  }

  /**
   * Gets the select cluster interaction
   *
   * @function
   * @public
   * @api stable
   */
  get selectClusterInteraction() {
    return this.selectClusterInteraction_;
  }
  /**
   * Apply the style cluster to layer vectorresolution
   *
   * @function
   * @private
   * @param {Array<Feature>} features features to clusterize
   * @api stable
   * @export
   */
  clusterize_(features) {
    const olFeatures = features.map(f => f.getImpl().getOLFeature());
    this.clusterLayer_ = new AnimatedCluster({
      name: 'Cluster',
      source: new OLSourceCluster({
        distance: this.options_.distance,
        geometryFunction(feature) {
          return new OLGeomPoint(getCenter(feature.getGeometry().getExtent()));
        },
        source: new OLSourceVector({
          features: olFeatures,
        }),
      }),
      animationDuration: this.optionsVendor_.animationDuration,
      style: this.clusterStyleFn_.bind(this),
      animationMethod: OLeasing[this.optionsVendor_.animationMethod],
    });
    if (this.options_.animated === false) {
      this.clusterLayer_.set('animationDuration', undefined);
    }
    this.clusterLayer_.setZIndex(99999);
    const ol3Layer = this.layer_.getImpl().getOL3Layer();
    if (!(ol3Layer instanceof AnimatedCluster)) {
      this.oldOLLayer_ = ol3Layer;
    }
    this.clusterLayer_.setMaxResolution(this.oldOLLayer_.getMaxResolution());
    this.clusterLayer_.setMinResolution(this.oldOLLayer_.getMinResolution());
    this.layer_.getImpl().setOL3Layer(this.clusterLayer_);

    if (isNullOrEmpty(this.options_.ranges)) {
      this.options_.ranges = this.getDefaultRanges_();
      // this.options_.label.color = '#fff';
    }

    if (this.options_.hoverInteraction !== false) {
      this.addCoverInteraction_();
    }
    if (this.options_.selectInteraction !== false) {
      this.addSelectInteraction_();
    }
  }

  /**
   * This function update a set of ranges  defined by user
   *
   * @function
   * @public
   * @param {Array<Object>} newRanges as new Ranges
   * @return {M.style.Cluster}
   * @api stable
   */
  setRanges(newRanges) {
    if (isNullOrEmpty(newRanges)) {
      this.options_.ranges = this.getDefaultRanges_();
      // this.options_.label.color = '#fff';
    } else {
      this.options_.ranges = newRanges;
    }
  }

  /**
   * This function add the max limit to the last range of cluster options if not exists
   *
   * @function
   * @public
   * @return {object}
   * @api stable
   */
  updateLastRange_() {
    const cloneOptions = extendsObj({}, this.options_);
    if (!isNullOrEmpty(this.options_) && !isNullOrEmpty(this.options_.ranges)) {
      let ranges = cloneOptions.ranges;
      if (ranges.length > 0) {
        ranges = ranges.sort((range, range2) => {
          const min = range.min;
          const min2 = range2.min;
          return min - min2;
        });
        const lastRange = ranges.pop();
        if (isNullOrEmpty(lastRange.max)) {
          const numFeatures = this.layer_.getFeatures().length;
          lastRange.max = numFeatures;
        }
        cloneOptions.ranges.push(lastRange);
      }
    }
    return cloneOptions;
  }


  /**
   * This function set a specified range
   *
   * @function
   * @public
   * @param {number} min as range minimal value to be overwritten
   * @param {number} max as range max value to be overwritten
   * @param {number} newRange as the new range
   * @param {M.layer.Vector} layer is the Cluster layer
   * @param {M.style.Cluster} cluster as the cluster to update his range
   * @return {M.style.Cluster}
   * @api stable
   */
  static updateRangeImpl(min, max, newRange, layer, cluster) {
    const element = cluster
      .getOptions().ranges.find(el => (el.min === min && el.max === max)) || false;
    if (element) {
      element.style = newRange;
    }
    return element;
  }

  /**
   * This function set if layer must be animated
   *
   * @function
   * @public
   * @param {boolean} animated defining if layer must be animated
   * @param {M.layer.Vector} layer is the Cluster layer
   * @param {M.style.Cluster} Cluster is the Cluster being chamge the animation
   * @return {M.style.Cluster}
   * @api stable
   */

  setAnimated(animated, layer, cluster) {
    const clusterVariable = cluster;
    clusterVariable.getOptions().animated = animated;
    if (animated === false) {
      this.clusterLayer_.set('animationDuration', undefined);
    } else {
      this.clusterLayer_.set('animationDuration', this.optionsVendor_.animationDuration);
    }
    return this;
  }

  /**
   * Add selected interaction and layer to see the features of cluster
   *
   * @function
   * @private
   * @api stable
   */
  addSelectInteraction_() {
    const map = this.layer_.getImpl().getMap();
    this.selectClusterInteraction_ = new SelectCluster({
      fLayer: this.layer_,
      map,
      maxFeaturesToSelect: this.options_.maxFeaturesToSelect,
      pointRadius: this.optionsVendor_.distanceSelectFeatures,
      animate: true,
      // style: this.clusterStyleFn_.bind(this),
      layers: [this.clusterLayer_],
    });
    this.selectClusterInteraction_.on('select', this.selectClusterFeature_.bind(this), this);
    map.getMapImpl().addInteraction(this.selectClusterInteraction_);
    map.getMapImpl().on('change:view', evt => this.selectClusterInteraction_.refreshViewEvents(evt));
  }

  /**
   * Remove selected interaction and layer to see the features of cluster
   *
   * @function
   * @private
   * @api stable
   */
  removeSelectInteraction_() {
    this.layer_.getImpl().getMap().getMapImpl().removeInteraction(this.selectClusterInteraction_);
  }

  /**
   * Add cover interaction and layer to see the cover
   *
   * @function
   * @private
   * @param {Array<Features>} features
   * @param {M.evt.EventType} evt
   * @api stable
   */
  hoverFeatureFn_(features, evt) {
    if (!isNullOrEmpty(features)) {
      let hoveredFeatures = [];
      features.forEach((hoveredFeature) => {
        if (hoveredFeature instanceof ClusteredFeature) {
          hoveredFeatures = hoveredFeatures.concat(hoveredFeature.getAttribute('features'));
        } else {
          hoveredFeatures.push(hoveredFeature);
        }
      });

      const coordinates = hoveredFeatures
        .map(f => f.getImpl().getOLFeature().getGeometry().getCoordinates());
      const convexHull = coordinatesConvexHull(coordinates);
      if (convexHull.length > 2) {
        const convexOlFeature = new OLFeature(new OLGeomPolygon([convexHull]));
        const convexFeature = Feature.olFeature2Facade(convexOlFeature);
        if (isNullOrEmpty(this.convexHullLayer_)) {
          this.convexHullLayer_ = new LayerVector({
            name: `cluster_cover_${this.layer_.name}`,
            extract: false,
          }, {
            displayInLayerSwitcher: false,
            style: new Polygon(this.optionsVendor_.convexHullStyle),
          });
          this.convexHullLayer_.addFeatures(convexFeature);
          this.layer_.getImpl().getMap().addLayers(this.convexHullLayer_);
          this.layer_.getImpl().getMap().getMapImpl().getView()
            .on('change:resolution', this.clearConvexHull.bind(this), this);
          this.convexHullLayer_.setStyle(new Polygon(this.optionsVendor_.convexHullStyle));
          this.convexHullLayer_.setZIndex(99990);
        } else {
          this.convexHullLayer_.removeFeatures(this.convexHullLayer_.getFeatures());
          this.convexHullLayer_.addFeatures(convexFeature);
        }
      }
    }
  }

  /**
   * Add cover interaction and layer to see the cover
   * @function
   * @private
   * @param {Array<Features>} features
   * @param {M.evt.EventType} evt
   * @api stable
   */
  leaveFeatureFn_(features, evt) {
    if (!isNullOrEmpty(this.convexHullLayer_)) {
      this.convexHullLayer_.removeFeatures(this.convexHullLayer_.getFeatures());
    }
  }

  /**
   * Add cover interaction and layer to see the cover
   *
   * @function
   * @private
   * @api stable
   */
  addCoverInteraction_() {
    this.hoverKey_ = this.layer_.on(EventType.HOVER_FEATURES, this.hoverFeatureFn_.bind(this));
    this.leaveKey_ = this.layer_.on(EventType.LEAVE_FEATURES, this.leaveFeatureFn_.bind(this));
  }

  /**
   * Add cover interaction and layer to see the cover
   *
   * @function
   * @private
   * @api stable
   */
  removeCoverInteraction_() {
    this.layer_.unByKey(EventType.HOVER_FEATURES, this.hoverKey_);
    this.layer_.unByKey(EventType.LEAVE_FEATURES, this.leaveKey_);
  }

  /**
   * This function is a style function to cluster
   * Get a style from ranges of user or default ranges
   *
   * @function
   * @private
   * @param {M.Feature} feature
   * @param {float} resolution
   * @param {M.impl.interaction.SelectCluster} selected
   * @return {object}
   * @api stable
   * @export
   */
  clusterStyleFn_(feature, resolution, selected) {
    let olStyle;
    const clusterOlFeatures = feature.get('features');
    if (!clusterOlFeatures) {
      return new Centroid();
    }
    const numFeatures = clusterOlFeatures.length;
    const range = this.options_.ranges.find(el => (el.min <= numFeatures && el.max >= numFeatures));
    if (!isNullOrEmpty(range)) {
      const style = range.style.clone();
      if (selected) {
        style.set('fill.opacity', 0.33);
      } else if (this.options_.displayAmount) {
        style.set('label', this.options_.label);
        let labelColor = style.get('label.color');
        if (isNullOrEmpty(labelColor)) {
          const fillColor = style.get('fill.color');
          if (!isNullOrEmpty(fillColor)) {
            labelColor = inverseColor(fillColor);
          } else {
            labelColor = '#000';
          }
          style.set('label.color', labelColor);
        }
      }
      olStyle = style.getImpl().olStyleFn(feature, resolution);
    } else if (numFeatures === 1) {
      let clusterOlFeatureStyle = clusterOlFeatures[0].getStyle();
      if (!clusterOlFeatureStyle) {
        clusterOlFeatureStyle = this.oldOLLayer_.getStyle();
      }
      olStyle = clusterOlFeatureStyle(clusterOlFeatures[0], resolution);
      olStyle[0].setGeometry(clusterOlFeatures[0].getGeometry());
    }
    return olStyle;
  }

  /**
   * This function return a default ranges to cluster
   *
   * @function
   * @private
   * @return {Array<Ranges>}
   * @api stable
   * @export
   */
  getDefaultRanges_() {
    const numFeatures = this.layer_.getFeatures().length;
    let breakpoint = Math.floor(numFeatures / 3);
    // min value is 3 in order to get valid clusters ranges
    breakpoint = Math.max(breakpoint, 3);
    const ranges = [{
      min: 2,
      max: breakpoint,
      style: new StylePoint(FacadeCluster.RANGE_1_DEFAULT),
    }, {
      min: breakpoint,
      max: breakpoint * 2,
      style: new StylePoint(FacadeCluster.RANGE_2_DEFAULT),
    }, {
      min: breakpoint * 2,
      max: numFeatures + 1,
      style: new StylePoint(FacadeCluster.RANGE_3_DEFAULT),
    }];
    this.options_.ranges = ranges;
    return ranges;
  }
  /**
   * Select feautes to get info.
   * the first feature is cluster (evt.selected)
   *This feature has a propertie called (features), this
   *
   * @function
   * @private
   * @api stable
   */
  selectClusterFeature_(evt) {
    this.clearConvexHull();
    // if (!isNullOrEmpty(evt.selected)) {
    //   let olFeatures = evt.selected[0].get('features');
    //   let features = olFeatures.map(M.impl.Feature.olFeature2Facade);
    //   this.layer_.fire(M.evt.SELECT_FEATURES, [features, evt]);
    // }
  }

  /**
   * This function remove the style to specified layer
   * @function
   * @public
   * @api stable
   */
  unapply() {
    if (!isNullOrEmpty(this.clusterLayer_)) {
      this.layer_.getImpl().setOL3Layer(this.oldOLLayer_);
      this.oldOLLayer_.setMaxResolution(this.clusterLayer_.getMaxResolution());
      this.oldOLLayer_.setMinResolution(this.clusterLayer_.getMinResolution());
      this.removeCoverInteraction_();
      this.removeSelectInteraction_();
      this.clearConvexHull();
      this.deactivateChangeResolutionEvent();
      this.layer_.redraw();
      this.deactivateChangeEvent();
    } else if (!isNullOrEmpty(this.layer_)) {
      this.layer_.un(EventType.LOAD, this.clusterize_.bind(this), this);
    }
  }

  /**
   * TODO
   */
  clearConvexHull() {
    if (this.convexHullLayer_ !== null) {
      this.layer_.getImpl().getMap().removeLayers(this.convexHullLayer_);
      this.convexHullLayer_ = null;
    }
  }

  /**
   * This function
   * @public
   * @param {object} canvas
   * @function
   * @api stable
   */
  updateCanvas() {}

  /**
   * TODO
   * @public
   * @param {object} canvas
   * @function
   * @api stable
   */
  activateChangeEvent() {
    if (this.clusterLayer_ !== null) {
      const clusterSource = this.clusterLayer_.getSource();
      const callback = OLSourceCluster.prototype.refresh;
      clusterSource.getSource().on('change', callback);
    }
  }

  /**
   * TODO
   * @public
   * @param {object} canvas
   * @function
   * @api stable
   */
  deactivateChangeEvent() {
    if (this.clusterLayer_ !== null) {
      const clusterSource = this.clusterLayer_.getSource();
      const callback = OLSourceCluster.prototype.refresh;
      unByKey({
        bindTo: undefined,
        callOnce: false,
        listener: callback,
        target: clusterSource.getSource(),
        type: 'change',
      });
    }
  }


  /**
   * TODO
   * @public
   * @param {object} canvas
   * @function
   * @api stable
   */
  deactivateChangeResolutionEvent() {
    if (!isNullOrEmpty(this.layer_) && !isNullOrEmpty(this.layer_.getImpl())) {
      const impl = this.layer_.getImpl();
      const map = impl.getMap();
      if (!isNullOrEmpty(map) && !isNullOrEmpty(map.getMapImpl())) {
        const olView = map.getMapImpl().getView();
        unByKey({
          type: 'change:resolution',
          bindTo: undefined,
          listener: this.clearConvexHull,
          target: olView,
          callOnce: false,
        });
      }
    }
  }


  /**
   * TODO
   * @public
   * @param {object} canvas
   * @function
   * @api stable
   */
  deactivateTemporarilyChangeEvent(callback, callbackArguments) {
    this.deactivateChangeEvent();
    if (isFunction(callback)) {
      if (callbackArguments == null) {
        callback();
      } else {
        callback(...callbackArguments);
      }
    }
  }

  /**
   * oldOLLayer getter
   * @public
   */
  get oldOLLayer() {
    return this.oldOLLayer_;
  }
}

export default Cluster;
