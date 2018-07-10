import Autocomplete from "plugins/autocomplete/facade/js/autocomplete";
import Plugin from "facade/js/plugin";
import Config from "../../../configuration";
import Utils from "facade/js/utils/utils";
import Remote from "facade/js/utils/remote";
import Dialog from "facade/js/dialog";
import EventsManager from "facade/js/event/eventsmanager";
import Panel from "facade/js/ui/panel";
import Position from "facade/js/ui/position";
import Exception from "facade/js/exception/exception";

export default class Searchstreet extends Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Mx.parameters.Searchstreet} parameters - Searchstreet parameters
   * @api stable
   */
  constructor(parameters) {
    super();

    parameters = (parameters || {});

    /**
     * Name plugin
     *
     * @public
     * @type {string}
     * @api stable
     */
    this.name = "searchstreet";

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Searchstreet control
     *
     * @private
     * @type {M.control.Searchstreet}
     */
    this.control_ = null;

    /**
     * Autocomplete control
     *
     * @private
     * @type {M.plugin.Autocomplete}
     */
    this.autocompletador_ = null;

    /**
     * Panel Searchstreet
     * @private
     * @type {M.ui.Panel}
     */
    this.panel_ = null;

    /**
     * Service URL (Searchstreet)
     *
     * @private
     * @type {string}
     */
    this.url_ = Config.SEARCHSTREET_URL;

    /**
     * INE code to specify the search
     *
     * @private
     * @type {number}
     */
    this.locality_ = "";
    if (!Utils.isNullOrEmpty(parameters.locality)) {
      this.locality_ = parameters.locality;
    }

  }

  /**
   * @inheritdoc
   *
   * @public
   * @function
   * @param {M.Map}
   *        map - Facade map
   * @api stable
   */
  addTo(map) {
    this.map_ = map;

    map._areasContainer.getElementsByClassName("m-top m-right")[0].classList.add("top-extra");

    // Checks if the received INE code is correct.
    let comCodIne = Utils.addParameters(Config.SEARCHSTREET_URLCOMPROBARINE, {
      codigo: this.locality_
    });
    Remote.get(comCodIne).then(
      response => {
        let results;
        try {
          if (!Utils.isNullOrEmpty(response.text)) {
            results = JSON.parse(response.text);
            if (!Utils.isNullOrEmpty(this_.locality_) && Utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
              // If not correct, value empty
              Dialog.error("El código del municipio '" + this_.locality_ + "' no es válido");
              this_.locality_ = "";
            }
          }
          this_.control_ = new Searchstreet(this_.url_, this_.locality_);
          this_.control_.on(EventsManager.ADDED_TO_MAP, () => {
            this_.fire(EventsManager.ADDED_TO_MAP);
            this_.autocompletador_ = new Autocomplete({
              'locality': this_.locality_,
              'target': this_.control_.getInput(),
              'html': this_.control_.getHtml()
            });
            this_.map_.addPlugin(this_.autocompletador_);
          }, this);
          this_.panel_ = new Panel('searchstreet', {
            'collapsible': true,
            'className': 'm-searchstreet',
            'position': Position.TL,
            'tooltip': 'Buscador de calles'
          });
          //JGL20170816: foco al input al desplegar panel
          this_.panel_.on(EventsManager.ADDED_TO_MAP, html => {
            this_.panel_._buttonPanel.addEventListener("click", evt => {
              if (!this_.panel_._collapsed) {
                this_.control_.input_.focus();
              }
            });
          });
          this_.panel_.addControls(this_.control_);
          this_.map_.addPanels(this_.panel_);
        } catch (err) {
          Exception('La respuesta no es un JSON válido: ' + err);
        }
      });
  };

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls([this.control_]);
    this.autocompletador_.destroy();
    this.name = null;
    this.map_ = null;
    this.control_ = null;
    this.autocompletador_ = null;
    this.panel_ = null;
    this.url_ = null;
    this.locality_ = null;
  }

  /**
   * This function compare if pluging recieved by param is instance of M.plugin.Searchstreet
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof Searchstreet) {
      return true;
    } else {
      return false;
    }
  }
}
