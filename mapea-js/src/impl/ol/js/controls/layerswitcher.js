goog.provide('M.impl.control.LayerSwitcher');

goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('goog.events');

goog.require('M.impl.Control');

/**
 * @namespace M.impl.control
 */
(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layerswitcher
   * control
   * Source code from: https://github.com/walkermatt/ol3-layerswitcher
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  M.impl.control.LayerSwitcher = function () {
    this.mouseoutTimeId = null;
    this.panel = null;
    this.facadeMap_ = null;
  };
  goog.inherits(M.impl.control.LayerSwitcher, M.impl.Control);

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  M.impl.control.LayerSwitcher.prototype.addTo = function (map, element) {
    this.facadeMap_ = map;
    var olMap = map.getMapImpl();

    // panel
    this.panel = element.getElementsByTagName('div')[M.impl.control.LayerSwitcher.PANEL_ID];

    // click layer event
    goog.events.listen(this.panel, goog.events.EventType.CLICK, this.clickLayer, false, this);

    // change slider event
    goog.events.listen(this.panel, goog.events.EventType.INPUT, this.clickLayer, false, this);

    ol.control.Control.call(this, {
      'element': element,
      'target': null
    });
    olMap.addControl(this);
  };

  /**
   * Sets the visibility of the clicked layer
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.LayerSwitcher.prototype.clickLayer = function (evt) {
    evt = (evt || window.event);
    if (!M.utils.isNullOrEmpty(evt.target)) {
      let layerName = evt.target.getAttribute('data-layer-name');
      if (!M.utils.isNullOrEmpty(layerName)) {
        evt.stopPropagation();
        let layer;
        this.facadeMap_.getLayers().some(function (l) {
          if (l.name === layerName) {
            layer = l;
            return true;
          }
        });
        // checkbox
        if (goog.dom.classlist.contains(evt.target, 'm-check')) {
          /* sets the layer visibility only if
             the layer is not base layer and visible */
          if ((layer.transparent === true) || !layer.isVisible()) {
            let opacity = evt.target.parentElement.parentElement.querySelector('div.tools > input');
            if (!M.utils.isNullOrEmpty(opacity)) {
              layer.setOpacity(opacity.value);
            }
            layer.setVisible(!layer.isVisible());
          }
        }
        // range
        else if (goog.dom.classlist.contains(evt.target, 'm-layerswitcher-transparency')) {
          layer.setOpacity(evt.target.value);
        }
        // remove span
        else if (goog.dom.classlist.contains(evt.target, 'm-layerswitcher-remove')) {
          this.facadeMap_.removeLayers(layer);
        }
      }
    }
  };

  /**
   * Re-draw the layer panel to represent the current state of the layers.
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.LayerSwitcher.prototype.renderPanel = function () {
    var this_ = this;
    M.template.compile(M.control.LayerSwitcher.TEMPLATE, {
      'jsonp': true,
      'vars': M.control.LayerSwitcher.getTemplateVariables_(this.facadeMap_)
    }).then(function (html) {
      this_.registerImgErrorEvents_(html);
      var newPanel = html.querySelector('div#'.concat(M.impl.control.LayerSwitcher.PANEL_ID));
      this_.panel.innerHTML = newPanel.innerHTML;
    });
  };

  /**
   * Registers events on map and layers to render the
   * layerswitcher
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.LayerSwitcher.prototype.registerEvents = function () {
    if (!M.utils.isNullOrEmpty(this.facadeMap_)) {
      var olMap = this.facadeMap_.getMapImpl();

      this.registerViewEvents_(olMap.getView());
      this.registerLayersEvents_(olMap.getLayers());
      olMap.on('change:view', this.onViewChange_, this);
    }
  };

  /**
   * Unegisters events for map and layers from the layerswitcher
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.LayerSwitcher.prototype.unregisterEvents = function () {
    if (!M.utils.isNullOrEmpty(this.facadeMap_)) {
      var olMap = this.facadeMap_.getMapImpl();

      this.unregisterViewEvents_(olMap.getView());
      this.unregisterLayersEvents_(olMap.getLayers());
      olMap.un('change:view', this.onViewChange_, this);
    }
  };

  /**
   * TODO
   */
  M.impl.control.LayerSwitcher.prototype.registerViewEvents_ = function (view) {
    view.on('change:resolution', this.renderPanel, this);
  };

  /**
   * TODO
   */
  M.impl.control.LayerSwitcher.prototype.registerLayersEvents_ = function (layers) {
    layers.forEach(this.registerLayerEvents_, this);
    layers.on('remove', this.renderPanel, this);
    layers.on('add', this.onAddLayer_, this);
  };

  /**
   * TODO
   */
  M.impl.control.LayerSwitcher.prototype.registerLayerEvents_ = function (layer) {
    layer.on('change:visible', this.renderPanel, this);
    // layer.on('change:opacity', this.renderPanel, this);
    layer.on('change:extent', this.renderPanel, this);
  };

  /**
   * TODO
   */
  M.impl.control.LayerSwitcher.prototype.unregisterViewEvents_ = function (view) {
    view.un('change:resolution', this.renderPanel, this);
  };

  /**
   * TODO
   */
  M.impl.control.LayerSwitcher.prototype.unregisterLayersEvents_ = function (layers) {
    layers.forEach(this.registerLayerEvents_, this);
    layers.un('remove', this.renderPanel, this);
    layers.un('add', this.onAddLayer_, this);
  };

  /**
   * TODO
   */
  M.impl.control.LayerSwitcher.prototype.unregisterLayerEvents_ = function (layer) {
    layer.un('change:visible', this.renderPanel, this);
    //layer.un('change:opacity', this.renderPanel, this);
    layer.un('change:extent', this.renderPanel, this);
  };

  /**
   * TODO
   */
  M.impl.control.LayerSwitcher.prototype.onViewChange_ = function (evt) {
    // removes listener from previous view
    this.unregisterViewEvents_(evt.oldValue);

    // attaches listeners to the new view
    var olMap = this.facadeMap_.getMapImpl();
    this.registerViewEvents_(olMap.getView());
  };

  /**
   * TODO
   */
  M.impl.control.LayerSwitcher.prototype.onAddLayer_ = function (evt) {
    this.registerLayerEvents_(evt.element);
    this.renderPanel();
  };

  /**
   * TODO
   */
  M.impl.control.LayerSwitcher.prototype.registerImgErrorEvents_ = function (html) {
    var imgElements = html.querySelectorAll('img');
    Array.prototype.forEach.call(imgElements, function (imgElem) {
      goog.events.listen(imgElem, goog.events.EventType.ERROR, function (evt) {
        var layerName = evt.target.getAttribute('data-layer-name');
        var legendErrorUrl = M.utils.concatUrlPaths([M.config.THEME_URL, M.Layer.LEGEND_ERROR]);
        var layer = this.facadeMap_.getLayers().filter(function (l) {
          return (l.name === layerName);
        })[0];
        if (!M.utils.isNullOrEmpty(layer)) {
          layer.setLegendURL(legendErrorUrl);
          this.renderPanel();
        }
      }, false, this);
    }, this);
  };

  /**
   * Set the map instance the control is associated with.
   * @param {ol.Map} map The map instance.
   */
  M.impl.control.LayerSwitcher.prototype.setMap = function (map) {
    goog.base(this, 'setMap', map);
    this.renderPanel();
  };

  /**
   * LayerSwitcher panel id
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.impl.control.LayerSwitcher.PANEL_ID = 'm-layerswitcher-panel';
})();
