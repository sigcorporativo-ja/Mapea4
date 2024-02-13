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
   * Removes and creates the ol3layer
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  recreateOlLayer() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
    }
    this.addSingleLayer_();
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

      this.requestFeatures_().then((features) => {
        const isCluster = (this.facadeVector_.getStyle() instanceof StyleCluster);
        let ol3LayerSource = null;
        if (!isNullOrEmpty(this.ol3Layer)) {
          ol3LayerSource = this.ol3Layer.getSource();
        }
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
          /* cluster does infinite calls due to it executes
          the refresh method when it has changed so we prevent
          that checking if the style is not cluster */
          if (!isCluster) {
            ol3LayerSource.changed();
          }
        }
      });
    }
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

  /**
   * Sets the url of the layer
   *
   * @public
   * @function
   * @api stable
   */
  setURL(newURL) {
    this.url = newURL;
    this.recreateOlLayer();
  }

  /**
   * Sets the name of the layer
   *
   * @public
   * @function
   * @api stable
   */
  setName(newName) {
    this.name = newName;
    this.recreateOlLayer();
  }

  /**
   * Sets the namespace of the layer
   *
   * @public
   * @function
   * @api stable
   */
  setNamespace(newNamespace) {
    this.namespace = newNamespace;
    this.recreateOlLayer();
  }

  /**
   * Sets the geometry of the layer
   *
   * @public
   * @function
   * @api stable
   */
  setGeometry(newGeometry) {
    this.geometry = newGeometry;
    this.recreateOlLayer();
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
    return new Promise((resolve) => {
      this.loader_.getLoaderFn((features) => {
        resolve(features);
      })(null, null, getProj(this.map.getProjection().code));
    });
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
