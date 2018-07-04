import Utils from '../utils/utils';
import Exception from '../exception/exception';
import LayerBase from './layerbase';
import LayerType from './layertype';
import WMCImpl from '../../../impl/js/layers/wmc';
import Layer from '../parameters/layers';
import Config from '../../../configuration';
import Evt from '../event/eventsmanager';

export default class WMC extends LayerBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMC} userParameters parameters
   * provided by the user
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor(userParameters, options) {

    let impl = new WMCImpl(options);

    // calls the super constructor
    super(parameters, impl);
    // checks if the implementation can create WMC layers
    if (Utils.isUndefined(WMCImpl)) {
      Exception('La implementación usada no puede crear capas WMC');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    options = (options || {});
    //This Layer is of parameters
    let parameters = Layer(userParameters, LayerType.WMC);

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMC}
     */


    // options
    this.options = options;

    // checks if the name is auto-generated
    if (!Utils.isNullOrEmpty(this.url) && Utils.isNullOrEmpty(this.name)) {
      this.generateName_();
    }
    // checks if it is predefined context
    else if (Utils.isNullOrEmpty(this.url) && !Utils.isNullOrEmpty(this.name)) {
      var predefinedIdx = Config.predefinedWMC.predefinedNames.indexOf(this.name);
      if (predefinedIdx === -1) {
        Exception('El contexto predefinido \'' + this.name + '\' no existe');
      } else {
        this.url = Config.predefinedWMC.urls[predefinedIdx];
        this.name = Config.predefinedWMC.names[predefinedIdx];
      }
    }

    /**
     * 'loaded' This property indicates if the layers is loaded and all its layers.
     * @type {bool}
     * @private
     * @api stable
     */
    this.loaded_ = false;

    this.once(Evt.LOAD, () => this.loaded_ = true);
  }

  /**
   * 'selected' This property indicates if
   * the layer was selected
   */

  getSelected() {
    return this.getImpl().selected;
  }

  setSelected(newSelectedValue) {
    this.getImpl().selected = newSelectedValue;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  getType() {
    return LayerType.WMC;
  }

  setType(newType) {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.WMC)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WMC).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * The layers provided by the WMC file
   */
  getLayers() {
    return this.getImpl().layers;
  }

  setLayers(newLayers) {
    this.getImpl().layers = newLayers;
  }

  /**
   * Projection provided by the WMC file
   */
  getProjection() {
    return this.getImpl().projection;
  }

  setProjection(newProjection) {
    this.getImpl().projection = newProjection;
  }

  /**
   * Max extent provided by the WMC file
   */
  getMaxExtent() {
    return this.getImpl().maxExtent;
  }

  setMaxExtent(newMaxExtent) {
    this.getImpl().maxExtent = newMaxExtent;
  }

  /**
   * 'options' resolutions specified by the user
   */
  getOptions() {
    return this.getImpl().options;
  }

  setOptions(newOptions) {
    this.getImpl().options = newOptions;
  }

  /**
   * This function select this WMC layer and
   * triggers the event to draw it
   *
   * @function
   * @api stable
   */
  select() {
    // checks if the implementation can manage select method
    if (Utils.isUndefined(this.getImpl().select)) {
      Exception('La implementación usada no posee el método select');
    }

    this.getImpl().select();
  }



  /**
   * This function unselect this WMC layer and
   * removes all its layers
   *
   * @function
   * @api stable
   */
  unselect() {
    // checks if the implementation can manage select method
    if (Utils.isUndefined(this.getImpl().unselect)) {
      Exception('La implementación usada no posee el método unselect');
    }

    this.getImpl().unselect();
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

    if (obj instanceof WMC) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  }

  /**
   * This function returns if the layer is loaded
   *
   * @function
   * @api stable
   */
  isLoaded() {
    return this.loaded_;
  }

  /**
   * This function returns if the layer is loaded
   *
   * @function
   * @api stable
   */
  setLoaded(loaded) {
    this.loaded_ = loaded;
  }
}
