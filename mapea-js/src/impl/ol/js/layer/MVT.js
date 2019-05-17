/**
 * @module M/impl/layer/MVT
 */
import OLSourceVectorTile from 'ol/source/VectorTile';
import OLLayerVectorTile from 'ol/layer/VectorTile';
import { extend } from 'M/util/Utils';
import * as EventType from 'M/event/eventtype';
import MVTFormatter from 'ol/format/MVT';
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
    });

    this.ol3Layer = new OLLayerVectorTile(extend({
      source,
      extent,
    }, this.vendorOptions_, true));

    this.map.getMapImpl().addLayer(this.ol3Layer);
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
