import Utils from '../utils/utils';
import Exception from '../exception/exception';
import LayerBase from './layerbase';
import WMSImpl from '../../../impl/js/layers/wms';
import Layer from '../parameters/layers';
import LayerType from './layertype';
import Config from '../../../configuration';

export default class WMS extends LayerBase() {
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
  constructor(userParameters, options, implParam) {

    let impl = implParam;
    if (Utils.isNullOrEmpty(impl)) {
      impl = new WMSImpl(options);
    }

    // calls the super constructor
    super(parameters, impl);
    // checks if the implementation can create WMC layers
    if (Utils.isUndefined(WMSImpl)) {
      Exception('La implementación usada no puede crear capas WMS');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    options = (options || {});

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMS}
     */

    //This Layer is of parameters.
    let parameters = Layer(userParameters, LayerType.WMS);


    // legend
    this.legend = parameters.legend;

    // cql
    this.cql = parameters.cql;

    // version
    this.version = parameters.version;

    // tiled
    if (!Utils.isNullOrEmpty(parameters.tiled)) {
      this.tiled = parameters.tiled;
    }

    // transparent
    this.transparent = parameters.transparent;

    // options
    this.options = options;
  }

  /**
   * 'url' The service URL of the
   * layer
   */
  getUrl() {
    return this.getImpl().url;
  }
  setUrl(newUrl) {
    this.getImpl().url = newUrl;
    this._updateNoCache();
  }

  /**
   * 'name' the layer name
   */
  getName() {
    return this.getImpl().name;
  }

  setName(newName) {
    this.getImpl().name = newName;
    this._updateNoCache();
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  getType() {
    return LayerType.WMS;
  }

  setType(newType) {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.WMS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WMS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'legend' the layer name
   */
  getLegend() {
    return this.getImpl().legend;
  }

  setLegend(newLegend) {

    if (Utils.isNullOrEmpty(newLegend)) {
      this.getImpl().legend = this.name;
    } else {
      this.getImpl().legend = newLegend;
    }
  }

  /**
   * 'tiled' the layer name
   */
  getTiled() {
    return this.getImpl().tiled;
  }

  setTiled(newTiled) {
    if (!Utils.isNullOrEmpty(newTiled)) {
      if (Utils.isString(newTiled)) {
        this.getImpl().tiled = (Utils.normalize(newTiled) === 'true');
      } else {
        this.getImpl().tiled = newTiled;
      }
    } else {
      this.getImpl().tiled = true;
    }
  }

  /**
   * 'cql' the CQL filter
   */
  getCql() {
    return this.getImpl().cql;
  }

  setCql(newCql) {
    this.getImpl().cql = newCql;
  }

  /**
   * 'version' the service version
   * default value is 1.3.0
   */
  getVersion() {
    return this.getImpl().version;
  }

  setVersion(newVersion) {
    if (!Utils.isNullOrEmpty(newVersion)) {
      this.getImpl().version = newVersion;
    } else {
      this.getImpl().version = '1.1.0'; // default value
    }
  }

  /**
   * 'options' the layer options
   */
  getOptions() {
    return this.getImpl().options;
  }

  setOptions(newOptions) {
    this.getImpl().options = newOptions;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  getNoChacheUrl() {
    return this._noCacheUrl;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  getNoChacheName() {
    return this._noCacheName;
  }

  /**
   * Update minimum and maximum resolution WMS layers
   *
   * @public
   * @function
   * @param {String|Mx.Projection} projection - Projection map
   * @api stable
   */
  updateMinMaxResolution(projection) {
    return this.getImpl().updateMinMaxResolution(projection);
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  _updateNoCache() {
    let tiledIdx = M.config.tileMappgins.tiledNames.indexOf(this.name);
    if ((tiledIdx !== -1) && Utils.sameUrl(Config.tileMappgins.tiledUrls[tiledIdx], this.url)) {
      this._noCacheUrl = Config.tileMappgins.urls[tiledIdx];
      this._noCacheName = Config.tileMappgins.names[tiledIdx];
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

    if (obj instanceof WMS) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.cql === obj.cql);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }
}
