import Plugin from "facade/js/plugin";
import Control from "./attributetablecontrol";
import EventsManager from "facade/js/event/eventsmanager";
import Utils from "facade/js/utils/utils";
import Panel from "facade/js/ui/panel";
import Dialog from "facade/js/dialog";
import Position from "facade/js/ui/position";

export default class AttributeTable extends Plugin {

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

    super();

  [this.control_, this.panel_, this.facadeMap_] = [null, null, null];

    parameters = (parameters || {});

    this.numPages_ = parseInt((!Utils.isNullOrEmpty(parameters.pages) && parameters.pages >= 1 && parameters.pages % 1 === 0) ? parameters.pages : M.config.ATTRIBUTETABLE_PAGES);

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
    map.on(EventsManager.ADDED_LAYER, () => {
      this.destroy();
      add(this);
    });

    const add = (plugin) => {
      plugin.facadeMap_ = map;
      plugin.control_ = new Control(plugin.numPages_);
      plugin.panel_ = new Panel(AttributeTable.NAME, {
        'collapsible': true,
        'className': 'm-attributetable',
        'collapsedButtonClass': 'g-cartografia-localizacion4',
        'position': Position.TR,
        'tooltip': 'Tabla de atributos'
      });
      plugin.panel_.addControls(plugin.control_);
      plugin.panel_.on(EventsManager.SHOW, evt => {
        if (map.getWFS().length === 0 && map.getKML().length === 0 && map.getLayers()
          .filter(layer => layer.type === "GeoJSON") === 0) {
          plugin.panel_.collapse();
          Dialog.info("No existen capas consultables.");
        }
      });
      map.addPanels(plugin.panel_);
    };
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
