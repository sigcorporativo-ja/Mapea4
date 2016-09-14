goog.provide('M.impl.layer.KML');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.loader.KML');
goog.require('M.impl.Popup');
goog.require('M.impl.format.KML');

goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');

goog.require('goog.style');

(function() {
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
   M.impl.layer.KML = (function(options) {
      /**
       * Popup showed
       * @private
       * @type {M.impl.Popup}
       */
      this.popup_ = null;

       /**
       * Tab popup
       * @private
       * @type {Object}
       */
      this.tabPopup_ = null;

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
   M.impl.layer.KML.prototype.setVisible = function(visibility) {
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
   M.impl.layer.KML.prototype.addTo = function(map) {
      this.map = map;

      var formater = new M.impl.format.KML();
      var loader = new M.impl.loader.KML(map, this.url, formater);
      var this_ = this;
      this.ol3Layer = new ol.layer.Vector({
         source: new ol.source.Vector({
            url: this.url,
            format: formater,
            loader: loader.getLoaderFn(function(features, screenOverlay) {
               this.addFeatures(features);
               if (!M.utils.isNullOrEmpty(screenOverlay)) {
                  var screenOverLayImg = M.impl.utils.addOverlayImage(screenOverlay, map);
                  this_.setScreenOverlayImg(screenOverLayImg);
               }
            })
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

      map.getImpl().on(M.evt.CHANGE, function() {
         this_.getOL3Layer().getSource().clear();
      }, this);
   };

   /**
    * This function checks if an object is equals
    * to this layer
    * @public
    * @function
    * @param {ol.Feature} feature
    * @api stable
    */
   M.impl.layer.KML.prototype.selectFeatures = function(features) {
      // TODO: manage multiples features
      var feature = features[0];

      if (this.extract === true) {
         var featureName = feature.get('name');
         var featureDesc = feature.get('description');
         var featureCoord = feature.getGeometry().getFirstCoordinate();

         var this_ = this;
         M.template.compile(M.layer.KML.POPUP_TEMPLATE, {
            'jsonp': true,
            'vars': {
               'name': featureName,
               'desc': featureDesc
            },
            'parseToHtml': false
         }).then(function(htmlAsText) {
            this_.popup_ = new M.Popup();
            this_.tabPopup_ = {
               'icon': 'g-cartografia-comentarios',
               'title': featureName,
               'content': htmlAsText
            };
            this_.popup_.addTab(this_.tabPopup_);
            this_.map.addPopup(this_.popup_, featureCoord);
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
   M.impl.layer.KML.prototype.unselectFeatures = function() {
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
   M.impl.layer.KML.prototype.setScreenOverlayImg = function(screenOverlayImg) {
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
   M.impl.layer.KML.prototype.destroy = function() {
      var olMap = this.map.getMapImpl();

      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
         olMap.removeLayer(this.ol3Layer);
         this.ol3Layer = null;
      }

      this.removePopup();

      this.options = null;
      this.map = null;
   };

   /**
    * This function destroys KML popup
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.KML.prototype.removePopup = function() {
      if (!M.utils.isNullOrEmpty(this.popup_)) {
         if (this.popup_.getTabs().length > 1) {
            this.popup_.removeTab(this.tabPopup_);
         }
         else {
            this.map.removePopup();
         }
      }
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.KML.prototype.equals = function(obj) {
      var equals = false;

      if (obj instanceof M.impl.layer.KML) {
         equals = (this.url === obj.url);
         equals = equals && (this.name === obj.name);
         equals = equals && (this.extract === obj.extract);
      }
      return equals;
   };
})();
