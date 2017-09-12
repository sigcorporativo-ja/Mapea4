goog.provide('M.impl.style.Cluster');

goog.require('M.impl.layer.AnimatedCluster');
goog.require('ol.source.Cluster');
goog.require('M.impl.interaction.SelectCluster');
goog.require('ol.interaction.Hover');
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
    this.numFeaturesToDoCluster = 0;
    this.styleCache = [];
    this.olLayerOld = null;
    this.vectorCover = null;
    this.optionsVendor = optionsVendor;
    this.options = options;
    this.clusterSource = new ol.source.Cluster({
      distance: this.options.distance,
      source: new ol.source.Vector()
    });
    this.clusterLayer = new M.impl.layer.AnimatedCluster({
      name: 'Cluster',
      source: this.clusterSource,
      animationDuration: optionsVendor.animationDuration,
      style: this.getStyle.bind(this),
      animationMethod: ol.easing[optionsVendor.animationMethod]
    });
    if (this.options.animated === false) {
      this.clusterLayer.set('animationDuration', undefined);
    }
  };
  /**
   * Apply the style cluster to layer vectorresolution
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.applyToLayer = function(layer) {
    this.mLayer = layer;
    let map = layer.getImpl().map;
    this.numFeaturesToDoCluster = layer.getFeatures().length;
    if (!M.utils.isArray(this.options.ranges) || (M.utils.isArray(this.options.ranges) && this.options.ranges.length == 0)) {
      this.options.ranges = this.getDefaulStyles();
    }
    let features = layer.getImpl().getOL3Layer().getSource().getFeatures();
    this.clusterSource.getSource().addFeatures(features);
    this.clusterLayer.setZIndex(99999);
    layer.getImpl().setOL3Layer(this.clusterLayer);
    if (this.options.hoverInteraction) {
      this.addCoverInteraction(map);
    }
    if (this.options.selectedInteraction) {
      this.addSelectedInteraction(map);
    }
  };
  /**
   * This function update a set of ranges  defined by user
   *
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.setRangesImpl = function(newRanges, layer, cluster) {
    cluster.options_.ranges = newRanges;
    return cluster;
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
      this.clusterLayer.set('animationDuration', undefined);
    }
    else {
      this.clusterLayer.set('animationDuration', this.optionsVendor.animationDuration);
    }
    return this;
  };
  /**
   * Add selected interaction and layer to see the features of cluster
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.addSelectedInteraction = function(map) {
    this.selectCluster = new M.impl.interaction.SelectCluster({
      map: map,
      maxFeaturesToSelect: this.options.maxFeaturesToSelect || 50,
      pointRadius: this.optionsVendor.distanceSelectFeatures || 15,
      animate: true,
      style: function(f, res) {
        var cluster = f.get('features');
        if (cluster && cluster.length > 1) {
          return this.getStyle(f, res);
        }
        else {
          let style = new ol.style.Style({
            image: new ol.style.Circle({
              stroke: new ol.style.Stroke({
                color: "rgba(0,0,192,0.5)",
                width: 2
              }),
              fill: new ol.style.Fill({
                color: "rgba(0,0,192,0.3)"
              }),
              radius: 5
            })
          });
          return [style];
        }
      }.bind(this)
    });
    this.selectCluster.on('select', this.selectClusterFeature_, this);
    map.getMapImpl().addInteraction(this.selectCluster);
  };
  /**
   * Add cover interaction and layer to see the cover
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.addCoverInteraction = function(map) {
    let olmap = map.getMapImpl();
    this.hoverInteraction = new ol.interaction.Hover({
      cursor: "pointer",
      layerFilter: function(l) {
        return l === this.clusterLayer;
      }.bind(this)
    });
    olmap.addInteraction(this.hoverInteraction);
    this.hoverInteraction.on("enter", function(e) {
      let h = e.feature.get("convexHull");
      if (!h) {
        let cluster = e.feature.get("features");
        if (cluster && cluster.length) {
          let c = [];
          for (var i = 0; i < cluster.length; i++) {
            let f = cluster[i];
            c.push(f.getGeometry().getCoordinates());
          }
          h = ol.coordinate.convexHull(c);
          e.feature.get("convexHull", h);
        }
      }
      if (h.length > 2) {
        let feature = new ol.Feature(new ol.geom.Polygon([h]));
        let mFeature = M.impl.Feature.olFeature2Facade(feature);
        if (this.vectorCover == null) {
          this.vectorCover = new M.layer.Vector({
            name: "cover",
            extract: false
          }, {
            displayInLayerSwitcher: this.optionsVendor.displayInLayerSwitcherHoverLayer || false
          });
          this.vectorCover.addFeatures(mFeature);
          map.addLayers(this.vectorCover);
          this.vectorCover.setZIndex(99990);
        }
        else {
          this.vectorCover.clear();
          this.vectorCover.addFeatures(mFeature);
        }
      }
    }.bind(this));
    this.hoverInteraction.on("leave", function(e) {
      if (this.vectorCover != null) {
        this.vectorCover.clear();
      }
    }.bind(this));
  };
  /**
   * Check if user has defined a individual style
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.hasIndividualStyle = function() {
    let individualStyle = this.options.ranges.find(el => (el.min == 1 && el.max == 1));
    return individualStyle ? true : false;
  };
  /**
   * This function is a style function to cluster
   * Get a style from ranges of user or default ranges
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.getStyle = function(feature, resolution) {
    if (!M.utils.isArray(this.options.ranges) || (M.utils.isArray(this.options.ranges) && this.options.ranges.length == 0)) {
      this.options.ranges = this.getDefaulStyles(this.clusterLayer);
    }
    var size = feature.get('features').length;
    var style = this.styleCache[size];
    if (!style) {
      if (size == 1 && !this.hasIndividualStyle()) {
        let styleFeature = feature.get('features')[0].getStyle();
        if (styleFeature) {
          return styleFeature();
        }
        else {
          return new ol.style.Style.defaultFunction();
        }
      }
      else {
        let range = this.options.ranges.find(el => (el.min <= size && el.max >= size));
        if (range) {
          let style = range.style;
          if (this.options.displayAmount) {


            style.set('label.text', size.toString());
            style.set('label.text.color', '#000');
          }
          return style.getImpl().olStyleFn_(feature, resolution);
        }
        else {
          return new ol.style.Style.defaultFunction();
        }
      }
    }
    return style.getImpl().olStyleFn_(feature, resolution);
  };
  /**
   * This function return a default ranges to cluster
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.getDefaulStyles = function() {
    let isReal = false;
    let range = this.numFeaturesToDoCluster / 3;
    let rangeInt = Math.floor(range);
    if ((range % 1) != 0) {
      isReal = true;
    }
    var ranges = [
      {
        min: 2,
        max: rangeInt,
        style: new M.style.Point({
          fill: {
            color: 'green'
          },
          radius: 5
        })
      },
      {
        min: rangeInt,
        max: (rangeInt * 2),
        style: new M.style.Point({
          fill: {
            color: 'red'
          },
          radius: 10,
        })
      },
      {
        min: (rangeInt * 2),
        max: this.numFeaturesToDoCluster + 1,
        style: new M.style.Point({
          fill: {
            color: 'blue'
          },
          radius: 15
        })
      }
      ];
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
    if (M.utils.isArray(evt.selected) && evt.selected.length == 1 && evt.selected[0].getProperties().features && M.utils.isArray(evt.selected[0].getProperties().features) && evt.selected[0].getProperties().features.length == 1) {
      let feature = evt.selected[0].getProperties().features[0];
      let features = [M.impl.Feature.olFeature2Facade(feature)];
      let layerImpl = this.mLayer.getImpl();
      if (M.utils.isFunction(layerImpl.selectFeatures)) {
        layerImpl.selectFeatures(features, feature.getGeometry().getCoordinates(), evt);
      }
      this.mLayer.fire(M.evt.SELECT_FEATURES, [features, evt]);
    }
  };
  /**
   * remove style cluster
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.unapply = function(layer) {
    let layerol = this.mLayer.getImpl().getOL3Layer();
    let featuresCluster = layerol.getSource().getFeatures();
    let features = [];
    if (featuresCluster.length == 0) {
      let feats = layer.getFeatures();
      feats.forEach(function(f) {
        features.push(f.impl_.olFeature_);
      });

    }
    else {
      featuresCluster.forEach(function(f) {
        if (f.getProperties() && M.utils.isArray(f.getProperties()['features'])) {
          features = features.concat(f.getProperties()['features']);
        }
      });
    }
    let source = new ol.source.Vector({});
    source.addFeatures(features);
    let vector = new ol.layer.Vector({
      source: source
    });
    vector.setZIndex(9999);
    layer.getImpl().setOL3Layer(vector);
    if (this.options.hoverInteraction) {
      this.removeInteraction(layer, ol.interaction.Hover);
    }
    if (this.options.selectedInteraction) {
      this.removeInteraction(layer, M.impl.interaction.SelectCluster);
    }
  };
  /**
   * remove interactions added to style cluster
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.style.Cluster.prototype.removeInteraction = function(layer, type) {
    let map = layer.getImpl().map;
    let olmap = map.getMapImpl();
    olmap.getInteractions().forEach(function(i) {
      if (i instanceof type) {
        olmap.removeInteraction(i);
      }
    });
  };
})();
