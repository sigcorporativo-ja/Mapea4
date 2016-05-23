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

      // button
      var button = element.getElementsByTagName('button')[M.impl.control.LayerSwitcher.BUTTON_ID];

      // panel
      this.panel = element.getElementsByTagName('div')[M.impl.control.LayerSwitcher.PANEL_ID];

      // show panel events
      goog.events.listen(element, goog.events.EventType.MOUSEOVER, this.showPanel, false, this);
      goog.events.listen(button, goog.events.EventType.CLICK, this.showPanel, false, this);

      // hide panel event
      goog.events.listen(element, goog.events.EventType.MOUSEOUT, this.hidePanel, false, this);

      // click layer event
      goog.events.listen(this.panel, [
               goog.events.EventType.CLICK,
               goog.events.EventType.TOUCHEND
            ], this.clickLayer, false, this);

      ol.control.Control.call(this, {
         'element': element,
         'target': null,
         'render': this.renderPanel
      });
      map.getMapImpl().addControl(this);
   };

   /**
    * Shows the panel of the layerswitcher
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.LayerSwitcher.prototype.showPanel = function (evt) {
      if (!M.utils.isNullOrEmpty(this.mouseoutTimeId)) {
         clearTimeout(this.mouseoutTimeId);
         this.mouseoutTimeId = null;
      }

      if (!goog.dom.classlist.contains(this.element, M.impl.control.LayerSwitcher.SHOWN_CLASS)) {
         goog.dom.classlist.add(this.element, M.impl.control.LayerSwitcher.SHOWN_CLASS);
         this.renderPanel();
      }
   };

   /**
    * This function hides the panel of this control
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.LayerSwitcher.prototype.hidePanel = function (evt) {
      evt = (evt || window.event);
      var element = this.element;
      if (!element.contains(evt.toElement)) {
         this.mouseoutTimeId = setTimeout(function () {
            if (goog.dom.classlist.contains(element, M.impl.control.LayerSwitcher.SHOWN_CLASS)) {
               goog.dom.classlist.remove(element, M.impl.control.LayerSwitcher.SHOWN_CLASS);
            }
         }, 500);
      }
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
      if (!M.utils.isNullOrEmpty(evt.target) && !M.utils.isNullOrEmpty(evt.target.id)) {
         var layerName = evt.target.id;
         var filter = {
            'name': layerName
         };
         var layers = this.facadeMap_.getWMTS(filter)
            .concat(this.facadeMap_.getKML(filter))
            .concat(this.facadeMap_.getWFS(filter))
            .concat(this.facadeMap_.getWMS(filter));
         layers.forEach(function (layer) {
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
   M.impl.control.LayerSwitcher.prototype.renderPanel = function () {
      var this_ = this;
      M.template.compile(M.control.LayerSwitcher.TEMPLATE,
         M.control.LayerSwitcher.getTemplateVariables_(this_.facadeMap_)).then(function (html) {
         var newPanel = html.getElementsByTagName('div')[M.impl.control.LayerSwitcher.PANEL_ID];
         this_.panel.innerHTML = newPanel.innerHTML;
      });
   };

   /**
    * Set the map instance the control is associated with.
    * @param {ol.Map} map The map instance.
    */
   M.impl.control.LayerSwitcher.prototype.setMap = function (map) {
      goog.base(this, 'setMap', map);

      map.on('pointerdown', this.hidePanel, this);
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
   M.impl.control.LayerSwitcher.prototype.destroy = function () {
      // TODO remove events
      this.map.un('pointerdown', this.hidePanel);
      goog.base(this, 'destroy');
   };

   /**
    * Shown class for this control
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.impl.control.LayerSwitcher.SHOWN_CLASS = 'shown';

   /**
    * LayerSwitcher button id
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.impl.control.LayerSwitcher.BUTTON_ID = 'm-layersiwtcher-btn';

   /**
    * LayerSwitcher panel id
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.impl.control.LayerSwitcher.PANEL_ID = 'm-layerswitcher-panel';
})();