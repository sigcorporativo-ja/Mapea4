goog.provide('M.layer.WMTS');

goog.require('M.Layer');
goog.require('M.utils');
goog.require('M.exception');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMTS layer
    * with parameters specified by the user
    *
    * @constructor
    * @extends {M.Layer}
    * @param {string|Mx.parameters.WMTS} userParameters parameters
    * @param {Mx.parameters.LayerOptions} options provided by the user
    * @api stable
    */
   M.layer.WMTS = (function (userParameters, options) {
      // checks if the implementation can create WMTS layers
      if (M.utils.isUndefined(M.impl.layer.WMTS)) {
         M.exception('La implementación usada no puede crear capas WMTS');
      }

      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(userParameters)) {
         M.exception('No ha especificado ningún parámetro');
      }

      options = (options || {});

      /**
       * Implementation of this layer
       * @public
       * @type {M.layer.WMTS}
       */
      var impl = new M.impl.layer.WMTS(options);

      var parameters = M.parameter.layer(userParameters, M.layer.type.WMTS);

      // calls the super constructor
      goog.base(this, parameters, impl);

      // matrixSet
      this.matrixSet = parameters.matrixSet;

      // legend
      this.legend = parameters.legend;

      // options
      this.options = options;
   });
   goog.inherits(M.layer.WMTS, M.Layer);

   /**
    * 'type' This property indicates if
    * the layer was selected
    */
   Object.defineProperty(M.layer.WMTS.prototype, "type", {
      get: function () {
         return M.layer.type.WMTS;
      },
      // defining new type is not allowed
      set: function (newType) {
         if (!M.utils.isUndefined(newType) &&
            !M.utils.isNullOrEmpty(newType) && (newType !== M.layer.type.WMTS)) {
            M.exception('El tipo de capa debe ser \''.concat(M.layer.type.WMTS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
         }
      }
   });

   /**
    * 'matrixSet' the layer matrix set
    */
   Object.defineProperty(M.layer.WMTS.prototype, "matrixSet", {
      get: function () {
         return this.getImpl().matrixSet;
      },
      // defining new type is not allowed
      set: function (newMatrixSet) {
         this.getImpl().matrixSet = newMatrixSet;
      }
   });

   /**
    * 'legend' the layer name
    */
   Object.defineProperty(M.layer.WMTS.prototype, "legend", {
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
    * 'options' the layer options
    */
   Object.defineProperty(M.layer.WMTS.prototype, "options", {
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
   M.layer.WMTS.prototype.equals = function (obj) {
      var equals = false;

      if (obj instanceof M.layer.WMS) {
         equals = (this.url === obj.url);
         equals = equals && (this.name === obj.name);
         equals = equals && (this.matrixSet === obj.matrixSet);
      }

      return equals;
   };
})();