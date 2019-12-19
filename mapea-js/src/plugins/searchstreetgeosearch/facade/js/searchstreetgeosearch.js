import 'plugins/searchstreetgeosearch/facade/assets/css/searchstreetgeosearch';
import Autocomplete from './autocomplete';
import SearchstreetGeosearchControl from './searchstreetgeosearchcontrol';
import api from '../../api';

export default class SearchstreetGeosearch extends M.Plugin {
  /**
   * @classdesc Main facade plugin object. This class creates a plugin
   *            object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Mx.parameters.SearchstreetGeosearch} parameters - parameters SearchstreetGeosearch
   * @api stable
   */
  constructor(parameters = {}) {
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
    this.name = 'searchstreetgeosearch';

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
   * @param {M.Map} map - Map to add the control
   * @api stable
   */
  addTo(map) {
    this.map_ = map;
    this.control_ = new SearchstreetGeosearchControl(this.parameters_);
    map.areasContainer.getElementsByClassName('m-top m-right')[0].classList.add('top-extra');

    this.control_.on(M.evt.ADDED_TO_MAP, () => {
      this.fire(M.evt.ADDED_TO_MAP);

      // Checks if the received INE code is correct.
      const comCodIne = M.utils.addParameters(M.config.SEARCHSTREET_URLCOMPROBARINE, {
        codigo: this.locality_,
      });
      M.remote.get(comCodIne).then((response) => {
        const results = JSON.parse(response.text);
        if (M.utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
          this.locality_ = '';
        }
        this.autocompletador = new Autocomplete({
          locality: this.locality_,
          target: this.control_.getInput(),
          html: this.control_.getHtml(),
        });
        this.map_.addPlugin(this.autocompletador);
      });
    }, this);
    this.panel_ = new M.ui.Panel('SearchstreetGeosearch', {
      collapsible: true,
      className: 'm-geosearch',
      position: M.ui.position.TL,
      tooltip: 'Buscador de calles y geobúsquedas',
    });
    /* eslint-disable */
    // JGL20170816: foco al input al desplegar panel
    this.panel_.on(M.evt.ADDED_TO_MAP, (html) => {
      this.panel_._buttonPanel.addEventListener('click', (evt) => {
        if (!this.panel_._collapsed) {
          this.control_.getInput().focus();
        }
      });
    });
    this.panel_.addControls(this.control_);
    this.map_.addPanels(this.panel_);
    /* eslint-enable */
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
    this.map_.removePlugins(this.autocompletador);
    this.name = null;
    this.parameters_ = null;
    this.map_ = null;
    this.control_ = null;
    this.locality_ = null;
  }

  /**
   * This function compare if pluging recieved by param
   is instance of M.plugin.SearchstreetGeosearch
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof SearchstreetGeosearch) {
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
    return 'searchstreetgeosearch';
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
