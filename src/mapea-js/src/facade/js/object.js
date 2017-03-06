goog.provide('M.Object');

goog.require('M.evt.EventsManager');
goog.require('M.evt.Listener');

(function () {
   'use strict';
   /**
    * @classdesc
    * Main mapea Object. This class creates a Object
    * which manages events
    *
    * @constructor
    * @api stable
    */
   M.Object = (function () {

      /**
       * Callback for events managed by the
       * facade object
       * 
       * @private
       * @type {M.evt.EventsManager}
       */
      this.eventsManager_ = new M.evt.EventsManager();
   });

   /**
    * Sets the callback when the instace is loaded
    *
    * @public
    * @function
    * @api stable
    */
   M.Object.prototype.on = function (eventType, listener, optThis) {
      this.eventsManager_.add(eventType, listener, optThis);
   };

   /**
    * Sets the callback when the instace is loaded
    *
    * @public
    * @function
    * @api stable
    */
   M.Object.prototype.un = function (eventType, listener, optThis) {
      this.eventsManager_.remove(eventType, listener, optThis);
   };

   /**
    * Sets the callback when the instace is loaded
    *
    * @public
    * @function
    * @api stable
    */
   M.Object.prototype.fire = function (eventType, args) {
      if (M.utils.isNullOrEmpty(args)) {
         args = [this];
      }
      this.eventsManager_.fire(eventType, args);
   };
})();