import Plugin from "facade/js/plugin";
import Config from "../../../configuration";
import Utils from "facade/js/utils/utils";
import Panel from "facade/js/ui/panel";
import Position from "facade/js/ui/position";
import EventsManager from "facade/js/event/eventsmanager";

export default class Printer extends Plugin {
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

    super(null, Printer.NAME);

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
    this.name = Printer.NAME;

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.url_ = Config.geoprint.URL;
    if (!Utils.isNullOrEmpty(parameters.url)) {
      this.url_ = parameters.url;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.params_ = {};
    if (!Utils.isNullOrEmpty(parameters.params)) {
      this.params_ = parameters.params;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.options_ = {};
    if (!Utils.isNullOrEmpty(parameters.options)) {
      this.options_ = parameters.options;
    }

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

    this.control_ = new Printer(this.url_, this.params_,
      this.options_);
    this.panel_ = new Panel('printer', {
      'collapsible': true,
      'className': 'm-printer',
      'collapsedButtonClass': 'g-cartografia-impresora',
      'position': Position.TR,
      'tooltip': 'Impresión del mapa'
    });
    this.panel_.on(EventsManager.ADDED_TO_MAP, html => {
      Utils.enableTouchScroll(html);
    });
    this.panel_.addControls(this.control_);
    this.map_.addPanels(this.panel_);

    this.control_.on(EventsManager.ADDED_TO_MAP, function () {
      this.fire(EventsManager.ADDED_TO_MAP);
    });
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
    this.params_ = null;
    this.options_ = null;
    this.name = null;
  }

  /**
   * This function compare if pluging recieved by param is instance of   M.plugin.Printer
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof Printer) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Name to identify this plugin
   * @const
   * @type {string}
   * @public
   * @api stable
   */
}

Printer.NAME = "printer";
