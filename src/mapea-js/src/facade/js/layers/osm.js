import LayerBase from './layerbase';
import Utils from '../utils/utils';
import Exception from '../exception/exception';
import OSMImpl from '../../../impl/js/layers/osm';
import LayerType from './layertype';

export default class OSM extends LayerBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  constructor(userParameters, options) {
    let impl = new OSMImpl(userParameters, options);
    // calls the super constructor
    super(parameters, impl);

    // checks if the implementation can create OSM
    if (Utils.isUndefined(OSMImpl)) {
      Exception('La implementación usada no puede crear capas OSM');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      userParameters = "OSM";
    }

    options = (options || {});

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMS}
     */

    //This layer is of parameters.
    let parameters = Layer(userParameters, LayerType.OSM);

    if (Utils.isNullOrEmpty(parameters.name)) {
      parameters.name = 'osm';
    }


    this.name = parameters.name;

    this.legend = parameters.legend;
    if (Utils.isNullOrEmpty(parameters.legend)) {
      this.legend = 'OpenStreetMap';
    }

    // transparent
    this.transparent = parameters.transparent;

    // options
    this.options = options;
  }

  /**
   * 'transparent' the layer name
   */
  getTransparent() {
    return this.getImpl().transparent;
  }

  setTransparent(newTransparent) {
    if (!Utils.isNullOrEmpty(newTransparent)) {
      this.getImpl().transparent = newTransparent;
    } else {
      this.getImpl().transparent = false;
    }
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  getType() {
    return LayerType.OSM;
  }

  setType(newType) {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.OSM)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.OSM).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }



  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof OSM) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  }
}
