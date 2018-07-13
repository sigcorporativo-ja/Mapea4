import Utils from "facade/js/util/Utils";
import DescribeFeatureTypeXML from "./DescribeFeatureTypeXML";

export default class DescribeFeatureType {
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
      "outputFormat": outputFormat,
      "featureType": typeName,
      "srsName": this.projection_.code
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
    let describeFeatureType = {};

    let describeFeatureTypeResponse;
    if (/json/gi.test(this.outputFormat_)) {
      try {
        describeFeatureTypeResponse = JSON.parse(response.text);
      }
      catch (err) {}
    }

    if (!describeFeatureTypeResponse) {
      describeFeatureTypeResponse = this.gmlFormatter_.read(response.text);
    }

    describeFeatureType.featureNS = describeFeatureTypeResponse.targetNamespace;
    describeFeatureType.featurePrefix = describeFeatureTypeResponse.targetPrefix;

    describeFeatureTypeResponse.featureTypes.some(featureType => {
      if (featureType.typeName === this.typeName_) {
        describeFeatureType.properties = featureType.properties;
        describeFeatureType.properties.some(prop => {
          if (Utils.isGeometryType(prop.localType)) {
            describeFeatureType.geometryName = prop.name;
            return true;
          }
        });
        return true;
      }
    });
    return describeFeatureType;
  }
}
