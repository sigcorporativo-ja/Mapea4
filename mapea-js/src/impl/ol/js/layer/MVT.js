/**
 * @module M/impl/layer/MVT
 */
import OLSourceVectorTile from 'ol/source/VectorTile';
import OLLayerVectorTile from 'ol/layer/VectorTile';
import { extend } from 'M/util/Utils';
import * as EventType from 'M/event/eventtype';
import TileEventType from 'ol/source/TileEventType';
import TileState from 'ol/TileState';
import MVTFormatter from 'ol/format/MVT';
import { get as getProj } from 'ol/proj';
import { fromKey } from 'ol/tilecoord';
import Feature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import { mode } from 'M/layer/MVT';
import Vector from './Vector';

/**
 * @classdesc
 * Main constructor of the class. Creates a KML layer
 * with parameters specified by the user
 *
 */
class MVT extends Vector {
  /**
   * @constructor
   * @api
   */
  constructor(parameters, options, vendorOptions) {
    super(options, vendorOptions);
    /**
     *
     * @private
     * @type {ol.format.MVT}
     */
    this.formater_ = null;

    /**
     *
     * @private
     * @type {Boolean}
     */
    this.loaded_ = true;

    /**
     *
     * @private
     * @type {Number}
     */
    this.lastZoom_ = -1;

    /**
     * Projection of the layer.
     *
     * @private
     * @type {ol.proj.Projection}
     */
    this.projection_ = parameters.projection || 'EPSG:3857';

    /**
     * Features of the openlayers source
     * @private
     * @type {ol.render.Feature | ol.Feature}
     */
    this.features_ = [];

    /**
     * Render mode of the layer. Possible values: 'render' | 'feature'.
     *
     * @private
     * @type {string}
     */
    this.mode_ = parameters.mode;
  }

  /**
   * This method adds the vector tile layer to the ol.Map
   *
   * @public
   * @function
   * @api
   */
  addTo(map) {
    this.map = map;
    this.fire(EventType.ADDED_TO_MAP);

    this.formater_ = new MVTFormatter({
      featureClass: this.mode_ === mode.FEATURE ? Feature : RenderFeature,
    });

    const extent = this.facadeVector_.getMaxExtent();
    const source = new OLSourceVectorTile({
      format: this.formater_,
      url: this.url,
      projection: this.projection_,
    });

    this.ol3Layer = new OLLayerVectorTile(extend({
      source,
      extent,
    }, this.vendorOptions_, true));

    if (this.opacity_) {
      this.setOpacity(this.opacity_);
    }
    this.map.getMapImpl().addLayer(this.ol3Layer);

    // clear features when zoom changes
    this.map.on(EventType.CHANGE_ZOOM, () => {
      if (this.map) {
        const newZoom = this.map.getZoom();
        if (this.lastZoom_ !== newZoom) {
          this.features_.length = 0;
          this.lastZoom_ = newZoom;
        }
      }
    });

    // register events in order to fire the LOAD event
    source.on(TileEventType.TILELOADERROR, evt => this.checkAllTilesLoaded_(evt));
    source.on(TileEventType.TILELOADEND, evt => this.checkAllTilesLoaded_(evt));
  }

  /**
   * This function returns all features or discriminating by the filter
   *
   * @function
   * @public
   * @param {boolean} skipFilter - Indicates whether skyp filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<M.Feature>} returns all features or discriminating by the filter
   * @api stable
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
    const currTileCoord = evt.tile.getTileCoord();
    const olProjection = getProj(this.projection_);
    const tileCache = this.ol3Layer.getSource().getTileCacheForProjection(olProjection);
    const tileImages = tileCache.getValues();
    const loaded = tileImages.every((tile) => {
      const tileCoord = tile.getTileCoord();
      const tileState = tile.getState();
      const sameTile = (currTileCoord[0] === tileCoord[0] &&
        currTileCoord[1] === tileCoord[1] &&
        currTileCoord[2] === tileCoord[2]);
      const tileLoaded = sameTile || (tileState !== TileState.LOADING);
      return tileLoaded;
    });
    if (loaded) {
      this.facadeVector_.fire(EventType.LOAD);
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof MVT) {
      equals = this.name === obj.name;
    }
    return equals;
  }
}

export default MVT;
