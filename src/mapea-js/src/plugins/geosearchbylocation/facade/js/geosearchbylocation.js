import geosearchbylocationcontrol from "./geosearchbylocationcontrol";
import Plugin from "facade/js/plugin";
import Config from "../../../configuration";
import Utils from "facade/js/utils/utils";
import Panel from "facade/js/ui/panel";
import Position from "facade/js/ui/position";
import Location from "facade/js/controls/location";

export default class Geosearchbylocation extends Plugin {
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
  constructor(parameters) {
    // call super
    super();

    parameters = (parameters || {});

    /**
     * Name of this control
     * @public
     * @type {string}
     * @api stable
     */
    this.name = Geosearchbylocation.NAME;

    /**
     * URL for the query
     * @private
     * @type {string}
     */
    this.url_ = Config.GEOSEARCH_URL;
    if (!Utils.isNullOrEmpty(parameters.url)) {
      this.url_ = parameters.url;
    }

    /**
     * Core to the URL for the query
     * @private
     * @type {string}
     */
    this.core_ = Config.GEOSEARCH_CORE;
    if (!Utils.isNullOrEmpty(parameters.core)) {
      this.core_ = parameters.core;
    }

    /**
     * Handler to the URL for the query
     * @private
     * @type {string}
     */
    this.handler_ = Config.GEOSEARCH_HANDLER;
    if (!Utils.isNullOrEmpty(parameters.handler)) {
      this.handler_ = parameters.handler;
    }

    /**
     * Distance search
     * @private
     * @type {number}
     */
    this.distance_ = Config.GEOSEARCH_DISTANCE;
    if (!Utils.isNullOrEmpty(parameters.distance)) {
      this.distance_ = parameters.distance;
    }

    /**
     * Spatial field
     * @private
     * @type {string}
     */
    this.spatialField_ = Config.GEOSEARCH_SPATIAL_FIELD;

    /**
     * Number of responses allowed
     * @private
     * @type {number}
     */
    this.rows_ = Config.GEOSEARCHBYLOCATION_ROWS;

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

  }

  /**
   * @inheritdoc
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.map_ = map;
    this.controlGeo = new GeosearchbylocationControl(this.url_,
      this.core_, this.handler_, this.distance_, this.spatialField_, this.rows_);

    this.panel_ = new Panel(Geosearchbylocation.NAME, {
      'collapsible': false,
      'className': 'm-geosearchbylocation',
      'position': Position.BR
    });
    // sets the className depending on other panels
    var locationPanel = map.getPanels([Location.NAME])[0];
    var streetViewPanel;

    // TODO
    if (!Utils.isNullOrEmpty(M.plugin.Streetview)) {
      streetViewPanel = map.getPanels([M.plugin.Streetview.NAME])[0];
    }


    if (!Utils.isNullOrEmpty(locationPanel) && !Utils.isNullOrEmpty(streetViewPanel)) {
      locationPanel.addClassName('m-with-geosearchbylocation');
      streetViewPanel.addClassName('m-with-geosearchbylocation');
      this.panel_.addClassName('m-with-location m-with-streetview');
    } else if (!Utils.isNullOrEmpty(locationPanel)) {
      locationPanel.addClassName('m-with-geosearchbylocation');
      this.panel_.addClassName('m-with-location');
    } else if (!Utils.isNullOrEmpty(streetViewPanel)) {
      streetViewPanel.addClassName('m-with-geosearchbylocation');
      this.panel_.addClassName('m-with-streetview');
    }
    this.panel_.addControls(this.controlGeo);
    this.map_.addPanels(this.panel_);
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
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
  }
  /**
   * This function compare if pluging recieved by param is instance of  M.plugin.Geosearchbylocation
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof Geosearchbylocation) {
      return true;
    } else {
      return false;
    }
  }
}


/**
 * Name of this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */

M.plugin.Geosearchbylocation.NAME = 'geosearchbylocation';
