goog.provide('M.layer.OSM');

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
   M.layer.OSM = (function (options) {
      // checks if the implementation can create OSM
      if (M.utils.isUndefined(M.impl.layer.OSM)) {
         M.exception('La implementación usada no puede crear capas OSM');
      }

      options = (options || {});

      /**
       * Implementation of this layer
       * @public
       * @type {M.layer.WMS}
       */
      var impl = new M.impl.layer.OSM(options);

      // calls the super constructor
      goog.base(this, this, impl);

      // options
      this.options = options;

      // options
      this.legend = 'OpenStreetMap';
   });
   goog.inherits(M.layer.OSM, M.Layer);

   /**
    * 'type' This property indicates if
    * the layer was selected
    */
   Object.defineProperty(M.layer.OSM.prototype, "type", {
      get: function () {
         return M.layer.type.OSM;
      },
      // defining new type is not allowed
      set: function (newType) {
         if (!M.utils.isUndefined(newType) &&
            !M.utils.isNullOrEmpty(newType) && (newType !== M.layer.type.OSM)) {
            M.exception('El tipo de capa debe ser \''.concat(M.layer.type.OSM).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
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
   M.layer.OSM.prototype.equals = function (obj) {
      var equals = false;

      if (obj instanceof M.layer.OSM) {
         equals = (this.url === obj.url);
         equals = equals && (this.name === obj.name);
         equals = equals && (this.options === obj.options);
      }
      return equals;
   };
})();