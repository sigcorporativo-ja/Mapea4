/**
 * @module M/impl/layer/WMC
 */
import { isNullOrEmpty } from 'M/util/Utils';
import * as parameter from 'M/parameter/parameter';
import { get as getRemote } from 'M/util/Remote';
import * as EventType from 'M/event/eventtype';
import { get as getProj, transformExtent } from 'ol/proj';
import FormatWMC from '../format/wmc/WMC';
import Layer from './Layer';
/**
 * @classdesc
 * @api
 */
class WMC extends Layer {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor(options) {
    // calls the super constructor
    super(options);

    /**
     * Indicates if the layer was selected
     * @private
     * @type {boolean}
     */
    this.selected = false;

    /**
     * WMS layers defined into the WMC
     * @private
     * @type {Array<M.layer.WMS>}
     */
    this.layers = [];

    /**
     * Load WMC file promise
     * @private
     * @type {Promise}
     */
    this.loadContextPromise = null;

    /**
     * Envolved extent for the WMC
     * @private
     * @type {Mx.Extent}
     */
    this.maxExtent = null;

    /**
     * Current projection
     * @private
     * @type {ol.Projection}
     */
    this.extentProj_ = null;
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  addTo(map) {
    this.map = map;
  }

  /**
   * This function select this WMC layer and
   * triggers the event to draw it
   *
   * @public
   * @function
   * @api stable
   */
  select() {
    if (this.selected === false) {
      const bbox = this.map.getBbox();

      // unselect layers
      this.map.getWMC().forEach(wmcLayer => wmcLayer.unselect());

      this.selected = true;

      // loads the layers from this WMC if it is not cached
      this.loadContextPromise = new Promise((success, fail) => {
        getRemote(this.url).then((response) => {
          let proj;
          if (this.map.defaultProj === false) {
            proj = this.map.getProjection().code;
          }
          const wmcDocument = response.xml;
          const formater = new FormatWMC({
            projection: proj,
          });
          const context = formater.readFromDocument(wmcDocument);
          success.call(this, context);
        });
      });
      this.loadContextPromise.then((context) => {
        // set projection with the wmc
        if (this.map.defaultProj) {
          const olproj = getProj(context.projection);
          this.map.setProjection({
            code: olproj.getCode(),
            units: olproj.getUnits(),
          }, true);
        }
        // load layers
        this.loadLayers(context);
        if (!isNullOrEmpty(bbox)) {
          this.map.setBbox(bbox, {
            nearest: true,
          });
        }
        this.map.fire(EventType.CHANGE_WMC, this);
      });
    }
  }

  /**
   * This function unselect this WMC layer and
   * triggers the event to remove it
   *
   * @public
   * @function
   * @api stable
   */
  unselect() {
    if (this.selected === true) {
      this.selected = false;

      // removes all loaded layers
      if (!isNullOrEmpty(this.layers)) {
        this.map.removeLayers(this.layers);
      }
    }
  }

  /**
   * This function load all layers of the WMC and
   * it adds them to the map
   *
   * @public
   * @function
   * @api stable
   */
  loadLayers(context) {
    this.layers = context.layers;
    this.maxExtent = context.maxExtent;

    this.map.addWMS(this.layers, true);

    // updates the z-index of the layers
    this.layers.forEach((layer, i) => layer.setZIndex(this.getZIndex() + i));
    this.facadeLayer_.fire(EventType.LOAD, [this.layers]);
  }

  /**
   * This function set facade class vector
   *
   * @function
   * @param {object} obj - Facade vector
   * @api stable
   */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
  }


  /**
   * This function gets the envolved extent for
   * this WMC
   *
   * @public
   * @function
   * @api stable
   */
  getMaxExtent() {
    const olProjection = getProj(this.map.getProjection().code);
    const promise = new Promise((success, fail) => {
      if (isNullOrEmpty(this.maxExtent)) {
        this.loadContextPromise.then((context) => {
          this.maxExtent = context.maxExtent;
          if (isNullOrEmpty(this.extentProj_)) {
            this.extentProj_ = parameter.projection(M.config.DEFAULT_PROJ).code;
          }
          this.maxExtent = transformExtent(this.maxExtent, this.extentProj_, olProjection);
          this.extentProj_ = olProjection;
          success(this.maxExtent);
        });
      } else {
        this.extentProj_ = olProjection;
        success(this.maxExtent);
      }
    });
    return promise;
  }

  /**
   * This function gets layers loaded from
   * this WMC
   *
   * @public
   * @function
   * @api stable
   */
  getLayers() {
    return this.layers;
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    if (!isNullOrEmpty(this.layers)) {
      this.map.removeLayers(this.layers);
    }
    this.map = null;
    this.layers.length = 0;
    this.wmcDocument = null;
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
}

export default WMC;
