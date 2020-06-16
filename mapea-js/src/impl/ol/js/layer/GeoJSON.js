/**
 * @module M/impl/layer/GeoJSON
 */
import { isNullOrEmpty, isObject } from 'M/util/Utils';
import * as EventType from 'M/event/eventtype';
import GeoJSONFormat from 'M/format/GeoJSON';
import OLSourceVector from 'ol/source/Vector';
import { get as getProj } from 'ol/proj';
import Vector from './Vector';
import JSONPLoader from '../loader/JSONP';
import ImplUtils from '../util/Utils';

/**
 * @classdesc
 * @api
 */
class GeoJSON extends Vector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.layer.Vector}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @param {Object} vendorOptions vendor options for the base library
   * @api stable
   */
  constructor(parameters, options, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);

    /**
     * Popup showed
     * @private
     * @type {M.impl.Popup}
     */
    this.popup_ = null;

    /**
     *
     * @private
     * @type {M.impl.format.GeoJSON}
     */
    this.formater_ = null;

    /**
     *
     * @private
     * @type {function}
     */
    this.loader_ = null;

    /**
     *
     * @private
     * @type {Promise}
     */
    this.loadFeaturesPromise_ = null;

    /**
     *
     * @private
     * @type {Boolean}
     */
    this.loaded_ = false;

    /**
     *
     * @private
     * @type {Array<String>}
     */
    this.hiddenAttributes_ = [];
    if (!isNullOrEmpty(options.hide)) {
      this.hiddenAttributes_ = options.hide;
    }

    /**
     *
     * @private
     * @type {Array<String>}
     */
    this.showAttributes_ = [];
    if (!isNullOrEmpty(options.show)) {
      this.showAttributes_ = options.show;
    }
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
    this.formater_ = new GeoJSONFormat({
      defaultDataProjection: getProj(map.getProjection().code),
    });
    if (!isNullOrEmpty(this.url)) {
      this.loader_ = new JSONPLoader(map, this.url, this.formater_);
    }
    super.addTo(map);
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  refresh(source = null) {
    const features = this.formater_.write(this.facadeVector_.getFeatures());
    const codeProjection = this.map.getProjection().code.split(':')[1];
    let newSource = {
      type: 'FeatureCollection',
      features,
      crs: {
        properties: {
          code: codeProjection,
        },
        type: 'EPSG',
      },
    };
    if (isObject(source)) {
      newSource = source;
    }
    this.source = newSource;
    this.updateSource_();
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  setSource(source) {
    this.source = source;
    if (!isNullOrEmpty(this.map)) {
      this.updateSource_();
    }
  }

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  requestFeatures_() {
    if (this.source) {
      this.loadFeaturesPromise_ = new Promise((resolve) => {
        const features = this.formater_.read(this.source, this.map.getProjection());
        resolve(features);
      });
    } else if (isNullOrEmpty(this.loadFeaturesPromise_)) {
      this.loadFeaturesPromise_ = new Promise((resolve) => {
        this.loader_.getLoaderFn((features) => {
          resolve(features);
        })(null, null, getProj(this.map.getProjection().code));
      });
    }
    return this.loadFeaturesPromise_;
  }

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  updateSource_() {
    if (isNullOrEmpty(this.vendorOptions_.source)) {
      this.requestFeatures_().then((features) => {
        if (this.ol3Layer) {
          this.ol3Layer.setSource(new OLSourceVector({
            loader: (extent, resolution, projection) => {
              this.loaded_ = true;
              // removes previous features
              this.facadeVector_.clear();
              this.facadeVector_.addFeatures(features);
              this.fire(EventType.LOAD, [features]);
            },
          }));
        }
        this.facadeVector_.addFeatures(features);
      });
    }
  }

  /**
   * This function return extent of all features or discriminating by the filter
   *
   * @function
   * @param {boolean} skipFilter - Indicates whether skip filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<number>} Extent of features
   * @api stable
   */
  getFeaturesExtentPromise(skipFilter, filter) {
    return new Promise((resolve) => {
      const codeProj = this.map.getProjection().code;
      if (this.isLoaded() === true) {
        const features = this.getFeatures(skipFilter, filter);
        const extent = ImplUtils.getFeaturesExtent(features, codeProj);
        resolve(extent);
      } else {
        this.requestFeatures_().then((features) => {
          const extent = ImplUtils.getFeaturesExtent(features, codeProj);
          resolve(extent);
        });
      }
    });
  }

  // /**
  //  * This function destroys this layer, cleaning the HTML
  //  * and unregistering all events
  //  *
  //  * @public
  //  * @function
  //  * @api stable
  //  */
  // destroy () {
  //   let olMap = this.map.getMapImpl();
  //
  //   if (!isNullOrEmpty(this.ol3Layer)) {
  //     olMap.removeLayer(this.ol3Layer);
  //     this.ol3Layer = null;
  //   }
  //   this.options = null;
  //   this.map = null;
  // };

  /**
   * TODO
   * @function
   * @api stable
   */
  isLoaded() {
    return this.loaded_;
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

    if (obj instanceof GeoJSON) {
      equals = equals && (this.name === obj.name);
      equals = equals && (this.extract === obj.extract);
    }
    return equals;
  }
}

export default GeoJSON;
