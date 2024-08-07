/**
 * @module M/impl/format/DescribeFeatureType
 */
import { isGeometryType } from 'M/util/Utils';
import DescribeFeatureTypeXML from './DescribeFeatureTypeXML';
/**
 * @classdesc
 * @api
 */
class DescribeFeatureType {
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
  constructor(typeName, outputFormat, projection) {
    /**
     * TOOD
     * @private
     * @type {String}
     */
    this.typeName_ = typeName;

    /**
     * TOOD
     * @private
     * @type {String}
     */
    this.outputFormat_ = outputFormat;

    /**
     * TOOD
     * @private
     * @type {M.Projection}
     */
    this.projection_ = projection;

    /**
     * TOOD
     * @private
     * @type {ol.format.GML2 | ol.format.GML3}
     */
    this.gmlFormatter_ = new DescribeFeatureTypeXML({
      outputFormat,
      featureType: typeName,
      srsName: this.projection_.code,
    });
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  read(response) {
    const describeFeatureType = {};

    let describeFeatureTypeResponse;
    if (/json/gi.test(this.outputFormat_)) {
      // eslint-disable-next-line no-useless-catch
      try {
        describeFeatureTypeResponse = JSON.parse(response.text);
      } catch (err) {
        throw err;
      }
    }

    if (!describeFeatureTypeResponse) {
      describeFeatureTypeResponse = this.gmlFormatter_.read(response.text);
    }

    describeFeatureType.featureNS = describeFeatureTypeResponse.targetNamespace;
    describeFeatureType.featurePrefix = describeFeatureTypeResponse.targetPrefix;

    describeFeatureTypeResponse.featureTypes.some((featureType) => {
      if (featureType.typeName === this.typeName_) {
        describeFeatureType.properties = featureType.properties;
        describeFeatureType.properties.some((prop) => {
          if (isGeometryType(prop.localType)) {
            describeFeatureType.geometryName = prop.name;
          }
          return isGeometryType(prop.localType);
        });
      }
      return featureType.typeName === this.typeName_;
    });
    return describeFeatureType;
  }
}

export default DescribeFeatureType;
