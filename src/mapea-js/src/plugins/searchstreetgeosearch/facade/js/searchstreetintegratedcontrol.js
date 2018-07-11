import SearchstreetIntegratedControlImpl from "../../impl/ol/js/searchstreetintegratedcontrol"
import SearchstreetGeosearchControl from "./searchstreetgeosearchcontrol";
import Searchstreet from "plugins/searchstreet/facade/js/searchstreet";
import Utils from "facade/js/utils/Utils";
import Exception from "facade/js/exception/exception";
import EventsManager from "facade/js/event/Eventsmanager";
import Remote from "facade/js/utils/Remote";
import Dialog from "facade/js/Dialog";

export default class SearchstreetIntegrated extends Searchstreet {
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

    /**
     * Implementation of this control
     *
     * @private
     * @type {M.impl.control.SearchstreetIntegrated}
     */

    this.impl = new M.impl.control.SearchstreetIntegrated();
    // call super

    super(url, locality);

    if (Utils.isUndefined(SearchstreetIntegratedControlImpl)) {
      Exception('La implementación usada no puede crear controles SearchstreetIntegrated');
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
    this.on(EventsManager.COMPLETED, function () {
      goog.dom.classlist.add(this.element_,
        "shown");
    }, this);

    // searchs
    this.input_ = this.element_.getElementsByTagName("input")["m-searchstreetgeosearch-search-input"];
    this.button_ = this.element_.getElementsByTagName("button")["m-searchstreetgeosearch-search-btn"];
    this.clear_ = this.element_.getElementsByTagName("button")["m-searchstreetgeosearch-clear-btn"];

    // events
    //JGL20170818: traslado gestión evento a autocomplete
    //goog.events.listen(this.input_, goog.events.EventType.KEYUP, this.searchClick_, false, this);
    goog.events.listen(this.button_, goog.events.EventType.CLICK, this.searchClick_, false, this);
    goog.events.listen(this.clear_, goog.events.EventType.CLICK, this.clearSearchs_, false, this);

    // results container
    this.resultsContainer_ = this.element_.getElementsByTagName('div')["m-searchstreet-results"];
    this.resultsAutocomplete_ = this.element_.getElementsByTagName('div')["m-autocomplete-results"];
    this.resultsGeosearch_ = this.element_.getElementsByTagName('div')["m-geosearch-results"];
    this.searchingResult_ = this.element_.querySelector('div#m-searchstreet-results > div#m-searching-result-searchstreet');

    if (!Utils.isUndefined(this.codIne_)) {
      this.searchTime_ = Date.now();
      var searchCodIne = Utils.addParameters(this.searchCodIne_, {
        codigo: this.codIne_
      });
      ((searchTime) => {
        Remote.get(searchCodIne).then(
          (response) => {
            let results;
            try {
              if (!Utils.isNullOrEmpty(response.text)) {
                results = JSON.parse(response.text);
                if (Utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
                  Dialog.error("El código del municipio '" + this.codIne_ + "' no es válido");
                } else {
                  this.getMunProv_(results);
                  this.element_.getElementsByTagName("span")["codIne"].innerHTML = "Búsquedas en " + this.municipio_ + "  (" + this.provincia_ + ")";
                }
              }
            } catch (err) {
              Exception('La respuesta no es un JSON válido: ' + err);
            }
          });
      })(this.searchTime_);
    }
    this.resultsContainer_.removeChildren(this.searchingResult_);
  }

  /**
   * This function remove popup, points and results drawn on the map.
   *
   * @private
   * @function
   */
  clearSearchs_() {
    this.element_.classList.remove("shown");
    let controls = this.facadeMap_.getControls();
    for (var x = 0, ilen = controls.length; x < ilen; x++) {
      if (controls[x].name_ === "searchstreetgeosearch") {
        controls[x].ctrlGeosearch.getImpl().layer_.clear();
      }
    }
    this.facadeMap_.removePopup();
    this.getImpl().removePoints_();
    this.input_.value = "";
    this.resultsContainer_.innerHTML = "";
    this.resultsAutocomplete_.innerHTML = "";
    this.resultsGeosearch_.innerHTML = "";
  }

  /**
   * This function checks the query field is not empty and send the query to the search function
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Keypress event
   */
  searchClick_(evt) {
    evt.preventDefault();

    if ((evt.type !== "keyup") || (evt.keyCode === 13)) {
      this.resultsAutocomplete_.classList.remove(Searchstreet.MINIMUM);
      this.resultsAutocomplete_.removeChildren(this.resultsAutocomplete_.querySelector("div#m-searching-result-autocomplete"));
      // gets the query
      let query = this.input_.value;
      if (!Utils.isNullOrEmpty(query)) {
        if (query.length < this.minAutocomplete_) {
          this.completed = false;
        } else {
          this.completed = true;
        }
        if (!Utils.isUndefined(this.codIne_) && !Utils.isNullOrEmpty(this.codIne_)) {
          // It does not take into account the municipality if indicated
          let pos = query.indexOf(",");
          if (query.indexOf(",") > -1) {
            query = query.substring(0, pos);
          }
          this.search_(query + ", " + this.municipio_ + " (" + this.provincia_ + ")", this.showResults_);
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
    this.facadeMap_._areasContainer.getElementsByClassName("m-top m-right")[0].classlist.add("top-extra-searchs");
    evt.target.classList.toggle('g-cartografia-flecha-arriba');
    evt.target.classList.toggle('g-cartografia-flecha-abajo');
    this.resultsContainer_.classList.toggle("hidden");
    if (Utils.isNullOrEmpty(this.resultsContainer_.parentElement.querySelector("div#m-geosearch-results.hidden"))) {
      this.resultsContainer_.parentElement.classList.toggle("hidden");
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
