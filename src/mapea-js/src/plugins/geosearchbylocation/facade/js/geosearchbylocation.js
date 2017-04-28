goog.provide('P.plugin.Geosearchbylocation');

goog.require('P.control.Geosearchbylocation');

(function () {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a Control
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Mx.parameters.Geosearchbylocation} parameters - Geosearchbylocation parameters
   * @api stable
   */
  M.plugin.Geosearchbylocation = (function (parameters) {
    parameters = (parameters || {});

    /**
     * Name of this control
     * @public
     * @type {string}
     * @api stable
     */
    this.name = M.plugin.Geosearchbylocation.NAME;

    /**
     * URL for the query
     * @private
     * @type {string}
     */
    this.url_ = M.config.GEOSEARCH_URL;
    if (!M.utils.isNullOrEmpty(parameters.url)) {
      this.url_ = parameters.url;
    }

    /**
     * Core to the URL for the query
     * @private
     * @type {string}
     */
    this.core_ = M.config.GEOSEARCH_CORE;
    if (!M.utils.isNullOrEmpty(parameters.core)) {
      this.core_ = parameters.core;
    }

    /**
     * Handler to the URL for the query
     * @private
     * @type {string}
     */
    this.handler_ = M.config.GEOSEARCH_HANDLER;
    if (!M.utils.isNullOrEmpty(parameters.handler)) {
      this.handler_ = parameters.handler;
    }

    /**
     * Distance search
     * @private
     * @type {number}
     */
    this.distance_ = M.config.GEOSEARCH_DISTANCE;
    if (!M.utils.isNullOrEmpty(parameters.distance)) {
      this.distance_ = parameters.distance;
    }

    /**
     * Spatial field
     * @private
     * @type {string}
     */
    this.spatialField_ = M.config.GEOSEARCH_SPATIAL_FIELD;

    /**
     * Number of responses allowed
     * @private
     * @type {number}
     */
    this.rows_ = M.config.GEOSEARCHBYLOCATION_ROWS;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Implementation of this object
     * @public
     * @type {M.control.Geosearchbylocation}
     * @api stable
     */
    this.controlGeo = null;

    /**
     * Plugin panel
     * @private
     * @type {M.ui.Panel}
     */
    this.panel_ = null;

    // call super
    goog.base(this);
  });
  goog.inherits(M.plugin.Geosearchbylocation, M.Plugin);

  /**
   * @inheritdoc
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @api stable
   */
  M.plugin.Geosearchbylocation.prototype.addTo = function (map) {
    this.map_ = map;
    this.controlGeo = new M.control.Geosearchbylocation(this.url_,
      this.core_, this.handler_, this.distance_, this.spatialField_, this.rows_);

    this.panel_ = new M.ui.Panel(M.plugin.Geosearchbylocation.NAME, {
      'collapsible': false,
      'className': 'm-geosearchbylocation',
      'position': M.ui.position.BR
    });
    // sets the className depending on other panels
    var locationPanel = map.getPanels([M.control.Location.NAME])[0];
    var streetViewPanel;
    if (!M.utils.isNullOrEmpty(M.plugin.Streetview)) {
      streetViewPanel = map.getPanels([M.plugin.Streetview.NAME])[0];
    }
    if (!M.utils.isNullOrEmpty(locationPanel) && !M.utils.isNullOrEmpty(streetViewPanel)) {
      locationPanel.addClassName('m-with-geosearchbylocation');
      streetViewPanel.addClassName('m-with-geosearchbylocation');
      this.panel_.addClassName('m-with-location m-with-streetview');
    }
    else if (!M.utils.isNullOrEmpty(locationPanel)) {
      locationPanel.addClassName('m-with-geosearchbylocation');
      this.panel_.addClassName('m-with-location');
    }
    else if (!M.utils.isNullOrEmpty(streetViewPanel)) {
      streetViewPanel.addClassName('m-with-geosearchbylocation');
      this.panel_.addClassName('m-with-streetview');
    }
    this.panel_.addControls(this.controlGeo);
    this.map_.addPanels(this.panel_);
  };

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  M.plugin.Geosearchbylocation.prototype.destroy = function () {
    this.map_.removeControls([this.controlGeo]);
    this.controlGeo = null;
    this.name = null;
    this.url_ = null;
    this.core_ = null;
    this.handler_ = null;
    this.distance_ = null;
    this.spatialField_ = null;
    this.rows_ = null;
    this.map_ = null;
    this.controlGeo = null;
    this.panel_ = null;
  };

  /**
   * Name of this control
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.plugin.Geosearchbylocation.NAME = 'geosearchbylocation';

  /**
   * This function compare if pluging recieved by param is instance of  M.plugin.Geosearchbylocation
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  M.plugin.Geosearchbylocation.prototype.equals = function (plugin) {
    if (plugin instanceof M.plugin.Geosearchbylocation) {
      return true;
    }
    else {
      return false;
    }
  };
})();
