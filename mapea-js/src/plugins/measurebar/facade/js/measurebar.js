import MeasureLength from './measurelength.js';
import MeasureArea from './measurearea.js';
import MeasureClear from './measureclear.js';
import '../assets/css/measurebar.css';
import api from '../../api.json';

export default class Measurebar extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @api stable
   */
  constructor(parameters) {
    const params = parameters || {};
    super();

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Control MeasureLength
     * @private
     * @type {M.control.MeasureLength}
     */
    this.measureLength_ = null;

    /**
     * Control MeasureArea
     * @private
     * @type {M.control.MeasureArea}
     */
    this.measureArea_ = null;

    /**
     * Name of this control
     * @public
     * @type {string}
     * @api stable
     */
    this.name = Measurebar.NAME;

    /**
     * Control MeasureClear
     * @private
     * @type {M.control.MeasureClear}
     */
    this.measureClear_ = null;

    /**
     * Control MeasureLenght
     * @privates
     * @type {number}
     */
    this.metadata_ = api.metadata;

    this.longitud_ = params.longitud || 100;

    /**
     * Control MeasureArea
     * @privates
     * @type {number}
     */
    this.metadata_ = api.metadata;

    this.distanciaArea_ = params.distanciaArea || 1;

    /**
     * Control MeasureArea
     * @privates
     * @type {string}
     */
    this.metadata_ = api.metadata;
    this.unidadMedida_ = params.unidadMedida || 'km<sup>2</sup>';
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

    this.measureLength_ = new MeasureLength(this.longitud_);
    this.measureArea_ = new MeasureArea(this.distanciaArea_, this.unidadMedida_);
    this.measureClear_ = new MeasureClear(this.measureLength_, this.measureArea_);
    if (M.utils.isNullOrEmpty(this.map_.panel.TOOLS)) {
      this.map_.panel.TOOLS = new M.ui.Panel('tools', {
        collapsible: true,
        className: 'm-tools',
        collapsedButtonClass: 'g-cartografia-herramienta',
        position: M.ui.position.TL,
        tooltip: 'Panel de herramientas',
      });
    }
    this.controls_ = [this.measureLength_, this.measureArea_, this.measureClear_];
    this.map_.panel.TOOLS.addControls(this.controls_);
    this.panel_ = this.map_.panel.TOOLS;
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
    this.panel_.removeControls([this.measureLength_, this.measureArea_, this.measureClear_]);
    this.map_ = null;
    this.measureLength_ = null;
    this.measureArea_ = null;
    this.measureClear_ = null;
    this.name = null;
  }

  /**
   * This function return the control of plugin
   *
   * @public
   * @function
   * @api stable
   */
  getControls() {
    const aControls = [];
    aControls.push(this.measureArea_, this.measureClear_, this.measureLength_);
    return aControls;
  }

  /**
   * This function compare if pluging recieved by param is instance of M.plugin.Measurebar
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof Measurebar) {
      return true;
    }
    return false;
  }

  /**
   * Gets the parameter api rest of the plugin
   *
   * @public
   * @function
   * @api
   */
  getAPIRest() {
    return 'measurebar';
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata() {
    return this.metadata_;
  }
}

Measurebar.NAME = 'measurebar';
