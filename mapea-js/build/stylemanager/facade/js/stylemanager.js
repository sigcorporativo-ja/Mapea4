import 'templates/categorystyles';
import StyleManagerControl from './stylemanagerControl';
import { ColorPickerPolyfill } from './utils/colorpicker';

export default class StyleManager extends M.Plugin {
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
  constructor(layer = null) {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * @private
     * @type {M.ui.Panel}
     */
    this.panel_ = null;

    /**
     * @private
     * @type {M.layer.Vector}
     */
    this.layer_ = layer;

    ColorPickerPolyfill.apply(window);


    // helpers handlebars
    Handlebars.registerHelper('sum', (n1, n2) => {
      return n1 + n2;
    });

    Handlebars.registerHelper('neq', (arg1, arg2, options) => {
      if (!Object.equals(arg1, arg2)) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    Handlebars.registerHelper('unless', (arg1, options) => {
      if (!arg1) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    Handlebars.registerHelper('get', (index, array) => {
      return array[index];
    });

    Handlebars.registerHelper('uppercase', (string) => {
      return string.toUpperCase();
    });

    Handlebars.registerHelper('lowercase', (string) => {
      return string.toLowerCase();
    });
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.controls_.push(new StyleManagerControl(this.layer_));
    this.map_ = map;
    this.panel_ = new M.ui.Panel(M.plugin.StyleManager.NAME, {
      collapsible: true,
      className: 'm-stylemanager',
      collapsedButtonClass: 'g-sigc-palette',
      position: M.ui.position.TL,
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * TODO
   */
  destroy() {
    this.panel_.removeControls(this.controls_);
    this.panel_ = null;
    this.controls_ = [];
    this.map_ = null;
  }

  static get NAME() {
    return 'stylemanager';
  }
}
