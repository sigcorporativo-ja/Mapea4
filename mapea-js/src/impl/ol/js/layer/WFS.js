/**
 * @module M/impl/layer/WFS
 */
import StyleCluster from 'M/style/Cluster';
import FormatGeoJSON from 'M/format/GeoJSON';
import { isNullOrEmpty } from 'M/util/Utils';
import * as EventType from 'M/event/eventtype';
import OLSourceVector from 'ol/source/Vector';
import OLSourceCluster from 'ol/source/Cluster';
import { get as getProj } from 'ol/proj';
import { all } from 'ol/loadingstrategy';
import ServiceWFS from '../service/WFS';
import FormatImplGeoJSON from '../format/GeoJSON';
import FormatGML from '../format/GML';
import LoaderWFS from '../loader/WFS';
import Vector from './Vector';
import ImplUtils from '../util/Utils';

/**
 * @classdesc
 * @api
 */
class WFS extends Vector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WFS layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.layer.Vector}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @param {Object} vendorOptions vendor options for the base library
   * @api stable
   */
  constructor(options = {}, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);
    /**
     *
     * @private
     * @type {Object}
     */
    this.describeFeatureType_ = null;

    /**
     *
     * @private
     * @type {M.impl.format.GeoJSON | M.impl.format.GML}
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
     * @type {M.iml.service.WFS}
     */
    this.service_ = null;

    /**
     *
     * @private
     * @type {Boolean}
     */
    this.loaded_ = false;

    // GetFeature output format parameter
    if (isNullOrEmpty(this.options.getFeatureOutputFormat)) {
      this.options.getFeatureOutputFormat = 'application/json'; // by default
    }

    /**
     *
     * @private
     * @type {Promise}
     */
    this.loadFeaturesPromise_ = null;
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  addTo(map) {
    super.addTo(map);
    this.updateSource_();
    map.getImpl().on(EventType.CHANGE, () => this.refresh());
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {Boolean} forceNewSource
   * @api stable
   */
  refresh(forceNewSource) {
    if (forceNewSource) {
      this.facadeVector_.removeFeatures(this.facadeVector_.getFeatures(true));
    }
    this.updateSource_(forceNewSource);
  }

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  updateSource_(forceNewSource) {
    if (isNullOrEmpty(this.vendorOptions_.source)) {
      this.service_ = new ServiceWFS({
        url: this.url,
        namespace: this.namespace,
        name: this.name,
        version: this.version,
        ids: this.ids,
        cql: this.cql,
        projection: this.map.getProjection(),
        getFeatureOutputFormat: this.options.getFeatureOutputFormat,
        describeFeatureTypeOutputFormat: this.options.describeFeatureTypeOutputFormat,
      }, this.options.vendor);
      if (/json/gi.test(this.options.getFeatureOutputFormat)) {
        this.formater_ = new FormatGeoJSON({
          defaultDataProjection: getProj(this.map.getProjection().code),
        });
      } else {
        this.formater_ = new FormatGML(this.name, this.version, this.map.getProjection());
      }
      this.loader_ = new LoaderWFS(this.map, this.service_, this.formater_);


      const isCluster = (this.facadeVector_.getStyle() instanceof StyleCluster);
      let ol3LayerSource = this.ol3Layer.getSource();
      this.requestFeatures_().then((features) => {
        if (forceNewSource === true || isNullOrEmpty(ol3LayerSource)) {
          const newSource = new OLSourceVector({
            loader: () => {
              this.loaded_ = true;
              this.facadeVector_.addFeatures(features);
              this.fire(EventType.LOAD, [features]);
              this.facadeVector_.redraw();
            },
          });

          if (isCluster) {
            const distance = this.facadeVector_.getStyle().getOptions().distance;
            const clusterSource = new OLSourceCluster({
              distance,
              source: newSource,
            });
            this.ol3Layer.setStyle(this.facadeVector_.getStyle().getImpl().olStyleFn);
            this.ol3Layer.setSource(clusterSource);
          } else if (this.ol3Layer) {
            this.ol3Layer.setSource(newSource);
          }
        } else {
          if (isCluster) {
            ol3LayerSource = ol3LayerSource.getSource();
          }
          ol3LayerSource.set('format', this.formater_);
          ol3LayerSource.set('loader', this.loader_.getLoaderFn((features2) => {
            this.loaded_ = true;
            this.facadeVector_.addFeatures(features2);
            this.fire(EventType.LOAD, [features2]);
            this.facadeVector_.redraw();
          }));
          ol3LayerSource.set('strategy', all);
          ol3LayerSource.changed();
        }
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
  getFeaturesExtent(skipFilter, filter) {
    const codeProj = this.map.getProjection().code;
    const features = this.getFeatures(skipFilter, filter);
    const extent = ImplUtils.getFeaturesExtent(features, codeProj);
    return extent;
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

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  setCQL(newCQL) {
    this.cql = newCQL;
    this.refresh(true);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getDescribeFeatureType() {
    if (isNullOrEmpty(this.describeFeatureType_)) {
      this.describeFeatureType_ =
        this.service_.getDescribeFeatureType().then((describeFeatureType) => {
          if (!isNullOrEmpty(describeFeatureType)) {
            this.formater_ = new FormatImplGeoJSON({
              geometryName: describeFeatureType.geometryName,
              defaultDataProjection: getProj(this.map.getProjection().code),
            });
          }
          return describeFeatureType;
        });
    }

    return this.describeFeatureType_;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getDefaultValue(type) {
    let defaultValue;
    if (type === 'dateTime') {
      defaultValue = '0000-00-00T00:00:00';
    } else if (type === 'date') {
      defaultValue = '0000-00-00';
    } else if (type === 'time') {
      defaultValue = '00:00:00';
    } else if (type === 'duration') {
      defaultValue = 'P0Y';
    } else if (type === 'int' || type === 'number' || type === 'float' || type === 'double' || type === 'decimal' || type === 'short' || type === 'byte' || type === 'integer' || type === 'long' || type === 'negativeInteger' || type === 'nonNegativeInteger' || type === 'nonPositiveInteger' || type === 'positiveInteger' || type === 'unsignedLong' || type === 'unsignedInt' || type === 'unsignedShort' || type === 'unsignedByte') {
      defaultValue = 0;
    } else if (type === 'hexBinary') {
      defaultValue = null;
    } else {
      defaultValue = '-';
    }
    return defaultValue;
  }

  // /**
  //  * This function destroys this layer, cleaning the HTML
  //  * and unregistering all events
  //  *
  //  * @public
  //  * @function
  //  * @api stable
  //  */
  // destroy() {
  //   let olMap = this.map.getMapImpl();
  //   if (!isNullOrEmpty(this.ol3Layer)) {
  //     olMap.removeLayer(this.ol3Layer);
  //     this.ol3Layer = null;
  //   }
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
   * TODO
   */
  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  requestFeatures_() {
    if (isNullOrEmpty(this.loadFeaturesPromise_)) {
      this.loadFeaturesPromise_ = new Promise((resolve) => {
        this.loader_.getLoaderFn((features) => {
          resolve(features);
        })(null, null, getProj(this.map.getProjection().code));
      });
    }
    return this.loadFeaturesPromise_;
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

    if (obj instanceof WFS) {
      equals = (this.url === obj.url);
      equals = equals && (this.namespace === obj.namespace);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.ids === obj.ids);
      equals = equals && (this.cql === obj.cql);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }
}

export default WFS;
