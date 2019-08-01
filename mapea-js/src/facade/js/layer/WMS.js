/**
 * @module M/layer/WMS
 */
import WMSImpl from 'impl/layer/WMS';

import { isNullOrEmpty, isUndefined, sameUrl, isString, normalize, isFunction } from '../util/Utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import * as parameter from '../parameter/parameter';
import * as LayerType from './Type';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMS layer
 * with parameters specified by the user*
 * @api
 */
class WMS extends LayerBase {
  /**
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions) {
    // checks if the implementation can create WMC layers
    if (isUndefined(WMSImpl)) {
      Exception('La implementación usada no puede crear capas WMS');
    }
    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }
    // This Layer is of parameters.
    const parameters = parameter.layer(userParameters, LayerType.WMS);
    const impl = new WMSImpl(options, vendorOptions);
    // calls the super constructor
    super(parameters, impl);
    // legend
    this.legend = parameters.legend;

    // cql
    this.cql = parameters.cql;

    // version
    this.version = parameters.version;

    // tiled
    if (!isNullOrEmpty(parameters.tiled)) {
      this.tiled = parameters.tiled;
    }

    // transparent
    this.transparent = parameters.transparent;

    // options
    this.options = options;

    /**
     * get WMS getCapabilities promise
     * @private
     * @type {Promise}
     */
    this.getCapabilitiesPromise_ = null;

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
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.WMS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WMS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'legend' the layer name
   */
  get legend() {
    return this.getImpl().legend;
  }

  set legend(newLegend) {
    if (isNullOrEmpty(newLegend)) {
      this.getImpl().legend = this.name;
    } else {
      this.getImpl().legend = newLegend;
    }
  }

  /**
   * 'tiled' the layer name
   */
  get tiled() {
    return this.getImpl().tiled;
  }

  set tiled(newTiled) {
    if (!isNullOrEmpty(newTiled)) {
      if (isString(newTiled)) {
        this.getImpl().tiled = (normalize(newTiled) === 'true');
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
  get cql() {
    return this.getImpl().cql;
  }

  set cql(newCql) {
    this.getImpl().cql = newCql;
  }

  /**
   * 'version' the service version
   * default value is 1.3.0
   */
  get version() {
    return this.getImpl().version;
  }

  set version(newVersion) {
    if (!isNullOrEmpty(newVersion)) {
      this.getImpl().version = newVersion;
    } else {
      this.getImpl().version = '1.1.0'; // default value
    }
  }

  /**
   * 'options' the layer options
   */
  get options() {
    return this.getImpl().options;
  }

  set options(newOptions) {
    this.getImpl().options = newOptions;
  }

  /**
   * This method calculates the maxExtent of this layer:
   * 1. Check if the user specified a maxExtentn parameter
   * 2. Gets the maxExtent of the layer in the WMC
   * 3. Gets the map maxExtent
   * 4. If not, sets the maxExtent from the WMC global
   * 5. Sets the maxExtent from the capabilities
   * 6. Sets the maxExtent from the map projection
   *
   * @function
   * @api
   */
  getMaxExtent(callbackFn) {
    let maxExtent;
    if (isNullOrEmpty(this.userMaxExtent)) { // 1
      if (isNullOrEmpty(this.options.wmcMaxExtent)) { // 2
        if (isNullOrEmpty(this.map_.userMaxExtent)) { // 3
          const selectedWMC = this.map_.getWMC().find(wmc => wmc.selected);
          // if (isNullOrEmpty(this.options.wmcGlobalMaxExtent)) {
          if (isNullOrEmpty(selectedWMC)) { // 4
            // maxExtent provided by the service
            this.getCapabilities().then((capabilities) => {
              const capabilitiesMaxExtent = this.getImpl()
                .getExtentFromCapabilities(capabilities);
              if (isNullOrEmpty(capabilitiesMaxExtent)) { // 5
                const projMaxExtent = this.map_.getProjection().getExtent();
                this.maxExtent_ = projMaxExtent; // 6
              } else {
                this.maxExtent_ = capabilitiesMaxExtent;
              }
              // this allows get the async extent by the capabilites
              if (isFunction(callbackFn)) {
                callbackFn(this.maxExtent_);
              }
            });
          } else {
            selectedWMC.calculateMaxExtent().then((wmcMaxExtent) => {
              this.maxExtent_ = wmcMaxExtent;
              if (isFunction(callbackFn)) {
                callbackFn(this.maxExtent_);
              }
            });
          }
        } else {
          this.maxExtent_ = this.map_.userMaxExtent;
          maxExtent = this.maxExtent_;
        }
      } else {
        this.maxExtent_ = this.options.wmcMaxExtent;
        maxExtent = this.maxExtent_;
      }
    } else {
      maxExtent = this.userMaxExtent;
    }
    if (!isNullOrEmpty(maxExtent) && isFunction(callbackFn)) {
      callbackFn(maxExtent);
    } else if (isNullOrEmpty(maxExtent)) {
      maxExtent = this.maxExtent_;
    }
    return maxExtent;
  }

  /**
   * This method calculates the maxExtent of this layer:
   * 1. Check if the user specified a maxExtentn parameter
   * 2. Gets the maxExtent of the layer in the WMC
   * 3. Gets the map maxExtent
   * 4. If not, sets the maxExtent from the WMC global
   * 5. Sets the maxExtent from the capabilities
   * 6. Sets the maxExtent from the map projection
   *
   * Async version of getMaxExtent
   * @function
   * @api
   */
  calculateMaxExtent() {
    return new Promise(resolve => this.getMaxExtent(resolve));
  }

  /**
   * This functions retrieves a Promise which will be
   * resolved when the GetCapabilities request is retrieved
   * by the service and parsed. The capabilities is cached in
   * order to prevent multiple requests
   *
   * @function
   * @api
   */
  getCapabilities() {
    if (isNullOrEmpty(this.getCapabilitiesPromise_)) {
      this.getCapabilitiesPromise_ = this.getImpl().getCapabilities();
    }
    return this.getCapabilitiesPromise_;
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  getNoCacheUrl() {
    return this._noCacheUrl;
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  getNoCacheName() {
    return this._noCacheName;
  }

  /**
   * Update minimum and maximum resolution WMS layers
   *
   * @public
   * @function
   * @param {String|Mx.Projection} projection - Projection map
   * @api
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
    const tiledIdx = M.config.tileMappgins.tiledNames.indexOf(this.name);
    if ((tiledIdx !== -1) && sameUrl(M.config.tileMappgins.tiledUrls[tiledIdx], this.url)) {
      this._noCacheUrl = M.config.tileMappgins.urls[tiledIdx];
      this._noCacheName = M.config.tileMappgins.names[tiledIdx];
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
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

export default WMS;
