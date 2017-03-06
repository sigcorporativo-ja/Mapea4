goog.provide('M.layer.WMS');

goog.require('M.Layer');
goog.require('M.utils');
goog.require('M.exception');

(function() {
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
   M.layer.WMS = (function(userParameters, options, implParam) {
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
      var impl = implParam;
      if (M.utils.isNullOrEmpty(impl)) {
         impl = new M.impl.layer.WMS(options);
      }
      
      var parameters = M.parameter.layer(userParameters, M.layer.type.WMS);

      // calls the super constructor
      goog.base(this, parameters, impl);

      // legend
      this.legend = parameters.legend;

      // cql
      this.cql = parameters.cql;

      // version
      this.version = parameters.version;

      // tiled
      if (!M.utils.isNullOrEmpty(parameters.tiled)) {
         this.tiled = parameters.tiled;
      }

      // transparent
      this.transparent = parameters.transparent;

      // options
      this.options = options;
   });
   goog.inherits(M.layer.WMS, M.Layer);

   /**
    * 'url' The service URL of the
    * layer
    */
   Object.defineProperty(M.layer.WMS.prototype, "url", {
      get: function() {
         return this.getImpl().url;
      },
      // defining new type is not allowed
      set: function(newUrl) {
         this.getImpl().url = newUrl;
         this._updateNoCache();
      }
   });

   /**
    * 'name' the layer name
    */
   Object.defineProperty(M.layer.WMS.prototype, "name", {
      get: function() {
         return this.getImpl().name;
      },
      // defining new type is not allowed
      set: function(newName) {
         this.getImpl().name = newName;
         this._updateNoCache();
      }
   });

   /**
    * 'type' This property indicates if
    * the layer was selected
    */
   Object.defineProperty(M.layer.WMS.prototype, "type", {
      get: function() {
         return M.layer.type.WMS;
      },
      // defining new type is not allowed
      set: function(newType) {
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
      get: function() {
         return this.getImpl().legend;
      },
      // defining new type is not allowed
      set: function(newLegend) {
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
      get: function() {
         return this.getImpl().tiled;
      },
      set: function(newTiled) {
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
      get: function() {
         return this.getImpl().cql;
      },
      // defining new type is not allowed
      set: function(newCql) {
         this.getImpl().cql = newCql;
      }
   });

   /**
    * 'version' the service version
    * default value is 1.3.0
    */
   Object.defineProperty(M.layer.WMS.prototype, "version", {
      get: function() {
         return this.getImpl().version;
      },
      // defining new type is not allowed
      set: function(newVersion) {
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
      get: function() {
         return this.getImpl().options;
      },
      // defining new type is not allowed
      set: function(newOptions) {
         this.getImpl().options = newOptions;
      }
   });

   /**
    * TODO
    *
    * @function
    * @api stable
    */
   M.layer.WMS.prototype.getNoChacheUrl = function() {
      return this._noCacheUrl;
   };

   /**
    * TODO
    *
    * @function
    * @api stable
    */
   M.layer.WMS.prototype.getNoChacheName = function() {
      return this._noCacheName;
   };

   /**
    * Update minimum and maximum resolution WMS layers
    *
    * @public
    * @function
    * @param {ol.Projection} projection - Projection map
    * @api stable
    */
   M.layer.WMS.prototype.updateMinMaxResolution = function(projection) {
      return this.getImpl().updateMinMaxResolution(projection);
   };

   /**
    * TODO
    *
    * @private
    * @function
    */
   M.layer.WMS.prototype._updateNoCache = function() {
      var tiledIdx = M.config.tileMappgins.tiledNames.indexOf(this.name);
      if ((tiledIdx !== -1) && M.utils.sameUrl(M.config.tileMappgins.tiledUrls[tiledIdx], this.url)) {
         this._noCacheUrl = M.config.tileMappgins.urls[tiledIdx];
         this._noCacheName = M.config.tileMappgins.names[tiledIdx];
      }
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.layer.WMS.prototype.equals = function(obj) {
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
