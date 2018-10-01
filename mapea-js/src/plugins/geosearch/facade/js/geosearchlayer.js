import GeosearchLayerImpl from '../../impl/ol/js/geosearchlayer';

export default class GeosearchLayer extends M.layer.Vector {
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
  constructor(parameters = {}, options = {}, impl = new GeosearchLayerImpl()) {
    // calls the super constructor
    super(parameters, options, impl);
    // checks if the implementation can create KML layers
    if (M.utils.isUndefined(GeosearchLayerImpl)) {
      M.exception('La implementación usada no puede crear capas Geosearch');
    }

    this.displayInLayerSwitcher = false;
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
    const equals = false;
    return equals;
  }
}
