import SearchstreetGeosearchControlImpl from 'plugins/searchstreetgeosearch/impl/ol/js/searchstreetgeosearchcontrol';
import SearchstreetIntegrated from './searchstreetintegratedcontrol';
import GeosearchIntegrated from './geosearchintegratedcontrol';
import SearchStreetGeosearch from './searchstreetgeosearch';
import searchstreetgeosearchHTML from '../../templates/searchstreetgeosearch';

/**
 * Name controls
 * @type {string}
 */
const name = 'searchstreetgeosearch';
export default class SearchstreetGeosearchControl extends M.Control {
  /**
   * @classdesc Main constructor of the class. Creates a SearchstreetGeosearch
   * control to search streets and geosearchs
   *
   * @constructor
   * @extends {M.Control}
   * @param {Mx.parameters.SearchstreetGeosearch} parameters - parameters SearchstreetGeosearch
   * @api stable
   */
  constructor(parameters = {}) {
    // implementation of this control
    const impl = new SearchstreetGeosearchControlImpl();

    // checks if the implementation can create SearchstreetGeosearch
    if (M.utils.isUndefined(SearchstreetGeosearchControlImpl)) {
      M.exception('La implementación usada no puede crear controles SearchStreetGeosearch');
    }

    super(impl, name);

    /**
     * INE code to specify the search
     *
     * @private
     * @type {number}
     */
    if (!M.utils.isNullOrEmpty(parameters.locality)) {
      this.locality_ = parameters.locality;
    }

    /**
     * Search URL - Searchstreet
     *
     * @private
     * @type {string}
     */
    this.urlSearchstret_ = M.config.SEARCHSTREET_URL;

    /**
     * Search URL - Geosearch
     *
     * @private
     * @type {string}
     */
    this.urlGeosearch_ = M.config.GEOSEARCH_URL;

    /**
     * Core to the URL for the query - Geosearch
     * @private
     * @type {string}
     */
    this.coreGeosearch_ = M.config.GEOSEARCH_CORE;

    /**
     * Handler to the URL for the query - Geosearch
     * @private
     * @type {string}
     */
    this.handlerGeosearch_ = M.config.GEOSEARCH_HANDLER;

    /**
     * Others parameters for Geosearch
     * @private
     * @type {String}
     */
    this.paramsGeosearch_ = parameters.paramsGeosearch || {};

    /**
     * Input SearchstreetGeosearch
     *
     * @private
     * @type {HTMLElement}
     */
    this.input_ = null;

    /**
     * Control Searchstreet
     *
     * @public
     * @type {M.control.SearchstreetIntegrated}
     * @api stable
     */
    this.ctrlSearchstreet = null;

    /**
     * Control Geosearch
     *
     * @public
     * @type {M.control.GeosearchIntegrated}
     * @api stable
     */
    this.ctrlGeosearch = null;

    /**
     * Name plugin
     *
     * @private
     * @type {string}
     */
    this.name_ = name;

    /**
     * Template SearchstreetGeosearch
     *
     * @private
     * @type {HTMLElement}
     */
    this.element_ = null;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;
  }


  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @api stable
   * @export
   */
  addTo(map) {
    const impl = this.getImpl();
    this.facadeMap_ = map;
    const view = this.createView(map);
    if (view instanceof Promise) { // the view is a promise
      view.then((html) => {
        impl.addTo(map, html);
        this.html = html;
        this.fire(M.evt.ADDED_TO_MAP);
      });
    }

    this.on(M.evt.ADDED_TO_MAP, (evt) => {
      if (M.utils.isUndefined(this.locality_)) {
        this.ctrlSearchstreet = new SearchstreetIntegrated(this.urlSearchstret_);
      } else {
        this.ctrlSearchstreet = new SearchstreetIntegrated(this.urlSearchstret_, this.locality_);
      }
      const impl2 = this.ctrlSearchstreet.getImpl();
      impl2.addTo(map, this.html);

      this.ctrlGeosearch = new GeosearchIntegrated(
        this.urlGeosearch_,
        this.coreGeosearch_,
        this.handlerGeosearch_,
        this.paramsGeosearch_,
      );
      // const view2 = this.ctrlGeosearch.createView(this.html, this.facadeMap_);
      impl2.addTo(map, this.html);

      let completados = false;

      this.ctrlSearchstreet.on(M.evt.COMPLETED, () => {
        if (completados === true) {
          this.element_.classList.add('shown');
          completados = false;
          this.zoomResults();
        }
        completados = true;
      }, this);

      this.ctrlGeosearch.on(M.evt.COMPLETED, () => {
        if (completados === true) {
          this.element_.classList.add('shown');
          completados = false;
          this.zoomResults();
        }
        completados = true;
      }, this);
    });
  }


  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the control
   * @returns {Promise} HTML template
   * @api stable
   */
  createView(map) {
    const promise = new Promise((success, fail) => {
      const html = M.template.compile(searchstreetgeosearchHTML, { jsonp: true });
      this.element_ = html;
      this.input_ = html.querySelector('input#m-searchstreetgeosearch-search-input');
      const searchstreetResuts = html.querySelector('div#m-searchstreet-results');
      const geosearchResuts = html.querySelector('div#m-geosearch-results');
      const searchstreetTab = html.querySelector('ul#m-tabs > li:nth-child(1) > a');
      const geosearchTab = html.querySelector('ul#m-tabs > li:nth-child(2) > a');
      searchstreetTab.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (!searchstreetTab.classList.contains('activated')) {
          searchstreetTab.classList.add('activated');
          geosearchTab.classList.remove('activated');
          searchstreetResuts.classList.add('show');
          geosearchResuts.classList.remove('show');
        }
      });
      geosearchTab.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (!geosearchTab.classList.contains('activated')) {
          geosearchTab.classList.add('activated');
          searchstreetTab.classList.remove('activated');
          searchstreetResuts.classList.remove('show');
          geosearchResuts.classList.add('show');
        }
      });
      success(html);
    });
    return promise;
  }

  /**
   * This query returns the input SearchstreetGeosearch
   *
   * @public
   * @function
   * @returns {HTMLElement} Input SearchstreetGeosearch
   * @api stable
   */
  getInput() {
    return this.input_;
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
    if (obj instanceof SearchStreetGeosearch) {
      equals = (this.name === obj.name);
    }
    return equals;
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
   * This function zoom results
   *
   * @public
   * @function
   * @api stable
   */
  zoomResults() {
    this.getImpl().zoomResults();
  }
}

/**
 * Template for this controls
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */
SearchstreetGeosearchControl.TEMPLATE = 'searchstreetgeosearch.html';
