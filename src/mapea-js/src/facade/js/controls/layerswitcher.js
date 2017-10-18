goog.provide('M.control.LayerSwitcher');

goog.require('M.Control');
goog.require('M.utils');
goog.require('M.exception');

(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a GetFeatureInfo
   * control to provides a popup with information about the place
   * where the user has clicked inside the map.
   *
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api stable
   */
  M.control.LayerSwitcher = (function() {
    if (M.utils.isUndefined(M.impl.control.LayerSwitcher)) {
      M.exception('La implementación usada no puede crear controles LayerSwitcher');
    }
    // implementation of this control
    var impl = new M.impl.control.LayerSwitcher();

    // calls the super constructor
    goog.base(this, impl, M.control.LayerSwitcher.NAME);
  });
  goog.inherits(M.control.LayerSwitcher, M.Control);

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map map to add the control
   * @returns {Promise} html response
   * @api stable
   */
  M.control.LayerSwitcher.prototype.createView = function(map) {
    return M.control.LayerSwitcher.getTemplateVariables_(map).then(templateVars =>
      M.template.compile(M.control.LayerSwitcher.TEMPLATE, {
        'jsonp': true,
        'vars': templateVars
      }));
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  M.control.LayerSwitcher.prototype.equals = function(obj) {
    var equals = (obj instanceof M.control.LayerSwitcher);
    return equals;
  };

  /**
   * This function registers events on map and layers to render
   * the layerswitcher
   *
   * @function
   * @api stable
   */
  M.control.LayerSwitcher.prototype.render = function() {
    this.getImpl().renderPanel();
  };

  /**
   * This function registers events on map and layers to render
   * the layerswitcher
   *
   * @function
   * @api stable
   */
  M.control.LayerSwitcher.prototype.registerEvents = function() {
    this.getImpl().registerEvents();
  };

  /**
   * Unegisters events for map and layers from the layerswitcher
   *
   * @function
   * @api stable
   */
  M.control.LayerSwitcher.prototype.unregisterEvents = function() {
    this.getImpl().unregisterEvents();
  };

  /**
   * Gets the variables of the template to compile
   */
  M.control.LayerSwitcher.getTemplateVariables_ = function(map) {
    return new Promise(function(success, fail) {
      // gets base layers and overlay layers
      let baseLayers = map.getBaseLayers();
      let overlayLayers = map.getLayers().filter(function(layer) {
        let isTransparent = (layer.transparent === true);
        let displayInLayerSwitcher = (layer.displayInLayerSwitcher === true);
        let isNotWMC = (layer.type !== M.layer.type.WMC);
        let isNotWMSFull = !((layer.type === M.layer.type.WMS) && M.utils.isNullOrEmpty(layer.name));
        return (isTransparent && isNotWMC && isNotWMSFull && displayInLayerSwitcher);
      }).reverse();

      let baseLayersPromise = Promise.all(baseLayers.map(M.control.LayerSwitcher.parseLayerForTemplate_));
      let overlayLayersPromise = Promise.all(overlayLayers.map(M.control.LayerSwitcher.parseLayerForTemplate_));
      baseLayersPromise.then(parsedBaseLayers => {
        overlayLayersPromise.then(parsedOverlayLayers => success({
          'baseLayers': parsedBaseLayers,
          'overlayLayers': parsedOverlayLayers
        }));
      });

      // success({
      //   'baseLayers': baseLayers.map(M.control.LayerSwitcher.parseLayerForTemplate_),
      //   'overlayLayers': overlayLayers.map(M.control.LayerSwitcher.parseLayerForTemplate_)
      // });
    });
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.control.LayerSwitcher.parseLayerForTemplate_ = function(layer) {
    var layerTitle = layer.legend;
    if (M.utils.isNullOrEmpty(layerTitle)) {
      layerTitle = layer.name;
    }
    if (M.utils.isNullOrEmpty(layerTitle)) {
      layerTitle = 'Servicio WMS';
    }
    // return new Promise((success, fail) => success({
    //   'base': (layer.transparent === false),
    //   'visible': (layer.isVisible() === true),
    //   'id': layer.name,
    //   'title': layerTitle,
    //   'legend': layer.getLegendURL(),
    //   'outOfRange': !layer.inRange(),
    //   'opacity': layer.getOpacity()
    // }));
    return new Promise((success, fail) => {
      let layerVarTemplate = {
        'base': (layer.transparent === false),
        'visible': (layer.isVisible() === true),
        'id': layer.name,
        'title': layerTitle,
        'outOfRange': !layer.inRange(),
        'opacity': layer.getOpacity()
      };
      let legendUrl = layer.getLegendURL();
      if (legendUrl instanceof Promise) {
        legendUrl.then(url => {
          layerVarTemplate['legend'] = url;
          success(layerVarTemplate);
        })
      }
      else {
        layerVarTemplate['legend'] = legendUrl;
        success(layerVarTemplate);
      }
    });
  };

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.control.LayerSwitcher.NAME = 'layerswitcher';

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.control.LayerSwitcher.TEMPLATE = 'layerswitcher.html';
})();
