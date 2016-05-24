goog.provide('M.impl.layer.WFS');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.service.WFS');
goog.require('M.impl.format.GeoJSON');
goog.require('M.impl.loader.WFS');

goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WFS layer
    * with parameters specified by the user
    *
    * @constructor
    * @implements {M.impl.Layer}
    * @param {Mx.parameters.LayerOptions} options custom options for this layer
    * @api stable
    */
   M.impl.layer.WFS = (function(options) {

      /**
       *
       * @private
       * @type {Object}
       */
      this.describeFeatureType_ = null;

      /**
       *
       * @private
       * @type {M.impl.format.GeoJSON}
       */
      this.formater_ = null;

      /**
       *
       * @private
       * @type {function}
       */
      this.loader_ = null;

      /**
       *
       * @private
       * @type {M.iml.service.WFS}
       */
      this.service_ = null;

      // calls the super constructor
      goog.base(this, options);
   });
   goog.inherits(M.impl.layer.WFS, M.impl.Layer);

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.Map} map
    * @api stable
    */
   M.impl.layer.WFS.prototype.addTo = function(map) {
      this.map = map;

      this.service_ = new M.impl.service.WFS({
         'url': this.url,
         'namespace': this.namespace,
         'name': this.name,
         'version': this.version,
         'ids': this.ids
      });

      this.describeFeatureType_ = this.service_.getDescribeFeatureType();

      var this_ = this;
      this.describeFeatureType_.then(function(describeFeatureType) {
         this_.formater_ = new M.impl.format.GeoJSON({
            'geometryName': describeFeatureType.geometryName,
            'defaultDataProjection': ol.proj.get(this_.map.getProjection().code)
         });
         this_.loader_ = new M.impl.loader.WFS(map, this_.service_, this_.formater_);
         this_.ol3Layer = new ol.layer.Vector({
            style: M.impl.layer.WFS.STYLE
         });
         this_.updateSource_();
         // sets its z-index
         if (this_.zIndex_ !== null) {
            this_.setZIndex(this_.zIndex_);
         }
         var olMap = this_.map.getMapImpl();
         olMap.addLayer(this_.ol3Layer);
      });
   };

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.Map} map
    * @api stable
    */
   M.impl.layer.WFS.prototype.refresh = function() {
      this.updateSource_();
   };

   /**
    * This function sets the map object of the layer
    *
    * @private
    * @function
    */
   M.impl.layer.WFS.prototype.updateSource_ = function() {
      var this_ = this;
      this.ol3Layer.setSource(new ol.source.Vector({
         format: this.formater_,
         loader: this.loader_.getLoaderFn(function(features) {
            this.addFeatures(features);
            this_.fire(M.evt.LOAD, features);
         }),
         strategy: ol.loadingstrategy.all
      }));
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WFS.prototype.getDescribeFeatureType = function() {
      return this.describeFeatureType_;
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WFS.prototype.getDefaultValue = function(type) {
      var defaultValue;
      if (type == "dateTime") {
         defaultValue = '0000-00-00T00:00:00';
      }
      else if (type == "date") {
         defaultValue = '0000-00-00';
      }
      else if (type == "time") {
         defaultValue = '00:00:00';
      }
      else if (type == "duration") {
         defaultValue = 'P0Y';
      }
      else if (type == "int" || type == "number" || type == "float" || type == "double" || type == "decimal" || type == "short" || type == "byte" || type == "integer" || type == "long" || type == "negativeInteger" || type == "nonNegativeInteger" || type == "nonPositiveInteger" || type == "positiveInteger" || type == "unsignedLong" || type == "unsignedInt" || type == "unsignedShort" || type == "unsignedByte") {
         defaultValue = 0;
      }
      else {
         defaultValue = "-";
      }
      return defaultValue;
   };

   /**
    * This function destroys this layer, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WFS.prototype.destroy = function() {
      var olMap = this.map.getMapImpl();
      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
         olMap.removeLayer(this.ol3Layer);
         this.ol3Layer = null;
      }
      this.map = null;
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.WFS.prototype.equals = function(obj) {
      var equals = false;

      if (obj instanceof M.layer.WFS) {
         equals = (this.url === obj.url);
         equals = equals && (this.namespace === obj.namespace);
         equals = equals && (this.name === obj.name);
         equals = equals && (this.ids === obj.ids);
         equals = equals && (this.cql === obj.cql);
         equals = equals && (this.version === obj.version);
      }

      return equals;
   };

   /**
    * Style for this layer
    * @const
    * @type {ol.style.Style}
    * @public
    * @api stable
    */
   M.impl.layer.WFS.STYLE = new ol.style.Style({
      fill: new ol.style.Fill({
         color: 'rgba(103, 175, 19, 0.2)'
      }),
      stroke: new ol.style.Stroke({
         color: '#67af13',
         width: 2
      }),
      image: new ol.style.Circle({
         radius: 7,
         fill: new ol.style.Fill({
            color: '#67af13'
         })
      })
   });
})();