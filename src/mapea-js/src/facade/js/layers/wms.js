import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import LayerBase from('./layerbase.js');
import WMSImpl from('../../../impl/js/layers/wms.js');
import Layer from('../parameters/layers.js');
import LayerType from('./layertype.js');
import Config from('../../../configuration.js');

export class WMS extends LayerBase() {
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
    // calls the super constructor
    super(this, parameters, impl);
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
    let impl = implParam;
    if (Utils.isNullOrEmpty(impl)) {
      impl = new WMSImpl(options);
    }

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
  get url() {
    return this.impl().url;
  }
  set url(newUrl) {
    this.impl().url = newUrl;
    this._updateNoCache();
  }

  /**
   * 'name' the layer name
   */
  get name() {
    return this.impl().name;
  }

  set name(newName) {
    this.impl().name = newName;
    this._updateNoCache();
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.WMS;
  }

  set type(newType) {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.WMS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WMS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'legend' the layer name
   */
  get legend() {
    return this.impl().legend;
  }

  set legend(newLegend) {

    if (Utils.isNullOrEmpty(newLegend)) {
      this.impl().legend = this.name;
    } else {
      this.impl().legend = newLegend;
    }
  }

  /**
   * 'tiled' the layer name
   */
  get tiled() {
    return this.impl().tiled;
  }

  set tiled(newTiled) {
    if (!Utils.isNullOrEmpty(newTiled)) {
      if (Utils.isString(newTiled)) {
        this.impl().tiled = (Utils.normalize(newTiled) === 'true');
      } else {
        this.impl().tiled = newTiled;
      }
    } else {
      this.impl().tiled = true;
    }
  }

  /**
   * 'cql' the CQL filter
   */
  get cql() {
    return this.impl().cql;
  }

  set cql(newCql) {
    this.impl().cql = newCql;
  }

  /**
   * 'version' the service version
   * default value is 1.3.0
   */
  get version() {
    return this.impl().version;
  }

  set version(newVersion) {
    if (!Utils.isNullOrEmpty(newVersion)) {
      this.impl().version = newVersion;
    } else {
      this.impl().version = '1.1.0'; // default value
    }
  }

  /**
   * 'options' the layer options
   */
  get options() {
    return this.impl().options;
  }

  set options(newOptions) {
    this.impl().options = newOptions;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  get noChacheUrl() {
    return this._noCacheUrl;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  get noChacheName() {
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
    return this.impl().updateMinMaxResolution(projection);
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
