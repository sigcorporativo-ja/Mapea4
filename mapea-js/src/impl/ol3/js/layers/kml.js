goog.provide('M.impl.layer.KML');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.FeatureLoaderJsonp');
goog.require('M.impl.Popup');
goog.require('M.impl.format.KML');

goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');

goog.require('goog.style');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a KML layer
    * with parameters specified by the user
    *
    * @constructor
    * @implements {M.impl.Layer}
    * @param {Mx.parameters.LayerOptions} options custom options for this layer
    * @api stable
    */
   M.impl.layer.KML = (function (options) {
      /**
       * Popup showed
       * @private
       * @type {M.impl.Popup}
       */
      this.popup_ = null;

      /**
       * Image tag for the screenOverlay
       * @private
       * @type {HTMLElement}
       */
      this.screenOverlayImg_ = null;

      // calls the super constructor
      goog.base(this, options);
   });
   goog.inherits(M.impl.layer.KML, M.impl.Layer);


   /**
    * This function sets the visibility of this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.KML.prototype.setVisible = function (visibility) {
      this.visibility = visibility;

      // layer
      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
         this.ol3Layer.setVisible(visibility);
      }

      // screen overlay
      if (!M.utils.isNullOrEmpty(this.screenOverlayImg_)) {
         var display = 'none';
         if (visibility === true) {
            display = 'inherit';
         }
         goog.style.setStyle(this.screenOverlayImg_, 'display', display);
      }
   };

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.impl.Map} map
    * @api stable
    */
   M.impl.layer.KML.prototype.addTo = function (map) {
      this.map = map;

      var formater = new M.impl.format.KML();
      var loader = ol.featureloader.jsonp(this.url, formater, map, this);
      this.ol3Layer = new ol.layer.Vector({
         source: new ol.source.Vector({
            url: this.url,
            format: formater,
            loader: loader
         })
      });
      // sets its visibility if it is in range
      if (this.options.visibility !== false) {
         this.setVisible(this.inRange());
      }
      // sets its z-index
      if (this.zIndex_ !== null) {
         this.setZIndex(this.zIndex_);
      }
      var olMap = this.map.getMapImpl();
      olMap.addLayer(this.ol3Layer);
   };

   /**
    * This function checks if an object is equals
    * to this layer
    * @public
    * @function
    * @param {ol.Feature} feature
    * @api stable
    */
   M.impl.layer.KML.prototype.selectFeatures = function (features) {
      // TODO: manage multiples features
      var feature = features[0];

      if (this.extract === true) {
         var popupVars = {
            'name': feature.get('name'),
            'desc': feature.get('description')
         };
         var this_ = this;
         M.template.compile(M.layer.KML.POPUP_TEMPLATE, popupVars).then(function (html) {
            this_.popup_ = new M.impl.Popup(html);
            this_.map.getImpl().addPopup(this_.popup_);
            var coord = feature.getGeometry().getFirstCoordinate();
            this_.popup_.show(coord, html);
         });
      }
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @public
    * @function
    * @param {ol.Feature} feature
    * @api stable
    */
   M.impl.layer.KML.prototype.unselectFeatures = function () {
      if (!M.utils.isNullOrEmpty(this.popup_)) {
         this.popup_.hide();
         this.popup_ = null;
      }
   };

   /**
    * Sets the screen overlay image for this KML
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.KML.prototype.setScreenOverlayImg = function (screenOverlayImg) {
      this.screenOverlayImg_ = screenOverlayImg;
   };

   /**
    * This function destroys this layer, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.KML.prototype.destroy = function () {
      var olMap = this.map.getMapImpl();

      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
         olMap.removeLayer(this.ol3Layer);
         this.ol3Layer = null;
      }
      this.options = null;
      this.map = null;
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.KML.prototype.equals = function (obj) {
      var equals = false;

      if (obj instanceof M.impl.layer.KML) {
         equals = (this.url === obj.url);
         equals = equals && (this.name === obj.name);
         equals = equals && (this.extract === obj.extract);
      }
      return equals;
   };
})();