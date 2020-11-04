/**
 * @module M/impl/layer/MBTiles
 */
import { isNullOrEmpty } from 'M/util/Utils';
import { get as getProj, transformExtent } from 'ol/proj';
import OLLayerTile from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import { getBottomLeft, getWidth } from 'ol/extent';
import * as LayerType from 'M/layer/Type';
import TileProvider from 'M/provider/Tile';
import MBTilesSource from '../source/MBTiles';
import ImplMap from '../Map';
import Layer from './Layer';

/**
 * Default tile size of MBTiles
 * @const
 * @private
 * @type {number}
 */
const DEFAULT_TILE_SIZE = 256;

/**
 * @function
 * @private
 */
const generateResolutions = (extent, tileSize, zoomLevels) => {
  const width = getWidth(extent);
  const size = width / tileSize;
  const resolutions = new Array(zoomLevels);
  for (let z = 0; z < zoomLevels; z += 1) {
    resolutions[z] = size / (2 ** z);
  }
  return resolutions;
};


/**
 * @classdesc
 * @api
 */
class MBTiles extends Layer {
  /**
   * @classdesc
   * Main constructor of the class. Creates a MBTiles implementation layer
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
     * MBTiles url
     * @private
     * @type {string}
     */
    this.url_ = userParameters.url;

    /**
     * MBTiles source
     * @type {ArrayBuffer|Uint8Array|Response|File}
     */
    this.source_ = userParameters.source;

    /**
     * Tile size (default value 256)
     * @private
     * @type {number}
     */
    this.tileSize_ = typeof userParameters.tileSize === 'number' ? userParameters.tileSize : DEFAULT_TILE_SIZE;

    /**
     * Layer extent
     * @private
     * @type {Mx.Extent}
     */
    this.maxExtent_ = userParameters.maxExtent || null;

    /**
     * Min zoom level
     * @private
     * @type {number}
     */
    this.minZoomLevel_ = typeof userParameters.minZoomLevel === 'number' ? userParameters.minZoomLevel : 0;

    /**
     * Max zoom level
     * @private
     * @type {number}
     */
    this.maxZoomLevel_ = typeof userParameters.maxZoomLevel === 'number' ? userParameters.maxZoomLevel : 0;

    /**
     * Layer opacity
     * @private
     * @type {number}
     */
    this.opacity_ = typeof options.opacity === 'number' ? options.opacity : 1;

    this.zIndex_ = ImplMap.Z_INDEX[LayerType.MBTiles];

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
    const { code } = this.map.getProjection();
    const projection = getProj(code);
    const extent = projection.getExtent();

    const resolutions = generateResolutions(extent, this.tileSize_, 16);
    this.fetchSource().then((tileProvider) => {
      this.tileProvider_ = tileProvider;
      this.tileProvider_.getExtent().then((mbtilesExtent) => {
        let reprojectedExtent = mbtilesExtent;
        if (reprojectedExtent) {
          reprojectedExtent = transformExtent(mbtilesExtent, 'EPSG:4326', code);
        }
        this.ol3Layer = new OLLayerTile({
          visible: this.visibility,
          opacity: this.opacity_,
          zIndex: this.zIndex_,
          extent: this.maxExtent_ || reprojectedExtent,
          source: new MBTilesSource({
            projection,
            tileLoadFunction: tile => this.loadTile(tile, tileProvider),
            tileGrid: new TileGrid({
              extent,
              origin: getBottomLeft(extent),
              resolutions,
            }),
          }),
        });
        this.map.getMapImpl().addLayer(this.ol3Layer);
      });
    });
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
    this.ol3Layer.setExtent(maxExtent);
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

    if (obj instanceof MBTiles) {
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

export default MBTiles;
