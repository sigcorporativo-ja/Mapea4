goog.provide('P.impl.control.SearchstreetIntegrated');

goog.require('P.impl.control.Searchstreet');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc Main constructor of the SearchstreetIntegrated control.
    *
    * @constructor
    * @extends {M.impl.control.Searchstreet}
    * @api stable
    */
   M.impl.control.SearchstreetIntegrated = function() {
      goog.base(this);
   };
   goog.inherits(M.impl.control.SearchstreetIntegrated, M.impl.control.Searchstreet);

   /**
    * This function replaces the addTo of Searchstreet, not to add control
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the plugin
    * @param {HTMLElement} template - Template SearchstreetGeosearch control
    * @api stable
    */
   M.impl.control.SearchstreetIntegrated.prototype.addTo = function(map, element) {
      this.facadeMap_ = map;
      this.element_ = element;

      ol.control.Control.call(this, {
         'element': element,
         'target': null
      });
   };

   /**
    * This function cancels the zoom function of searchstreet
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.SearchstreetIntegrated.prototype.zoomResults = function() {};


})();