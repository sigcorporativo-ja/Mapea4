import OLWMTSCapabilities from "ol/format/WMTSCapabilities";
import OLWMTS from "ol/source/WMTS";
import Utils from "facade/js/utils/utils";

export default class WMTSCapabilities {

  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC formater
   *
   * @constructor
   * @param {Mx.parameters.LayerOptions} options custom options for this formater
   * @extends {ol.format.XML}
   * @api stable
   */
  constructor(options) {
    /**
     * Parser of an specified WMC version
     * @private
     * @type {ol.format.XML}
     */
    this.parser = new OLWMTSCapabilities();

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
    this.options = (options || {});
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
    for (let i = 0, ilen = this.capabilities.Contents.Layer.length;
      (i < ilen) && (matrixSet === undefined); i++) {
      let layer = this.capabilities.Contents.Layer[i];
      if (layer.Identifier === layerName) {
        if (!Utils.isNullOrEmpty(srid)) {
          // gets the matrixSet by the SRID
          matrixSet = layer.TileMatrixSetLink.filter(matrixSetLink => matrixSetLink.contains(srid))[0];
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
    let matrixSet = this.getMatrixSet(layerName, srid);
    let tileMatrixSet = his.capabilities.Contents.TileMatrixSet.filter(tileMatrixSet => tileMatrixSet.Identifier === matrixSet)[0];
    if (tileMatrixSet != null && tileMatrixSet.length > 0) {
      matrixIds = tileMatrixSet.TileMatrix.map(tileMatrix => tileMatrix.Identifier);
    }
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
    let layer = this.capabilities.Contents.Layer.filter(layer => layer.Identifier === layerName)[0];
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
    let options = OLWMTS.optionsFromCapabilities(this.capabilities, {
      'layer': layerName,
      'matrixSet': matrixSet
    });

    return options;
  }
}
