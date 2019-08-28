/**
 * @module M/layer/LayerGroup
 */

import LayerGroupImpl from 'impl/layer/LayerGroup';
import MObject from 'M/Object';
import * as EventType from 'M/event/eventtype';
import LayerBase from './Layer';

// import WMC from './WMC';
import { isNullOrEmpty, isArray, generateRandom } from '../util/Utils';

/**
 * @constructor
 * @extends {M.facade.Base}
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @api stable
 */
class LayerGroup extends MObject {
  constructor(id, title, order) {
    /**
     * Implementation of this layer
     * @public
     * @type {M.impl.layer.LayerGroup}
     */
    const impl = new LayerGroupImpl(id, title, order);
    // calls the super constructor
    super(impl);
    /**
     * @public
     * @type {String}
     * @api stable
     */
    this.id = id;
    if (isNullOrEmpty(this.id)) {
      this.id = generateRandom('mapea_layer_group_');
    }
    /**
     * @public
     * @type {String}
     * @api stable
     */
    this.title = title;
    if (isNullOrEmpty(this.title)) {
      this.title = 'Conjunto de Servicios WMS';
    }
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
     * @type {Array<M.impl.layer.LayerGroup>}
     * @expose
     */
    this.impl_ = impl;

    /**
     * @public
     * @type {Number}
     * @api stable
     */
    this.zIndex_ = 10000;
  }

  /**
   * This function sets the map object of the group
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  addTo(map) {
    this.map = map;
    this.fire(EventType.ADDED_TO_MAP);
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  setVisible(visibility) {
    this.getAllLayers().forEach(l => (l.transparent === true) && l.setVisible(visibility));
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  setZIndex(zIndex) {
    this.zIndex_ = zIndex;
    const layersOfLayerGroup = this.getAllLayers();
    let countZindex = zIndex;
    layersOfLayerGroup.forEach((varLayer) => {
      const layer = varLayer;
      layer.setZIndex(countZindex);
      countZindex += 1;
    });
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  getZIndex(zIndex) {
    return this.zIndex_;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   * @export
   */
  addChild(childParam, index) {
    const child = childParam;
    if (isNullOrEmpty(index)) {
      this.children_.push(child);
    } else {
      this.children_.splice(index, 0, child);
    }
    if (child instanceof LayerGroup) {
      child.parent = this;
    } else if (child instanceof LayerBase) {
      child.group = this;
      // if the layer is not in the map then is added
      if (!isNullOrEmpty(this.map) &&
        !this.map.getRootLayers().some(rootLayer => rootLayer.equals(child))) {
        this.map.addLayers(child);
      }
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
    children.getImpl().destroy();
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
    if (isArray(layerGroups)) {
      group = layerGroups.find(g => g instanceof LayerGroup && g.id === groupId);
    }
    return group;
  }
}

export default LayerGroup;
