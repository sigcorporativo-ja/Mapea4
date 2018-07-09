import GeosearchLayerImpl from "impl/ol/js/geosearchlayer";
import Utils from "facade/js/utils/utils";
import Exception from "facade/js/exception/exception";
import Vector from "facade/js/layers/vector";

export default class GeosearchLayer extends Vector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.GeoJSON} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  constructor(parameters = {}, options = {}, impl = GeosearchLayerImpl()) {
    // calls the super constructor
    super(options, impl);
    // checks if the implementation can create KML layers
    if (Utils.isUndefined(GeosearchLayerImpl)) {
      Exception('La implementación usada no puede crear capas Geosearch');
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @public
   * @param {object} obj - Object to compare
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof GeosearchLayer) {}
    return equals;
  }
}
