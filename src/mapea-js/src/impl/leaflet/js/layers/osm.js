goog.provide('M.impl.layer.OSM');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMS layer
    * with parameters specified by the user
    *
    * @constructor
    * @implements {M.impl.Layer}
    * @param {Mx.parameters.LayerOptions} options custom options for this layer
    * @api stable
    */
   M.impl.layer.OSM = (function(options) {
      // sets visibility
      if (options.visibility === false) {
         this.visibility = false;
      }

      // calls the super constructor
      goog.base(this, options);
   });
   goog.inherits(M.impl.layer.OSM, M.impl.Layer);

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.impl.Map} map
    * @api stable
    */
   M.impl.layer.OSM.prototype.addTo = function(map) {
      this.map = map;

      // this.leafletLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //    minZoom: 8,
      //    maxZoom: 12,
      //    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      // });
      // this.map.getMapImpl().addLayer(this.leafletLayer);

      this.leafletLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
         maxZoom: 18,
         attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
         id: 'mapbox.streets'
      });
      this.leafletLayer.addTo(this.map.getMapImpl());

      // sets its visibility if it is in range
      if (this.options.visibility !== false) {
         this.setVisible(this.inRange());
      }
      if (this.zIndex_ !== null) {
         this.setZIndex(this.zIndex_);
      }
   };

   /**
    * This function sets the resolutions for this layer
    *
    * @public
    * @function
    * @param {Array<Number>} resolutions
    * @api stable
    */
   M.impl.layer.OSM.prototype.setResolutions = function(resolutions) {
      // TODO
   };

   /**
    * This function gets the envolved extent for
    * this WMS
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.OSM.prototype.getExtent = function() {
      // TODO
   };

   /**
    * This function destroys this layer, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.OSM.prototype.destroy = function() {
      // TODO
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.OSM.prototype.equals = function(obj) {
      var equals = false;

      if (obj instanceof M.impl.layer.OSM) {
         equals = (this.url === obj.url);
         equals = equals && (this.name === obj.name);
      }

      return equals;
   };
})();