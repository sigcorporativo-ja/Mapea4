import SearchstreetControl from '../../../searchstreet/facade/js/searchstreetcontrol.js';
import SearchstreetIntegratedControlImpl from '../../impl/ol/js/searchstreetintegratedcontrol.js';

export default class SearchstreetIntegrated extends SearchstreetControl {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Searchstreet control that allows searches of streets
   *
   * @constructor
   * @extends {M.Control}
   * @param {string} url - Service URL
   * @param {number} locality - INE code to specify the search
   * @api stable
   */
  constructor(url, locality) {
    // call super
    super(url, locality);

    /**
     * Implementation of this control
     *
     * @private
     * @type {M.impl.control.SearchstreetIntegrated}
     */
    this.impl = new SearchstreetIntegratedControlImpl();
    if (M.utils.isUndefined(SearchstreetIntegratedControlImpl)) {
      M.exception('La implementación usada no puede crear controles SearchstreetIntegrated');
    }
  }

  /**
   * This function replaces createView of Searchstreet, not to add the template control, add events
   *
   * @public
   * @function
   * @param {HTMLElement} html - HTML template searchstreetgeosearch
   * @param {M.Map} map - Map to add the control
   * @api stable
   * @return {null}
   */
  createView(html, map) {
    this.facadeMap_ = map;
    this.addEvents(html);
    return null;
  }

  /**
   * This function add events to HTML elements
   *
   * @public
   * @function
   * @param {HTMLElement}
   *        html - HTML to add events
   * @api stable
   */
  addEvents(html) {
    this.element_ = html;
    this.on(M.evt.COMPLETED, () => {
      this.element_.classList.add('shown');
    }, this);

    // searchs
    this.input_ = this.element_.getElementsByTagName('input')['m-searchstreetgeosearch-search-input'];
    this.button_ = this.element_.getElementsByTagName('button')['m-searchstreetgeosearch-search-btn'];
    this.clear_ = this.element_.getElementsByTagName('button')['m-searchstreetgeosearch-clear-btn'];

    // events
    // JGL20170818: traslado gestión evento a autocomplete
    this.button_.addEventListener('click', this.searchClick.bind(this));
    this.input_.addEventListener('keyup', this.searchClick.bind(this));
    this.clear_.addEventListener('click', this.clearSearchs_.bind(this));

    // results container
    this.resultsContainer_ = this.element_.getElementsByTagName('div')['m-searchstreet-results'];
    this.resultsAutocomplete_ = this.element_.getElementsByTagName('div')['m-autocomplete-results'];
    this.resultsGeosearch_ = this.element_.getElementsByTagName('div')['m-geosearch-results'];
    this.searchingResult_ = this.element_.querySelector('div#m-searchstreet-results > div#m-searching-result-searchstreet');

    if (!M.utils.isUndefined(this.codIne_)) {
      this.searchTime_ = Date.now();
      const searchCodIne = M.utils.addParameters(this.searchCodIne_, {
        codigo: this.codIne_,
      });
      ((searchTime) => {
        M.remote.get(searchCodIne).then((response) => {
          let results;
          // try {
          if (!M.utils.isNullOrEmpty(response.text)) {
            results = JSON.parse(response.text);
            if (M.utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
              M.dialog.error(`El código del municipio  ${this.codIne_} no es válido`);
            } else {
              this.getMunProv_(results);
              this.element_.getElementsByTagName('span').codIne.innerHTML = `Búsquedas en  ${this.municipio_} ( ${this.provincia_} )`;
            }
          }
          // } catch (err) {
          //   M.exception(`La respuesta no es un JSON válido:  ${err}`);
          // }
        });
      })(this.searchTime_);
    }

    this.searchingResult_.parentNode.removeChild(this.searchingResult_);
  }

  /**
   * This function remove popup, points and results drawn on the map.
   *
   * @private
   * @function
   */
  clearSearchs_() {
    this.element_.classList.remove('shown');
    const controls = this.facadeMap_.getControls();
    for (let x = 0, ilen = controls.length; x < ilen; x += 1) {
      if (controls[x].name === 'searchstreetgeosearch') {
        controls[x].ctrlGeosearch.getImpl().getLayer().clear();
      }
    }
    const layers = this.facadeMap_.getLayers();
    const layerDraw = layers.filter((layer) => layer.name === '__draw__')[0];
    layerDraw.removeFeatures(layerDraw.getFeatures());
    this.facadeMap_.removePopup();
    this.input_.value = '';
    this.resultsContainer_.innerHTML = '';
    this.resultsAutocomplete_.innerHTML = '';
    this.resultsGeosearch_.innerHTML = '';
  }

  /**
   * This function checks the query field is not empty and send the query to the search function
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Keypress event
   */
  searchClick(evt) {
    evt.preventDefault();
    if (evt.type !== 'keyup') { // || (evt.keyCode === 13)
      this.resultsAutocomplete_.classList.remove(SearchstreetControl.MINIMUM);
      this.resultsAutocomplete_.innerHTML = '';
      // gets the query
      let query = this.input_.value;
      if (!M.utils.isNullOrEmpty(query)) {
        if (query.length < this.minAutocomplete_) {
          this.completed = false;
        } else {
          this.completed = true;
        }
        if (!M.utils.isUndefined(this.codIne_) && !M.utils.isNullOrEmpty(this.codIne_)) {
          // It does not take into account the municipality if indicated
          const pos = query.indexOf(',');
          if (query.indexOf(',') > -1) {
            query = query.substring(0, pos);
          }
          this.search_(`${query} ,  ${this.municipio_}  ( ${this.provincia_} ), ${this.showResults_}`);
        } else {
          this.search_(query, this.showResults_);
        }
      }
    }
  }

  /**
   * This function hides/shows the list
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Keypress event
   */
  resultsClick_(evt) {
    this.facadeMap_.areasContainer.getElementsByClassName('m-top m-right')[0].classList.add('top-extra-searchs');
    evt.target.classList.toggle('g-cartografia-flecha-arriba');
    evt.target.classList.toggle('g-cartografia-flecha-abajo');
    this.resultsContainer_.classList.toggle('hidden');
    if (M.utils.isNullOrEmpty(this.resultsContainer_.parentElement.querySelector('div#m-geosearch-results.hidden'))) {
      this.resultsContainer_.parentElement.classList.toggle('hidden');
    }
  }

  /**
   * This function return impl control
   *
   * @public
   * @function
   * @api stable
   * @return {M.impl.control.SearchstreetIntegrated}
   */
  getImpl() {
    return this.impl;
  }
}
