goog.provide('M.impl.Layer');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a layer
    * with parameters specified by the user
    *
    * @interface
    * @extends {M.facade.Base}
    * @param {string | Mx.parameters.Layer} userParameters parameters
    * provided by the user
    * @api stable
    */
   M.impl.Layer = (function(options) {
      /**
       * The map instance
       * @private
       * @type {M.Map}
       * @expose
       */
      this.map = null;

      /**
       * The ol3 layer instance
       * @private
       * @type {L.Layer}
       * @expose
       */
      this.leafletLayer = null;

      /**
       * Custom options for this layer
       * @private
       * @type {Mx.parameters.LayerOptions}
       * @expose
       */
      this.options = (options || {});

      /**
       * Indicates the visibility of the layer
       * @private
       * @type {Boolean}
       * @expose
       */
      this.visibility = (this.options.visibility !== false);

      /**
       * Indicates if the layer is displayed in
       * layerswitcher control
       * @private
       * @type {Boolean}
       * @expose
       */
      this.displayInLayerSwitcher = (this.options.displayInLayerSwitcher !== false);

      /**
       * Layer opacity
       * @private
       * @type {Number}
       * @expose
       */
      this.opacity_ = (this.options.opacity || 1);

      // calls the super constructor
      goog.base(this);
   });
   goog.inherits(M.impl.Layer, M.Object);

   /**
    * This function indicates if the layer is visible
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.isVisible = function() {
      return this.map.getMapImpl().hasLayer(this.leafletLayer);
   };

   /**
    * This function indicates if the layer is queryable
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.isQueryable = function() {
      return false;
   };

   /**
    * This function indicates if the layer is in range
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.inRange = function() {
      // TODO
      return true;
   };

   /**
    * This function sets the visibility of this layer
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.setVisible = function(visibility) {
      if (!M.utils.isNullOrEmpty(this.leafletLayer)) {
         var lMap = this.map.getMapImpl();
         if ((visibility === true) && !lMap.hasLayer(this.leafletLayer)) {
            lMap.addLayer(this.leafletLayer);
         }
         else if ((visibility !== true) && lMap.hasLayer(this.leafletLayer)) {
            lMap.removeLayer(this.leafletLayer);
         }
      }
   };

   /**
    * This function sets the visibility of this layer
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.getZIndex = function() {
      if (!M.utils.isNullOrEmpty(this.leafletLayer)) {
         this.zIndex_ = this.leafletLayer.zIndex;
      }
      return this.zIndex_;
   };

   /**
    * This function sets the visibility of this layer
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.setZIndex = function(zIndex) {
      this.zIndex_ = zIndex;
      if (!M.utils.isNullOrEmpty(this.leafletLayer)) {
         this.leafletLayer.setZIndex(this.zIndex_);
      }
   };

   /**
    * This function sets the visibility of this layer
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.getOpacity = function() {
      if (!M.utils.isNullOrEmpty(this.leafletLayer)) {
         this.opacity_ = this.leafletLayer.opacity;
      }
      return this.opacity_;
   };

   /**
    * This function sets the visibility of this layer
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.setOpacity = function(opacity) {
      this.opacity_ = opacity;
      if (!M.utils.isNullOrEmpty(this.leafletLayer)) {
         this.leafletLayer.setOpacity(opacity);
      }
   };

   /**
    * This function gets the created OL layer
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.getLegendURL = function() {
      return M.utils.concatUrlPaths([M.config.THEME_URL, M.Layer.LEGEND_DEFAULT]);
   };

   /**
    * This function gets the created OL layer
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.setLegendURL = function(legendUrl) {};

   /**
    * This function gets the max resolution for
    * this WMS
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.Layer.prototype.getNumZoomLevels = function() {
      return 16; // 16 zoom levels by default
   };

   /**
    * This function exectues an unselect feature
    *
    * @public
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.unselectFeatures = function(features, coord) {};

   /**
    * This function exectues a select feature
    *
    * @function
    * @api stable
    * @expose
    */
   M.impl.Layer.prototype.selectFeatures = function(features, coord) {};
})();