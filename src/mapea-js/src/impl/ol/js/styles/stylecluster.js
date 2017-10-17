goog.provide('M.impl.style.Cluster');

goog.require('M.impl.Style');
goog.require('M.impl.style.CentroidStyle');
goog.require('M.impl.layer.AnimatedCluster');
goog.require('M.impl.interaction.SelectCluster');
goog.require('ol.source.Cluster');
goog.require('ol.geom.convexhull');
/**
 * @namespace M.style.Cluster
 */
(function() {
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
  M.impl.style.Cluster = function(options, optionsVendor) {
    /**
     * TODO
     * @private
     * @type {M.layer.Vector}
     * @expose
     */
    this.convexHullLayer_ = null;

    goog.base(this, {});

    /**
     * TODO
     * @private
     * @type {ol.layer.Vector}
     * @expose
     */
    this.oldOLLayer_ = null;

    /**
     * TODO
     * @private
     * @type {Object}
     * @expose
     */
    this.optionsVendor_ = optionsVendor;

    /**
     * TODO
     * @private
     * @type {Object}
     * @expose
     */
    this.options_ = options;

    /**
     * TODO
     * @private
     * @type {M.impl.layer.AnimatedCluster}
     * @expose
     */
    this.clusterLayer_ = null;

    /**
     * TODO
     * @private
     * @type {M.impl.interaction.SelectCluster}
     * @expose
     */
    this.selectClusterInteraction_ = null;

    /**
     * TODO
     * @private
     * @type {ol.interaction.Hover}
     * @expose
     */
    this.hoverInteraction_ = null;
  };
  goog.inherits(M.impl.style.Cluster, M.impl.Style);

  /**
   * Apply the style cluster to layer vectorresolution
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.applyToLayer = function(layer, map) {
    this.layer_ = layer;
    if (!M.utils.isNullOrEmpty(this.selectClusterInteraction_)) {
      this.selectClusterInteraction_.clear();
    }
    this.updateCanvas();
    let features = layer.getFeatures();
    if (features.length > 0) {
      this.clusterize_(features);
    }
    else {
      this.layer_.on(M.evt.LOAD, this.clusterize_, this);
    }
  };

  /**
   * Apply the style cluster to layer vectorresolution
   *
   * @private
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.clusterize_ = function(features) {
    let olFeatures = features.map(f => f.getImpl().getOLFeature());
    this.clusterLayer_ = new M.impl.layer.AnimatedCluster({
      name: 'Cluster',
      source: new ol.source.Cluster({
        distance: this.options_.distance,
        source: new ol.source.Vector({
          features: olFeatures
        })
      }),
      animationDuration: this.optionsVendor_.animationDuration,
      style: this.clusterStyleFn_.bind(this),
      animationMethod: ol.easing[this.optionsVendor_.animationMethod]
    });
    if (this.options_.animated === false) {
      this.clusterLayer_.set('animationDuration', undefined);
    }
    this.clusterLayer_.setZIndex(99999);
    this.oldOLLayer_ = this.layer_.getImpl().getOL3Layer();
    this.layer_.getImpl().setOL3Layer(this.clusterLayer_);

    if (M.utils.isNullOrEmpty(this.options_.ranges)) {
      this.options_.ranges = this.getDefaultRanges_();
    }

    if (this.options_.hoverInteraction !== false) {
      this.addCoverInteraction_();
    }
    if (this.options_.selectInteraction !== false) {
      this.addSelectInteraction_();
    }
  };

  /**
   * This function update a set of ranges  defined by user
   *
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.setRanges = function(newRanges) {
    if (M.utils.isNullOrEmpty(newRanges)) {
      this.options_.ranges = this.getDefaultRanges_();
    }
    else {
      this.options_.ranges = newRanges;
    }
  };

  /**
   * This function set a specified range
   *
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.updateRangeImpl = function(min, max, newRange, layer, cluster) {
    let element = cluster.options_.ranges.find(el => (el.min == min && el.max == max));
    if (element) {
      element.style = newRange;
      return element;
    }
    else {
      return false;
    }
  };

  /**
   * This function set if layer must be animated
   *
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.setAnimated = function(animated, layer, cluster) {
    cluster.options_.animated = animated;
    if (animated === false) {
      this.clusterLayer_.set('animationDuration', undefined);
    }
    else {
      this.clusterLayer_.set('animationDuration', this.optionsVendor_.animationDuration);
    }
    return this;
  };

  /**
   * Add selected interaction and layer to see the features of cluster
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.addSelectInteraction_ = function() {
    let map = this.layer_.getImpl().getMap();
    this.selectClusterInteraction_ = new M.impl.interaction.SelectCluster({
      map: map,
      maxFeaturesToSelect: this.options_.maxFeaturesToSelect,
      pointRadius: this.optionsVendor_.distanceSelectFeatures,
      animate: true,
      style: this.clusterStyleFn_.bind(this)
      // style: function(feature, resolution) {
      //   let style = this.clusterStyleFn_(feature, resolution, true);
      //   if (feature.get('features').length < 2) {
      //     feature = feature.get('features')[0];
      //     style = this.layer_.getStyle().getOldStyle().getImpl().olStyleFn_(feature, resolution);
      //   }
      //   return style;
      // }.bind(this),
      // style: function(f, res) {
      //   var cluster = f.get('features');
      //   // cluster style
      //   if (cluster && cluster.length > 1) {
      //     return this.clusterStyleFn_(f, res, true);
      //   }
      // }.bind(this)
    });
    this.selectClusterInteraction_.on('select', this.selectClusterFeature_, this);
    map.getMapImpl().addInteraction(this.selectClusterInteraction_);
  };

  /**
   * TODO
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.removeSelectInteraction_ = function() {
    this.layer_.getImpl().getMap().getMapImpl().removeInteraction(this.selectClusterInteraction_);
  };

  /**
   * Add cover interaction and layer to see the cover
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.hoverFeatureFn_ = function(features, evt) {
    if (!M.utils.isNullOrEmpty(features)) {
      let convexHull = ol.coordinate.convexHull(features.map(f => f.getImpl().getOLFeature().getGeometry().getCoordinates()));
      if (convexHull.length > 2) {
        let convexOlFeature = new ol.Feature(new ol.geom.Polygon([convexHull]));
        let convexFeature = M.impl.Feature.olFeature2Facade(convexOlFeature);
        if (M.utils.isNullOrEmpty(this.convexHullLayer_)) {
          this.convexHullLayer_ = new M.layer.Vector({
            name: "cluster_cover",
            extract: false
          }, {
            displayInLayerSwitcher: false,
            style: new M.style.Polygon(this.optionsVendor_.convexHullStyle)
          });
          this.convexHullLayer_.addFeatures(convexFeature);
          this.layer_.getImpl().getMap().addLayers(this.convexHullLayer_);
          this.convexHullLayer_.setStyle(new M.style.Polygon(this.optionsVendor_.convexHullStyle));
          this.convexHullLayer_.setZIndex(99990);
        }
        else {
          this.convexHullLayer_.removeFeatures(this.convexHullLayer_.getFeatures());
          this.convexHullLayer_.addFeatures(convexFeature);
        }
      }
    }
  };

  /**
   * Add cover interaction and layer to see the cover
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.leaveFeatureFn_ = function(features, evt) {
    if (!M.utils.isNullOrEmpty(this.convexHullLayer_)) {
      this.convexHullLayer_.removeFeatures(this.convexHullLayer_.getFeatures());
    }
  };

  /**
   * Add cover interaction and layer to see the cover
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.addCoverInteraction_ = function() {
    this.layer_.on(M.evt.HOVER_FEATURE, this.hoverFeatureFn_, this);
    this.layer_.on(M.evt.LEAVE_FEATURE, this.leaveFeatureFn_, this);
  };

  /**
   * Add cover interaction and layer to see the cover
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.removeCoverInteraction_ = function() {
    this.layer_.un(M.evt.HOVER_FEATURE, this.hoverFeatureFn_, this);
    this.layer_.un(M.evt.LEAVE_FEATURE, this.leaveFeatureFn_, this);
  };

  /**
   * This function is a style function to cluster
   * Get a style from ranges of user or default ranges
   *
   * @private
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.clusterStyleFn_ = function(feature, resolution, selected) {
    let olStyle;
    let clusterOlFeatures = feature.get('features');
    if (!clusterOlFeatures) {
      return new M.impl.style.CentroidStyle();
    }
    let numFeatures = clusterOlFeatures.length;
    let range = this.options_.ranges.find(el => (el.min <= numFeatures && el.max >= numFeatures));
    if (!M.utils.isNullOrEmpty(range)) {
      let style = range.style.clone();
      if (selected) {
        style.set('fill.opacity', 0.33);
      }
      else if (this.options_.displayAmount) {
        style.set('label', this.options_.label);
        let labelColor = style.get('label.color');
        if (M.utils.isNullOrEmpty(labelColor)) {
          let fillColor = style.get('fill.color');
          if (!M.utils.isNullOrEmpty(fillColor)) {
            labelColor = M.utils.inverseColor(fillColor);
          }
          else {
            labelColor = '#000';
          }
          style.set('label.color', labelColor);
        }
      }
      olStyle = style.getImpl().olStyleFn_(feature, resolution);
    }
    else if (numFeatures === 1) {
      olStyle = clusterOlFeatures[0].getStyleFunction()(clusterOlFeatures[0], resolution);
    }
    return olStyle;
  };

  /**
   * This function return a default ranges to cluster
   *
   * @private
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.getDefaultRanges_ = function() {
    let breakpoint = Math.floor(this.layer_.getFeatures().length / 3);
    let ranges = [{
      min: 2,
      max: breakpoint,
      style: new M.style.Point(M.style.Cluster.RANGE_1_DEFAULT)
      }, {
      min: breakpoint,
      max: (breakpoint * 2),
      style: new M.style.Point(M.style.Cluster.RANGE_2_DEFAULT)
      }, {
      min: (breakpoint * 2),
      max: (breakpoint * 3) + 1,
      style: new M.style.Point(M.style.Cluster.RANGE_3_DEFAULT)
    }];
    return ranges;
  };
  /**
   * Select feautes to get info.
   * the first feature is cluster (evt.selected)
   *This feature has a propertie called (features), this
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.selectClusterFeature_ = function(evt) {
    // console.log(evt);
    // if (!M.utils.isNullOrEmpty(evt.selected)) {
    //   let selectedFeatures = evt.selected[0].get('features');
    //   if (!M.utils.isNullOrEmpty(selectedFeatures)) {
    //     let feature = evt.selected[0].getProperties().features[0];
    //     let features = [M.impl.Feature.olFeature2Facade(feature)];
    //     let layerImpl = this.mLayer.getImpl();
    //     if (M.utils.isFunction(layerImpl.selectFeatures)) {
    //       layerImpl.selectFeatures(features, feature.getGeometry().getCoordinates(), evt);
    //     }
    //     this.mLayer.fire(M.evt.SELECT_FEATURES, [features, evt]);
    // }
  };

  /**
   * remove style cluster
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.unapply = function() {
    if (!M.utils.isNullOrEmpty(this.clusterLayer_)) {
      let clusterSource = this.clusterLayer_.getSource();
      clusterSource.getSource().un(ol.events.EventType.CHANGE, ol.source.Cluster.prototype.refresh_, clusterSource);
      this.layer_.getImpl().setOL3Layer(this.oldOLLayer_);
      this.removeCoverInteraction_();
      this.removeSelectInteraction_();
      this.layer_.getImpl().getMap().removeLayers(this.convexHullLayer_);
    }
    else {
      this.layer_.un(M.evt.LOAD, this.clusterize_, this);
    }
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.updateCanvas = function(canvas) {
    // let canvasSize = this.getCanvasSize();
    // let vectorContext = ol.render.toContext(canvas.getContext('2d'), {
    //   size: canvasSize
    // });
    // vectorContext.setStyle(this.olStyleFn_()[0]);
    // this.drawGeometryToCanvas(vectorContext);
  };
})();
