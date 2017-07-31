goog.provide('P.plugin.Geosearch');

goog.require('P.control.Geosearch');
goog.require('P.layer.Geosearch');

(function() {
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
  M.plugin.Geosearch = (function(parameters) {
    parameters = (parameters || {});

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Control that executes the searches
     * @private
     * @type {Object}
     */
    this.control_ = null;

    /**
     * TODO
     * @private
     * @type {M.ui.Panel}
     */
    this.panel_ = null;

    /**
     * Name of this control
     * @public
     * @type {string}
     * @api stable
     */
    this.name = M.plugin.Geosearch.NAME;

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.url_ = M.config.GEOSEARCH_URL;
    if (!M.utils.isNullOrEmpty(parameters.url)) {
      this.url_ = parameters.url;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.core_ = M.config.GEOSEARCH_CORE;
    if (!M.utils.isNullOrEmpty(parameters.core)) {
      this.core_ = parameters.core;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.handler_ = M.config.GEOSEARCH_HANDLER;
    if (!M.utils.isNullOrEmpty(parameters.handler)) {
      this.handler_ = parameters.handler;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.searchParameters_ = parameters.params || {};

    goog.base(this);
  });
  goog.inherits(M.plugin.Geosearch, M.Plugin);

  /**
   * This function provides the implementation
   * of the object
   *
   * @public
   * @function
   * @param {Object} map the map to add the plugin
   * @api stable
   */
  M.plugin.Geosearch.prototype.addTo = function(map) {
    this.map_ = map;

    goog.dom.classlist.add(map._areasContainer.getElementsByClassName("m-top m-right")[0],
      "top-extra");

    this.control_ = new M.control.Geosearch(this.url_, this.core_,
      this.handler_, this.searchParameters_);
    this.control_.on(M.evt.ADD_TO_MAP, this.onLoadCallback_, this);
    this.panel_ = new M.ui.Panel('geosearch', {
      'collapsible': true,
      'className': 'm-geosearch',
      'collapsedButtonClass': 'g-cartografia-zoom',
      'position': M.ui.position.TL,
      'tooltip': 'Geobúsquedas'
    });
    this.panel_.addControls(this.control_);
    this.map_.addPanels(this.panel_);
  };

  /**
   * This function provides the input search
   *
   * @public
   * @function
   * @returns {HTMLElement} the input that executes the search
   * @api stable
   */
  M.plugin.Geosearch.prototype.getInput = function() {
    var inputSearch = null;
    if (!M.utils.isNullOrEmpty(this.control_)) {
      inputSearch = this.control_.getInput();
    }
    return inputSearch;
  };

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  M.plugin.Geosearch.prototype.destroy = function() {
    this.map_.removeControls([this.control_]);
    this.map_ = null;
    this.control_ = null;
    this.panel_ = null;
    this.url_ = null;
    this.core_ = null;
    this.handler_ = null;
    this.searchParameters_ = null;
  };

  /**
   * This function compare if pluging recieved by param is instance of  M.plugin.Geosearch
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  M.plugin.Geosearch.prototype.equals = function(plugin) {
    if (plugin instanceof M.plugin.Geosearch) {
      return true;
    }
    else {
      return false;
    }
  };

  M.plugin.Geosearch.NAME = "geosearch";
})();
