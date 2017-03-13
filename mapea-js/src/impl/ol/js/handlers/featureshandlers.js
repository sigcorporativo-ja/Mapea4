goog.provide('M.impl.handler.Features');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @param {ol.Map} options custom options for this layer
   * @api stable
   */
  M.impl.handler.Features = (function (map) {
    /**
     * OpenLayers map
     * @private
     * @type {M.impl.Map}
     */
    this.map_ = map;

    /**
     * Layers
     * @private
     * @type {Array<M.impl.Layer>}
     */
    this.layers_ = [];

    this.map_.getMapImpl().on('click', this.onMapClick_, this);
  });


  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @private
   * @function
   */
  M.impl.handler.Features.prototype.onMapClick_ = function (evt) {
    // hides the label if it was added
    var label = this.map_.getLabel();
    if (!M.utils.isNullOrEmpty(label)) {
      label.hide();
    }

    var coord = this.map_.getMapImpl().getCoordinateFromPixel(evt.pixel);
    var featuresByLayer = this.getFeaturesByLayer_(evt);

    this.layers_.forEach(function (layer) {
      var features = featuresByLayer[layer.name];
      layer.unselectFeatures(features, coord);
      layer.fire(M.evt.UNSELECT_FEATURES, coord);
      if (!M.utils.isNullOrEmpty(features)) {
        layer.selectFeatures(features, coord, evt);
        layer.fire(M.evt.SELECT_FEATURES, [features, coord]);
      }
    }, this);
  };

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @private
   * @function
   */
  M.impl.handler.Features.prototype.getFeaturesByLayer_ = function (evt) {
    var featuresByLayer = {};

    this.map_.getMapImpl().forEachFeatureAtPixel(evt.pixel, function (feature, olLayer) {
      var layer = this.layers_.filter(function (layer) {
        return (layer.isVisible() && (layer.getOL3Layer() === olLayer));
      })[0];
      var includesFeature = false;
      if (!M.utils.isNullOrEmpty(layer) && !M.utils.isNullOrEmpty(layer.getOL3Layer())) {
        var layerFeatures = layer.getOL3Layer().getSource().getFeatures();
        for (var i = 0, ilen = layerFeatures.length;
          (i < ilen) && !includesFeature; i++) {
          includesFeature = (layerFeatures[i] === feature);
        }
      }
      if (includesFeature) {
        if (M.utils.isNullOrEmpty(featuresByLayer[layer.name])) {
          featuresByLayer[layer.name] = [];
        }
        featuresByLayer[layer.name].push(feature);
      }
    }.bind(this));

    return featuresByLayer;
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.handler.Features.prototype.addLayer = function (layer) {
    if (!M.utils.includes(this.layers_, layer)) {
      this.layers_.push(layer);
    }
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.handler.Features.prototype.removeLayer = function (layer) {
    this.layers_.remove(layer);
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.handler.Features.prototype.destroy = function () {
    // unlisten event
    this.map_.un('click', this.onMapClick_, this);
    this.map_ = null;
  };
})();
