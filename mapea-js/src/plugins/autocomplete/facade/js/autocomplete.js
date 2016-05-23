goog.provide('M.plugin.Autocomplete');

goog.require('goog.events');

(function () {
   /**
    * @classdesc
    * Main facade plugin object. This class creates a plugin
    * object which has an implementation Object
    *
    * @constructor
    * @extends {M.Plugin}
    * @param {Object} impl implementation object
    * @api stable
    */
   M.plugin.Autocomplete = (function (parameters) {
      parameters = (parameters || {});

      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.map_ = null;

      /**
       * Facade of the map
       * @private
       * @type {String}
       */
      this.url_ = M.config.CALLEJERO_URL;
      if (!M.utils.isNullOrEmpty(parameters.url)) {
         this.url_ = parameters.url;
      }

      /**
       * Facade of the map
       * @private
       * @type {String}
       */
      this.minLength_ = 3;
      if (!M.utils.isNullOrEmpty(parameters.minLength)) {
         this.minLength_ = parameters.minLength;
      }

      /**
       * Facade of the map
       * @private
       * @type {String}
       */
      this.target_ = parameters.target;


      /**
       * Facade of the map
       * @private
       * @type {String}
       */
      this.delayTime_ = 750;
      if (!M.utils.isNullOrEmpty(parameters.delay)) {
         this.delayTime_ = parameters.delay;
      }

      /**
       * Facade of the map
       * @private
       * @type {String}
       */
      this.timeoutKey_ = null;

      goog.base(this);
   });
   goog.inherits(M.plugin.Autocomplete, M.Plugin);

   /**
    * This function provides the implementation
    * of the object
    *
    * @public
    * @function
    * @param {Object} map the map to add the plugin
    * @api stable
    */
   M.plugin.Autocomplete.prototype.addTo = function (map) {
      this.map_ = map;
      goog.dom.classlist.add(this.target_, M.plugin.Autocomplete.CLASS);
      goog.events.listen(this.target_, goog.events.EventType.INPUT, this.keyPress_, false, this);
   };


   /**
    * This function provides the input search
    *
    * @private
    * @function
    * @returns {HTMLElement} the input that executes the search
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
            this.search_(query);
         }, this), this.delayTime_);
      }
   };

   /**
    * This function provides the input search
    *
    * @private
    * @function
    * @returns {HTMLElement} the input that executes the search
    */
   M.plugin.Autocomplete.prototype.search_ = function (query) {
      goog.dom.classlist.add(this.target_, M.plugin.Autocomplete.SEARCHING_CLASS);
      console.log(this.url_ + ' ---> ' + query);
      setTimeout(goog.bind(function () {
         goog.dom.classlist.remove(this.target_, M.plugin.Autocomplete.SEARCHING_CLASS);
      }, this), 2000);
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
      goog.dom.classlist.remove(this.target_, M.plugin.Autocomplete.SEARCHING_CLASS);
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
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.plugin.Autocomplete.CLASS = 'm-plugin-autocomplete';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.plugin.Autocomplete.SEARCHING_CLASS = 'searching';
})();