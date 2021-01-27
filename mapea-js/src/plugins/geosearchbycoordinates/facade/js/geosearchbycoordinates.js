import '../assets/css/geosearchbycoordinates.css';
import GeosearchByCoordinatesControl from './geosearchbycoordinatescontrol.js';
import api from '../../api.json';

export default class GeosearchByCoordinates extends M.Plugin {
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
  constructor(parameters = {}) {
    // call super
    super();

    /**
     * Name of this control
     * @public
     * @type {string}
     * @api stable
     */
    this.name = GeosearchByCoordinates.NAME;

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
     * @type {M.control.GeosearchByCoordinates}
     * @api stable
     */
    this.controlGeo_ = null;

    /**
     * Plugin panel
     * @private
     * @type {M.ui.Panel}
     */
    this.panel_ = null;

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
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
    this.controlGeo_ = new GeosearchByCoordinatesControl(
      this.url_,
      this.core_,
      this.handler_,
      this.distance_,
      this.spatialField_,
      this.rows_);

    this.panel_ = new M.ui.Panel(GeosearchByCoordinates.NAME, {
      collapsible: false,
      className: 'm-geosearchbylocation',
      position: M.ui.position.BR,
    });
    // sets the className depending on other panels
    const locationPanel = map.getPanels([M.control.Location.NAME])[0];
    let streetViewPanel;

    if (!M.utils.isNullOrEmpty(locationPanel) && !M.utils.isNullOrEmpty(streetViewPanel)) {
      locationPanel.addClassName('m-with-geosearchbylocation');
      streetViewPanel.addClassName('m-with-geosearchbylocation');
      this.panel_.addClassName('m-with-location m-with-streetview');
    } else if (!M.utils.isNullOrEmpty(locationPanel)) {
      locationPanel.addClassName('m-with-geosearchbylocation');
      this.panel_.addClassName('m-with-location');
    } else if (!M.utils.isNullOrEmpty(streetViewPanel)) {
      streetViewPanel.addClassName('m-with-geosearchbylocation');
      this.panel_.addClassName('m-with-streetview');
    }
    this.panel_.addControls(this.controlGeo_);
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
    this.map_.removeControls([this.controlGeo_]);
    this.controlGeo_ = null;
    this.name = null;
    this.url_ = null;
    this.core_ = null;
    this.handler_ = null;
    this.distance_ = null;
    this.spatialField_ = null;
    this.rows_ = null;
    this.map_ = null;
    this.controlGeo_ = null;
    this.panel_ = null;
  }

  /**
   * This function return the control of plugin
   *
   * @public
   * @function
   * @api stable
   */
  getControls() {
    const aControl = [];
    aControl.push(this.controlGeo_);
    return aControl;
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
    if (plugin instanceof GeosearchByCoordinates) {
      return true;
    }
    return false;
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api
   */
  getMetadata() {
    return this.metadata_;
  }
}


/**
 * Name of this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchByCoordinates.NAME = 'geosearchbylocation';
