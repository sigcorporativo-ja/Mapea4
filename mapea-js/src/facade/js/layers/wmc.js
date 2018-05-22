goog.provide('M.layer.WMC');

goog.require('M.Layer');
goog.require('M.utils');
goog.require('M.exception');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC layer
    * with parameters specified by the user
    *
    * @constructor
    * @extends {M.Layer}
    * @param {string|Mx.parameters.WMC} userParameters parameters
    * provided by the user
    * @param {Mx.parameters.LayerOptions} options custom options for this layer
    * @api stable
    */
   M.layer.WMC = (function (userParameters, options) {
      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(M.impl.layer.WMC)) {
         M.exception('La implementación usada no puede crear capas WMC');
      }

      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(userParameters)) {
         M.exception('No ha especificado ningún parámetro');
      }

      options = (options || {});

      var parameters = M.parameter.layer(userParameters, M.layer.type.WMC);

      /**
       * Implementation of this layer
       * @public
       * @type {M.layer.WMC}
       */
      var impl = new M.impl.layer.WMC(options);

      // calls the super constructor
      goog.base(this, parameters, impl);

      // options
      this.options = options;

      // checks if the name is auto-generated
      if (!M.utils.isNullOrEmpty(this.url) && M.utils.isNullOrEmpty(this.name)) {
         this.generateName_();
      }
      // checks if it is predefined context
      else if (M.utils.isNullOrEmpty(this.url) && !M.utils.isNullOrEmpty(this.name)) {
         var predefinedIdx = M.config.predefinedWMC.predefinedNames.indexOf(this.name);
         if (predefinedIdx === -1) {
            M.exception('El contexto predefinido \'' + this.name + '\' no existe');
         }
         else {
            this.url = M.config.predefinedWMC.urls[predefinedIdx];
            this.name = M.config.predefinedWMC.names[predefinedIdx];
         }
      }

      /**
       * 'loaded' This property indicates if the layers is loaded and all its layers.
       * @type {bool}
       * @private
       * @api stable
       */
      this.loaded_ = false;

      this.once(M.evt.LOAD, ()=> this.loaded_ = true);
   });
   goog.inherits(M.layer.WMC, M.Layer);

   /**
    * 'selected' This property indicates if
    * the layer was selected
    */
   Object.defineProperty(M.layer.WMC.prototype, "selected", {
      get: function () {
         return this.getImpl().selected;
      },
      set: function (newSelectedValue) {
         this.getImpl().selected = newSelectedValue;
      }
   });

   /**
    * 'type' This property indicates if
    * the layer was selected
    */
   Object.defineProperty(M.layer.WMC.prototype, "type", {
      get: function () {
         return M.layer.type.WMC;
      },
      // defining new type is not allowed
      set: function (newType) {
         if (!M.utils.isUndefined(newType) &&
            !M.utils.isNullOrEmpty(newType) && (newType !== M.layer.type.WMC)) {
            M.exception('El tipo de capa debe ser \''.concat(M.layer.type.WMC).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
         }
      }
   });

   /**
    * The layers provided by the WMC file
    */
   Object.defineProperty(M.layer.WMC.prototype, "layers", {
      get: function () {
         return this.getImpl().layers;
      },
      set: function (newLayers) {
         this.getImpl().layers = newLayers;
      }
   });

   /**
    * Projection provided by the WMC file
    */
   Object.defineProperty(M.layer.WMC.prototype, "projection", {
      get: function () {
         return this.getImpl().projection;
      },
      // defining new type is not allowed
      set: function (newProjection) {
         this.getImpl().projection = newProjection;
      }
   });

   /**
    * Max extent provided by the WMC file
    */
   Object.defineProperty(M.layer.WMC.prototype, "maxExtent", {
      get: function () {
         return this.getImpl().maxExtent;
      },
      // defining new type is not allowed
      set: function (newMaxExtent) {
         this.getImpl().maxExtent = newMaxExtent;
      }
   });

   /**
    * 'options' resolutions specified by the user
    */
   Object.defineProperty(M.layer.WMC.prototype, "options", {
      get: function () {
         return this.getImpl().options;
      },
      // defining new type is not allowed
      set: function (newOptions) {
         this.getImpl().options = newOptions;
      }
   });

   /**
    * This function select this WMC layer and
    * triggers the event to draw it
    *
    * @function
    * @api stable
    */
   M.layer.WMC.prototype.select = function () {
      // checks if the implementation can manage select method
      if (M.utils.isUndefined(this.getImpl().select)) {
         M.exception('La implementación usada no posee el método select');
      }

      this.getImpl().select();
   };

   /**
    * This function unselect this WMC layer and
    * removes all its layers
    *
    * @function
    * @api stable
    */
   M.layer.WMC.prototype.unselect = function () {
      // checks if the implementation can manage select method
      if (M.utils.isUndefined(this.getImpl().unselect)) {
         M.exception('La implementación usada no posee el método unselect');
      }

      this.getImpl().unselect();
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.layer.WMC.prototype.equals = function (obj) {
      var equals = false;

      if (obj instanceof M.layer.WMC) {
         equals = (this.url === obj.url);
         equals = equals && (this.name === obj.name);
      }

      return equals;
   };

   /**
    * This function returns if the layer is loaded
    *
    * @function
    * @api stable
    */
   M.layer.WMC.prototype.isLoaded = function () {
      return this.loaded_;
   };

   /**
    * This function returns if the layer is loaded
    *
    * @function
    * @api stable
    */
   M.layer.WMC.prototype.setLoaded = function (loaded) {
      this.loaded_ = loaded;
   };
})();
