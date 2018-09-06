import { isNullOrEmpty } from 'facade/js/util/Utils';
import OLLayerVector from 'ol/layer/Vector';
import OLSourceVector from 'ol/source/Vector';
import OLGeomPoint from 'ol/geom/Point';
import { easeOut } from 'ol/easing';
import { buffer } from 'ol/extent';

export default class AnimatedCluster extends OLLayerVector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a AnimatedCluster layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.layer.Vector}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor(options = {}) {
    super(options);

    /**
     * TODO
     * @private
     * @type {ol.style.StyleFunction}
     * @expose
     */
    this.styleCluster_ = options.style;

    // super

    /**
     * TODO
     * @private
     * @type {ol.source.Vector}
     * @expose
     */
    this.oldCluster_ = new OLSourceVector();

    /**
     * TODO
     * @private
     * @type {Array<ol.Feature>}
     * @expose
     */
    this.clusters_ = [];

    /**
     * TODO
     * @private
     * @type {Object}
     * @expose
     */
    this.animation_ = {
      start: false,
    };

    this.set('animationDuration', typeof options.animationDuration === 'number' ? options.animationDuration : 700);
    this.set('animationMethod', options.animationMethod || easeOut);

    // Save cluster before change
    this.getSource().on('change', this.saveCluster_.bind(this));
    // Animate the cluster
    this.on('precompose', this.animate.bind(this));
    this.on('postcompose', this.postanimate.bind(this));
    this.setStyle(options.style);
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  saveCluster_() {
    this.oldCluster_.clear();
    if (!this.get('animationDuration')) return;

    const olFeatures = this.getSource().getFeatures();
    if (olFeatures.length && olFeatures[0].get('features')) {
      this.oldCluster_.addFeatures(this.clusters_);
      this.clusters_ = olFeatures.slice(0);
      this.sourceChanged = true;
    }
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  static getClusterForFeature(feature, clusters) {
    return clusters.find((cluster) => {
      const clusterFeatures = cluster.get('features');
      let result;
      if (!isNullOrEmpty(clusterFeatures)) {
        result = clusterFeatures.find(clusterFeature => clusterFeature === feature);
      }
      return result;
    });
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  animate(event) {
    const eventVariable = event;
    const duration = this.get('animationDuration');
    if (!duration) return;

    // Start a new animation, if change resolution and source has changed
    if (this.animation_.resolution !== eventVariable.frameState.viewState.resolution &&
      this.sourceChanged) {
      const resolution = eventVariable.frameState.viewState.resolution;
      const extent = eventVariable.frameState.extent;
      this.animation_.reverse = this.animation_.resolution >= resolution;
      this.prepareAnimation_(extent, eventVariable.frameState.viewState.resolution);
      eventVariable.frameState.time = this.animation_.start;
    }

    const numClusters = this.animation_.clustersFrom.length;
    if (numClusters > 0 && numClusters <= 1000 && this.animation_.start) {
      const vectorContext = eventVariable.vectorContext;
      let animationProgress = (eventVariable.frameState.time - this.animation_.start) / duration;

      // Animation ends
      if (animationProgress > 1) {
        this.animation_.start = false;
        animationProgress = 1;
      }
      animationProgress = this.get('animationMethod')(animationProgress);

      // Layer opacity
      eventVariable.context.save();
      eventVariable.context.globalAlpha = this.getOpacity();

      this.animation_.clustersFrom.forEach((cluster, i) => {
        const ptFrom = cluster.getGeometry().getCoordinates();
        const ptTo = this.animation_.clustersTo[i].getGeometry().getCoordinates();

        // console.log(ptTo[0] === ptFrom[0] && ptTo[1] === ptFrom[1], animationProgress, reverse);
        if (this.animation_.reverse) {
          ptFrom[0] = ptTo[0] + (animationProgress * (ptFrom[0] - ptTo[0]));
          ptFrom[1] = ptTo[1] + (animationProgress * (ptFrom[1] - ptTo[1]));
        } else {
          ptFrom[0] += animationProgress * (ptTo[0] - ptFrom[0]);
          ptFrom[1] += animationProgress * (ptTo[1] - ptFrom[1]);
        }
        // Draw feature
        const olStyles = this.getStyle()(cluster, eventVariable.frameState.viewState.resolution);
        const geo = new OLGeomPoint(ptFrom);
        if (!isNullOrEmpty(olStyles)) {
          olStyles.forEach((olStyle) => {
            const styleImage = olStyle.getImage();
            if (!isNullOrEmpty(styleImage)) {
              // TODO
              /* eslint-disable */
              if (styleImage.getOrigin() == null) {
                styleImage.origin_ = [];
              }
              if (styleImage.getAnchor() == null) {
                styleImage.normalizedAnchor_ = [];
              }
              if (styleImage.getSize() == null) {
                styleImage.size_ = [];
              }
            }
            vectorContext.setStyle(olStyle);
            vectorContext.drawGeometry(geo);
          });
        }
      });

      eventVariable.context.restore();
      // tell OL3 to continue postcompose animation
      eventVariable.frameState.animate = true;

      // PreventVariable layer drawing (clip with null rect)
      eventVariable.context.save();
      eventVariable.context.beginPath();
      eventVariable.context.rect(0, 0, 0, 0);
      eventVariable.context.clip();
      this.clip_ = true;
    } else { // too much to animate
      this.animation_.clustersFrom.length = 0;
      this.animation_.clustersTo.length = 0;
      this.animation_.start = false;
    }
  }

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   * @api stable
   */
  prepareAnimation_(extent, resolution) {
    this.animation_.clustersFrom = [];
    this.animation_.clustersTo = [];

    const extentBuff = buffer(extent, 100 * resolution);

    const oldClusters = this.oldCluster_.getFeaturesInExtent(extentBuff);
    const currentClusters = this.getSource().getFeaturesInExtent(extentBuff);

    const clustersFrom = this.animation_.reverse ? currentClusters : oldClusters;
    const clustersTo = this.animation_.reverse ? oldClusters : currentClusters;

    clustersFrom.forEach((clusterFrom) => {
      const clusterFeatures = clusterFrom.get('features');
      if (!isNullOrEmpty(clusterFeatures)) {
        const clusterTo = AnimatedCluster.getClusterForFeature(clusterFeatures[0], clustersTo);
        if (!isNullOrEmpty(clusterTo) && clusterTo !== false) {
          this.animation_.clustersFrom.push(clusterFrom);
          this.animation_.clustersTo.push(clusterTo);
        }
      }
    });

    // Save state
    this.animation_.resolution = resolution;
    this.sourceChanged = false;

    // Start animation from now
    this.animation_.start = (new Date()).getTime();
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  postanimate(e) {
    if (this.clip_) {
      e.context.restore();
      this.clip_ = false;
    }
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  setStyle(style) {
    super.setStyle(this.styleCluster_);
  }
}
