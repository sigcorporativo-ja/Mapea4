goog.provide('M.Layer');
goog.provide('M.layer');


goog.require('M.utils');
goog.require('M.exception');
goog.require('M.facade.Base');
goog.require('M.parameter.layer');

(function () {
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
   M.Layer = (function (userParameters, impl) {
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
      get: function () {
         return this.getImpl().url;
      },
      // defining new type is not allowed
      set: function (newUrl) {
         this.getImpl().url = newUrl;
      }
   });

   /**
    * 'name' the layer name
    */
   Object.defineProperty(M.Layer.prototype, "name", {
      get: function () {
         return this.getImpl().name;
      },
      // defining new type is not allowed
      set: function (newName) {
         this.getImpl().name = newName;
      }
   });

   /**
    * 'transparent' the layer transparence
    */
   Object.defineProperty(M.Layer.prototype, "transparent", {
      get: function () {
         return this.getImpl().transparent;
      },
      // defining new type is not allowed
      set: function (newTransparent) {
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
    * This function indicates if the layer is visible
    *
    * @function
    * @api stable
    * @export
    */
   M.Layer.prototype.isVisible = function () {
      // checks if the implementation can manage this method
      if (M.utils.isUndefined(this.getImpl().isVisible)) {
         M.exception('La implementación usada no posee el método isVisible');
      }

      return this.getImpl().isVisible();
   };

   /**
    * This function sets the visibility of this layer
    *
    * @function
    * @api stable
    * @export
    */
   M.Layer.prototype.setVisible = function (visibility) {
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
   M.Layer.prototype.inRange = function () {
      // checks if the implementation can manage this method
      if (M.utils.isUndefined(this.getImpl().inRange)) {
         M.exception('La implementación usada no posee el método inRange');
      }

      return this.getImpl().inRange();
   };

   /**
    * This function auto-generates a name for this layer
    * @private
    * @function
    * @export
    */
   M.Layer.prototype.generateName_ = (function () {
      this.name = M.utils.generateRandom('layer_', '_'.concat(this.type));
   });
})();