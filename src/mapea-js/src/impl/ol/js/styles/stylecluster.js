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
   * @param {Object} ranges - ranges defined by user
   * @param {Object} animated - if layer is animated
   * @api stable
   */
  M.impl.style.Cluster = function(ranges, animated, optionsVendor) {
    this.numFeaturesToDoCluster = 0;
    this.styleCache = [];
    this.olLayerOld = null;
    this.ranges = ranges;
    this.animated = animated;
    this.optionsVendor = optionsVendor;
    this.vectorCover = null;
    this.optionsVendor = optionsVendor;
    this.maxFeaturesToSelect = optionsVendor.maxFeaturesToSelect || 50;

    this.clusterSource = new ol.source.Cluster({
      distance : optionsVendor.distance ? optionsVendor.distance : M.style.Cluster.DEFAULT_DISTANCE,
      source : new ol.source.Vector()
    });

    this.clusterLayer = new M.impl.layer.AnimatedCluster({
      name : 'Cluster',
      source : this.clusterSource,
      animationDuration : optionsVendor.animationDuration ? optionsVendor.animationDuration : M.style.Cluster.ANIMATION_DURATION,
      style : this.getStyle.bind(this),
      animationMethod : ol.easing[optionsVendor.animationMethod ? optionsVendor.animationMethod : M.style.Cluster.ANIMATION_METHOD]
    });

  };

  /**
   * Apply the style cluster to layer vector
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.apply = function(layer) {
    this.mLayer = layer;

    this.mLayer.getImpl().on(M.evt.LOAD, function(e) {
      let map = layer.getImpl().map;
      this.numFeaturesToDoCluster = layer.getFeatures().length;
      let features = layer.getImpl().getOL3Layer().getSource().getFeatures();
      this.clusterSource.getSource().addFeatures(features);
      this.clusterLayer.setZIndex(99999);
      layer.getImpl().setOL3Layer(this.clusterLayer);

      if (this.optionsVendor.hoverInteraction) {
        this.addCoverInteraction(map);
      }

      if (this.optionsVendor.selectedInteraction) {
        this.addSelectedInteraction(map);
      }

    }.bind(this));
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
      maxFeaturesToSelect: this.maxFeaturesToSelect,
			pointRadius:this.optionsVendor.distanceSelectFeatures || 15,
			animate: true,

			style: function(f,res) {
        var cluster = f.get('features');
        if (cluster && cluster.length > 10) {
          alert("centrar");
        }
				else if (cluster && cluster.length > 1) {
          return this.getStyle(f,res);
				}
				else {
          let style = new ol.style.Style({
              image: new ol.style.Circle ({
              stroke: new ol.style.Stroke({ color: "rgba(0,0,192,0.5)", width:2 }),
							fill: new ol.style.Fill({ color: "rgba(0,0,192,0.3)" }),
							radius:5
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

    this.hoverInteraction = new ol.interaction.Hover(
      {cursor: "pointer",
      layerFilter: function(l){
        return l===this.clusterLayer;
      }.bind(this) }
    );

    olmap.addInteraction(this.hoverInteraction);

    this.hoverInteraction.on("enter", function(e) {
      let h = e.feature.get("convexHull");
			if (!h) {
        let cluster = e.feature.get("features");
				if (cluster && cluster.length) {
          let c = [];
					for (var i=0; i< cluster.length; i++) {
            let f = cluster[i];
            c.push(f.getGeometry().getCoordinates());
					}
					h = ol.coordinate.convexHull(c);
					e.feature.get("convexHull", h);
				}
			}

			if (h.length>2) {
        let feature = new ol.Feature( new ol.geom.Polygon([h]) );
        let mFeature = M.impl.Feature.olFeature2Facade(feature);
        if (this.vectorCover == null) {
          this.vectorCover = new M.layer.Vector({name: "cover", extract: false}, {displayInLayerSwitcher:  this.optionsVendor.displayInLayerSwitcherHoverLayer || false});
          this.vectorCover.addFeatures(mFeature);
          map.addLayers(this.vectorCover);
          this.vectorCover.setZIndex(99990);
        }
        else  {
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
  M.impl.style.Cluster.prototype.hasIndividualStyle = function () {
    let individualStyle = this.ranges.find(el => (el.min == 1 && el.max == 1));
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
  M.impl.style.Cluster.prototype.getStyle = function (feature, resolution) {
    if(this.ranges.length == 0) {
      this.ranges = this.getDefaulStyles(this.clusterLayer);
    }
    var size = feature.get('features').length;
    var style = this.styleCache[size];
    if (!style) {
      if (size == 1 && !this.hasIndividualStyle()) {
        return new ol.style.Style.defaultFunction();
      }
      else {
        let range = this.ranges.find(el => (el.min <= size && el.max >= size));
        if (range) {
          let style = range.style.getImpl().style_;
          if (this.optionsVendor.displayAmount) {
            style.text_ = new ol.style.Text(
						{	text: size.toString(),
							fill: new ol.style.Fill(
							{	color: '#000'
							})
						});
          }
          return [style];
        } else {
          return new ol.style.Style.defaultFunction();
        }
      }

    }
    return [ style ];
  };

  /**
   * This function return a default ranges to cluster
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.style.Cluster.prototype.getDefaulStyles = function () {

    let isReal = false;
    let range = this.numFeaturesToDoCluster / 3;
    let rangeInt = Math.floor(range);
    if ((range % 1) != 0) {
      isReal = true;
    }

    var ranges =  [
        {min:2, max:rangeInt, style: new M.style.Point({
          fill: {
            color: 'green'
          },
          radius: 5
        })},
        {min:rangeInt, max:(rangeInt*2), style: new M.style.Point({
          fill: {
            color: 'yellow'
          },
          radius: 10,
        })},
        {min:(rangeInt*2), max: isReal ? ((rangeInt*3) + 1) : (rangeInt*3), style: new M.style.Point({
          fill: {
            color: 'red'
          },
          radius: 15
        })}
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
  M.impl.style.Cluster.prototype.selectClusterFeature_ = function (evt) {
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
})();
