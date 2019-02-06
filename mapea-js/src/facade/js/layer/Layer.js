/**
 * @module M/Layer
 */
import Exception from '../exception/exception';
import * as parserParameter from '../parameter/parameter';
import Base from '../Base';
import { isNullOrEmpty, concatUrlPaths, isUndefined, normalize, isString, isFunction, generateRandom, isBoolean } from '../util/Utils';

/**
 * @classdesc
 * Main constructor of the class. Creates a layer
 * with parameters specified by the user
 * @api
 */
class LayerBase extends Base {
  /**
   * @constructor
   * @extends {M.facade.Base}
   * @param {string|Mx.parameters.Layer} userParameters parameters
   * provided by the user
   * @api
   */
  constructor(userParameters, impl) {
    // calls the super constructor
    super(impl);

    // This layer is of parameters.
    const parameter = parserParameter.layer(userParameters);

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.type = parameter.type;

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.url = parameter.url;

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.name = parameter.name;

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.transparent = parameter.transparent;

    /**
     * @private
     * @type {Array<number>}
     * @expose
     */
    this.maxExtent_ = parameter.maxExtent;

    /**
     * @private
     * @type {number}
     * @expose
     */
    this.zindex_ = null;

    /**
     * @private
     * @type {M.Map}
     * @expose
     */
    this.map_ = null;
  }

  /**
   * 'url' The service URL of the
   * layer
   */
  get url() {
    return this.getImpl().url;
  }

  set url(newUrl) {
    this.getImpl().url = newUrl;
  }

  /**
   * 'name' the layer name
   */
  get name() {
    return this.getImpl().name;
  }

  set name(newName) {
    this.getImpl().name = newName;
  }

  /**
   * 'transparent' the layer transparence
   */
  get transparent() {
    return this.getImpl().transparent;
  }

  set transparent(newTransparent) {
    if (!isNullOrEmpty(newTransparent)) {
      if (isString(newTransparent)) {
        this.getImpl().transparent = (normalize(newTransparent) === 'true');
      } else {
        this.getImpl().transparent = newTransparent;
      }
    } else {
      this.getImpl().transparent = true;
    }
  }

  /**
   * 'displayInLayerSwitcher' the layer transparence
   */
  get displayInLayerSwitcher() {
    return this.getImpl().displayInLayerSwitcher;
  }

  set displayInLayerSwitcher(newDisplayInLayerSwitcher) {
    if (!isNullOrEmpty(newDisplayInLayerSwitcher)) {
      if (isString(newDisplayInLayerSwitcher)) {
        this.getImpl().displayInLayerSwitcher = (normalize(newDisplayInLayerSwitcher) === 'true');
      } else {
        this.getImpl().displayInLayerSwitcher = newDisplayInLayerSwitcher;
      }
    } else {
      this.getImpl().displayInLayerSwitcher = true;
    }
  }

  /**
   * This function indicates the layer max extent
   *
   * @function
   * @api
   * @export
   */
  getMaxExtent() {
    let maxExtent;
    if (isNullOrEmpty(this.maxExtent_) && !isNullOrEmpty(this.map_)) {
      const mapMaxExtent = this.map_.getMaxExtent();
      if (isNullOrEmpty(mapMaxExtent)) {
        const projMaxExtent = this.map_.getProjection().getExtent();
        maxExtent = projMaxExtent;
      } else {
        const mapMaxExtentArr = [
          mapMaxExtent.x.min,
          mapMaxExtent.y.min,
          mapMaxExtent.x.max,
          mapMaxExtent.y.max,
        ];
        maxExtent = mapMaxExtentArr;
      }
    } else {
      maxExtent = this.maxExtent_;
    }
    return maxExtent;
  }

  /**
   * This function changes the layer max extent
   *
   * @function
   * @api
   * @export
   */
  setMaxExtent(maxExtent) {
    this.maxExtent_ = maxExtent;
    if (this.getImpl().setMaxExtent !== undefined) {
      this.getImpl().setMaxExtent(maxExtent);
    }
  }

  /**
   * The facade map instace
   *
   * @function
   * @public
   * @api
   * @export
   */
  setMap(map) {
    this.map_ = map;
  }

  /**
   * This function indicates if the layer is visible
   *
   * @function
   * @api
   * @export
   */
  isVisible() {
    // checks if the implementation can manage this method
    if (isUndefined(this.getImpl().isVisible)) {
      Exception('La implementación usada no posee el método isVisible');
    }

    return this.getImpl().isVisible();
  }

  /**
   * This function indicates if the layer is visible
   *
   * @function
   * @api
   * @export
   */
  isQueryable() {
    // checks if the implementation can manage this method
    if (isUndefined(this.getImpl().isQueryable)) {
      Exception('La implementación usada no posee el método isQueryable');
    }

    return this.getImpl().isQueryable();
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api
   * @export
   */
  setVisible(visibilityParam) {
    let visibility = visibilityParam;
    // checks if the param is null or empty
    if (isNullOrEmpty(visibility)) {
      Exception('No ha especificado ningún parámetro de visibilidad');
    }

    // checks if the param is boolean or string
    if (!isString(visibility) && !isBoolean(visibility)) {
      Exception('No ha especificado ningún parámetro de visibilidad');
    }

    // checks if the implementation can manage this method
    if (isUndefined(this.getImpl().setVisible)) {
      Exception('La implementación usada no posee el método setVisible');
    }

    visibility = /^1|(true)$/i.test(visibility);

    this.getImpl().setVisible(visibility);
  }

  /**
   * This function indicates if the layer is in range
   *
   * @function
   * @api
   * @export
   */
  inRange() {
    // checks if the implementation can manage this method
    if (isUndefined(this.getImpl().inRange)) {
      Exception('La implementación usada no posee el método inRange');
    }

    return this.getImpl().inRange();
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  getLegendURL() {
    return this.getImpl().getLegendURL();
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  setLegendURL(legendUrlParam) {
    let legendUrl = legendUrlParam;
    if (isNullOrEmpty(legendUrl)) {
      legendUrl = concatUrlPaths([M.config.THEME_URL, LayerBase.LEGEND_DEFAULT]);
    }
    this.getImpl().setLegendURL(legendUrl);
  }

  /**
   * This function gets the z-index of this layer
   *
   * @function
   * @api
   */
  getZIndex() {
    return this.zindex_;
  }

  /**
   * This function sets the z-index for this layer
   *
   * @function
   * @api
   */
  setZIndex(zIndex) {
    this.zindex_ = zIndex;
    this.getImpl().setZIndex(zIndex);
  }

  /**
   * This function gets the opacity of this layer
   *
   * @function
   * @api
   */
  getOpacity() {
    return this.getImpl().getOpacity();
  }

  /**
   * This function sets the opacity of this layer
   *
   * @function
   * @api
   */
  setOpacity(opacity) {
    this.getImpl().setOpacity(opacity);
  }

  /**
   * This function refreshes the state of this
   * layer
   *
   * @function
   * @api
   * @export
   */
  refresh() {
    // checks if the implementation can manage this method
    if (!isUndefined(this.getImpl().refresh) && isFunction(this.getImpl().refresh)) {
      this.getImpl().refresh();
    }
  }

  /**
   * This function auto-generates a name for this layer
   * @private
   * @function
   * @export
   */
  generateName_() {
    this.name = generateRandom('layer_', '_'.concat(this.type));
  }
}

/**
 * Image PNG for legend default
 * @const
 * @type {string}
 * @public
 * @api
 */
LayerBase.LEGEND_DEFAULT = '/img/legend-default.png';

/**
 * Image PNG for legend default
 * @const
 * @type {string}
 * @public
 * @api
 */
LayerBase.LEGEND_ERROR = '/img/legend-error.png';

export default LayerBase;
