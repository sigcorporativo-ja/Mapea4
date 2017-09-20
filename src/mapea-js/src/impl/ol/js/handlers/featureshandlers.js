goog.provide('M.impl.handler.Features');

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
      this.map_.getMapImpl().forEachFeatureAtPixel(evt.pixel, function(feature, olLayer) {
        if (layer.getImpl().getOL3Layer() === olLayer) {
          if (olLayer instanceof M.impl.layer.AnimatedCluster) {
            features = features.concat(feature.get("features").map(M.impl.Feature.olFeature2Facade));
          }
          else {
            features.push(M.impl.Feature.olFeature2Facade(feature));
          }
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
