import Remote from 'facade/js/util/Remote';
import Utils from 'facade/js/util/Utils';
import Featuretype from '../format/wfs/DescribeFeatureType';

export default class WFS {
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
  constructor(layerParameters, vendorOpts) {
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
    if (!Utils.isNullOrEmpty(this.namespace_)) {
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
    if (Utils.isNullOrEmpty(this.getFeatureOutputFormat_)) {
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
    if (!Utils.isNullOrEmpty(vendorOpts) && !Utils.isNullOrEmpty(vendorOpts.getFeature)) {
      this.getFeatureVendor_ = vendorOpts.getFeature;
    }

    /**
     * TODO
     *
     * @private
     * @type {Object}
     */
    this.describeFeatureTypeVendor_ = {};
    if (!Utils.isNullOrEmpty(vendorOpts) && !Utils.isNullOrEmpty(vendorOpts.describeFeatureType)) {
      this.describeFeatureTypeVendor_ = vendorOpts.describeFeatureType;
    }
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  getDescribeFeatureType() {
    // TODO
    const describeFeatureParams = {
      service: 'WFS',
      version: this.version_,
      request: 'DescribeFeatureType',
      typename: this.typeName_,
    };
    if (!Utils.isNullOrEmpty(this.describeFeatureTypeOutputFormat_)) {
      describeFeatureParams.outputFormat = this.describeFeatureTypeOutputFormat_;
    }

    const params = Utils.addParameters(this.url_, describeFeatureParams);
    const describeFeatureTypeUrl = Utils
      .addParameters(params, this.describeFeatureTypeVendor_);
    const descFTypeOForm = this.describeFeatureTypeOutputFormat_;
    const descrFTypeFormat = new Featuretype(this.name_, descFTypeOForm, this.projection_);
    return new Promise((success, fail) => {
      Remote.get(describeFeatureTypeUrl).then((response) => {
        success(descrFTypeFormat.read(response));
      });
    });
  }

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

  getFeatureUrl(extent, projection) {
    const getFeatureParams = {
      service: 'WFS',
      version: this.version_,
      request: 'GetFeature',
      typename: this.typeName_,
      outputFormat: this.getFeatureOutputFormat_,
      srsname: projection.getCode(),
    };
    if (!Utils.isNullOrEmpty(this.ids_)) {
      getFeatureParams.featureId = this.ids_.map((id) => {
        return this.name_.concat('.').concat(id);
      });
    }
    if (!Utils.isNullOrEmpty(this.cql_)) {
      getFeatureParams.CQL_FILTER = this.cql_;
    }
    else if (!Utils.isNullOrEmpty(extent)) {
      getFeatureParams.bbox = `${extent.join(',')},${projection.getCode()}`;
    }

    return Utils
      .addParameters(Utils.addParameters(this.url_, getFeatureParams), this.getFeatureVendor_);
  }
}