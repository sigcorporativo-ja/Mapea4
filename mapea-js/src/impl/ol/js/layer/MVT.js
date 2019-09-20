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

import Vector from './Vector';
import FeatureImpl from '../feature/Feature';

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
     * Popup showed
     * @private
     * @type {M.impl.Popup}
     */
    this.popup_ = null;

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
    source.on(TileEventType.TILELOADEND, evt => this.parseFeaturesFromTile_(evt));
  }

  /**
   * This function parses the tiled features contained
   * in the loaded tile
   *
   * @private
   * @function
   * @param {ol/source/Tile.TileSourceEvent} evt
   */
  parseFeaturesFromTile_(evt) {
    const vectorTile = evt.tile;
    const renderFeatures = vectorTile.getFeatures();
    const tileProjection = vectorTile.getProjection();
    const mapProjection = getProj(this.projection_);
    const features = renderFeatures.map(rf => FeatureImpl
      .olRenderFeature2Facade(rf, tileProjection, mapProjection)).filter(f => f !== null);
    this.features_ = [...this.features_, ...features];
    this.checkAllTilesLoaded_(evt);
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
