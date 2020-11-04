/**
 * @module M/impl/layer/GeoPackageTile
 */
import { isNullOrEmpty } from 'M/util/Utils';
// import { get as getProj } from 'ol/proj';
import OLLayerTile from 'ol/layer/Tile';
// import TileGrid from 'ol/tilegrid/TileGrid';
// import { getBottomLeft, getWidth } from 'ol/extent';
import * as LayerType from 'M/layer/Type';
import TileProvider from 'M/provider/Tile';
// import GeoPackageTileSource from '../source/MBTiles.js';
import ImplMap from '../Map';
import Layer from './Layer';

/**
 * @function
 * @private
 */
// const generateResolutions = (extent, tileSize, zoomLevels) => {
//   const width = getWidth(extent);
//   const size = width / tileSize;
//   const resolutions = new Array(zoomLevels);
//   for (let z = 0; z < zoomLevels; z += 1) {
//     resolutions[z] = size / (2 ** z);
//   }
//   return resolutions;
// };


/**
 * @classdesc
 * @api
 */
class GeoPackageVector extends Layer {
  /**
   * @classdesc
   * Main constructor of the class. Creates a GeoPackageVector implementation layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);

    /**
     * Layer extent
     * @private
     * @type {Mx.Extent}
     */
    this.maxExtent_ = userParameters.maxExtent || null;

    /**
     * Layer opacity
     * @private
     * @type {number}
     */
    this.opacity_ = typeof options.opacity === 'number' ? options.opacity : 1;

    /**
     * Z Index of layer
     * @private
     * @type {number}
     */
    this.zIndex_ = ImplMap.Z_INDEX[LayerType.GeoPackageVector];

    /**
     * Visibility of layer
     * @private
     * @type {boolean}
     */
    this.visibility = userParameters.visibility === false ? userParameters.visibility : true;
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api
   */
  setVisible(visibility) {
    this.visibility = visibility;
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @api
   */
  addTo(map) {
    this.map = map;
    // const projection = getProj('EPSG:3857');
    // const extent = projection.getExtent();

    // const resolutions = generateResolutions(extent, this.tileSize_, 16);
    // this.fetchSource().then((tileProvider) => {
    //   this.tileProvider_ = tileProvider;
    //   this.ol3Layer = new OLLayerTile({
    //     visible: this.visibility,
    //     opacity: this.opacity_,
    //     zIndex: this.zIndex_,
    //     extent,
    //     source: new GeoPackageVectorSource({
    //       projection,
    //       tileLoadFunction: tile => this.loadTile(tile, tileProvider),
    //       tileGrid: new TileGrid({
    //         extent,
    //         origin: getBottomLeft(extent),
    //         resolutions,
    //       }),
    //     }),
    //   });

    //   this.map.getMapImpl().addLayer(this.ol3Layer);
    // });
  }

  loadTile(tile, tileProvider) {
    const imgTile = tile;
    const tileCoord = tile.getTileCoord();
    const tileSrc = tileProvider.getTile([tileCoord[0], tileCoord[1], -tileCoord[2] - 1]);
    imgTile.getImage().src = tileSrc;
  }

  fetchSource() {
    return new Promise((resolve, reject) => {
      if (this.tileProvider_) {
        resolve(this.tileProvider_);
      } else if (this.source_) {
        const tileProvider = new TileProvider(this.source_);
        resolve(tileProvider);
      } else if (this.url_) {
        throw new Error('');
      } else {
        reject(new Error('No url or source was specified.'));
      }
    });
  }

  /**
   * This function set facade class OSM
   *
   * @function
   * @api
   */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
  }

  /**
   * TODO
   */
  setMaxExtent(maxExtent) {
    // this.ol3Layer.setExtent(maxExtent);
  }

  /**
   *
   * @public
   * @function
   * @api
   */
  getMinResolution() {}

  /**
   *
   * @public
   * @function
   * @api
   */
  getMaxResolution() {}

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    this.map = null;
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

    if (obj instanceof GeoPackageVector) {
      equals = (this.name === obj.name);
    }

    return equals;
  }

  /**
   * This methods returns a layer clone of this instance
   * @return {ol/layer/Tile}
   */
  cloneOLLayer() {
    let olLayer = null;
    if (this.ol3Layer != null) {
      const properties = this.ol3Layer.getProperties();
      olLayer = new OLLayerTile(properties);
    }
    return olLayer;
  }
}

export default GeoPackageVector;
