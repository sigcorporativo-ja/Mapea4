goog.provide('P.control.SearchstreetIntegrated');

goog.require('P.impl.control.SearchstreetIntegrated');
goog.require('P.control.Searchstreet');
goog.require('P.impl.control.Searchstreet');

(function() {
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
  M.control.SearchstreetIntegrated = (function(url, locality) {
    if (M.utils.isUndefined(M.impl.control.SearchstreetIntegrated)) {
      M.exception('La implementación usada no puede crear controles SearchstreetIntegrated');
    }

    /**
     * Implementation of this control
     *
     * @private
     * @type {M.impl.control.SearchstreetIntegrated}
     */
    this.impl = new M.impl.control.SearchstreetIntegrated();
    // call super
    goog.base(this, url, locality);
  });
  goog.inherits(M.control.SearchstreetIntegrated, M.control.Searchstreet);

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
  M.control.SearchstreetIntegrated.prototype.createView = function(html, map) {
    this.facadeMap_ = map;
    this.addEvents(html);
    return null;
  };

  /**
   * This function add events to HTML elements
   *
   * @public
   * @function
   * @param {HTMLElement}
   *        html - HTML to add events
   * @api stable
   */
  M.control.SearchstreetIntegrated.prototype.addEvents = function(html) {
    this.element_ = html;
    var this_ = this;

    this.on(M.evt.COMPLETED, function() {
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

    if (!M.utils.isUndefined(this.codIne_)) {
      this.searchTime_ = Date.now();
      var searchCodIne = M.utils.addParameters(this.searchCodIne_, {
        codigo: this.codIne_
      });
      (function(searchTime) {
        M.remote.get(searchCodIne).then(
          function(response) {
            var results;
            try {
              if (!M.utils.isNullOrEmpty(response.text)) {
                results = JSON.parse(response.text);
                if (M.utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
                  M.dialog.error("El código del municipio '" + this_.codIne_ + "' no es válido");
                }
                else {
                  this_.getMunProv_(results);
                  this_.element_.getElementsByTagName("span")["codIne"].innerHTML = "Búsquedas en " + this_.municipio_ + "  (" + this_.provincia_ + ")";
                }
              }
            }
            catch (err) {
              M.exception('La respuesta no es un JSON válido: ' + err);
            }
          });
      })(this.searchTime_);
    }
    goog.dom.removeChildren(this.resultsContainer_, this.searchingResult_);
  };

  /**
   * This function remove popup, points and results drawn on the map.
   *
   * @private
   * @function
   */
  M.control.SearchstreetIntegrated.prototype.clearSearchs_ = function() {
    goog.dom.classlist.remove(this.element_,
      "shown");
    var controls = this.facadeMap_.getControls();
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
  };

  /**
   * This function checks the query field is not empty and send the query to the search function
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Keypress event
   */
  M.control.SearchstreetIntegrated.prototype.searchClick_ = function(evt) {
    evt.preventDefault();

    if ((evt.type !== goog.events.EventType.KEYUP) || (evt.keyCode === 13)) {
      goog.dom.classlist.remove(this.resultsAutocomplete_,
        M.control.Searchstreet.MINIMUM);
      goog.dom.removeChildren(this.resultsAutocomplete_, this.resultsAutocomplete_.querySelector("div#m-searching-result-autocomplete"));
      // gets the query
      var query = this.input_.value;
      if (!M.utils.isNullOrEmpty(query)) {
        if (query.length < this.minAutocomplete_) {
          this.completed = false;
        }
        else {
          this.completed = true;
        }
        if (!M.utils.isUndefined(this.codIne_) && !M.utils.isNullOrEmpty(this.codIne_)) {
          // It does not take into account the municipality if indicated
          var pos = query.indexOf(",");
          if (query.indexOf(",") > -1) {
            query = query.substring(0, pos);
          }
          this.search_(query + ", " + this.municipio_ + " (" + this.provincia_ + ")", this.showResults_);
        }
        else {
          this.search_(query, this.showResults_);
        }
      }
    }
  };

  /**
   * This function hides/shows the list
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Keypress event
   */
  M.control.SearchstreetIntegrated.prototype.resultsClick_ = function(evt) {
    goog.dom.classlist.add(this.facadeMap_._areasContainer.getElementsByClassName("m-top m-right")[0],
      "top-extra-searchs");
    goog.dom.classlist.toggle(evt.target, 'g-cartografia-flecha-arriba');
    goog.dom.classlist.toggle(evt.target, 'g-cartografia-flecha-abajo');
    goog.dom.classlist.toggle(this.resultsContainer_, "hidden");
    if (M.utils.isNullOrEmpty(this.resultsContainer_.parentElement.querySelector("div#m-geosearch-results.hidden"))) {
      goog.dom.classlist.toggle(this.resultsContainer_.parentElement, "hidden");
    }
  };

  /**
   * This function return impl control
   *
   * @public
   * @function
   * @api stable
   * @return {M.impl.control.SearchstreetIntegrated}
   */
  M.control.SearchstreetIntegrated.prototype.getImpl = (function() {
    return this.impl;
  });


})();
