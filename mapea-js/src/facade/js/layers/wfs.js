goog.provide('M.layer.WFS');

goog.require('M.Layer');
goog.require('M.utils');
goog.require('M.exception');
goog.require('M.geom');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WFS layer
    * with parameters specified by the user
    *
    * @constructor
    * @extends {M.Layer}
    * @param {string|Mx.parameters.WFS} userParameters parameters
    * @param {Mx.parameters.LayerOptions} options provided by the user
    * @api stable
    */
   M.layer.WFS = (function(userParameters, options) {
      // checks if the implementation can create WFS layers
      if (M.utils.isUndefined(M.impl.layer.WFS)) {
         M.exception('La implementación usada no puede crear capas WFS');
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
      var impl = new M.impl.layer.WFS(options);

      var parameters = M.parameter.layer(userParameters, M.layer.type.WFS);

      // calls the super constructor
      goog.base(this, parameters, impl);

      // namespace
      this.namespace = parameters.namespace;

      // legend
      this.legend = parameters.legend;

      // cql
      this.cql = parameters.cql;

      // geometry
      this.geometry = parameters.geometry;

      // ids
      this.ids = parameters.ids;

      // version
      this.version = parameters.version;

      // options
      this.options = options;
   });
   goog.inherits(M.layer.WFS, M.Layer);

   /**
    * 'type' This property indicates if
    * the layer was selected
    */
   Object.defineProperty(M.layer.WFS.prototype, "type", {
      get: function() {
         return M.layer.type.WFS;
      },
      // defining new type is not allowed
      set: function(newType) {
         if (!M.utils.isUndefined(newType) &&
            !M.utils.isNullOrEmpty(newType) && (newType !== M.layer.type.WFS)) {
            M.exception('El tipo de capa debe ser \''.concat(M.layer.type.WFS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
         }
      }
   });

   /**
    * 'namespace' the layer name
    */
   Object.defineProperty(M.layer.WFS.prototype, "namespace", {
      get: function() {
         return this.getImpl().namespace;
      },
      // defining new type is not allowed
      set: function(newNamespace) {
         this.getImpl().namespace = newNamespace;
      }
   });

   /**
    * 'legend' the layer name
    */
   Object.defineProperty(M.layer.WFS.prototype, "legend", {
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
    * 'cql' the layer name
    */
   Object.defineProperty(M.layer.WFS.prototype, "cql", {
      get: function() {
         return this.getImpl().cql;
      },
      // defining new type is not allowed
      set: function(newCQL) {
         this.getImpl().cql = newCQL;
      }
   });

   /**
    * 'geometry' the layer name
    */
   Object.defineProperty(M.layer.WFS.prototype, "geometry", {
      get: function() {
         return this.getImpl().geometry;
      },
      // defining new type is not allowed
      set: function(newGeometry) {
         if (!M.utils.isNullOrEmpty(newGeometry)) {
            var parsedGeom = M.geom.parse(newGeometry);
            if (M.utils.isNullOrEmpty(parsedGeom)) {
               M.exception('El tipo de capa WFS <b>' + newGeometry + '</b> no se reconoce. Los tipos disponibles son: POINT, LINE, POLYGON, MPOINT, MLINE, MPOLYGON');
            }
            this.getImpl().geometry = parsedGeom;
         }
      }
   });

   /**
    * 'ids' the layer name
    */
   Object.defineProperty(M.layer.WFS.prototype, "ids", {
      get: function() {
         return this.getImpl().ids;
      },
      // defining new type is not allowed
      set: function(newIds) {
         if (M.utils.isNullOrEmpty(newIds)) {
            this.getImpl().ids = this.ids;
         }
         else {
            this.getImpl().ids = newIds;
         }
      }
   });

   /**
    * 'version' the layer name
    */
   Object.defineProperty(M.layer.WFS.prototype, "version", {
      get: function() {
         return this.getImpl().version;
      },
      // defining new type is not allowed
      set: function(newVersion) {
         if (!M.utils.isNullOrEmpty(newVersion)) {
            this.getImpl().version = newVersion;
         }
         else {
            this.getImpl().version = '1.0.0'; // default value
         }

      }
   });

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.layer.WFS.prototype.equals = function(obj) {
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
})();