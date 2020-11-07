/**
 * @module M/layer/GeoPackage
 */
import MObject from '../Object.js';
import GeoPackageProvider from '../geopackage/GeoPackageConnector.js';
import GeoJSON from './GeoJSON.js';
import GeoPackageTile from './GeoPackageTile.js';
import { extend } from '../util/Utils.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a Geopackage layer
 * with parameters specified by the user*
 * @api
 */
class GeoPackage extends MObject {
  /**
   * @constructor
   * @extends {MObject}
   * @api
   */
  constructor(data, options = {}) {
    super({});

    /**
     * Layers of the geopackage
     * @type {M/layer/GeoPackageTile|M/layer/GeoPackageVector}
     * @private
     */
    this.layers_ = {};

    /**
     * Geopackage connector
     * @type {provider/GeoPackage}
     * @private
     */
    this.connector_ = new GeoPackageProvider(data, options);

    /**
     * Options paramenter
     * @type {object}
     * @public
     */
    this.options = options;
  }

  /**
   * This method adds the layers of geopackage
   * @function
   * @param {M/Map} map
   * @api
   */
  addTo(map) {
    this.map_ = map;
    this.connector_.getVectorProviders().then((vectorProviders) => {
      vectorProviders.forEach((vectorProvider) => {
        const geojson = vectorProvider.getGeoJSON();
        const tableName = vectorProvider.getTableName();
        const optsExt = extend(this.options[tableName] || {}, { name: tableName });
        const vectorLayer = new GeoJSON({
          ...optsExt,
          source: geojson,
        });

        this.layers_[tableName] = vectorLayer;
        map.addLayers(vectorLayer);
      });
    });

    this.connector_.getTileProviders().then((tileProviders) => {
      tileProviders.forEach((tileProvider) => {
        const tableName = tileProvider.getTableName();
        const optsExt = extend(this.options[tableName] || {}, {
          name: tableName,
          legend: tableName,
        });
        const tileLayer = new GeoPackageTile(optsExt, tileProvider);

        this.layers_[tableName] = tileLayer;
        map.addLayers(tileLayer);
      });
    });
  }

  /**
   * This method gets the layers of geopackage
   * @function
   * @return {array<M/layer/GeoPackageTile|M/layer/GeoPackageVector>}
   * @api
   */
  getLayers() {
    return Object.values(this.layers_);
  }

  /**
   * This method gets the layer of geopackage by table name
   * @function
   * @param {string} tableName
   * @return {M/layer/GeoPackageTile|M/layer/GeoPackageVector}
   * @api
   */
  getLayer(tableName) {
    return this.layers_[tableName] || null;
  }

  /**
   * This method removes all layers of geopackage
   * @function
   * @api
   */
  removeLayers() {
    this.map_.removeLayers(this.getLayers());
  }

  /**
   * This method remove the layer of geopackage by table name
   * @function
   * @param {string} tableName
   * @api
   */
  removeLayer(tableName) {
    this.map_.removeLayers(this.getLayer(tableName));
  }
}

export default GeoPackage;
