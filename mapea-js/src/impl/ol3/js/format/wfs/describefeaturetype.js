goog.provide('M.impl.format.DescribeFeatureType');

goog.require('M.utils');
goog.require('M.exception');


(function () {
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
   M.impl.format.DescribeFeatureType = (function (typeName) {
      /**
       * TOOD
       * @private
       * @type {String}
       */
      this.typeName_ = typeName;
   });

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.Map} map
    * @api stable
    */
   M.impl.format.DescribeFeatureType.prototype.read = function (response) {
      var geometryName;
      var featureNS;
      var featurePrefix;
      var properties;

      var jsonResponse = JSON.parse(response.text);

      featureNS = jsonResponse.targetNamespace;
      featurePrefix = jsonResponse.targetPrefix;

      jsonResponse.featureTypes.some(function (featureType) {
         if (featureType.typeName === this.typeName_) {
            properties = featureType.properties;
            properties.some(function (prop) {
               if (prop.localType === 'Geometry') {
                  geometryName = prop.name;
                  return true;
               }
            });
            return true;
         }
      }, this);
      return {
         'geometryName': geometryName,
         'featureNS': featureNS,
         'featurePrefix': featurePrefix,
         'properties': properties
      };
   };
})();