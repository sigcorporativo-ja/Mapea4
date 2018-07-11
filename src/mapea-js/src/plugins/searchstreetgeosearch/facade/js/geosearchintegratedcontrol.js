import GeosearchImpl from "plugins/geosearch/impl/ol/js/Geosearch";
import GeosearchIntegratedImpl from "../../impl/ol/js/GeosearchIntegrated";
import Geosearch from "plugins/geosearch/facade/js/Geosearch";
import Utils from "facade/js/utils/Utils";
import Exception from "facade/js/exception/exception";
import EventsManager from "facade/js/event/Eventsmanager";
import Template from "facade/js/utils/Template";

export default class GeosearchIntegrated extends Geosearch {
  /**
   * @classdesc Main constructor of the class. Creates a GeosearchIntegrated
   * control.
   *
   * @constructor
   * @param {string} url - URL for the query
   * @param {string} core - Core to the URL for the query
   * @param {string} handler - Handler to the URL for the query
   * @param {object} searchParameters - Others parameters
   * @extends {M.control.Geosearch}
   * @api stable
   */
  constructor(url, core, handler, searchParameters) {
    // implementation of this control
    this.impl = new GeosearchIntegratedImpl();

    super(url, core, handler, searchParameters);

    if (Utils.isUndefined(M.impl.control.GeosearchIntegrated)) {
      Exception('La implementación usada no puede crear controles GeosearchIntegrated');
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

    this.on(EventsManager.COMPLETED, () => {
      this.element_.classList.add("shown");
    }, this);
    // input search
    this.input_ = this.element_.getElementsByTagName('input')["m-searchstreetgeosearch-search-input"];
    //JGL20170818: traslado gestión evento a autocomplete
    //goog.events.listen(this.input_, goog.events.EventType.KEYUP, this.searchClick_, false, this);

    // search buntton
    let btnSearch = this.element_.getElementsByTagName('button')["m-searchstreetgeosearch-search-btn"];
    btnSearch.addEventListener("click", this.searchClick_);
    // help buntton
    let btnHelp = this.element_.getElementsByTagName('button')["m-searchstreetgeosearch-help-btn"];
    btnHelp.addEventListener("click", evt => {
      evt.preventDefault();
      btnHelp.classList.toggle('shown');
      this.helpClick_();
    });

    // results container
    this.resultsContainer_ = this.element_.getElementsByTagName('div')["m-geosearch-results"];
    Utils.enableTouchScroll(this.resultsContainer_);
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

    let resultsTemplateVars = this.parseResultsForTemplate_(results, true);
    Template.compile(Geosearch.RESULTS_TEMPLATE, {
      'jsonp': true,
      'vars': resultsTemplateVars
    }).then(html => {
      // appends the new results
      let newResultsScrollContainer = html.getElementsByTagName("div")["m-geosearch-results-scroll"];
      let newResults = newResultsScrollContainer.children;
      let newResult;
      while ((newResult = newResults.item(0)) !== null) {
        this_.resultsScrollContainer_.appendChild(newResult);
        newResult.addEventListener("click", this_.resultClick_);
      }

      // updates the found num elements
      let spanNumFound = this_.resultsContainer_.getElementsByTagName("span")["m-geosearch-page-found"];
      spanNumFound.innerHTML = this_.results_.length;


      this_.element_.classList.remove(Geosearch.SEARCHING_CLASS);
      this_.resultsContainer_.removeChild(this_.searchingResult_);
      // disables scroll if gets all results
      this_.checkScrollSearch_(results);
    });
  }

  /**
   * This function hides/shows the list
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Keypress event
   */
  resultsClick_(evt) {
    this.facadeMap_._areasContainer.getElementsByClassName("m-top m-right")[0].classList.toggle("top-extra-search");
    evt.target.classList.toggle('g-cartografia-flecha-arriba');
    evt.target.classList.toggle('g-cartografia-flecha-abajo');
    this.resultsContainer_.classList.toggle("hidden");
    if (Utils.isNullOrEmpty(this.resultsContainer_.parentElement.querySelector("div#m-searchstreet-results.hidden"))) {
      this.resultsContainer_.parentElement.classList.toggle("hidden");
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
