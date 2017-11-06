goog.provide('M.impl.handler.Features');

goog.require('M.ClusteredFeature');
goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');

(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @param {ol.Map} options custom options for this layer
   * @api stable
   */
  M.impl.handler.Features = (function(options = {}) {
    /**
     * OpenLayers map
     * @private
     * @type {M.impl.Map}
     */
    this.map_ = null;

    /**
     * @private
     * @type {String}
     * @expose
     */
    this.defaultCursor_ = undefined;
  });

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.handler.Features.prototype.addTo = function(map) {
    this.map_ = map;
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.handler.Features.prototype.getFeaturesByLayer = function(evt, layer) {
    let features = [];

    if (!M.utils.isNullOrEmpty(layer) && layer.isVisible() && !M.utils.isNullOrEmpty(layer.getImpl().getOL3Layer())) {
      let olLayer = layer.getImpl().getOL3Layer();
      this.map_.getMapImpl().forEachFeatureAtPixel(evt.pixel, function(feature, layerFrom) {
        if ((layerFrom instanceof M.impl.layer.AnimatedCluster) && !M.utils.isNullOrEmpty(feature.get("features"))) {
          let clusteredFeatures = feature.get("features").map(M.impl.Feature.olFeature2Facade);
          if (clusteredFeatures.length === 1) {
            features.push(clusteredFeatures[0]);
          }
          else {
            let styleCluster = layer.getStyle();
            features.push(new M.ClusteredFeature(clusteredFeatures, {
              "ranges": styleCluster.getRanges(),
              "hoverInteraction": styleCluster.getOptions()["hoverInteraction"],
              "maxFeaturesToSelect": styleCluster.getOptions()["maxFeaturesToSelect"],
              "distance": styleCluster.getOptions()["distance"]
            }));
          }
        }
        else {
          features.push(M.impl.Feature.olFeature2Facade(feature));
        }
        // return true;
      }, {
        layerFilter: l => {
          let passFilter = false;
          if (layer.getStyle() instanceof M.style.Cluster && layer.getStyle().getOptions().selectInteraction) {
            passFilter = (l === layer.getStyle().getImpl().selectClusterInteraction_.overlayLayer_);
          }
          passFilter = passFilter || l === olLayer;
          return passFilter;
        }
      });
    }
    return features;
  };

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.handler.Features.prototype.addCursorPointer = function() {
    let viewport = this.map_.getMapImpl().getViewport();
    if (viewport.style.cursor !== 'pointer') {
      this.defaultCursor_ = viewport.style.cursor;
    }
    viewport.style.cursor = 'pointer';
  };

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.impl.handler.Features.prototype.removeCursorPointer = function() {
    this.map_.getMapImpl().getViewport().style.cursor = this.defaultCursor_;
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.handler.Features.prototype.destroy = function() {
    // unlisten event
    this.map_.un('click', this.onMapClick_, this);
    this.map_ = null;
  };
})();
