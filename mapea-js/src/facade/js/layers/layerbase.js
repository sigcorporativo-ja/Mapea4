goog.provide('M.Layer');
goog.provide('M.layer');


goog.require('M.utils');
goog.require('M.exception');
goog.require('M.facade.Base');
goog.require('M.parameter.layer');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a layer
    * with parameters specified by the user
    *
    * @constructor
    * @extends {M.facade.Base}
    * @param {string|Mx.parameters.Layer} userParameters parameters
    * provided by the user
    * @api stable
    */
   M.Layer = (function(userParameters, impl) {
      // calls the super constructor
      goog.base(this, impl);

      var parameter = M.parameter.layer(userParameters);

      /**
       * @private
       * @type {string}
       * @expose
       */
      this.type = parameter.type;

      /**
       * @private
       * @type {string}
       * @expose
       */
      this.url = parameter.url;

      /**
       * @private
       * @type {string}
       * @expose
       */
      this.name = parameter.name;

      /**
       * @private
       * @type {string}
       * @expose
       */
      this.transparent = parameter.transparent;
   });
   goog.inherits(M.Layer, M.facade.Base);

   /**
    * 'url' The service URL of the
    * layer
    */
   Object.defineProperty(M.Layer.prototype, "url", {
      get: function() {
         return this.getImpl().url;
      },
      // defining new type is not allowed
      set: function(newUrl) {
         this.getImpl().url = newUrl;
      }
   });

   /**
    * 'name' the layer name
    */
   Object.defineProperty(M.Layer.prototype, "name", {
      get: function() {
         return this.getImpl().name;
      },
      // defining new type is not allowed
      set: function(newName) {
         this.getImpl().name = newName;
      }
   });

   /**
    * 'transparent' the layer transparence
    */
   Object.defineProperty(M.Layer.prototype, "transparent", {
      get: function() {
         return this.getImpl().transparent;
      },
      // defining new type is not allowed
      set: function(newTransparent) {
         if (!M.utils.isNullOrEmpty(newTransparent)) {
            if (M.utils.isString(newTransparent)) {
               this.getImpl().transparent = (M.utils.normalize(newTransparent) === 'true');
            }
            else {
               this.getImpl().transparent = newTransparent;
            }
         }
         else {
            this.getImpl().transparent = true;
         }
      }
   });

   /**
    * 'displayInLayerSwitcher' the layer transparence
    */
   Object.defineProperty(M.Layer.prototype, "displayInLayerSwitcher", {
      get: function() {
         return this.getImpl().displayInLayerSwitcher;
      },
      // defining new type is not allowed
      set: function(newDisplayInLayerSwitcher) {
         if (!M.utils.isNullOrEmpty(newDisplayInLayerSwitcher)) {
            if (M.utils.isString(newDisplayInLayerSwitcher)) {
               this.getImpl().displayInLayerSwitcher = (M.utils.normalize(newDisplayInLayerSwitcher) === 'true');
            }
            else {
               this.getImpl().displayInLayerSwitcher = newDisplayInLayerSwitcher;
            }
         }
         else {
            this.getImpl().displayInLayerSwitcher = true;
         }
      }
   });

   /**
    * This function indicates if the layer is visible
    *
    * @function
    * @api stable
    * @export
    */
   M.Layer.prototype.isVisible = function() {
      // checks if the implementation can manage this method
      if (M.utils.isUndefined(this.getImpl().isVisible)) {
         M.exception('La implementación usada no posee el método isVisible');
      }

      return this.getImpl().isVisible();
   };

   /**
    * This function indicates if the layer is visible
    *
    * @function
    * @api stable
    * @export
    */
   M.Layer.prototype.isQueryable = function() {
      // checks if the implementation can manage this method
      if (M.utils.isUndefined(this.getImpl().isQueryable)) {
         M.exception('La implementación usada no posee el método isQueryable');
      }

      return this.getImpl().isQueryable();
   };

   /**
    * This function sets the visibility of this layer
    *
    * @function
    * @api stable
    * @export
    */
   M.Layer.prototype.setVisible = function(visibility) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(visibility)) {
         M.exception('No ha especificado ningún parámetro de visibilidad');
      }

      // checks if the param is boolean or string
      if (!M.utils.isString(visibility) && !M.utils.isBoolean(visibility)) {
         M.exception('No ha especificado ningún parámetro de visibilidad');
      }

      // checks if the implementation can manage this method
      if (M.utils.isUndefined(this.getImpl().setVisible)) {
         M.exception('La implementación usada no posee el método setVisible');
      }

      visibility = /^true$/i.test(visibility);

      this.getImpl().setVisible(visibility);
   };

   /**
    * This function indicates if the layer is in range
    *
    * @function
    * @api stable
    * @export
    */
   M.Layer.prototype.inRange = function() {
      // checks if the implementation can manage this method
      if (M.utils.isUndefined(this.getImpl().inRange)) {
         M.exception('La implementación usada no posee el método inRange');
      }

      return this.getImpl().inRange();
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.Layer.prototype.getLegendURL = function() {
      return this.getImpl().getLegendURL();
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.Layer.prototype.setLegendURL = function(legendUrl) {
      this.getImpl().setLegendURL(legendUrl);
   };

   /**
    * This function gets the z-index of this layer
    *
    * @function
    * @api stable
    */
   M.Layer.prototype.getZIndex = function() {
      return this.getImpl().getZIndex();
   };

   /**
    * This function sets the z-index for this layer
    *
    * @function
    * @api stable
    */
   M.Layer.prototype.setZIndex = function(zIndex) {
      this.getImpl().setZIndex(zIndex);
   };

   /**
    * This function gets the opacity of this layer
    *
    * @function
    * @api stable
    */
   M.Layer.prototype.getOpacity = function() {
      return this.getImpl().getOpacity();
   };

   /**
    * This function sets the opacity of this layer
    *
    * @function
    * @api stable
    */
   M.Layer.prototype.setOpacity = function(opacity) {
      this.getImpl().setOpacity(opacity);
   };

   /**
    * This function auto-generates a name for this layer
    * @private
    * @function
    * @export
    */
   M.Layer.prototype.generateName_ = (function() {
      this.name = M.utils.generateRandom('layer_', '_'.concat(this.type));
   });

   /**
    * Image PNG for legend default
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.Layer.LEGEND_DEFAULT = '/img/legend-default.png';

   /**
    * Image PNG for legend default
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.Layer.LEGEND_ERROR = '/img/legend-error.png';
})();