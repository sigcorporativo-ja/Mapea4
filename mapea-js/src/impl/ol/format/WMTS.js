/**
 * @module M/impl/format/WMTSCapabilities
 */
import { isNullOrEmpty } from 'M/util/Utils';
import { optionsFromCapabilities } from 'impl/patches';
import OLFormatWMTSCapabilities from 'ol/format/WMTSCapabilities';
/**
 * @classdesc
 * @api
 */
class WMTSCapabilities {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC formater
   *
   * @constructor
   * @param {Mx.parameters.LayerOptions} options custom options for this formater
   * @extends {ol.format.XML}
   * @api stable
   */
  constructor(options = {}) {
    /**
     * Parser of an specified WMC version
     * @private
     * @type {ol.format.XML}
     */
    this.parser = new OLFormatWMTSCapabilities();

    /**
     * Parsed capabilities
     * @private
     * @type {Mx.WMTSGetCapabilities}
     */
    this.capabilities = null;

    /**
     * Custom options for this formater
     * @private
     * @type {Mx.parameters.LayerOptions}
     */
  }

  /**
   * @public
   * @function
   * @param {Document} data Document.
   * @return {Object} this
   * @api stable
   */
  read(capabilities) {
    this.capabilities = this.parser.read(capabilities);
    return this;
  }

  /**
   * @public
   * @function
   * @param {String} layer the name of the layer to get its matrixSet.
   * @return {String} matrixSet name
   * @api stable
   */
  getMatrixSet(layerName, srid) {
    let matrixSet;
    for (let i = 0; i < this.capabilities.Contents.Layer.length &&
      matrixSet === undefined; i += 1) {
      const layer = this.capabilities.Contents.Layer[i];
      if (layer.Identifier === layerName) {
        if (!isNullOrEmpty(srid)) {
          // gets the matrixSet by the SRID
          matrixSet = layer.TileMatrixSetLink.filter((matrixSetLink) => {
            return matrixSetLink.contains(srid);
          })[0];
        }
        if (matrixSet === undefined) {
          matrixSet = layer.TileMatrixSetLink[0].TileMatrixSet;
        }
      }
    }
    return matrixSet;
  }

  /**
   * @public
   * @function
   * @param {String} layer the name of the layer to get its matrixIds.
   * @return {Array<String>} ids of its matrix
   * @api stable
   */
  getMatrixIds(layerName, srid) {
    let matrixIds = [];
    const matrixSet = this.getMatrixSet(layerName, srid);
    const tileMatrixSet = this.capabilities.Contents.TileMatrixSet.filter((tMatrixSet) => {
      return tMatrixSet.Identifier === matrixSet;
    })[0];
    if (tileMatrixSet != null && tileMatrixSet.length > 0) {
      matrixIds = tileMatrixSet.TileMatrix.map(tileMatrix => tileMatrix.Identifier);
    }
    return matrixIds;
  }

  /**
   * @public
   * @function
   * @param {String} layer the name of the layer to get its format.
   * @return {String} format of the layer.
   * @api stable
   */
  getFormat(layerName) {
    let format;
    const layer = this.capabilities.Contents.Layer.filter(l => l.Identifier === layerName)[0];
    if (layer != null) {
      format = layer.Format[0];
    }
    return format;
  }


  /**
   * @public
   * @function
   * @param {String} layer the name of the layer to get its format.
   * @return {String} format of the layer.
   * @api stable
   */
  getOptionsFromCapabilities(layerName, matrixSet) {
    const options = optionsFromCapabilities(this.capabilities, {
      layer: layerName,
      matrixSet,
    });

    return options;
  }
}

export default WMTSCapabilities;
