goog.provide('M.layer.WMS');

goog.require('M.Layer');
goog.require('M.utils');
goog.require('M.exception');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMS layer
    * with parameters specified by the user
    *
    * @constructor
    * @extends {M.Layer}
    * @param {string|Mx.parameters.WMS} userParameters parameters
    * @param {Mx.parameters.LayerOptions} options provided by the user
    * @api stable
    */
   M.layer.WMS = (function (userParameters, options) {
      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(M.impl.layer.WMS)) {
         M.exception('La implementación usada no puede crear capas WMS');
      }

      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(userParameters)) {
         M.exception('No ha especificado ningún parámetro');
      }

      options = (options || {});

      /**
       * Implementation of this layer
       * @public
       * @type {M.layer.WMS}
       */
      var impl = new M.impl.layer.WMS(options);

      var parameters = M.parameter.layer(userParameters, M.layer.type.WMS);

      // calls the super constructor
      goog.base(this, parameters, impl);

      // legend
      this.legend = parameters.legend;

      // tiled
      this.tiled = parameters.tiled;

      // cql
      this.cql = parameters.cql;

      // version
      this.version = parameters.version;

      // options
      this.options = options;
   });
   goog.inherits(M.layer.WMS, M.Layer);

   /**
    * 'type' This property indicates if
    * the layer was selected
    */
   Object.defineProperty(M.Layer.prototype, "type", {
      get: function () {
         return M.layer.type.WMS;
      },
      // defining new type is not allowed
      set: function (newType) {
         if (!M.utils.isUndefined(newType) &&
            !M.utils.isNullOrEmpty(newType) && (newType !== M.layer.type.WMS)) {
            M.exception('El tipo de capa debe ser \''.concat(M.layer.type.WMS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
         }
      }
   });

   /**
    * 'legend' the layer name
    */
   Object.defineProperty(M.layer.WMS.prototype, "legend", {
      get: function () {
         return this.getImpl().legend;
      },
      // defining new type is not allowed
      set: function (newLegend) {
         if (M.utils.isNullOrEmpty(newLegend)) {
            this.getImpl().legend = this.name;
         }
         else {
            this.getImpl().legend = newLegend;
         }
      }
   });

   /**
    * 'tiled' the layer name
    */
   Object.defineProperty(M.layer.WMS.prototype, "tiled", {
      get: function () {
         return this.getImpl().tiled;
      },
      set: function (newTiled) {
         if (!M.utils.isNullOrEmpty(newTiled)) {
            if (M.utils.isString(newTiled)) {
               this.getImpl().tiled = (M.utils.normalize(newTiled) === 'true');
            }
            else {
               this.getImpl().tiled = newTiled;
            }
         }
         else {
            this.getImpl().tiled = true;
         }
      }
   });

   /**
    * 'cql' the CQL filter
    */
   Object.defineProperty(M.layer.WMS.prototype, "cql", {
      get: function () {
         return this.getImpl().cql;
      },
      // defining new type is not allowed
      set: function (newCql) {
         this.getImpl().cql = newCql;
      }
   });

   /**
    * 'version' the service version
    * default value is 1.3.0
    */
   Object.defineProperty(M.layer.WMS.prototype, "version", {
      get: function () {
         return this.getImpl().version;
      },
      // defining new type is not allowed
      set: function (newVersion) {
         if (!M.utils.isNullOrEmpty(newVersion)) {
            this.getImpl().version = newVersion;
         }
         else {
            this.getImpl().version = '1.1.0'; // default value
         }

      }
   });

   /**
    * 'options' the layer options
    */
   Object.defineProperty(M.layer.WMS.prototype, "options", {
      get: function () {
         return this.getImpl().options;
      },
      // defining new type is not allowed
      set: function (newOptions) {
         this.getImpl().options = newOptions;
      }
   });


   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.layer.WMS.prototype.equals = function (obj) {
      var equals = false;

      if (obj instanceof M.layer.WMS) {
         equals = (this.url === obj.url);
         equals = equals && (this.name === obj.name);
         equals = equals && (this.cql === obj.cql);
         equals = equals && (this.version === obj.version);
      }

      return equals;
   };
})();