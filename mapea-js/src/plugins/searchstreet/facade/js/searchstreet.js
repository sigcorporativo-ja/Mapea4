import Autocomplete from './autocomplete.js';
import SearchstreetControl from './searchstreetcontrol.js';
import '../assets/css/searchstreet.css';
import api from '../../api.json';

export default class Searchstreet extends M.Plugin {
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
  constructor(parameters = {}) {
    super();
    /**
     * Name plugin
     *
     * @public
     * @type {string}
     * @api stable
     */
    this.name = 'searchstreet';

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
    this.url_ = M.config.SEARCHSTREET_URL;

    /**
     * INE code to specify the search
     *
     * @private
     * @type {number}
     */
    this.locality_ = '';
    if (!M.utils.isNullOrEmpty(parameters.locality)) {
      this.locality_ = parameters.locality;
    }

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
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

    map.areasContainer.getElementsByClassName('m-top m-right')[0].classList.add('top-extra');
    // Checks if the received INE code is correct.
    const comCodIne = M.utils.addParameters(M.config.SEARCHSTREET_URLCOMPROBARINE, {
      codigo: this.locality_,
    });
    if (!M.utils.isNullOrEmpty(comCodIne)) {
      M.remote.get(comCodIne).then((response) => {
        let results;
        // try {
        if (!M.utils.isNullOrEmpty(response.text)) {
          results = JSON.parse(response.text);
          if (!M.utils.isNullOrEmpty(this.locality_) &&
            M.utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
            // If not correct, value empty
            M.dialog.error(`El código del municipio '${this.locality}' no es válido`);
            this.locality_ = '';
          }
        }
        this.control_ = new SearchstreetControl(this.url_, this.locality_);
        this.control_.on(M.evt.ADDED_TO_MAP, () => {
          this.fire(M.evt.ADDED_TO_MAP);
          this.autocompletador_ = new Autocomplete({
            locality: this.locality_,
            target: this.control_.getInput(),
            html: this.control_.getHtml(),
          });
          this.map_.addPlugin(this.autocompletador_);
        }, this);
        this.panel_ = new M.ui.Panel('searchstreet', {
          collapsible: true,
          className: 'm-searchstreet',
          position: M.ui.position.TL,
          tooltip: 'Buscador de calles',
        });
        // JGL20170816: foco al input al desplegar panel

        this.panel_.on(M.evt.ADDED_TO_MAP, (html) => {
          this.panel_.getButtonPanel().addEventListener('click', (evt) => {
            if (!this.panel_.collapsed) {
              this.control_.getInput().focus();
            }
          });
        });
        this.panel_.addControls(this.control_);
        this.map_.addPanels(this.panel_);
        // }
        // catch (err) {
        //   M.exception(`La respuesta no es un JSON válido: ${err}`);
        // }
      });
    }
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
    this.map_.removePlugins(this.autocompletador_);
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
    return 'searchstreet';
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
