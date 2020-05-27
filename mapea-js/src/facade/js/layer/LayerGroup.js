/**
 * @module M/layer/LayerGroup
 */

import LayerGroupImpl from 'impl/layer/LayerGroup';
import MObject from 'M/Object';
import * as EventType from 'M/event/eventtype';
import LayerBase from './Layer';
import { isNullOrEmpty, isArray, generateRandom } from '../util/Utils';

/**
 * @classdesc
 * Represents a group of layers, of any type. If a group is already added to a Map,
 * layers added to that group are automatically added to the map, and layers
 * removed from the group, are automatically removed from the map. Elements inside the group
 * are considered children of that group.
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
     * Id for this LayerGroup, must be bunique
     * @public
     * @type {String}
     * @api
     */
    this.id = parameters.id;

    /**
     * Title of the group, to be displayed in TOC
     *
     * @public
     * @type {String}
     * @api
     */
    this.title = parameters.title;


    /**
     * 'true' to display the group collapsed in the TOC, 'false' to display it expanded
     * @public
     * @type {Boolean}
     * @api
     */
    this.collapsed = !!parameters.collapsed;

    /**
     * Position of the group in the TOC
     * @public
     * @type {Number}
     * @api
     */
    this.order = parameters.order;

    /**
     * Parent group of this group, if any
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
   * Sets the map object of the group
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
   * Sets the visibility for the LayerGroup and all of its layers.
   *
   * @function
   * @param {boolean} visibility Visibility to set
   * @api
   */
  setVisible(visibility) {
    this.getAllLayers().forEach(l => (l.transparent === true) && l.setVisible(visibility));
  }

  /**
   * The Z-index is applied to the first layer of the group, then it is increased by one
   * and applied to the next layer of the group, and so on.
   *
   * @function
   * @param {Number} zIndex
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
   * Gets the zIndex of the group, which is the lowest zIndex of its layers
   *
   * @function
   * @returns {Number} zIndex of the group
   * @api
   */
  getZIndex(zIndex) {
    return this.zIndex_;
  }

  /**
   * Adds a child to the group
   *
   * @function
   * @param {M.Layer|M.LayerBase} layer Layer to add to the group
   * @param {Number} [index=last position] Position to add the layer to, starting from 0
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
   * Deletes a child from the group
   *
   * @function
   * @param {M.LayerBase|M.LayerGroup} child Child to delete
   * @api
   */
  deleteChild(child) {
    const childI = child;
    if (childI instanceof LayerGroup) {
      childI.parent = null;
      this.map.removeLayerGroup(childI);
    } else if (childI instanceof LayerBase) {
      this.map.removeLayers(childI);
    }
  }

  /**
   * Deletes children from the group
   *
   * @function
   * @param {Array<M.LayerBase|M.LayerGroup>}  children children to delete
   * @api
   */
  deleteChildren(children) {
    children.forEach(this.deleteChild, this);
  }

  /**
   * Moves a child out of a group, to the root level
   * of the toc
   * @function
   * @param {M.LayerBase|M.LayerGroup} child
   * @api
   */
  ungroup(child) {
    child.setLayerGroup(null);
    this.children_.remove(child);
  }

  /**
   * Adds children to the group
   *
   * @function
   * @param {Array<M.LayerBase|M.LayerGroup>}  children
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
   * Returns all the children inside the group
   *
   * @function
   * @returns {Array<M.LayerBase|M.LayerGroup>}
   * @api
   */
  getChildren() {
    return this.children_;
  }

  /**
   * Returns all those children that are instances of LayerBase, whether they are
   * direct children of the group, or children from inner groups.
   *
   * @function
   * @returns  {Array<M.LayerBase>}
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
   * Destroys the group and all its layers
   * @function
   * @public
   * @api
   */
  destroy() {
    this.map.removeLayers(this.getAllLayers());
  }

  /**
   * Searchs a group by its id, recursively if there are nested groups.
   * @public
   * @param {Number} Id
   * @param {Array<LayerGroup>} layerGroup array of groups to perform the search
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
