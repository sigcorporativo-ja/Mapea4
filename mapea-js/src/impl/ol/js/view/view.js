goog.provide('M.impl.View');

goog.require('ol.View');

(function () {
   /**
    * @classdesc
    *
    * @constructor
    * @extends {ol.View}
    * @param {olx.ViewOptions=} opt_options View options.
    * @api stable
    */
   M.impl.View = function (opt_options) {
      this.userZoom_ = null;

      goog.base(this, opt_options);
   };
   goog.inherits(M.impl.View, ol.View);


   /**
    * Zoom to a specific zoom level from user
    * @param {number} zoom Zoom level.
    * @api stable
    */
   M.impl.View.prototype.setUserZoom = function (zoom) {
      this.userZoom_ = zoom;
      this.setZoom(zoom);
   };

   /**
    * Provides the zoom user
    * @param {number} zoom Zoom level.
    * @api stable
    */
   M.impl.View.prototype.getUserZoom = function (zoom) {
      return this.userZoom_;
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {ol.proj.Projection} projection to apply to the map
    * @api stable
    */
   M.impl.View.prototype.setProjection = function (projection) {
      this.projection_ = projection;
   };

   /**
    * This function provides the resolutions of the specified view
    *
    * @public
    * @function
    * @returns {Array<Number>} the resolutions
    * @api stable
    */
   M.impl.View.prototype.getResolutions = function () {
      return this.get('resolutions');
   };

   /**
    * This function adds sets resolutions of the specified map
    *
    * @public
    * @function
    * @param {Array<Number>} resolutions to apply to the map
    * @api stable
    */
   M.impl.View.prototype.setResolutions = function (resolutions) {
      this.set('resolutions', resolutions);
      this.maxResolution_ = resolutions[0];
      this.minResolution_ = resolutions[resolutions.length - 1];
      this.constraints_.resolution = ol.ResolutionConstraint.createSnapToResolutions(resolutions);

      // updates zoom
      this.setZoom(this.userZoom_);

      // updates center
      this.setCenter(this.getCenter());
   };
})();