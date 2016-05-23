goog.provide('M.facade.Base');

(function () {
   'use strict';
   /**
    * @classdesc
    * Main facade Object. This class creates a facede
    * Object which has an implementation Object and
    * provides the needed methods to access its implementation
    *
    * @constructor
    * @param {Object} impl implementation object
    * @api stable
    */
   M.facade.Base = (function (impl) {
      /**
       * Implementation of this object
       * @private
       * @type {Object}
       */
      this.impl_ = impl;

      /**
       * Callback when the object is loaded
       * This callback is used by objects that
       * load some resource
       * 
       * @private
       * @type {Object}
       */
      this.onLoadCallback_ = function () {};
   });

   /**
    * This function provides the implementation
    * of the object
    *
    * @public
    * @function
    * @returns {Object}
    * @api stable
    */
   M.facade.Base.prototype.getImpl = function () {
      return this.impl_;
   };
   
  /**
   * This function set implementation of this control
   *
   * @public
   * @function
   * @param {M.Map} impl to add the plugin
   * @api stable
   */
   M.facade.Base.prototype.setImpl = function (impl) {
     this.impl_ = impl;
  };

   /**
    * Sets the callback when the instace is loaded
    *
    * @public
    * @function
    * @api stable
    */
   M.facade.Base.prototype.onLoad = function (fn) {
      if (M.utils.isFunction(fn)) {
         this.onLoadCallback_ = fn;
      }
   };
})();