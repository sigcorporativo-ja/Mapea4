goog.provide('M.impl.control.LayerSwitcher');

goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('goog.events');

goog.require('M.impl.Control');

/**
 * @namespace M.impl.control
 */
(function() {
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
   M.impl.control.LayerSwitcher = function() {
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
   M.impl.control.LayerSwitcher.prototype.addTo = function(map, element) {
      this.facadeMap_ = map;
      var olMap = map.getMapImpl();

      // panel
      this.panel = element.getElementsByTagName('div')[M.impl.control.LayerSwitcher.PANEL_ID];

      // click layer event
      goog.events.listen(this.panel, goog.events.EventType.CLICK, this.clickLayer, false, this);

      ol.control.Control.call(this, {
         'element': element,
         'target': null
      });
      olMap.addControl(this);

      // register events in order to update the layerswitcher
      this.registerMapEvents_(olMap);
   };

   /**
    * Sets the visibility of the clicked layer
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.LayerSwitcher.prototype.clickLayer = function(evt) {
      evt = (evt || window.event);
      if (!M.utils.isNullOrEmpty(evt.target) && !M.utils.isNullOrEmpty(evt.target.id)) {
         evt.stopPropagation();
         var layerName = evt.target.id;
         var filter = {
            'name': layerName
         };
         var layers = this.facadeMap_.getWMTS(filter)
            .concat(this.facadeMap_.getKML(filter))
            .concat(this.facadeMap_.getWFS(filter))
            .concat(this.facadeMap_.getWMS(filter));
         layers.forEach(function(layer) {
            /* sets the layer visibility only if
            the layer is not base layer and visible */
            if ((layer.transparent === true) || !layer.isVisible()) {
               layer.setVisible(!layer.isVisible());
            }
         });
      }
   };

   /**
    * Re-draw the layer panel to represent the current state of the layers.
    */
   M.impl.control.LayerSwitcher.prototype.renderPanel = function() {
      var this_ = this;
      M.template.compile(M.control.LayerSwitcher.TEMPLATE, M.control.LayerSwitcher.getTemplateVariables_(this.facadeMap_)).then(function(html) {
         this_.registerImgErrorEvents_(html);
         var newPanel = html.querySelector('div#'.concat(M.impl.control.LayerSwitcher.PANEL_ID));
         this_.panel.innerHTML = newPanel.innerHTML;
      });
   };

   /**
    * TODO
    */
   M.impl.control.LayerSwitcher.prototype.registerMapEvents_ = function(map) {
      this.registerViewEvents_(map.getView());
      this.registerLayersEvents_(map.getLayers());
      map.on('change:view', function(evt) {
         this.registerViewEvents_(map.getView());
      }, this);
   };

   /**
    * TODO
    */
   M.impl.control.LayerSwitcher.prototype.registerViewEvents_ = function(view) {
      view.on('change:resolution', this.renderPanel, this);
   };

   /**
    * TODO
    */
   M.impl.control.LayerSwitcher.prototype.registerLayersEvents_ = function(layers) {
      layers.forEach(this.registerLayerEvents_, this);
      layers.on('remove', this.renderPanel, this);
      layers.on('add', function(evt) {
         this.registerLayerEvents_(evt.element);
         this.renderPanel();
      }, this);
   };

   /**
    * TODO
    */
   M.impl.control.LayerSwitcher.prototype.registerLayerEvents_ = function(layer) {
      layer.on('change:visible', this.renderPanel, this);
      layer.on('change:opacity', this.renderPanel, this);
      layer.on('change:extent', this.renderPanel, this);
   };

   /**
    * TODO
    */
   M.impl.control.LayerSwitcher.prototype.registerImgErrorEvents_ = function(html) {
      var imgElements = html.querySelectorAll('img');
      Array.prototype.forEach.call(imgElements, function(imgElem) {
         goog.events.listen(imgElem, goog.events.EventType.ERROR, function(evt) {
            var layerName = evt.target.getAttribute('data-layer-name');
            var legendErrorUrl = M.utils.concatUrlPaths([M.config.THEME_URL, M.Layer.LEGEND_ERROR]);
            var layer = this.facadeMap_.getLayers().filter(function(l) {
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
   M.impl.control.LayerSwitcher.prototype.setMap = function(map) {
      goog.base(this, 'setMap', map);
      this.renderPanel();
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.LayerSwitcher.prototype.destroy = function() {
      goog.base(this, 'destroy');
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