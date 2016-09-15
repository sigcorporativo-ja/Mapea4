goog.provide('M.impl.service.WFS');

goog.require('M.impl.format.DescribeFeatureType');
goog.require('M.utils');
goog.require('M.exception');


(function() {
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
   M.impl.service.WFS = (function(layerParameters) {

      /**
       *
       * @private
       * @type {String}
       */
      this.url_ = layerParameters.url;

      /**
       *
       * @private
       * @type {String}
       */
      this.namespace_ = layerParameters.namespace;

      /**
       *
       * @private
       * @type {String}
       */
      this.name_ = layerParameters.name;

      /**
       *
       * @private
       * @type {String}
       */
      this.typeName_ = this.name_;
      if (!M.utils.isNullOrEmpty(this.namespace_)) {
         this.typeName_ = this.namespace_.concat(':').concat(this.name_);
      }

      /**
       *
       * @private
       * @type {String}
       */
      this.version_ = layerParameters.version;

      /**
       *
       * @private
       * @type {String}
       */
      this.ids_ = layerParameters.ids;

      /**
       *
       * @private
       * @type {String}
       */
      this.cql_ = layerParameters.cql;
   });

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.Map} map
    * @api stable
    */
   M.impl.service.WFS.prototype.getDescribeFeatureType = function() {
      // TODO
      var describeFeatureParams = {
         'service': 'WFS',
         'version': this.version_,
         'request': 'DescribeFeatureType',
         'typename': this.typeName_,
         'outputFormat': 'application/json'
      };

      var describeFeatureTypeUrl = M.utils.addParameters(this.url_, describeFeatureParams);
      var describeFeatureTypeFormat = new M.impl.format.DescribeFeatureType(this.name_);
      return new Promise(function(success, fail) {
         M.remote.get(describeFeatureTypeUrl).then(function(response) {
            success(describeFeatureTypeFormat.read(response));
         });
      });
   };

   /**
    * This function gets the full URL of a GetFeature
    * request
    *
    * @public
    * @function
    * @param {ol.Extent} extent
    * @param {ol.proj.Projection} projection
    * @returns {String} GetFeature URL
    *
    * @api stable
    */
   M.impl.service.WFS.prototype.getFeatureUrl = function(extent, projection) {
      var getFeatureParams = {
         'service': 'WFS',
         'version': this.version_,
         'request': 'GetFeature',
         'typename': this.typeName_,
         'outputFormat': 'application/json',
         'srsname': projection.getCode()
      };
      if (!M.utils.isNullOrEmpty(this.ids_)) {
         getFeatureParams['featureId'] = this.ids_.map(function(id) {
            return this.name_.concat('.').concat(id);
         }, this);
      }
      if (!M.utils.isNullOrEmpty(this.cql_)) {
         getFeatureParams['CQL_FILTER'] = this.cql_;
      }
      else if (!M.utils.isNullOrEmpty(extent)) {
         getFeatureParams['bbox'] = extent.join(',') + ',' + projection.getCode();
      }

      return M.utils.addParameters(this.url_, getFeatureParams);
   };
})();