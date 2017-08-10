goog.provide('M.impl.style.Cluster');

goog.require('ol.layer.AnimatedCluster');
goog.require('ol.source.Cluster');
goog.require('ol.interaction.Select');
goog.require('ol.interaction.SelectCluster');

/**
 * @namespace M.style.Cluster
 */
(function() {

  M.impl.style.Cluster = function(ranges, animated, optionsVendor) {
    this.styleCache = [];
    this.ranges = ranges;
    this.animated = animated;
    this.optionsVendor = optionsVendor;
    this.clusterSource = new ol.source.Cluster({
      distance : optionsVendor.distance ? optionsVendor.distance : M.style.DEFAULT_DISTANCE,
      source : new ol.source.Vector()
    });

    this.clusterLayer = new ol.layer.AnimatedCluster({
      name : 'Cluster',
      source : this.clusterSource,
      animationDuration : optionsVendor.animationDuration ? optionsVendor.animationDuration : M.style.ANIMATION_DURATION,
      style : function getStyle(feature, resolution) {
    		var size = feature.get('features').length;
    		var style = this.styleCache[size];
    		if (!style) {
          let range = this.ranges.find(el => (el.min <= size && el.max > size));
          if (range) {
              return [range.style.getImpl().style_];
          }
    		}
    		return [ style ];
    	}.bind(this),
      animationMethod : ol.easing[optionsVendor.animationMethod ? optionsVendor.animationMethod : M.style.ANIMATION_METHOD]
    });

  };


  M.impl.style.Cluster.prototype.apply = function(layer, map) {
    let features = layer.getImpl().getOL3Layer().getSource().getFeatures();
    this.clusterSource.getSource().addFeatures(features);
    //let olVector = layer.getImpl().getOL3Layer();
    this.clusterLayer.setZIndex(99999);
    layer.getImpl().setOL3Layer(this.clusterLayer);
    //mapajs.getMapImpl().addLayer(this.clusterLayer);
  };

})();
