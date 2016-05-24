goog.provide('P.plugin.Streetview');

goog.require('P.control.Streetview');


goog.require('goog.events');

/**
 * @classdesc
 * Main facade plugin object. This class creates a plugin
 * object which has an implementation Object
 *
 * @constructor
 * @extends {M.Plugin}
 * @param {Object} impl implementation object
 * @api stable
 */
M.plugin.Streetview = (function() {

   /**
    * Facade of the map
    * @private
    * @type {M.Map}
    */
   this.map_ = null;

   this.streetview = null;

   /**
    * TODO
    * @private
    * @type {M.ui.Panel}
    */
   this.panel_ = null;

   goog.base(this);
});
goog.inherits(M.plugin.Streetview, M.Plugin);

/**
 * This function provides the implementation
 * of the object
 *
 * @public
 * @function
 * @param {Object} map the map to add the plugin
 * @api stable
 */
M.plugin.Streetview.prototype.addTo = function(map) {
   this.map_ = map;
   this.streetview = new M.control.Streetview();
   this.panel_ = new M.ui.Panel(M.plugin.Streetview.NAME, {
      'collapsible': false,
      'className': 'm-streetview',
      'position': M.ui.position.BR
   });
   // sets the className depending on other panels
   var locationPanel = map.getPanels([M.control.Location.NAME])[0];
   var geosearchByLocationPanel;
   if (!M.utils.isNullOrEmpty(M.plugin.Geosearchbylocation)) {
      geosearchByLocationPanel = map.getPanels([M.plugin.Geosearchbylocation.NAME])[0];
   }
   if (!M.utils.isNullOrEmpty(locationPanel) && !M.utils.isNullOrEmpty(geosearchByLocationPanel)) {
      locationPanel.addClassName('m-with-streetview');
      geosearchByLocationPanel.addClassName('m-with-streetview');
      this.panel_.addClassName('m-with-location m-with-geosearchbylocation');
   }
   else if (!M.utils.isNullOrEmpty(locationPanel)) {
      locationPanel.addClassName('m-with-streetview');
      this.panel_.addClassName('m-with-location');
   }
   else if (!M.utils.isNullOrEmpty(geosearchByLocationPanel)) {
      geosearchByLocationPanel.addClassName('m-with-streetview');
      this.panel_.addClassName('m-with-geosearchbylocation');
   }
   this.panel_.addControls(this.streetview);
   this.map_.addPanels(this.panel_);
};

/**
 * This function destroys this plugin
 *
 * @public
 * @function
 * @api stable
 */
M.plugin.Streetview.prototype.destroy = function() {
   this.map_.removeControls([this.streetview]);
   this.map_ = null;
   this.streetview = null;
   this.panel_ = null;
};

/**
 * TODO
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.plugin.Streetview.NAME = 'streetview';