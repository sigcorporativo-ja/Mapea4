import PrinterControl from './printercontrol';
import '../assets/css/printer';

export default class Printer extends M.Plugin {
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
  constructor(parameters = {}) {
    super(null);

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
    this.url_ = M.config.geoprint.URL;
    if (!M.utils.isNullOrEmpty(parameters.url)) {
      this.url_ = parameters.url;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.params_ = {};
    if (!M.utils.isNullOrEmpty(parameters.params)) {
      this.params_ = parameters.params;
    }

    /**
     * Facade of the map
     * @private
     * @type {String}
     */
    this.options_ = {};
    if (!M.utils.isNullOrEmpty(parameters.options)) {
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

    this.control_ = new PrinterControl(
      this.url_,
      this.params_,
      this.options_,
    );
    this.panel_ = new M.ui.Panel('printer', {
      collapsible: true,
      className: 'm-printer',
      collapsedButtonClass: 'g-cartografia-impresora',
      position: M.ui.position.TR,
      tooltip: 'Impresión del mapa',
    });
    this.panel_.on(M.evt.ADDED_TO_MAP, (html) => {
      M.utils.enableTouchScroll(html);
    });
    this.panel_.addControls(this.control_);
    this.map_.addPanels(this.panel_);

    this.control_.on(M.evt.ADDED_TO_MAP, () => {
      this.fire(M.evt.ADDED_TO_MAP);
    });
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
    aControls.push(this.control_);
    return aControls;
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
    }
    return false;
  }

  /**
   * Name to identify this plugin
   * @const
   * @type {string}
   * @public
   * @api stable
   */
}

Printer.NAME = 'printer';
