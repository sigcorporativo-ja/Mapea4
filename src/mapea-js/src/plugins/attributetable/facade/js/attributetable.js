import 'plugins/attributetable/facade/assets/css/attributetable';
import AttributeTableControl from './attributetableControl';

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
    const add = (pluginParam) => {
      const plugin = pluginParam;
      plugin.facadeMap_ = map;
      plugin.control_ = new AttributeTableControl(plugin.numPages_);
      plugin.panel_ = new M.ui.Panel(AttributeTable.NAME, {
        collapsible: true,
        className: 'm-attributetable',
        collapsedButtonClass: 'g-cartografia-localizacion4',
        position: M.ui.position.TR,
        tooltip: 'Tabla de atributos',
      });
      plugin.panel_.addControls(plugin.control_);
      plugin.panel_.on(M.evt.SHOW, (evt) => {
        if (map.getWFS().length === 0 && map.getKML().length === 0 && map.getLayers()
          .filter(layer => layer.type === 'GeoJSON') === 0) {
          plugin.panel_.collapse();
          M.dialog.info('No existen capas consultables.');
        }
      });
      map.addPanels(plugin.panel_);
    };

    map.on(M.evt.ADDED_LAYER, () => {
      this.destroy();
      add(this);
    });


    add(this);
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.removeControls([this.control_]);
    [this.control_, this.panel_, this.facadeMap_] = [null, null, null];
  }

  /**
   * Name of this control
   * @const
   * @type {string}
   * @public
   * @api stable
   */
}

AttributeTable.NAME = 'attributetable';
