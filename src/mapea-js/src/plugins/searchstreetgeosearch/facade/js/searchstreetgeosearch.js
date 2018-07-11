import Autocomplete from "plugins/autocomplete/facade/js/autocomplete";
import Plugin from "facade/js/Plugin";
import EventsManager from "facade/js/event/Eventsmanager";
import Utils from "facade/js/utils/Utils";
import Remote from "facade/js/utils/Remote";
import Panel from "facade/js/ui/Panel";
import Position from "facade/js/ui/Position";

export default class SearchstreetGeosearch extends Plugin {
  /**
   * @classdesc Main facade plugin object. This class creates a plugin
   *            object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Mx.parameters.SearchstreetGeosearch} parameters - parameters SearchstreetGeosearch
   * @api stable
   */
  constructor(parameters) {
    parameters = (parameters || {});

    super();
    /**
     * Parameters SearchstreetGeosearch
     *
     * @private
     * @type {Mx.parameters.SearchstreetGeosearch}
     */
    this.parameters_ = parameters;

    /**
     * Name plugin
     *
     * @public
     * @type {string}
     * @api stable
     */
    this.name = "searchstreetgeosearch";

    /**
     * Facade of the map
     *
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * SearchstreetGeosearch control
     *
     * @private
     * @type {M.control.SearchstreetGeosearch}
     */
    this.control_ = null;

    /**
     * INE code to specify the search
     *
     * @private
     * @type {number}
     */
    this.locality_ = parameters.locality;

  }

  /**
   * @inheritdoc
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the control
   * @api stable
   */
  addTo(map) {
    this.map_ = map;
    this.control_ = new SearchstreetGeosearch(this.parameters_);

    map._areasContainer.getElementsByClassName("m-top m-right")[0].classList.add("top-extra");

    this.control_.on(EventsManager.ADDED_TO_MAP, () => {
      this.fire(EventsManager.ADDED_TO_MAP);

      // Checks if the received INE code is correct.
      let comCodIne = Utils.addParameters(M.config.SEARCHSTREET_URLCOMPROBARINE, {
        codigo: this.locality_
      });
      Remote.get(comCodIne).then(
        (response) => {
          let results = JSON.parse(response.text);
          if (Utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
            this.locality_ = "";
          }
          let autocompletador = new Autocomplete({
            'locality': this.locality_,
            'target': this.control_.getInput(),
            'html': this.control_.getHtml()
          });
          this.map_.addPlugin(autocompletador);
        });
    }, this);
    this.panel_ = new Panel('SearchstreetGeosearch', {
      'collapsible': true,
      'className': 'm-geosearch',
      'position': Position.TL,
      'tooltip': 'Buscador de calles y geobúsquedas'
    });
    //JGL20170816: foco al input al desplegar panel
    this.panel_.on(EventsManager.ADDED_TO_MAP, html => {
      this.panel_._buttonPanel.addEventListener("click", evt => {
        if (!this.panel_._collapsed) {
          this.control_.input_.focus();
        }
      });
    });
    this.panel_.addControls(this.control_);
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
    this.map_.removeControls([this.control_]);
    this.name = null;
    this.parameters_ = null;
    this.map_ = null;
    this.control_ = null;
    this.locality_ = null;
  }

  /**
   * This function compare if pluging recieved by param is instance of M.plugin.SearchstreetGeosearch
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof SearchstreetGeosearch) {
      return true;
    } else {
      return false;
    }
  }
}
