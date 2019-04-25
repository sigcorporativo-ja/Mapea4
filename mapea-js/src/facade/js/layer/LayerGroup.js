/**
 * @module M/Layer/LayerGroup
 */

import MapImpl from 'impl/Map';
import MObject from 'M/Object';
import LayerBase from './Layer';
import WMC from './WMC';
import { isNullOrEmpty } from '../util/Utils';

/**
 * @constructor
 * @extends {M.facade.Base}
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @api stable
 */
class LayerGroup extends MObject {
  constructor(id, title, order) {
    // calls the super constructor
    super();
    /**
     * @public
     * @type {String}
     * @api stable
     */
    this.id = id;
    /**
     * @public
     * @type {String}
     * @api stable
     */
    this.title = title || 'Conjunto de Servicios WMS';
    /**
     * @public
     * @type {Boolean}
     * @api stable
     */
    this.collapsed = true;
    /**
     * @public
     * @type {Number}
     * @api stable
     */
    this.order = order;
    /**
     * @public
     * @type {M.layer.Group}
     * @api stable
     */
    this.parent = null;
    /**
     * @private
     * @type {Array<M.layer.Group|M.Layer>}
     * @expose
     */
    this.children_ = [];
    /**
     * @private
     * @type {Boolean}
     * @expose
     */
    this.visible_ = false;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  isVisible() {
    return this.visible_;
  }
  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  setVisible(visibility) {
    this.visible_ = visibility;
    this.getAllLayers().forEach(l => (l.transparent === true) && l.setVisible(this.visible_));
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  setZIndex(zIndex) {
    // TODO
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  getZIndex(zIndex) {
    return MapImpl.Z_INDEX[WMC] + this.order;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  addChild(child, index) {
    const children = child;
    if (isNullOrEmpty(index)) {
      this.children_.push(child);
    } else {
      this.children_.splice(index, 0, child);
    }
    if (children instanceof LayerGroup) {
      children.parent = this;
    } else if (children instanceof LayerBase) {
      children.group = this;
    }
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  removeChild(child) {
    const children = child;
    this.children_.remove(children);
    if (children instanceof LayerGroup) {
      children.parent = null;
    } else if (child instanceof LayerBase) {
      children.group = null;
    }
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  addChildren(children = []) {
    children.forEach(this.addChild, this);
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  getChildren() {
    return this.children_;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  getAllLayers() {
    const layers = [];
    this.getChildren().forEach((child) => {
      if (child instanceof LayerBase) {
        layers.push(child);
      } else if (child instanceof LayerGroup) {
        layers.push(child.getAllLayers());
      }
    });
    return layers;
  }

  /**
   * @public
   * @function
   * @api stable
   * @export
   */
  static findGroupById(groupId, layerGroups) {
    let group;
    if (!isNullOrEmpty(layerGroups) && Array.isArray(layerGroups)) {
      layerGroups.forEach((layerGroup) => {
        if (layerGroup instanceof LayerGroup) {
          const idLayerGroup = !isNullOrEmpty(layerGroup.id.title) ?
            layerGroup.id.title.replace(/\s/g, '_') : layerGroup.title.replace(/\s/g, '_');
          if (idLayerGroup === groupId) {
            group = layerGroup;
          }
        }
      });
    }
    return group;
  }
}

export default LayerGroup;
