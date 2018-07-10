import MeasureLength from "./measurelength"
import MeasureArea from "./measurearea"
import MeasureClear from "./measureclear"
import Plugin from "facade/js/plugin";

export default class Measurebar extends Plugin {
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

    map.addControls([this.measureLength_, this.measureArea_, this.measureClear_]);
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
    } else {
      return false;
    }
  }
}

Measurebar.NAME = "measurebar";
