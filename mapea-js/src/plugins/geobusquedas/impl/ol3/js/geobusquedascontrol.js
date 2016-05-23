goog.provide('P.impl.control.Geobusquedas');

goog.require('P.impl.layer.Geobusquedas');
goog.require('goog.dom.classes');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc
    * Main constructor of the measure conrol.
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.Geobusquedas = function () {
      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.facadeMap_ = null;

      /**
       * HTML element of the help
       * @private
       * @type {HTMLElement}
       */
      this.helpHtml_ = null;

      /**
       * Layer that represents the results
       * @private
       * @type {M.impl.Layer}
       */
      this.layer_ = new M.impl.layer.Geobusquedas();
   };
   goog.inherits(M.impl.control.Geobusquedas, ol.control.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Geobusquedas.prototype.addTo = function (map, element) {
      this.facadeMap_ = map;

      this.layer_.addTo(map.getImpl());
      map.getImpl().getFeaturesHandler().addLayer(this.layer_);

      ol.control.Control.call(this, {
         'element': element,
         'target': null
      });
      map.getMapImpl().addControl(this);
   };

   /**
    * This function draws the results into the specified map
    *
    * @public
    * @function
    * @param {Array<Object>} results to draw
    * @api stable
    */
   M.impl.control.Geobusquedas.prototype.drawResults = function (results) {
      this.layer_.drawResults(results);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.control.Geobusquedas.prototype.drawNewResults = function (results) {
      this.layer_.drawNewResults(results);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.control.Geobusquedas.prototype.resultClick = function (solrid) {
      this.layer_.selectFeatureBySolrid(solrid);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.control.Geobusquedas.prototype.hideHelp = function () {
      if (!M.utils.isNullOrEmpty(this.helpHtml_)) {
         this.facadeMap_.getMapImpl().getTargetElement().removeChild(this.helpHtml_);
         this.helpHtml_ = null;
      }
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.control.Geobusquedas.prototype.showHelp = function (helpHtml) {
      var overlayContainer = this.facadeMap_.getMapImpl().getTargetElement();
      if (!M.utils.isNullOrEmpty(this.helpHtml_)) {
         overlayContainer.removeChild(this.helpHtml_);
      }
      this.helpHtml_ = helpHtml;
      overlayContainer.appendChild(this.helpHtml_);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.control.Geobusquedas.prototype.clear = function () {
      this.layer_.clear();
   };

   /**
    * This function destroys this control, clearing the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Geobusquedas.prototype.destroy = function () {
      this.facadeMap_.removeControl(this);
      this.facadeMap_ = null;
   };
})();