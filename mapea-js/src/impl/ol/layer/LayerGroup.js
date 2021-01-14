/**
 * @module M/impl/layer/LayerGroup
 */
// import { isNullOrEmpty } from 'M/util/Utils';
import MObject from 'M/Object';
/**
 * @classdesc
 * @api
 */
class LayerGroup extends MObject {
  constructor(id, title, order) {
    super();

    /**
     * Id of LayerGroup
     * @private
     * @type {String}
     */
    this.id_ = id;

    /**
     * Title of LayerGroup
     * @private
     * @type {String}
     */
    this.title_ = title;

    /**
     * Order LayerGroup
     * @private
     * @type {Integer}
     */
    this.order_ = order;

    /**
     * zindex of LayerGroup
     * @private
     * @type {Object}
     */
    this.zindex_ = null;
  }
}

export default LayerGroup;
