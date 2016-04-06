goog.provide('P.plugin.Autocomplete');

goog.require('goog.dom.classlist');

(function () {
   /**
    * @classdesc 
    * Main facade plugin object. This class creates a plugin
    *            object which has an implementation Object
    * 
    * @constructor
    * @extends {M.Plugin}
    * @param {Object}
    * parameters parameter group to form URL Query
    * @api stable
    */
   M.plugin.Autocomplete = (function (parameters) {

      parameters = (parameters || {});

      /**
       * Facade of the map
       * 
       * @private
       * @type {M.Map}
       */
      this.map_ = null;

      /**
       * INE code to specify the search 
       * 
       * @private
       * @type {Number}
       */
      this.locality_ = null;
      if (!M.utils.isNullOrEmpty(parameters.locality)) {
         this.locality_ = parameters.locality;
      }

      /**
       * Service URL
       * 
       * @private
       * @type {String}
       */
      this.url_ = M.config.AUTOCOMPLETE_URL;

      /**
       * Minimum number of characters to start autocomplete
       * 
       * @private
       * @type {Number}
       */
      this.minLength_ = M.config.AUTOCOMPLETE_MINLENGTH;

      /**
       * Element at which to write the query
       * 
       * @private
       * @type {HTMLElement}
       */
      this.target_ = parameters.target;

      /**
       * Container autocomplete
       * 
       * @private
       * @type {HTMLElement}
       */
      this.resultsContainer_ = parameters.html.querySelector("div#m-autocomplete-results");


      /**
       * TODO
       * 
       * @private
       * @type {Number}
       */
      this.delayTime_ = M.config.AUTOCOMPLETE_DELAYTIME;

      /**
       * Time out Key
       * 
       * @private
       * @type {Number}
       */
      this.timeoutKey_ = null;

      /**
       * Number of results to show
       * 
       * @private
       * @type {Number}
       */
      this.limit_ = M.config.AUTOCOMPLETE_LIMIT;
      
      /**
       * Timestamp of the search to abort old requests
       * 
       * @private
       * @type {Number}
       */
      this.searchTime_ = 0;

      /**
       * state search municipality
       * 
       * @private
       * @type {Boolean}
       */
      this.busqMunicipio_ = false;

      /**
       * state click search municipality
       * 
       * @private
       * @type {Boolean}
       */
      this.busqMunicipioClick_ = false;


      goog.base(this);
   });
   goog.inherits(M.plugin.Autocomplete, M.Plugin);

   /**
    * This function adds the control to the specified map
    * 
    * @public
    * @function
    * @param {Object}
    *        map the map to add the plugin
    * @api stable
    */
   M.plugin.Autocomplete.prototype.addTo = function (map) {
      this.map_ = map;
      goog.dom.classlist.add(this.target_, M.plugin.Autocomplete.CLASS);
      goog.events.listen(this.target_, goog.events.EventType.INPUT,
         this.keyPress_, false, this);
   };

   /**
    * Read events keystrokes
    * 
    * @private
    * @function
    */
   M.plugin.Autocomplete.prototype.keyPress_ = function (evt) {
      evt.preventDefault();

      if (!M.utils.isNullOrEmpty(this.timeoutKey_)) {
         this.cancelSearch_();
         this.timeoutKey_ = null;
      }

      var query = this.target_.value.trim();
      if (query.length >= this.minLength_) {
         this.timeoutKey_ = setTimeout(goog.bind(function () {
            if (query.indexOf(',') != -1) {
               this.busqMunicipio_ = true;
            }
            else {
               this.busqMunicipio_ = false;
               this.busqMunicipioClick_ = false;
            }
            this.search_(query);
         }, this), this.delayTime_);
      }
   };

   /**
    * This function performs the query
    * 
    * @private
    * @function
    * @param {String} query query to search
    */
   M.plugin.Autocomplete.prototype.search_ = function (query, evt) {
      goog.dom.classlist.remove(this.target_,
         M.plugin.Autocomplete.SEARCHING_CLASS);
      var this_ = this;
      this.evt = evt;
      var searchUrl;
      if (!M.utils.isNullOrEmpty(this.locality_)) {
         searchUrl = M.utils.addParameters(this.url_, {
            input: query.trim(),
            limit: this.limit_,
            codine: this.locality_
         });
      }
      else {
         searchUrl = M.utils.addParameters(this.url_, {
            input: query.trim(),
            limit: this.limit_
         });
      }

      searchUrl = this.formatContent_(searchUrl, " ", "%20");
      this.searchTime_ = Date.now();
      (function (searchTime) {
         M.remote.get(searchUrl).then(function (response) {
            if (searchTime === this_.searchTime_) {
               var results = JSON.parse(response.text);
               results = this_.parseResultsForTemplate_(results);
               var controls = this_.map_.getControls();
               /*
                * In case of using locality, if a different municipality is indicated to locality results.docs will be undefinded
                * In this case, to change false the attribute completed of searchstreet
                */
               if (!M.utils.isUndefined(results.docs)) {
                  // If the result is indefinite, it will not continue autocompleting
                  if (!M.utils.isUndefined(results.docs[0])) {
                     M.template.compile(
                        M.plugin.Autocomplete.RESULTAUTOCOMPLETE,
                        results).then(
                        function (html) {
                           this_.resultsContainer_.innerHTML = html.innerHTML;
                           this_.addEvents_(this_.resultsContainer_.querySelectorAll("div.autocomplete"));
                           /*
                            * In case the municipality not searched, to verify that searchstreet is completed, 
                            * in affirmative case to change to false the attribute completed of searchstreet
                            * and not show results
                            * */
                           if (this_.busqMunicipio_ === true) {
                              /*In case of not having the added event, it will be verified if searchstreet is completed.
                               *  In affirmative case to change to false and not to show result, 
                               *  in negative case, to assign the event to the results
                               */
                              if (this_.busqMunicipioClick_ === true) {
                                 this_.target_.value = query.slice(0, -1);
                                 this_.resultsContainer_.innerHTML = "";
                                 if (!M.utils.isUndefined(this_.evt)) {
                                    for (var i = 0, ilen = controls.length; i < ilen; i++) {
                                       if (controls[i].name_ === "searchstreetgeosearch") {
                                          controls[i].ctrlSearchstreet.searchClick_(this_.evt);
                                          controls[i].ctrlSearchstreet.completed = false;
                                          controls[i].ctrlGeosearch.searchClick_(this_.evt);
                                       }
                                       else if (controls[i].name_ === "searchstreet") {
                                          controls[i].searchClick_(this_.evt);
                                          controls[i].completed = false;
                                       }
                                    }
                                    this_.busqMunicipioClick_ = false;
                                 }
                              }
                              else {
                                 var autocompleteResults = this_.resultsContainer_.querySelectorAll("div.autocomplete");
                                 for (var m = 0, ilen2 = controls.length; m < ilen2; m++) {
                                    if (controls[m].name_ === "searchstreetgeosearch") {
                                       if (controls[m].ctrlSearchstreet.completed === true) {
                                          controls[m].ctrlSearchstreet.completed = false;
                                          this_.resultsContainer_.innerHTML = "";
                                       }
                                       else {
                                          for (var h = 0, ilen3 = autocompleteResults.length; h < ilen3; h++) {
                                             this_.evtClickMunicipaly_(autocompleteResults[h]);
                                          }
                                       }
                                    }
                                    else if (controls[m].name_ === "searchstreet") {
                                       if (controls[m].completed === true) {
                                          controls[m].completed = false;
                                          this_.resultsContainer_.innerHTML = "";
                                       }
                                       else {
                                          for (var j = 0, ilen5 = autocompleteResults.length; j < ilen5; j++) {
                                             this_.evtClickMunicipaly_(autocompleteResults[j]);
                                          }
                                       }
                                    }
                                 }
                              }
                           }
                           else {
                              for (var y = 0, ilen4 = controls.length; y < ilen4; y++) {
                                 if (controls[y].name_ === "searchstreet") {
                                    if (controls[y].completed === true) {
                                       this_.resultsContainer_.innerHTML = "";
                                       controls[y].completed = false;
                                    }
                                 }
                                 else if (controls[y].name_ === "searchstreetgeosearch") {
                                    if (controls[y].ctrlSearchstreet.completed === true) {
                                       this_.resultsContainer_.innerHTML = "";
                                       controls[y].ctrlSearchstreet.completed = false;
                                    }
                                 }
                              }
                           }
                        });
                  }
                  else {
                     for (var r = 0, ilen4 = controls.length; r < ilen4; r++) {
                        if (controls[r].name_ === "searchstreet") {
                           controls[r].completed = false;
                        }
                        else if (controls[r].name_ === "searchstreetgeosearch") {
                           controls[r].ctrlSearchstreet.completed = false;
                        }
                     }
                  }
               }
               else {
                  for (var g = 0, ilen6 = controls.length; g < ilen6; g++) {
                     if (controls[g].name_ === "searchstreet") {
                        controls[g].completed = false;
                     }
                     else if (controls[g].name_ === "searchstreetgeosearch") {
                        controls[g].ctrlSearchstreet.completed = false;
                     }
                  }
               }
         }
            });
      })(this.searchTime_);
   };

   /**
    * This function add event click that call clickMunicipaly
    * 
    * @private
    * @param {HTMLElement} element HTML element to add the event
    * @function
    */
   M.plugin.Autocomplete.prototype.evtClickMunicipaly_ = function (element) {
      var this_ = this;
      goog.events.listen(element, goog.events.EventType.CLICK, function (e) {
         this_.clickMunicipaly_();
      }, false, this);
   };

   /**
    * This function parse query results for template
    * 
    * @private
    * @param {Object} results query results 
    * @function
    * @return {Object}
    */
   M.plugin.Autocomplete.prototype.parseResultsForTemplate_ = function (results) {
      var docs = results.autocompletarDireccionResponse.autocompletarDireccionReturn.autocompletarDireccionReturn;
      var doscsTemp = [];
      if (this.busqMunicipio_ === true) {
         if (!M.utils.isUndefined(docs)) {
            if (docs instanceof Array === false) {
               docs = [docs];
            }
            for (var i = 0, ilen = docs.length; i < ilen; i++) {
               var info = docs[i].split(",");
               doscsTemp.push(info[0] + " " + info[1] + ", " + info[3] + " (" + info[info.length - 1] + ")");
            }
            docs = doscsTemp;
         }
         else {
            this.resultsContainer_.innerHTML = "";
         }
      }
      else if (docs instanceof Array === false) {
         doscsTemp.push(docs);
         docs = doscsTemp;
         if (!M.utils.isUndefined(docs[0])) {
            for (var x = 0, ilen3 = docs.length; x < ilen3; x++) {
               docs[x] = this.formatContent_(docs[x], ",", " ");
            }
         }
      }
      else {
         for (var j = 0, ilen2 = docs.length; j < ilen2; j++) {
            docs[j] = this.formatContent_(docs[j], ",", " ");
         }
      }
      var resultsTemplateVar = null;
      resultsTemplateVar = {
         'docs': docs
      };
      return resultsTemplateVar;
   };

   /**
    * This function add events to the results
    *
    * @private
    * @Param {Array} results array of HTML elements that add the event
    * @function
    */
   M.plugin.Autocomplete.prototype.addEvents_ = function (results) {
      for (var i = 0, ilen = results.length; i < ilen; i++) {
         this.addEventSearchMunicipality_(results[i]);
      }
   };

   /**
    * This function add events to specific result
    * 
    * @private
    * @param {HTMLElement} result HTML element to add the event
    * @function
    */
   M.plugin.Autocomplete.prototype.addEventSearchMunicipality_ = function (result) {
      goog.events.listen(result, goog.events.EventType.CLICK, function (e) {
         this.searchMunicipality_(result.innerHTML, e);
      }, false, this);
   };

   /**
    * This function active busqMunicipio and call search
    * 
    * @private
    * @param {String} content string to search
    * @function
    */
   M.plugin.Autocomplete.prototype.searchMunicipality_ = function (content, evt) {
      this.busqMunicipio_ = true;
      this.search_(content.trim() + ",", evt);
   };

   /**
    * This function active busqMunicipioClick_
    * 
    * @private
    * @function
    */
   M.plugin.Autocomplete.prototype.clickMunicipaly_ = function () {
      this.busqMunicipioClick_ = true;
   };

   /**
    * This function formats content
    * 
    * @private
    * @function
    * @param {String} str string to search
    * @Param {String} find string to find
    * @Param {String} replace string to replace
    * @returns {String}
    */
   M.plugin.Autocomplete.prototype.formatContent_ = function (str, find, replace) {
      return str.replace(new RegExp(find, 'g'), replace);
   };

   /**
    * This function provides the input search
    * 
    * @private
    * @function
    * @returns {HTMLElement} the input that executes the search
    */
   M.plugin.Autocomplete.prototype.cancelSearch_ = function (query) {
      clearTimeout(this.timeoutKey_);
      if (this.minLength_ <= this.target_.value.length) {
         goog.dom.classlist.add(this.target_,
            M.plugin.Autocomplete.SEARCHING_CLASS);
      }
      else {
         goog.dom.classlist.remove(this.target_,
            M.plugin.Autocomplete.SEARCHING_CLASS);
         this.resultsContainer_.innerHTML = "";
      }
   };

   /**
    * This function destroys this plugin
    * 
    * @public
    * @function
    * @api stable
    */
   M.plugin.Autocomplete.prototype.destroy = function () {
      this.map_ = null;
   };

   /**
    * Class autocomplete
    * 
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.plugin.Autocomplete.CLASS = 'm-plugin-autocomplete';

   /**
    * Class searching autocomplete
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.plugin.Autocomplete.SEARCHING_CLASS = 'searching';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.plugin.Autocomplete.RESULTAUTOCOMPLETE = "resultautocomplete.html";
})();