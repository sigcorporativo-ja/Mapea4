goog.provide('P.impl.control.Center');

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
   M.impl.control.Center = function () {
      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.facadeMap_ = null;

      this.inputX_ = null;
      this.inputY_ = null;

      goog.base(this);
   };
   goog.inherits(M.impl.control.Center, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Center.prototype.addTo = function (map, element) {
      this.facadeMap_ = map;

      // adds select events
      var button = element.getElementsByTagName('button')['m-center-button'];
      goog.events.listen(button, [
         goog.events.EventType.CLICK,
         goog.events.EventType.TOUCHEND
      ], this.onClick, false, this);

      // input x
      this.inputX_ = element.getElementsByTagName('input')['m-center-x'];
      // input y
      this.inputY_ = element.getElementsByTagName('input')['m-center-y'];

      // super addTo
      goog.base(this, 'addTo', map, element);
   };

   /**
    * This function manages the click on the button
    *
    * @function
    * @api stable
    */
   M.impl.control.Center.prototype.onClick = function (evt) {
      var x = this.inputX_.value;
      var y = this.inputY_.value;

      this.facadeMap_.setCenter([x, y]);
   };

   /**
    * This function manages the click on the button
    *
    * @function
    * @api stable
    */
   M.impl.control.Center.prototype.destroy = function (obj) {
      this.facadeMap_.getMapImpl().removeControl(this);
      this.inputX_ = null;
      this.inputY_ = null;
      this.facadeMap_ = null;
   };
})();