import MeasureLength from './measurelength';
import MeasureArea from './measurearea';
import MeasureClear from './measureclear';
import '../assets/css/measurebar';
import api from '../../api';

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
  constructor() {
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

    this.measureLength_ = new MeasureLength();
    this.measureArea_ = new MeasureArea();
    this.measureClear_ = new MeasureClear(this.measureLength_, this.measureArea_);
    if (M.utils.isNullOrEmpty(this.map_.panel.TOOLS)) {
      this.map_.panel.TOOLS = new M.ui.Panel('tools', {
        collapsible: true,
        className: 'm-tools',
        collapsedButtonClass: 'g-cartografia-herramienta',
        position: M.ui.position.TL,
        tooltip: 'Panel de herramientas',
      });
      this.map_.addPanels(this.map_.panel.TOOLS);
    }
    this.controls_ = [this.measureLength_, this.measureArea_, this.measureClear_];
    this.map_.panel.TOOLS.addControls(this.controls_);
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls([this.measureLength_, this.measureArea_, this.measureClear_]);
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
