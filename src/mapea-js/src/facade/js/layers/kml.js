import Vector from './vector';
import Utils from '../utils/utils';
import Exception from '../exception/exception';
import KMLImpl from '../../../impl/js/layers/kml';
import LayerType from './layertype';
import Layer from '../parameters/layers';


export default class KML extends Vector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.KML} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  constructor(userParameters, options = {}) {
    let impl = new KMLImpl(options);

    // calls the super constructor
    super(parameters, options, impl);

    // checks if the implementation can create KML layers
    if (Utils.isUndefined(KMLImpl)) {
      Exception('La implementación usada no puede crear capas KML');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.KML}
     */

    //This layer is of parameters.
    let parameters = Layer(userParameters, LayerType.KML);


    // extract
    this.extract = parameters.extract;

    // options
    this.options = options;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  static getType() {
    return LayerType.KML;
  }

  static setType(newType) {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.KML)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.KML).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'transparent' the layer name
   */

  static getExtract() {
    return this.getImpl().extract;
  }

  static set extract(newExtract) {
    if (!Utils.isNullOrEmpty(newExtract)) {
      if (Utils.isString(newExtract)) {
        this.getImpl().extract = (Utils.normalize(newExtract) === 'true');
      } else {
        this.getImpl().extract = newExtract;
      }
    } else {
      this.getImpl().extract = true;
    }
  }

  /**
   * 'options' the layer options
   */
  static getOptions() {
    return this.getImpl().options;
  }

  static setOptions(newOptions) {
    this.getImpl().options = newOptions;
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

    if (obj instanceof KML) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.extract === obj.extract);
    }

    return equals;
  }

  /**
   * Template for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  KML.POPUP_TEMPLATE = 'kml_popup.html';
}
