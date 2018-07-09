import GeosearchControl from "./geosearchcontrol";
import GeosearchLayer from "./geosearchlayer";
import Plugin from "facade/js/plugin";
import Config from "../../../configuration";
import Utils from "facade/js/utils/utils";
import EventsManager from "facade/js/event/eventsmanager";
import Panel from "facade/js/ui/panel";
import Position from "facade/js/ui/position";

export default Geosearch extends Plugin {
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
  constructor(parameters) {
    super();

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
    this.name = Geosearch.NAME;

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.url_ = Config.GEOSEARCH_URL;
    if (!Utils.isNullOrEmpty(parameters.url)) {
      this.url_ = parameters.url;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.core_ = Config.GEOSEARCH_CORE;
    if (!Utils.isNullOrEmpty(parameters.core)) {
      this.core_ = parameters.core;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.handler_ = Config.GEOSEARCH_HANDLER;
    if (!Utils.isNullOrEmpty(parameters.handler)) {
      this.handler_ = parameters.handler;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.searchParameters_ = parameters.params || {};

  }

  /**
   * This function provides the implementation
   * of the object
   *
   * @public
   * @function
   * @param {Object} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.map_ = map;

    map._areasContainer.getElementsByClassName("m-top m-right")[0].classList.add("top-extra");

    this.control_ = new GeosearchControl(this.url_, this.core_,
      this.handler_, this.searchParameters_);
    this.control_.on(EventsManager.ADD_TO_MAP, this.onLoadCallback_, this);
    this.panel_ = new Panel('geosearch', {
      'collapsible': true,
      'className': 'm-geosearch',
      'collapsedButtonClass': 'g-cartografia-zoom',
      'position': Position.TL,
      'tooltip': 'Geobúsquedas'
    });
    this.panel_.addControls(this.control_);
    this.map_.addPanels(this.panel_);
  }

  /**
   * This function provides the input search
   *
   * @public
   * @function
   * @returns {HTMLElement} the input that executes the search
   * @api stable
   */
  getInput() {
    let inputSearch = null;
    if (!Utils.isNullOrEmpty(this.control_)) {
      inputSearch = this.control_.getInput();
    }
    return inputSearch;
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls([this.control_]);
    this.map_ = null;
    this.control_ = null;
    this.panel_ = null;
    this.url_ = null;
    this.core_ = null;
    this.handler_ = null;
    this.searchParameters_ = null;
  }

  /**
   * This function compare if pluging recieved by param is instance of  Geosearch
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof Geosearch) {
      return true;
    } else {
      return false;
    }
  }

}

Geosearch.NAME = "geosearch";
