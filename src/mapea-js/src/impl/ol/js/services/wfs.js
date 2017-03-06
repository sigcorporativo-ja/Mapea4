goog.provide('M.impl.service.WFS');

goog.require('M.impl.format.DescribeFeatureType');
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
  M.impl.service.WFS = (function (layerParameters, vendorOpts) {

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

    /**
     *
     * @private
     * @type {M.Projection}
     */
    this.projection_ = layerParameters.projection;

    /**
     * TODO
     *
     * @private
     * @type {String}
     */
    this.getFeatureOutputFormat_ = layerParameters.getFeatureOutputFormat;
    if (M.utils.isNullOrEmpty(this.getFeatureOutputFormat_)) {
      this.getFeatureOutputFormat_ = 'application/json'; // by default
    }

    /**
     * TODO
     *
     * @private
     * @type {String}
     */
    this.describeFeatureTypeOutputFormat_ = layerParameters.describeFeatureTypeOutputFormat;

    /**
     * TODO
     *
     * @private
     * @type {Object}
     */
    this.getFeatureVendor_ = {};
    if (!M.utils.isNullOrEmpty(vendorOpts) && !M.utils.isNullOrEmpty(vendorOpts.getFeature)) {
      this.getFeatureVendor_ = vendorOpts.getFeature;
    }

    /**
     * TODO
     *
     * @private
     * @type {Object}
     */
    this.describeFeatureTypeVendor_ = {};
    if (!M.utils.isNullOrEmpty(vendorOpts) && !M.utils.isNullOrEmpty(vendorOpts.describeFeatureType)) {
      this.describeFeatureTypeVendor_ = vendorOpts.describeFeatureType;
    }
  });

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  M.impl.service.WFS.prototype.getDescribeFeatureType = function () {
    // TODO
    var describeFeatureParams = {
      'service': 'WFS',
      'version': this.version_,
      'request': 'DescribeFeatureType',
      'typename': this.typeName_,
    };
    if (!M.utils.isNullOrEmpty(this.describeFeatureTypeOutputFormat_)) {
      describeFeatureParams['outputFormat'] = this.describeFeatureTypeOutputFormat_;
    }

    var describeFeatureTypeUrl = M.utils.addParameters(M.utils.addParameters(this.url_, describeFeatureParams), this.describeFeatureTypeVendor_);
    var describeFeatureTypeFormat = new M.impl.format.DescribeFeatureType(this.name_, this.describeFeatureTypeOutputFormat_, this.projection_);
    return new Promise(function (success, fail) {
      M.remote.get(describeFeatureTypeUrl).then(function (response) {
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
  M.impl.service.WFS.prototype.getFeatureUrl = function (extent, projection) {
    var getFeatureParams = {
      'service': 'WFS',
      'version': this.version_,
      'request': 'GetFeature',
      'typename': this.typeName_,
      'outputFormat': this.getFeatureOutputFormat_,
      'srsname': projection.getCode()
    };
    if (!M.utils.isNullOrEmpty(this.ids_)) {
      getFeatureParams['featureId'] = this.ids_.map(function (id) {
        return this.name_.concat('.').concat(id);
      }, this);
    }
    if (!M.utils.isNullOrEmpty(this.cql_)) {
      getFeatureParams['CQL_FILTER'] = this.cql_;
    }
    else if (!M.utils.isNullOrEmpty(extent)) {
      getFeatureParams['bbox'] = extent.join(',') + ',' + projection.getCode();
    }

    return M.utils.addParameters(M.utils.addParameters(this.url_, getFeatureParams), this.getFeatureVendor_);
  };
})();
