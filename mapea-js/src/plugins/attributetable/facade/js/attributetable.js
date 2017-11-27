goog.provide('P.plugin.AttributeTable');

goog.require('P.control.AttributeTableControl');
goog.require('goog.events');


/**
 * @classdesc
 * Main facade plugin object. This class creates a plugin
 * object which has an implementation Object
 *
 * @constructor
 * @extends {M.Plugin}
 * @api stable
 */
M.plugin.AttributeTable = (function(parameters) {
  [this.control_, this.panel_, this.facadeMap_] = [null, null, null];

  parameters = (parameters || {});

  this.numPages_ = parseInt((!M.utils.isNullOrEmpty(parameters.pages) && parameters.pages >= 1 && parameters.pages % 1 === 0) ? parameters.pages : M.config.ATTRIBUTETABLE_PAGES);

  /**
   * Name of this control
   * @public
   * @type {string}
   * @api stable
   */
  this.name = M.plugin.AttributeTable.NAME;
  goog.base(this);
});
goog.inherits(M.plugin.AttributeTable, M.Plugin);

/**
 * This function adds this plugin into the map
 *
 * @public
 * @function
 * @param {M.Map} map the map to add the plugin
 * @api stable
 */
M.plugin.AttributeTable.prototype.addTo = function(map) {
  map.on(M.evt.ADDED_LAYER, () => {
    this.destroy();
    add.bind(this)();
  }, this);
  const add = () => {
    this.facadeMap_ = map;
    this.control_ = new M.control.AttributeTableControl(this.numPages_);
    this.panel_ = new M.ui.Panel(M.plugin.AttributeTable.NAME, {
      'collapsible': true,
      'className': 'm-attributetable',
      'collapsedButtonClass': 'g-cartografia-localizacion4',
      'position': M.ui.position.TR,
      'tooltip': 'Tabla de atributos'
    });
    this.panel_.addControls(this.control_);
    this.panel_.on(M.evt.SHOW, function(evt) {
      if (map.getWFS().length === 0 && map.getKML().length === 0 && map.getLayers().filter(function(layer) {
          return layer.type === "GeoJSON";
        }) === 0) {
        this.panel_.collapse();
        M.dialog.info("No existen capas consultables.");
      }
    }, this);
    map.addPanels(this.panel_);
  };
  add();
};

/**
 * This function destroys this plugin
 *
 * @public
 * @function
 * @api stable
 */
M.plugin.AttributeTable.prototype.destroy = function() {
  this.facadeMap_.removeControls([this.control_]);
   [this.control_, this.panel_, this.facadeMap_] = [null, null, null];
};

/**
 * Name of this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.plugin.AttributeTable.NAME = 'attributetable';
