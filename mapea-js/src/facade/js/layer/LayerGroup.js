/**
 * @module M/layer/LayerGroup
 */

import LayerGroupImpl from 'impl/layer/LayerGroup';
import MObject from 'M/Object';
import * as EventType from 'M/event/eventtype';
import LayerBase from './Layer';
import { isNullOrEmpty, isArray, generateRandom } from '../util/Utils';

/**
 * @constructor
 * @extends {M.facade.Base}
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @api
 */
class LayerGroup extends MObject {
  constructor(userParameters) {
    const parameters = {
      ...userParameters,
    };

    if (isNullOrEmpty(parameters.id)) {
      parameters.id = generateRandom('mapea_layer_group_');
    }

    if (isNullOrEmpty(parameters.title)) {
      parameters.title = 'Grupo de capas';
    }

    if (isNullOrEmpty(parameters.zIndex)) {
      parameters.zIndex = 10000;
    }

    if (isNullOrEmpty(parameters.order)) {
      parameters.order = 0;
    }


    /**
     * Implementation of this layer
     * @public
     * @type {M.impl.layer.LayerGroup}
     */
    const impl = new LayerGroupImpl(parameters);
    super(impl);

    /**
     * @public
     * @type {String}
     * @api
     */
    this.id = parameters.id;

    /**
     * @public
     * @type {String}
     * @api
     */
    this.title = parameters.title;


    /**
     * @public
     * @type {Boolean}
     * @api
     */
    this.collapsed = !!parameters.collapsed;

    /**
     * @public
     * @type {Number}
     * @api
     */
    this.order = parameters.order;

    /**
     * @public
     * @type {M.layer.Group}
     * @api
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
     * @api
     */
    this.zIndex_ = parameters.zIndex;

    if (Array.isArray(parameters.children)) {
      this.addChildren(parameters.children);
    }
  }

  /**
   * This function sets the map object of the group
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api
   */
  addTo(map) {
    this.map = map;
    this.fire(EventType.ADDED_TO_MAP);
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  setVisible(visibility) {
    this.getAllLayers().forEach(l => (l.transparent === true) && l.setVisible(visibility));
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  setZIndex(zIndex) {
    this.zIndex_ = zIndex;
    const layersOfLayerGroup = this.getChildren();
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
   * @api
   */
  getZIndex(zIndex) {
    return this.zIndex_;
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  addChild(childParam, index) {
    let zIndex = this.getZIndex() + this.children_.length;
    const child = childParam;
    if (isNullOrEmpty(index)) {
      this.children_.push(child);
    } else {
      this.children_.splice(index, 0, child);
      zIndex = this.getZIndex() + index;
    }
    if (child instanceof LayerGroup) {
      child.parent = this;
    } else if (child instanceof LayerBase) {
      child.setLayerGroup(this);
      child.setZIndex(zIndex);
      if (!isNullOrEmpty(this.map) &&
        !this.map.getRootLayers().some(rootLayer => rootLayer.equals(child))) {
        this.map.addLayers(child);
        if (child instanceof LayerGroup) {
          this.map.addLayerGroup(child);
        }
      }
    }
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  removeChild(child) {
    const childI = child;
    if (childI instanceof LayerGroup) {
      childI.parent = null;
      this.map.removeLayerGroup(childI);
    } else if (childI instanceof LayerBase) {
      this.map.removeLayers(childI);
    }
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  removeChildren(children) {
    children.forEach(this.removeChild, this);
  }

  /**
   * TODO
   * @function
   * @api
   */
  deleteChild(child) {
    child.setLayerGroup(null);
    this.children_.remove(child);
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  addChildren(children = []) {
    let arrChildren = children;
    if (!Array.isArray(children)) {
      arrChildren = [arrChildren];
    }
    arrChildren.forEach(this.addChild, this);
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  getChildren() {
    return this.children_;
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  getAllLayers() {
    let layers = [];
    this.getChildren().forEach((child) => {
      if (child instanceof LayerBase) {
        layers.push(child);
      } else if (child instanceof LayerGroup) {
        layers = layers.concat(child.getAllLayers());
      }
    });
    return layers;
  }

  /**
   * @function
   * @public
   * @api
   */
  destroy() {
    this.map.removeLayers(this.getAllLayers());
  }

  /**
   * @public
   * @function
   * @api
   */
  static findGroupById(groupId, layerGroups) {
    let group;
    if (isArray(layerGroups)) {
      group = layerGroups.find(g => g instanceof LayerGroup && g.id === groupId);
      if (group == null) {
        const childGroups = layerGroups.map(g => g.getChildren())
          .reduce((current, next) => current.concat(next), [])
          .filter(g => g instanceof LayerGroup);
        group = LayerGroup.findGroupById(groupId, childGroups);
      }
    }
    return group;
  }
}

export default LayerGroup;
