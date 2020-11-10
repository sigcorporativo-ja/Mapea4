/**
 * @module M/impl/layer/MBTilesVector
 */
import { isNullOrEmpty } from 'M/util/Utils';
import { get as getProj, transformExtent } from 'ol/proj';
import OLLayerTile from 'ol/layer/Tile';
import OLLayerVectorTile from 'ol/layer/VectorTile';
import OLSourceVectorTile from 'ol/source/VectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';
import { getBottomLeft, getWidth } from 'ol/extent';
import * as LayerType from 'M/layer/Type';
import TileProvider from 'M/provider/Tile';
import * as EventType from 'M/event/eventtype';
import { fromKey } from 'ol/tilecoord';
import MVT from 'ol/format/MVT';
// import Feature from 'ol/Feature';
import TileState from 'ol/TileState';
import TileEventType from 'ol/source/TileEventType';
import ImplMap from '../Map';
import Vector from './Vector';

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
class MBTilesVector extends Vector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a MBTilesVector implementation layer
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
     * MBTilesVector url
     * @private
     * @type {string}
     */
    this.url_ = userParameters.url;

    /**
     * MBTilesVector source
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

    /**
     * Z-index of the layer
     * @private
     * @type {number}
     */
    this.zIndex_ = ImplMap.Z_INDEX[LayerType.MBTilesVector];

    /**
     * Visibility of the layer
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
   * @param {M/Map} map
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
        this.tileProvider_.getFormat().then((format) => {
          this.ol3Layer = this.createLayer({
            tileProvider,
            resolutions,
            extent: reprojectedExtent,
            sourceExtent: extent,
            projection,
            format,
          });

          this.ol3Layer
            .getSource().on(TileEventType.TILELOADERROR, evt => this.checkAllTilesLoaded_(evt));
          this.ol3Layer
            .getSource().on(TileEventType.TILELOADEND, evt => this.checkAllTilesLoaded_(evt));

          this.map.on(EventType.CHANGE_ZOOM, () => {
            if (this.map) {
              const newZoom = this.map.getZoom();
              if (this.lastZoom_ !== newZoom) {
                this.features_.length = 0;
                this.lastZoom_ = newZoom;
              }
            }
          });

          this.map.getMapImpl().addLayer(this.ol3Layer);
        });
      });
    });
  }

  /** This function create the implementation ol layer.
   *
   * @param {object} opts
   * @return {ol/layer/TileLayer|ol/layer/VectorTile}
   * @api
   */
  createLayer(opts) {
    const mvtFormat = new MVT();
    const layer = new OLLayerVectorTile({
      visible: this.visibility,
      opacity: this.opacity_,
      zIndex: this.zIndex_,
      extent: this.maxExtent_ || opts.extent,
      source: new OLSourceVectorTile({
        projection: opts.projection,
        url: '{z},{x},{y}',
        tileLoadFunction: tile => this.loadVectorTile(tile, mvtFormat, opts),
        tileGrid: new TileGrid({
          extent: opts.sourceExtent,
          origin: getBottomLeft(opts.sourceExtent),
          resolutions: opts.resolutions,
        }),
      }),
    });
    return layer;
  }

  /**
   * This function is the custom tile loader function of
   * TileLayer
   * @param {ol/Tile} tile
   * @param {ol/format/MVT} formatter
   * @param {M/provider/Tile} tileProvider
   * @function
   * @api
   */
  loadVectorTile(tile, formatter, opts) {
    tile.setState(TileState.LOADING);
    tile.setLoader((extent, resolution, projection) => {
      const tileCoord = tile.getTileCoord();
      opts.tileProvider.getVectorTile([tileCoord[0], tileCoord[1], -tileCoord[2] - 1])
        .then((pbf) => {
          if (pbf) {
            const features = formatter.readFeatures(pbf, {
              extent,
              featureProjection: projection,
            });
            tile.setFeatures(features);
            tile.setState(TileState.LOADED);
          } else {
            tile.setState(TileState.ERROR);
          }
        });
    });
  }

  /**
   *
   */
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

    if (obj instanceof MBTilesVector) {
      equals = (this.name === obj.name);
    }

    return equals;
  }

  /**
   * This function returns all features or discriminating by the filter
   *
   * @function
   * @public
   * @param {boolean} skipFilter - Indicates whether skyp filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<M.Feature>} returns all features or discriminating by the filter
   * @api
   */
  getFeatures(skipFilter, filter) {
    let features = [];
    if (this.ol3Layer) {
      const olSource = this.ol3Layer.getSource();
      const tileCache = olSource.tileCache;
      if (tileCache.getCount() === 0) {
        return features;
      }
      const z = fromKey(tileCache.peekFirstKey())[0];
      tileCache.forEach((tile) => {
        if (tile.tileCoord[0] !== z || tile.getState() !== TileState.LOADED) {
          return;
        }
        const sourceTiles = tile.getSourceTiles();
        for (let i = 0, ii = sourceTiles.length; i < ii; i += 1) {
          const sourceTile = sourceTiles[i];
          const olFeatures = sourceTile.getFeatures();
          if (olFeatures) {
            features = features.concat(olFeatures);
          }
        }
      });
    }
    return features;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @private
   * @function
   * @param {ol/source/Tile.TileSourceEvent} evt
   */
  checkAllTilesLoaded_(evt) {
    const { code } = this.map.getProjection();
    const currTileCoord = evt.tile.getTileCoord();
    const olProjection = getProj(code);
    const tileCache = this.ol3Layer.getSource().getTileCacheForProjection(olProjection);
    const tileImages = tileCache.getValues();
    const loaded = tileImages.some((tile) => {
      const tileCoord = tile.getTileCoord();
      const tileState = tile.getState();
      const sameTile = (currTileCoord[0] === tileCoord[0] &&
        currTileCoord[1] === tileCoord[1] &&
        currTileCoord[2] === tileCoord[2]);
      const tileLoaded = sameTile || (tileState !== TileState.LOADING);
      return tileLoaded;
    });
    if (loaded && !this.loaded_) {
      this.loaded_ = true;
      this.facadeLayer_.fire(EventType.LOAD);
    }
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

export default MBTilesVector;
