import GeosearchIntegratedImpl from 'plugins/searchstreetgeosearch/impl/ol/js/geosearchintegratedcontrol';
import GeosearchControl from 'plugins/geosearch/facade/js/geosearchcontrol';
import searchstreetgeosearchHTML from '../../templates/searchstreetgeosearch';

export default class GeosearchIntegrated extends GeosearchControl {
  /**
   * @classdesc Main constructor of the class. Creates a GeosearchIntegrated
   * control.
   *
   * @constructor
   * @param {string} url - URL for the query
   * @param {string} core - Core to the URL for the query
   * @param {string} handler - Handler to the URL for the query
   * @param {object} searchParameters - Others parameters
   * @extends {GeosearchControl}
   * @api stable
   */
  constructor(url, core, handler, searchParameters) {
    super(url, core, handler, searchParameters);

    // implementation of this control
    this.impl = new GeosearchIntegratedImpl();

    if (M.utils.isUndefined(GeosearchIntegratedImpl)) {
      M.exception('La implementación usada no puede crear controles GeosearchIntegrated');
    }
  }


  /**
   * This function replaces createView of Geosearch, not to add the template control, add events
   *
   * @public
   * @function
   * @param {HTMLElement} html - HTML template SearchstreetGeosearch
   * @param {M.Map} map - Map to add the control
   * @return {null}
   * @api stable
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
   * @param {HTMLElement} html - HTML template SearchstreetGeosearch
   * @api stable
   */
  addEvents(html) {
    this.element_ = html;

    this.on(M.evt.COMPLETED, () => {
      this.element_.classList.add('shown');
    }, this);
    // input search
    this.input_ = this.element_.getElementsByTagName('input')['m-searchstreetgeosearch-search-input'];
    // JGL20170818: traslado gestión evento a autocomplete

    // search buntton
    const btnSearch = this.element_.getElementsByTagName('button')['m-searchstreetgeosearch-search-btn'];
    btnSearch.addEventListener('click', this.searchClick);
    // help buntton
    const btnHelp = this.element_.getElementsByTagName('button')['m-searchstreetgeosearch-help-btn'];
    btnHelp.addEventListener('click', (evt) => {
      evt.preventDefault();
      btnHelp.classList.toggle('shown');
      this.helpClick_();
    });

    // results container
    this.resultsContainer_ = this.element_.getElementsByTagName('div')['m-geosearch-results'];
    M.utils.enableTouchScroll(this.resultsContainer_);
    this.searchingResult_ = this.element_.querySelector('div#m-geosearch-results > div#m-searching-result-geosearch');
    // goog.dom.removeChildren(this.resultsContainer_, this.searchingResult_);
  }
  /**
   * This function add new results panel Geosearch when done scroll
   * to this control
   *
   * @private
   * @function
   * @param {object} results - New results
   */
  appendResults_(results) {
    // draws the new results on the map
    this.drawNewResults(results);

    const resultsTemplateVars = this.parseResultsForTemplate_(results, true);
    const options = { jsonp: true, vars: resultsTemplateVars };
    const html = M.template.compileSync(searchstreetgeosearchHTML, options);
    // appends the new results
    const newResultsScrollContainer = html.getElementsByTagName('div')['m-geosearch-results-scroll'];
    const newResults = newResultsScrollContainer.children;
    let newResult;
    while ((newResult === newResults.item(0)) !== null) {
      this.resultsScrollContainer_.appendChild(newResult);
      newResult.addEventListener('click', this.resultClick_);
    }

    // updates the found num elements
    const spanNumFound = this.resultsContainer_.getElementsByTagName('span')['m-geosearch-page-found'];
    spanNumFound.innerHTML = this.results_.length;


    this.element_.classList.remove(GeosearchControl.SEARCHING_CLASS);
    this.resultsContainer_.removeChild(this.searchingResult_);
    // disables scroll if gets all results
    this.checkScrollSearch_(results);
  }

  /**
   * This function hides/shows the list
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Keypress event
   */
  resultsClick_(evt) {
    this.facadeMap_.areasContainer.getElementsByClassName('m-top m-right')[0].classList.toggle('top-extra-search');
    evt.target.classList.toggle('g-cartografia-flecha-arriba');
    evt.target.classList.toggle('g-cartografia-flecha-abajo');
    this.resultsContainer_.classList.toggle('hidden');
    if (M.utils.isNullOrEmpty(this.resultsContainer_.parentElement.querySelector('div#m-searchstreet-results.hidden'))) {
      this.resultsContainer_.parentElement.classList.toggle('hidden');
    }
  }


  /**
   * This function return impl control
   *
   * @public
   * @function
   * @api stable
   * @return {M.impl.control.GeosearchIntegrated}
   */
  getImpl(html) {
    return this.impl;
  }
}
