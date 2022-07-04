import '../assets/css/attributetable.css';
import AttributeTableControl from './attributetableControl.js';
import api from '../../api.json';

export default class AttributeTable extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @api stable
   */
  constructor(parameters = {}) {
    super();

    [this.control_, this.panel_, this.facadeMap_] = [null, null, null];

    this.numPages_ = parseInt((!M.utils.isNullOrEmpty(parameters.pages) &&
      parameters.pages >= 1 &&
      parameters.pages % 1 === 0) ? parameters.pages : M.config.ATTRIBUTETABLE_PAGES, 10);

    /**
     * Name of this control
     * @public
     * @type {string}
     * @api stable
     */
    this.name = AttributeTable.NAME;

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     * ID event ADDED_LAYER
     *
     * @public
     * @type {string}
     */
    this.idAddedLayer = '';

    /**
     * Control event ADDED_TO_MAP
     *
     * @public
     * @type {Boolean}
     */
    this.added_to_map = true;
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
    this.idAddedLayer = map.on(M.evt.ADDED_LAYER, () => {
      this.destroy();
      this.add(map);
    });
    this.add(map);
  }

  /**
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  add(map) {
    this.facadeMap_ = map;
    this.control_ = new AttributeTableControl(this.numPages_);
    this.control_.on(M.evt.ADDED_TO_MAP, () => {
      if (this.added_to_map) {
        this.fire(M.evt.ADDED_TO_MAP);
        this.added_to_map = false;
      }
    });
    this.panel_ = new M.ui.Panel(AttributeTable.NAME, {
      collapsible: true,
      className: 'm-attributetable',
      collapsedButtonClass: 'g-cartografia-localizacion4',
      position: M.ui.position.TR,
      tooltip: 'Tabla de atributos',
    });
    this.panel_.addControls(this.control_);
    this.panel_.on(M.evt.SHOW, (evt) => {
      if (map.getWFS().length === 0 && map.getKML().length === 0 && map.getLayers()
        .filter(layer => layer.type === 'GeoJSON') === 0) {
        this.panel_.collapse();
        M.dialog.info('No existen capas consultables.');
      }
    });
    map.addPanels(this.panel_);
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.unByKey(M.evt.ADDED_LAYER, this.idAddedLayer);
    this.facadeMap_.removeControls([this.control_]);
    [this.control_, this.panel_, this.facadeMap_] = [null, null, null];
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
    aControl.push(this.control_);
    return aControl;
  }

  /**
   * Gets the parameter api rest of the plugin
   *
   * @public
   * @function
   * @api
   */
  getAPIRest() {
    return 'attributetable';
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

/**
 * Name of this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
AttributeTable.NAME = 'attributetable';
