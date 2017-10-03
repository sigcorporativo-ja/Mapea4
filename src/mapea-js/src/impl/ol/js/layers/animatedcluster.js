goog.provide('M.impl.layer.AnimatedCluster');


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
M.impl.layer.AnimatedCluster = function(options = {}) {
  // super
  goog.base(this, options);

  /**
   * TODO
   * @private
   * @type {ol.source.Vector}
   * @expose
   */
  this.oldCluster_ = new ol.source.Vector();

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
    start: false
  };

  this.set('animationDuration', typeof(options.animationDuration) == 'number' ? options.animationDuration : 700);
  this.set('animationMethod', options.animationMethod || ol.easing.easeOut);

  // Save cluster before change
  this.getSource().on('change', this.saveCluster_, this);
  // Animate the cluster
  this.on('precompose', this.animate, this);
  this.on('postcompose', this.postanimate, this);
};
goog.inherits(M.impl.layer.AnimatedCluster, ol.layer.Vector);

/**
 * This function sets the map object of the layer
 *
 * @public
 * @function
 * @param {M.impl.Map} map
 * @api stable
 */
M.impl.layer.AnimatedCluster.prototype.saveCluster_ = function() {
  // console.log(this.oldCluster_.getFeatues().length, this.getSource().getFeatues().length);
  this.oldCluster_.clear();
  if (!this.get('animationDuration')) return;

  let olFeatures = this.getSource().getFeatures();
  if (olFeatures.length && olFeatures[0].get('features')) {
    this.oldCluster_.addFeatures(this.clusters_);
    this.clusters_ = olFeatures.slice(0);
    this.sourceChanged = true;
  }
};

/**
 * This function sets the map object of the layer
 *
 * @public
 * @function
 * @param {M.impl.Map} map
 * @api stable
 */
M.impl.layer.AnimatedCluster.getClusterForFeature_ = function(feature, clusters) {
  return clusters.find(cluster => {
    let clusterFeatures = cluster.get('features');
    if (!M.utils.isNullOrEmpty(clusterFeatures)) {
      return clusterFeatures.find(clusterFeature => clusterFeature === feature);
    }
  });
};

/**
 * This function sets the map object of the layer
 *
 * @public
 * @function
 * @param {M.impl.Map} map
 * @api stable
 */
M.impl.layer.AnimatedCluster.prototype.animate = function(event) {
  let duration = this.get('animationDuration');
  if (!duration) return;

  // Start a new animation, if change resolution and source has changed
  if (this.animation_.resolution != event.frameState.viewState.resolution && this.sourceChanged) {
    this.animation_.reverse = this.animation_.resolution >= event.frameState.viewState.resolution;
    this.prepareAnimation_(event.frameState.extent, event.frameState.viewState.resolution);
    event.frameState.time = this.animation_.start;
  }

  let numClusters = this.animation_.clustersFrom.length;
  if (numClusters > 0 && numClusters <= 1000 && this.animation_.start) {
    let vectorContext = event.vectorContext;
    let animationProgress = (event.frameState.time - this.animation_.start) / duration;

    // Animation ends
    if (animationProgress > 1) {
      this.animation_.start = false;
      animationProgress = 1;
    }
    animationProgress = this.get('animationMethod')(animationProgress);

    // Layer opacity
    event.context.save();
    event.context.globalAlpha = this.getOpacity();

    this.animation_.clustersFrom.forEach(function(cluster, i) {
      let ptFrom = cluster.getGeometry().getCoordinates();
      let ptTo = this.animation_.clustersTo[i].getGeometry().getCoordinates();

      // console.log(ptTo[0] === ptFrom[0] && ptTo[1] === ptFrom[1], animationProgress, reverse);
      if (this.animation_.reverse) {
        ptFrom[0] = ptTo[0] + animationProgress * (ptFrom[0] - ptTo[0]);
        ptFrom[1] = ptTo[1] + animationProgress * (ptFrom[1] - ptTo[1]);
      }
      else {
        ptFrom[0] = ptFrom[0] + animationProgress * (ptTo[0] - ptFrom[0]);
        ptFrom[1] = ptFrom[1] + animationProgress * (ptTo[1] - ptFrom[1]);
      }
      // Draw feature
      let olStyles = this.getStyle()(cluster, event.frameState.viewState.resolution);
      let geo = new ol.geom.Point(ptFrom);
      if (!M.utils.isNullOrEmpty(olStyles)) {
        olStyles.forEach(function(olStyle) {
          let styleImage = olStyle.getImage();
          if (!M.utils.isNullOrEmpty(styleImage)) {
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
    }, this);

    event.context.restore();
    // tell OL3 to continue postcompose animation
    event.frameState.animate = true;

    // Prevent layer drawing (clip with null rect)
    event.context.save();
    event.context.beginPath();
    event.context.rect(0, 0, 0, 0);
    event.context.clip();
    this.clip_ = true;
  }
  else { // too much to animate
    this.animation_.clustersFrom.length = 0;
    this.animation_.clustersTo.length = 0;
    this.animation_.start = false;
  }
};

/**
 * This function sets the map object of the layer
 *
 * @private
 * @function
 * @api stable
 */
M.impl.layer.AnimatedCluster.prototype.prepareAnimation_ = function(extent, resolution) {
  this.animation_.clustersFrom = [];
  this.animation_.clustersTo = [];

  let extentBuff = ol.extent.buffer(extent, 100 * resolution);

  let oldClusters = this.oldCluster_.getFeaturesInExtent(extentBuff);
  let currentClusters = this.getSource().getFeaturesInExtent(extentBuff);

  let clustersFrom = this.animation_.reverse ? currentClusters : oldClusters;
  let clustersTo = this.animation_.reverse ? oldClusters : currentClusters;

  clustersFrom.forEach(function(clusterFrom) {
    let clusterFeatures = clusterFrom.get('features');
    if (!M.utils.isNullOrEmpty(clusterFeatures)) {
      let clusterTo = M.impl.layer.AnimatedCluster.getClusterForFeature_(clusterFeatures[0], clustersTo);
      if (!M.utils.isNullOrEmpty(clusterTo) && clusterTo !== false) {
        this.animation_.clustersFrom.push(clusterFrom);
        this.animation_.clustersTo.push(clusterTo);
      }
    }
  }, this);

  // Save state
  this.animation_.resolution = resolution;
  this.sourceChanged = false;

  // Start animation from now
  this.animation_.start = (new Date()).getTime();
};

/**
 * This function sets the map object of the layer
 *
 * @public
 * @function
 * @param {M.impl.Map} map
 * @api stable
 */
M.impl.layer.AnimatedCluster.prototype.postanimate = function(e) {
  if (this.clip_) {
    e.context.restore();
    this.clip_ = false;
  }
};
