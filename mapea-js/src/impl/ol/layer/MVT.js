/**
 * @module M/impl/layer/MVT
 */
import OLSourceVectorTile from 'ol/source/VectorTile';
import OLLayerVectorTile from 'ol/layer/VectorTile';
import { extend } from 'M/util/Utils';
import * as EventType from 'M/event/eventtype';
// import TileEventType from 'ol/source/TileEventType';
import TileState from 'ol/TileState';
import MVTFormatter from 'ol/format/MVT';
// import { get as getProj } from 'ol/proj';
import { fromKey } from 'ol/tilecoord';
import Feature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import { mode } from 'M/layer/MVT';
import Vector from './Vector';
import { isNullOrEmpty } from '../../../facade/js/util/Utils';

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

    /**
     * Function to override the ol tile loading.
     *
     * @private
     * @type {string}
     */
    this.tileLoadFunction = options.tileLoadFunction;

    /**
     * Loaded flag attribute
     *
     * @private
     * @type {bool}
     */
    this.loaded_ = false;
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

    this.formater_ = new MVTFormatter({
      featureClass: this.mode_ === mode.FEATURE ? Feature : RenderFeature,
    });

    const extent = this.facadeVector_.getMaxExtent();
    const ticket = this.map.getTicket();
    const url = isNullOrEmpty(ticket) ? this.url : `${this.url}?ticket=${ticket}`;

    const source = new OLSourceVectorTile({
      format: this.formater_,
      url,
      projection: this.projection_,
      tileLoadFunction: this.tileLoadFunction,
    });

    // register events in order to fire the LOAD event
    // source.on(TileEventType.TILELOADERROR, evt => this.checkAllTilesLoaded_(evt));
    // source.on(TileEventType.TILELOADEND, evt => this.checkAllTilesLoaded_(evt));

    this.ol3Layer = new OLLayerVectorTile(extend({
      source,
      extent,
    }, this.vendorOptions_, true));

    if (this.opacity_) {
      this.setOpacity(this.opacity_);
    }

    this.map.getMapImpl().addLayer(this.ol3Layer);
    this.loaded_ = true;
    this.facadeVector_.fire(EventType.LOAD);

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
    this.fire(EventType.ADDED_TO_MAP);
    this.facadeVector_?.fire(EventType.ADDED_TO_MAP);
  }

  /**
   * This function sets 
   * the tileLoadFunction
   *
   * @public
   * @function
   * @api stable
   */
  setTileLoadFunction(func){
    this.getOLLayer().getSource().setTileLoadFunction(func);
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
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   * @expose
   */
  setVisible(visibility) {
    this.visibility = visibility;
    if ((visibility === true) && (this.transparent !== true)) {
      this.map.getBaseLayers()
        .filter(layer => !layer.equals(this) && layer.isVisible())
        .forEach(layer => layer.setVisible(false));
      this.ol3Layer.setVisible(visibility);
      // updates resolutions and keep the zoom
      const oldZoom = this.map.getZoom();
      this.map.getImpl().updateResolutionsFromBaseLayer();
      if (!isNullOrEmpty(oldZoom)) {
        this.map.setZoom(oldZoom);
      }
      // updates resolutions and keep the bbox
      const oldBbox = this.map.getBbox();
      if (!isNullOrEmpty(oldBbox)) {
        this.map.setBbox(oldBbox, { nearest: true });
      }
    } else if (!isNullOrEmpty(this.ol3Layer)) {
      this.ol3Layer.setVisible(visibility);
    }
  }

  // /**
  //  * This function checks if an object is equals
  //  * to this layer
  //  *
  //  * @private
  //  * @function
  //  * @param {ol/source/Tile.TileSourceEvent} evt
  //  */
  // checkAllTilesLoaded_(evt) {
  //   const currTileCoord = evt.tile.getTileCoord();
  //   const olProjection = getProj(this.projection_);
  //   const tileCache = this.ol3Layer.getSource().getTileCacheForProjection(olProjection);
  //   const tileImages = tileCache.getValues();
  //   const loaded = tileImages.every((tile) => {
  //     const tileCoord = tile.getTileCoord();
  //     const tileState = tile.getState();
  //     const sameTile = (currTileCoord[0] === tileCoord[0] &&
  //       currTileCoord[1] === tileCoord[1] &&
  //       currTileCoord[2] === tileCoord[2]);
  //     const tileLoaded = sameTile || (tileState !== TileState.LOADING);
  //     return tileLoaded;
  //   });
  //   if (loaded && !this.loaded_) {
  //     this.loaded_ = true;
  //     this.facadeVector_.fire(EventType.LOAD);
  //   }
  // }

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
