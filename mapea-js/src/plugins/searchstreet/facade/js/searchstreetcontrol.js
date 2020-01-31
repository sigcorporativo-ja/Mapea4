import SearchstreetImpl from '../../impl/ol/js/searchstreetcontrol';
import SearchstreetTemplate from '../../templates/searchstreet';
import SearchstreetResultsTemplate from '../../templates/searchstreetresults';


export default class SearchstreetControl extends M.Control {
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
    // implementation of this control
    const impl = new SearchstreetImpl();

    super(impl, SearchstreetControl.NAME);

    if (M.utils.isUndefined(SearchstreetImpl)) {
      M.exception('La implementación usada no puede crear controles Searchstreet');
    }

    /**
     * Input Searchstreet
     *
     * @private
     * @type {HTMLElement}
     */
    this.input_ = null;

    /**
     * Button Searchstreet
     *
     * @private
     * @type {HTMLElement}
     */
    this.button_ = null;

    /**
     * Container Searchstreet
     *
     * @private
     * @type {HTMLElement}
     */
    this.element_ = null;

    /**
     * Results panel Searchstreet
     *
     * @private
     * @type {HTMLElement}
     */
    this.resultsContainer_ = null;

    /**
     * Timestamp of the search to abort old requests
     *
     * @private
     * @type {number}
     */
    this.searchTime_ = 0;

    /**
     * Control name
     *
     * @private
     * @type {string}
     */
    this.name_ = 'searchstreet';

    /**
     * Search URL
     *
     * @private
     * @type {string}
     */
    this.searchUrl_ = url;

    /**
     * Municipality to search
     *
     * @private
     * @type {string}
     */
    this.municipio_ = null;

    /**
     * Province to search
     *
     * @private
     * @type {string}
     */
    this.provincia_ = null;

    /**
     * All provinces and theirs INE codes
     *
     * @private
     * @type {array}
     */
    this.provincias_ = [{
      nombre: 'Huelva',
      codigoINE: '21',
    }, {
      nombre: 'Sevilla',
      codigoINE: '41',
    }, {
      nombre: 'Córdoba',
      codigoINE: '14',
    }, {
      nombre: 'Jaén',
      codigoINE: '23',
    }, {
      nombre: 'Cádiz',
      codigoINE: '11',
    }, {
      nombre: 'Málaga',
      codigoINE: '29',
    }, {
      nombre: 'Granada',
      codigoINE: '18',
    }, {
      nombre: 'Almería',
      codigoINE: '04',
    }];

    // checks if you receive the locality parameter, if so create two attributes.
    if (!M.utils.isUndefined(locality)) {
      /**
       * INE code
       *
       * @private
       * @type {number}
       */
      this.codIne_ = locality;
      /**
       * Service check INE code
       *
       * @private
       * @type {string}
       */
      this.searchCodIne_ = M.config.SEARCHSTREET_URLCOMPROBARINE;
    }

    /**
     * Minimum number of characters to start autocomplete
     *
     * @private
     * @type {number}
     */
    this.minAutocomplete_ = M.config.AUTOCOMPLETE_MINLENGTH;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     * HTML element for container of the results (Autocomplete)
     *
     * @private
     * @type {HTMLElement}
     */
    this.resultsAutocomplete_ = null;

    /**
     * State consultation
     *
     * @public
     * @type {boolean}
     * @api stable
     */
    this.completed = false;

    /**
     * Stores the answers of the query when the province isn't indicated
     *
     * @private
     * @type {array}
     */
    this.respuestasProvincias_ = [];

    /**
     * Counter consulted provinces
     *
     * @public
     * @type {number}
     * @api stable
     */
    this.contadorProvincias = 0;

    /**
     * Container of the results to scroll
     * @private
     * @type {HTMLElement}
     */
    this.resultsScrollContainer_ = null;
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the control
   * @returns {HTMLElement} HTML template
   * @api stable
   */
  createView(map) {
    this.facadeMap_ = map;
    const options = { jsonp: true };
    const html = M.template.compileSync(SearchstreetTemplate, options);
    this.addEvents(html);
    return html;
  }

  /**
   * This function add events to HTML elements
   *
   * @public
   * @function
   * @param {HTMLElement} html - HTML to add events
   * @api stable
   */
  addEvents(html) {
    this.element_ = html;

    this.on(M.evt.COMPLETED, () => {
      this.element_.classList.add('shown');
    }, this);

    // searchs
    this.input_ = this.element_.getElementsByTagName('input')['m-searchstreet-search-input'];
    this.button_ = this.element_.getElementsByTagName('button')['m-searchstreet-search-btn'];
    this.clear_ = this.element_.getElementsByTagName('button')['m-searchstreet-clear-btn'];

    // events
    // JGL20170816: traslado gestión evento a autocomplete

    this.button_.addEventListener('click', this.searchClick.bind(this));
    this.input_.addEventListener('keyup', this.searchClick.bind(this));
    this.clear_.addEventListener('click', this.clearSearchs_.bind(this));
    // results container
    this.resultsContainer_ = this.element_.getElementsByTagName('div')['m-searchstreet-results'];
    this.resultsAutocomplete_ = this.element_.getElementsByTagName('div')['m-autocomplete-results'];
    this.searchingResult_ = this.element_.querySelector('div#m-searchstreet-results > div#m-searching-result-searchstreet');

    if (!M.utils.isUndefined(this.codIne_) && !M.utils.isNullOrEmpty(this.codIne_)) {
      const searchCodIne = M.utils.addParameters(this.searchCodIne_, {
        codigo: this.codIne_,
      });
      M.remote.get(searchCodIne).then((response) => {
        let results;
        try {
          if (!M.utils.isNullOrEmpty(response.text)) {
            results = JSON.parse(response.text);
            if (M.utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
              M.dialog.error(`El código del municipio '${this.codIne_}' no es válido`);
            } else {
              this.getMunProv_(results);
              this.element_.getElementsByTagName('span').codIne.innerHTML = `Búsquedas en ${this.municipio_}  (${this.provincia_})`;
            }
          }
        } catch (err) {
          M.exception(`La respuesta no es un JSON válido: ${err}`);
        }
      });
    }
    // remove the child of "resultsContainer_"
    this.searchingResult_.parentNode.removeChild(this.searchingResult_);
  }

  /**
   * Specifies the value of the municipality and province
   *
   * @param {object} results - Query results
   * @private
   * @function
   */
  getMunProv_(results) {
    this.provincia_ = results.comprobarCodIneResponse.comprobarCodIneReturn
      .comprobarCodIneReturn.nombreProvincia;
    this.municipio_ = results.comprobarCodIneResponse.comprobarCodIneReturn
      .comprobarCodIneReturn.nombreMunicipio;
  }

  /**
   * This function checks the query field is not empty, if it is not
   * sending the query to the search function
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
      if (M.utils.isNullOrEmpty(query)) {
        M.dialog.error('Debe introducir una búsqueda.');
      } else {
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
          this.search_(`${query}, ${this.municipio_} , (${this.provincia_})`, this.showResults_);
        } else {
          this.search_(query, this.showResults_);
        }
      }
    }
  }

  /**
   * This function performs the query
   *
   * @private
   * @function
   * @param {string} query - Query to search
   * @param {function} processor - Calls function
   */
  search_(query, processor) {
    this.resultsContainer_.innerHTML = ' ';
    let searchUrl = null;
    this.provincia_ = null;
    this.municipio_ = null;
    this.resultsContainer_.appendChild(this.searchingResult_);
    // adds the class
    this.element_.classList.add(SearchstreetControl.SEARCHING_CLASS);
    this.resultsContainer_.classList.add(SearchstreetControl.MINIMUM);
    const normalizar = M.utils.addParameters(M.config.SEARCHSTREET_NORMALIZAR, {
      cadena: query,
    });

    M.remote.get(normalizar).then((response) => {
      const results = JSON.parse(response.text).normalizarResponse.normalizarReturn;
      this.provincia_ = M.utils.beautifyString(results.provincia);
      this.municipio_ = M.utils.beautifyString(results.municipio);
      if (!M.utils.isNullOrEmpty(this.provincia_)) {
        searchUrl = M.utils.addParameters(this.searchUrl_, {
          streetname: results.nombreVia,
          streetNumber: results.numeroPortal,
          streetType: results.tipoVia,
          municipio: this.municipio_,
          provincia: this.provincia_,
          srs: this.facadeMap_.getProjection().code,
        });
        this.searchTime_ = Date.now();
        this.querySearch_(searchUrl, this.provincia_, processor);
      } else if (M.utils.isNullOrEmpty(this.provincia_) &&
        !M.utils.isNullOrEmpty(this.municipio_)) {
        this.searchTime_ = Date.now();
        this.respuestasProvincias_ = [];
        this.contadorProvincias = 0;
        for (let i = 0, ilen = this.provincias_.length; i < ilen; i += 1) {
          searchUrl = M.utils.addParameters(this.searchUrl_, {
            streetname: results.nombreVia,
            streetNumber: results.numeroPortal,
            streetType: results.tipoVia,
            municipio: this.municipio_,
            provincia: this.provincias_[i].nombre,
            srs: this.facadeMap_.getProjection().code,
          });
          this.querySearchProvinces(searchUrl, this.provincias_[i].nombre, processor);
        }
      } else {
        searchUrl = M.utils.addParameters(this.searchUrl_, {
          streetname: results.direccionSinNormalizar,
          streetNumber: null,
          streetType: null,
          municipio: null,
          provincia: null,
          srs: this.facadeMap_.getProjection().code,
        });
        this.searchTime_ = Date.now();
        this.querySearch_(searchUrl, null, processor);
      }
    });
  }

  /**
   * This function performs the query if the town and province have value
   *
   * @private
   * @function
   * @param {string} searchUrl - Search URL
   * @param {string} provincia - Province
   * @param {string} processor - Calls function
   */
  querySearch_(searchUrl, provincia, processor) {
    ((searchTime) => {
      M.remote.get(searchUrl).then((response) => {
        if (searchTime === this.searchTime_) {
          let results;
          try {
            if (!M.utils.isNullOrEmpty(response.text) && response.text.indexOf('No se ha podido obtener el codigoINE') === -1) {
              results = JSON.parse(response.text);
            } else {
              results = null;
            }
          } catch (err) {
            M.exception(`La respuesta no es un JSON válido: ${err}`);
          }
          if (!M.utils.isNullOrEmpty(results)) {
            this.provincia_ = M.utils.beautifyString(provincia);
            processor.call(this, results);
            this.element_.classList.remove(SearchstreetControl.SEARCHING_CLASS);
            this.resultsContainer_.classList.remove(SearchstreetControl.MINIMUM);
          } else {
            processor.call(this, results);
            this.element_.classList.remove(SearchstreetControl.SEARCHING_CLASS);
            this.resultsContainer_.classList.remove(SearchstreetControl.MINIMUM);
          }
        }
      });
    })(this.searchTime_);
  }

  /**
   * This function performs the query if the town and province haven't value
   *
   * @public
   * @function
   * @param {string} searchUrl - Search URL
   * @param {string} provincia - Province
   * @param {string} processor - Calls function
   * @api stable
   */
  querySearchProvinces(searchUrl, provincia, processor) {
    ((searchTime) => {
      M.remote.get(searchUrl).then((response) => {
        this.respuestasProvincias_.push(response);
        this.contadorProvincias += 1;
        if (this.contadorProvincias === 8) {
          for (let i = 0, ilen = this.respuestasProvincias_.length; i < ilen; i += 1) {
            if (searchTime === this.searchTime_) {
              let results;
              try {
                const item = this.respuestasProvincias_[i].text;
                if (!M.utils.isNullOrEmpty(item) && item.indexOf('No se ha podido obtener el codigoINE') === -1) {
                  results = JSON.parse(item);
                } else {
                  results = null;
                }
              } catch (err) {
                M.exception(`La respuesta no es un JSON válido: ${err}`);
              }
              if (!M.utils.isNullOrEmpty(results) && results.geocoderMunProvSrsResponse
                .geocoderMunProvSrsReturn.geocoderMunProvSrsReturn.coordinateX !== 0) {
                this.provincia_ = M.utils.beautifyString(provincia);
                processor.call(this, results);
                this.element_.classList.remove(SearchstreetControl.SEARCHING_CLASS);
                this.resultsContainer_.classList.remove(SearchstreetControl.MINIMUM);
              }
            }
          }
        }
      });
    })(this.searchTime_);
  }

  /**
   * This function displays the results of the consultation
   *
   * @private
   * @function
   * @param {object} results - Query results
   */
  showResults_(results) {
    const resultsTemplateVars = this.parseResultsForTemplate_(results);
    if (!M.utils.isUndefined(this.codIne_)) {
      for (let i = 0, ilen = resultsTemplateVars.docs.length; i < ilen; i += 1) {
        if (!M.utils.isUndefined(resultsTemplateVars.docs[i])) {
          if (resultsTemplateVars.docs[i].coordinateX === undefined) {
            resultsTemplateVars.docs.splice(i, 1);
            ilen -= 1;
            i -= 1;
          }
        }
      }
    }
    const options = { jsonp: true, vars: resultsTemplateVars };
    const html = M.template.compileSync(SearchstreetResultsTemplate, options);
    this.resultsContainer_.classList.remove(SearchstreetControl.HIDDEN_RESULTS_CLASS);
    this.resultsContainer_.innerHTML = html.innerHTML;
    this.resultsScrollContainer_ = this.resultsContainer_.querySelector('div#m-searchstreet-results-scroll');
    if (!M.utils.isNullOrEmpty(this.resultsScrollContainer_)) {
      M.utils.enableTouchScroll(this.resultsScrollContainer_);
    }

    this.facadeMap_.removePopup();
    if (this.getImpl().listPoints.length > 0) {
      this.getImpl().removePoints();
    }
    if (!M.utils.isUndefined(resultsTemplateVars.docs[0])) {
      this.getImpl().drawPoints(resultsTemplateVars.docs);
      this.eventList_(resultsTemplateVars.docs);
    }
    this.element_.classList.remove(SearchstreetControl.SEARCHING_CLASS);
    this.resultsContainer_.classList.remove(SearchstreetControl.MINIMUM);

    // results buntton
    const btnResults = this.resultsContainer_.querySelector('div.page > div.g-cartografia-flecha-arriba');
    btnResults.addEventListener('click', this.resultsClick_.bind(this));

    this.fire(M.evt.COMPLETED);

    this.element_.getElementsByClassName('m-autocomplete-results').innerHTML = '';
  }

  /**
   * This function parse query results for template
   *
   * @private
   * @function
   * @param {object} results - Query results
   * @returns {object} resultsTemplateVar - Parse results
   */
  parseResultsForTemplate_(results) {
    let resultsTemplateVar = null;
    let containtResult = null;
    const resultado = results;
    const search = this.input_.value;
    if (!M.utils.isNullOrEmpty(resultado)) {
      const docs = resultado.geocoderMunProvSrsResponse.geocoderMunProvSrsReturn;
      containtResult = !M.utils.isNullOrEmpty(docs);
      if (docs.geocoderMunProvSrsReturn instanceof Array) {
        if (!M.utils.isUndefined(docs.geocoderMunProvSrsReturn[0].coordinateX)) {
          for (let i = 0, ilen = docs.geocoderMunProvSrsReturn.length; i < ilen; i += 1) {
            docs.geocoderMunProvSrsReturn[i].localityName = this.municipio_;
            // eslint-disable-next-line max-len
            docs.geocoderMunProvSrsReturn[i].cityName = this.getNameProvince(docs.geocoderMunProvSrsReturn[i].locality);
            docs.geocoderMunProvSrsReturn[i].streetType =
              M.utils.beautifyString(docs.geocoderMunProvSrsReturn[i].streetType);
            docs.geocoderMunProvSrsReturn[i].streetName =
              M.utils.beautifyString(docs.geocoderMunProvSrsReturn[i].streetName);
          }
          resultsTemplateVar = {
            docs: docs.geocoderMunProvSrsReturn,
            containtResult,
            search,
          };
        } else {
          resultsTemplateVar = {
            docs: [undefined],
            containtResult: false,
            search,
          };
        }
      } else if (M.utils.isNullOrEmpty(docs)) {
        resultsTemplateVar = {
          docs: [undefined],
          containtResult,
          search,
        };
      } else if (docs.geocoderMunProvSrsReturn.coordinateX === 0) {
        resultsTemplateVar = {
          docs: [undefined],
          containtResult: false,
          search,
        };
      } else {
        docs.geocoderMunProvSrsReturn.localityName = this.municipio_;
        // eslint-disable-next-line max-len
        docs.geocoderMunProvSrsReturn.cityName = this.getNameProvince(docs.geocoderMunProvSrsReturn.locality);
        docs.geocoderMunProvSrsReturn.streetType =
          M.utils.beautifyString(docs.geocoderMunProvSrsReturn.streetType);
        docs.geocoderMunProvSrsReturn.streetName =
          M.utils.beautifyString(docs.geocoderMunProvSrsReturn.streetName);
        resultsTemplateVar = {
          docs: [docs.geocoderMunProvSrsReturn],
          containtResult,
          search,
        };
      }
    } else {
      resultsTemplateVar = {
        docs: [undefined],
        containtResult,
        search,
      };
    }
    return resultsTemplateVar;
  }

  /**
   * This function returns a province name from a locality code
   *
   * @private
   * @function
   * @param {string} codeINE - locality code
   */
  getNameProvince(codLocality) {
    let codLocalityCadena = codLocality.toString();
    if (codLocalityCadena.length < 5) {
      codLocalityCadena = `0${codLocalityCadena}`;
    }
    const codProvincia = codLocalityCadena.substr(0, 2);
    const provincia = this.provincias_.filter(l => (l.codigoINE === codProvincia));
    return provincia[0].nombre;
  }


  /**
   * This function adds a click event to the elements of the list
   *
   * @private
   * @function
   * @param {array} results - Query results
   */
  eventList_(results) {
    const rows = this.resultsContainer_.getElementsByClassName('result');
    for (let i = 0, ilen = rows.length; i < ilen; i += 1) {
      this.addEventClickList_(rows[i], results[i]);
    }
  }

  /**
   * This function adds a click event to the element
   *
   * @private
   * @function
   * @param {HTMLElement} element - Specific item in the list
   * @param {object} result - Specific query result
   */
  addEventClickList_(element, result) {
    element.addEventListener('click', (e) => {
      // hidden results on click for mobile devices
      if (M.window.WIDTH <= M.config.MOBILE_WIDTH) {
        e.target = this.resultsContainer_.querySelector('div.page > div.g-cartografia-flecha-arriba');
        this.resultsClick_(e);
      }
      this.getImpl().addEventClickFeature(result);
    }, false, this);
  }

  /**
   * This function checks if an object is equals to this control
   *
   * @function
   * @api stable
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof SearchstreetControl) {
      equals = (this.name === obj.name);
    }
    return equals;
  }

  /**
   * This query returns the input Searchstreet
   *
   * @public
   * @function
   * @returns {HTMLElement} Input Searchstreet
   * @api stable
   */
  getInput() {
    return this.input_;
  }

  /**
   * This function return HTML template
   *
   * @public
   * @function
   * @returns {HTMLElement} HTML template
   * @api stable
   */
  getHtml() {
    return this.element_;
  }

  /**
   * Clear results and searchs
   *
   * @private
   * @function
   */
  clearSearchs_() {
    this.element_.classList.remove('shown');
    this.facadeMap_.removePopup();
    this.getImpl().removePoints();
    this.input_.value = '';
    this.resultsContainer_.innerHTML = '';
    this.resultsAutocomplete_.innerHTML = '';
  }

  /**
   * This function hides/shows the list
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Keypress event
   */
  resultsClick_(evt) {
    this.facadeMap_.areasContainer.getElementsByClassName('m-top m-right')[0].classList.add('top-extra-search');
    evt.target.classList.toggle('g-cartografia-flecha-arriba');
    evt.target.classList.toggle('g-cartografia-flecha-abajo');
    this.resultsContainer_.classList.toggle(SearchstreetControl.HIDDEN_RESULTS_CLASS);
  }
}

/**
 * Name to identify this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
SearchstreetControl.NAME = 'searchstreet';

/**
 * Template for this controls
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */
SearchstreetControl.TEMPLATE = 'searchstreet.html';

/**
 * Template for show results
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */
SearchstreetControl.RESULTS_TEMPLATE = 'searchstreetresults.html';

/**
 * Class 'searching'
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */
SearchstreetControl.SEARCHING_CLASS = 'm-searching';

/**
 * Class 'hidden'
 * @const
 * @type {string}
 * @public
 * @api stable
 */
SearchstreetControl.HIDDEN_RESULTS_CLASS = 'hidden';

/**
 * Class 'minimum'
 * @const
 * @type {string}
 * @public
 * @api stable
 */
SearchstreetControl.MINIMUM = 'minimum';
