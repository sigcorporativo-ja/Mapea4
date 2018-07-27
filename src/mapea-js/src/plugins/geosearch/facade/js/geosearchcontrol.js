import GeosearchImpl from '../../impl/ol/js/geosearchcontrol';

export default class GeosearchControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMCSelector
   * control to provides a way to select an specific WMC
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(url, core, handler, searchParameters) {
    // implementation of this control
    const impl = new GeosearchImpl();

    super(impl, GeosearchControl.NAME);

    // checks if the implementation can create WMC layers
    if (M.utils.isUndefined(GeosearchImpl)) {
      M.exception('La implementación usada no puede crear controles Geosearch');
    }

    /**
     * Facade of the map
     * @private
     * @type {HTMLElement}
     */
    this.input_ = null;

    /**
     * Container of the control
     * @private
     * @type {HTMLElement}
     */
    this.element_ = null;

    /**
     * Container of the results
     * @private
     * @type {HTMLElement}
     */
    this.resultsContainer_ = null;

    /**
     * Container of the results to scroll
     * @private
     * @type {HTMLElement}
     */
    this.resultsScrollContainer_ = null;

    /**
     * Searching result
     * @private
     * @type {HTMLElement}
     */
    this.searchingResult_ = null;

    /**
     * Timestamp of the search to abort
     * old requests
     * @private
     * @type {Nunber}
     */
    this.searchTime_ = 0;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.url_ = url;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.core_ = core;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.handler_ = handler;

    /**
     * Search URL
     * @private
     * @type {String}
     */
    this.searchUrl_ = M.utils.concatUrlPaths([this.url_, this.core_, this.handler_]);

    /**
     * Help API URL
     * @private
     * @type {String}
     */
    this.helpUrl_ = M.utils.concatUrlPaths([this.url_, this.core_, '/help']);

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.searchParameters_ = searchParameters;
    if (!M.utils.isNullOrEmpty(this.searchParameters_)) {
      if (M.utils.isNullOrEmpty(this.searchParameters_.rows)) {
        this.searchParameters_.rows = M.config.GEOSEARCH_ROWS;
      }
      this.searchUrl_ = M.utils.addParameters(this.searchUrl_, this.searchParameters_);
    }

    /**
     * Results of the search
     * @private
     * @type {Array<Object>}
     */
    this.results_ = [];

    /**
     * Flag that indicates if the help was
     * shown
     * @private
     * @type {Boolean}
     */
    this.helpShown_ = false;

    /**
     * Flag that indicates the scroll is up
     * shown
     * @private
     * @type {Boolean}
     */
    this.scrollIsUp_ = true;

    /**
     * Flag that indicates the search is spatial
     * shown
     * @private
     * @type {Boolean}
     */
    this.spatialSearch_ = false;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stabletrue
   */
  createView(map) {
    this.facadeMap_ = map;
    const promise = new Promise((success, fail) => {
      M.template.compile(GeosearchControl.TEMPLATE, {
        jsonp: true,
      }).then((html) => {
        this.addEvents(html);
        success(html);
      });
    });
    return promise;
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  addEvents(html) {
    this.element_ = html;

    this.on(M.evt.COMPLETED, () => {
      this.element_.classList.add('shown');
    }, this);

    // input search
    this.input_ = this.element_.getElementsByTagName('input')['m-geosearch-search-input'];
    this.input_.addEventListener('keyup', this.searchClick_.bind(this));
    // search buntton
    const btnSearch = this.element_.getElementsByTagName('button')['m-geosearch-search-btn'];
    btnSearch.addEventListener('click', this.searchClick_.bind(this));

    // help buntton
    const btnHelp = this.element_.getElementsByTagName('button')['m-geosearch-help-btn'];
    btnHelp.addEventListener('click', (evt) => {
      evt.preventDefault();
      btnHelp.classList.toggle('shown');
      this.helpClick_();
    });

    // clear buntton
    const btnClean = this.element_.getElementsByTagName('button')['m-geosearch-clear-btn'];
    btnClean.addEventListener('click', this.clearClick_);

    // results container
    this.resultsContainer_ = this.element_.querySelector('div#m-geosearch-results');
    M.utils.enableTouchScroll(this.resultsContainer_);
    this.searchingResult_ = this.element_.querySelector('div#m-geosearch-results > div#m-searching-result');
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  searchClick_(evt) {
    evt.preventDefault();

    if (evt.type !== 'click') {
      // resets the results
      this.results_.length = 0;

      // gets the query
      const query = this.input_.value;
      if (M.utils.isNullOrEmpty(query)) {
        M.dialog.info('Debe introducir una búsqueda.');
      }
      else {
        this.search_(query, this.showResults_);
      }
    }
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  resultClick_(evtParam) {
    const evt = evtParam;
    evt.preventDefault();
    // hidden results on click for mobile devices
    if (M.Window.WIDTH <= M.config.MOBILE_WIDTH) {
      evt.target = this.resultsContainer_.querySelector('div.page > div.g-cartografia-flecha-arriba');
      this.resultsClick_(evt);
    }
    this.getImpl().facadeMap_.removePopup();
    const solrid = evt.currentTarget.id;
    this.getImpl().resultClick(solrid);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  search_(query, processor) {
    this.resultsContainer_.appendChild(this.searchingResult_);

    this.searchTime_ = Date.now();

    // adds the class
    this.element_.classList.add(GeosearchControl.SEARCHING_CLASS);

    const searchUrl = M.utils.addParameters(this.searchUrl_, {
      q: query,
      start: this.results_.length,
      srs: this.facadeMap_.getProjection().code,
    });

    /* Stores the current search time into a
       closure function. When the promise returns a
       value we compare the current search time
       (this.searchTime) and the saved search time of
       the request (searchTime parameter).
       If they are different then aborts the response */
    ((searchTime) => {
      M.remote.get(searchUrl).then((response) => {
        // if it is the current search then show the results
        if (searchTime === this.searchTime_) {
          let results;
          try {
            results = JSON.parse(response.text);
          }
          catch (err) {
            M.exception(`La respuesta no es un JSON válido: ${err}`);
          }
          processor.call(this, results);
          this.element_.classList.remove(GeosearchControl.SEARCHING_CLASS);
        }
      });
    })(this.searchTime_);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  showResults_(results) {
    // clears the layer
    this.getImpl().clear();

    // draws the results on the map
    this.drawResults(results);

    const resultsTemplateVars = this.parseResultsForTemplate_(results);
    M.template.compile(GeosearchControl.RESULTS_TEMPLATE, {
      jsonp: true,
      vars: resultsTemplateVars,
    }).then((html) => {
      this.resultsContainer_.classList.remove(GeosearchControl.HIDDEN_RESULTS_CLASS);
      /* unregisters previous events */
      // scroll
      if (!M.utils.isNullOrEmpty(this.resultsScrollContainer_)) {
        this.resultsScrollContainer_.removeEventListener('scroll', this.resultsScroll_);
      }
      // results
      let resultsHtmlElements = this.resultsContainer_.querySelectorAll('.result');
      let resultHtml;
      for (let i = 0, ilen = resultsHtmlElements.length; i < ilen; i += 1) {
        resultHtml = resultsHtmlElements.item(i);
        resultHtml.removeEventListener('click', this.resultClick_);
      }
      if (results.response.docs.length > 0) {
        this.zoomToResults();
      }

      // results buntton
      let btnResults = this.resultsContainer_.querySelector('div.page > div.g-cartografia-flecha-arriba');
      if (!M.utils.isNullOrEmpty(btnResults)) {
        btnResults.removeEventListener('click', this.resultsClick_);
      }

      // gets the new results scroll
      this.resultsContainer_.innerHTML = html.innerHTML;
      this.resultsScrollContainer_ = this.resultsContainer_.querySelector('div#m-geosearch-results-scroll');
      // registers the new event
      M.utils.enableTouchScroll(this.resultsScrollContainer_);
      this.resultsScrollContainer_.addEventListener('scroll', this.resultsScroll_);

      // adds new events
      resultsHtmlElements = this.resultsContainer_.getElementsByClassName('result');
      for (let i = 0, ilen = resultsHtmlElements.length; i < ilen; i += 1) {
        resultHtml = resultsHtmlElements.item(i);
        resultHtml.addEventListener('click', this.resultClick_);
      }

      // results buntton
      btnResults = this.resultsContainer_.querySelector('div.page > div.g-cartografia-flecha-arriba');
      btnResults.addEventListener('click', this.resultsClick_);
      this.checkScrollSearch_(results);
      this.fire(M.evt.COMPLETED);
    });
  }

  /**
   * This function draws the results into the specified map
   *
   * @public
   * @function
   * @param {Array<Object>} results to draw
   * @api stable
   */
  drawResults(results) {
    this.getImpl().drawResults(results);
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  drawNewResults(results) {
    this.getImpl().drawNewResults(results);
  }

  /**
   * This function sets zoom to results
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  zoomToResults() {
    this.getImpl().zoomToResults();
  }

  /**
   * This function provides the input search
   *
   * @public
   * @function
   * @returns {HTMLElement} the input that executes the search
   * @api stable
   */
  getInput() {
    return this.input_;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  appendResults_(results) {
    // draws the new results on the map
    this.drawNewResults(results);

    const resultsTemplateVars = this.parseResultsForTemplate_(results, true);
    M.template.compile(GeosearchControl.RESULTS_TEMPLATE, {
      jsonp: true,
      vars: resultsTemplateVars,
    }).then((html) => {
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

      // disables scroll if gets all results
      this.checkScrollSearch_(results);
    });
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  resultsScroll_(evt) {
    const target = evt.target;
    const height = target.style.height;
    const scrollHeight = target.scrollHeight;
    const scrollTop = target.scrollTop;

    const scrollPosition = scrollHeight - scrollTop;
    const scrollIsDown = ((scrollPosition - height) <= 15);
    if (scrollIsDown && this.scrollIsUp_) {
      this.scrollIsUp_ = false;
      this.scrollSearch_();
    }
    else if (!scrollIsDown) {
      // updates the scroll state
      this.scrollIsUp_ = true;
    }
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  scrollSearch_() {
    // unselects features
    this.getImpl().unselectResults(true);
    this.getImpl().setNewResultsAsDefault();

    // gets the query
    const query = this.input_.value;
    this.search_(query, this.appendResults_);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  helpClick_(evt) {
    if (this.helpShown_ === true) {
      this.getImpl().hideHelp();
      this.helpShown_ = false;
    }
    else {
      M.remote.get(this.helpUrl_).then((response) => {
        let help;
        try {
          help = JSON.parse(response.text);
        }
        catch (err) {
          M.Exception(`La respuesta no es un JSON válido: ${err}`);
        }
        M.template.compile(GeosearchControl.HELP_TEMPLATE, {
          jsonp: true,
          vars: {
            entities: help,
          },
        }).then((html) => {
          this.getImpl().showHelp(html);
          this.helpShown_ = true;
        });
      });
    }
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  clearClick_(evt) {
    this.element_.classList.remove('shown');
    if (!M.utils.isNullOrEmpty(this.input_)) {
      this.input_.value = '';
    }
    if (!M.utils.isNullOrEmpty(this.resultsContainer_)) {
      this.resultsContainer_.innerHTML = '';
    }
    if (!M.utils.isNullOrEmpty(this.resultsScrollContainer_)) {
      this.resultsScrollContainer_.innerHTML = '';
      this.resultsScrollContainer_ = null;
    }
    this.results_.length = 0;
    this.resultsContainer_.classList.remove(GeosearchControl.HIDDEN_RESULTS_CLASS);
    this.getImpl().clear();
    this.spatialSearch_ = false;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  resultsClick_(evt) {
    this.facadeMap_.areasContainer.getElementsByClassName('m-top m-right')[0].add('top-extra-search');
    evt.target.classList.toggle('g-cartografia-flecha-arriba');
    evt.target.classList.toggle('g-cartografia-flecha-abajo');

    this.resultsContainer_.classList.toggle(GeosearchControl.HIDDEN_RESULTS_CLASS);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof GeosearchControl) {
      equals = (this.name === obj.name);
    }
    return equals;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  parseResultsForTemplate_(results, append) {
    let search = '';
    if (!M.utils.isNullOrEmpty(this.input_)) {
      search = this.input_.value;
    }
    let total = 0;
    if (!M.utils.isUndefined(results.spatial_response)) {
      total = results.spatial_response.numFound;
      this.spatialSearch_ = true;
    }
    else {
      total = results.response.numFound;
      this.spatialSearch_ = false;
    }
    const docs = this.getDocsFromResults_(results);
    if (append === true) {
      this.results_ = this.results_.concat(docs);
    }
    else {
      this.results_ = docs;
    }
    const partial = (this.spatialSearch_ && M.utils.isNullOrEmpty(results.spatial_response.docs));
    let resultsTemplateVar = null;
    if (total !== 0) {
      resultsTemplateVar = {
        docs,
        total,
        partial,
      };
    }
    else {
      resultsTemplateVar = {
        docs,
        total,
        notResutls: true,
        query: search,
      };
    }
    return resultsTemplateVar;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  getDocsFromResults_(results) {
    let docs = [];
    if (this.spatialSearch_) {
      docs = results.spatial_response.docs;
    }
    else {
      docs = results.response.docs;
    }
    const hiddenAttributes = ['geom', '_version_', 'keywords', 'solrid'];
    docs = docs.map((doc) => {
      const attributes = [];
      const DocKeys = Object.keys(doc);
      DocKeys.forEach((key) => {
        if (!M.utils.includes(hiddenAttributes, key)) {
          attributes.push({
            key: M.utils.beautifyAttributeName(key),
            value: doc[key],
          });
        }
      });
      return {
        solrid: doc.solrid,
        attributes,
      };
    });
    return docs;
  }

  /**
   * Disables scroll if gets all results
   *
   * @private
   * @function
   */
  checkScrollSearch_(results) {
    let total = 0;
    if (!M.utils.isUndefined(results.spatial_response)) {
      total = results.spatial_response.numFound;
    }
    else {
      total = results.response.numFound;
    }
    if ((this.results_.length === total) &&
      (!M.utils.isNullOrEmpty(this.resultsScrollContainer_))) {
      this.resultsScrollContainer_.removeEventListener('scroll', this.resultsScroll_);
    }
  }
}

/**
 * Name of this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchControl.NAME = 'geosearch';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchControl.TEMPLATE = 'geosearch.html';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchControl.RESULTS_TEMPLATE = 'geosearchresults.html';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchControl.HELP_TEMPLATE = 'geosearchhelp.html';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchControl.SEARCHING_CLASS = 'm-searching';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchControl.HIDDEN_RESULTS_CLASS = 'hidden';
