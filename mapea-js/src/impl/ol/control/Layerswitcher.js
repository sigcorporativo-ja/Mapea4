/**
 * @module M/impl/control/LayerSwitcher
 */

import layerswitcherTemplate from 'templates/layerswitcher.html';
import { isNullOrEmpty, concatUrlPaths, isUndefined } from 'M/util/Utils';
import { compileSync as compileTemplate } from 'M/util/Template';
import LayerSwitcherFacade from 'M/control/Layerswitcher';
import Layer from 'M/layer/Layer';
import LayerGroup from 'M/layer/LayerGroup';
import Control from './Control';

/**
 * @classdesc
 * @api
 */
class LayerSwitcher extends Control {
  /**
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(emptyLayer) {
    super();
    this.mouseoutTimeId = null;
    this.panel = null;
    this.statusEmptyLayer = false;
    if (!isUndefined(emptyLayer) && emptyLayer !== '') {
      this.activeEmptyLayer = true;
    } else {
      this.activeEmptyLayer = false;
    }
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    const olMap = map.getMapImpl();

    // panel
    this.panel = element.getElementsByTagName('div')[LayerSwitcher.PANEL_ID];

    // click layer event
    this.panel.addEventListener('click', this.clickLayer.bind(this), false);

    // change slider event
    this.panel.addEventListener('input', this.inputLayer.bind(this), false);
    this.element = element;
    this.target_ = null;
    olMap.addControl(this);
  }

  /**
   * Sets the visibility of the clicked layer
   *
   * @public
   * @function
   * @api stable
   */
  inputLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    const groupId = evt.target.getAttribute('data-group-id');
    let group = null;
    if (!isNullOrEmpty(evt.target)) {
      const layerName = evt.target.getAttribute('data-layer-name');
      if (!isNullOrEmpty(layerName)) {
        evt.stopPropagation();
        let layer = this.facadeMap_.getLayers().filter(l => l.name === layerName)[0];
        if (isNullOrEmpty(layer) && !isNullOrEmpty(groupId)) {
          group = LayerGroup.findGroupById(groupId, this.facadeMap_.getLayerGroup());
          layer = group.getChildren().find(l => ((l instanceof Layer) && (l.name === layerName)));
        }
        // checkbox
        if (evt.target.classList.contains('m-check')) {
          /* sets the layer visibility only if
             the layer is not base layer and visible */
          if (!isUndefined(layer) && (layer.transparent === true || !layer.isVisible())) {
            const opacity = evt.target.parentElement.parentElement.querySelector('div.tools > input');
            if (!isNullOrEmpty(opacity)) {
              layer.setOpacity(parseFloat(opacity.value));
            }
            layer.setVisible(!layer.isVisible());
            this.statusEmptyLayer = false;
          } else {
            this.statusEmptyLayer = true;
            this.facadeMap_.getBaseLayers().forEach((base) => {
              base.setVisible(false);
            });
          }
        } else if (evt.target.classList.contains('m-layerswitcher-transparency')) {
          // range
          layer.setOpacity(parseFloat(evt.target.value));
          // remove span
        } else if (evt.target.classList.contains('m-layerswitcher-remove')) {
          this.facadeMap_.removeLayers(layer);
        }
      }
    }
  }

  /**
   * Sets the visibility of the clicked layer
   *const groupId = evt.target.getAttribute('data-group-id');
   * @public
   * @function
   * @api stable
   */
  clickLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    const groupId = evt.target.getAttribute('data-group-id');
    let group = null;
    if (!isNullOrEmpty(evt.target)) {
      const layerName = evt.target.getAttribute('data-layer-name');
      if (!isNullOrEmpty(layerName)) {
        evt.stopPropagation();
        let layer = this.facadeMap_.getLayers().filter(l => l.name === layerName)[0];
        if (isNullOrEmpty(layer) && !isNullOrEmpty(groupId)) {
          group = LayerGroup.findGroupById(groupId, this.facadeMap_.getLayerGroup());
          layer = group.getChildren().find(l => ((l instanceof Layer) && (l.name === layerName)));
        }
        // checkbox
        if (evt.target.classList.contains('m-check')) {
          /* sets the layer visibility only if
             the layer is not base layer and visible */
          if (!isUndefined(layer) && (layer.transparent === true || !layer.isVisible())) {
            const opacity = evt.target.parentElement.parentElement.querySelector('div.tools > input');
            if (!isNullOrEmpty(opacity)) {
              layer.setOpacity(parseFloat(opacity.value));
            }
            layer.setVisible(!layer.isVisible());
            this.statusEmptyLayer = false;
          } else {
            this.statusEmptyLayer = true;
            this.facadeMap_.getBaseLayers().forEach((base) => {
              base.setVisible(false);
            });
          }
          // range
        } else if (evt.target.classList.contains('m-layerswitcher-transparency')) {
          layer.setOpacity(parseFloat(evt.target.value));
          // remove span
        } else if (evt.target.classList.contains('m-layerswitcher-remove')) {
          if (!isNullOrEmpty(group)) {
            layer.getImpl().destroy();
            group.removeChild(layer);
          } else {
            this.facadeMap_.removeLayers(layer);
          }
        }
      } else if (!isNullOrEmpty(groupId)) {
        const idGroup = evt.target.getAttribute('data-group-id');
        group = LayerGroup.findGroupById(idGroup, this.facadeMap_.getLayerGroup());
        // checkbox
        if (evt.target.classList.contains('m-check')) {
          if (evt.target.classList.contains('g-cartografia-check3')) {
            group.setVisible(false);
          } else {
            group.setVisible(true);
          }
          // collapse
        } else {
          group.collapsed = !group.collapsed;
          this.renderPanel();
        }
      }
    }
    this.renderPanel();
  }

  /**
   * Re-draw the layer panel to represent the current state of the layers.
   *
   * @public
   * @function
   * @api stable
   */
  renderPanel() {
    LayerSwitcherFacade.getTemplateVariables(this.facadeMap_).then((templateVars) => {
      if (this.activeEmptyLayer) {
        const emptyLayer = Object.assign({}, LayerSwitcherFacade.EMPTYLAYER);
        emptyLayer.visible = this.statusEmptyLayer;
        templateVars.baseLayers.unshift(emptyLayer);
      }
      const html = compileTemplate(layerswitcherTemplate, {
        vars: templateVars,
      });
      this.registerImgErrorEvents_(html);
      const newPanel = html.querySelector('div#'.concat(LayerSwitcher.PANEL_ID));
      this.panel.innerHTML = newPanel.innerHTML;
    });
  }

  /**
   * Registers events on map and layers to render the
   * layerswitcher
   *
   * @public
   * @function
   * @api stable
   */
  registerEvents() {
    if (!isNullOrEmpty(this.facadeMap_)) {
      const olMap = this.facadeMap_.getMapImpl();

      this.registerViewEvents_(olMap.getView());
      this.registerLayersEvents_(olMap.getLayers());
      olMap.on('change:view', () => this.onViewChange_.bind(this));
    }
  }

  /**
   * Unegisters events for map and layers from the layerswitcher
   *
   * @public
   * @function
   * @api stable
   */
  unregisterEvents() {
    if (!isNullOrEmpty(this.facadeMap_)) {
      const olMap = this.facadeMap_.getMapImpl();

      this.unregisterViewEvents_(olMap.getView());
      this.unregisterLayersEvents_(olMap.getLayers());
      olMap.un('change:view', () => this.onViewChange_.bind(this));
    }
  }

  /**
   * TODO
   */
  registerViewEvents_(view) {
    view.on('change:resolution', () => this.renderPanel.bind(this));
  }

  /**
   * TODO
   */
  registerLayersEvents_(layers) {
    layers.forEach(this.registerLayerEvents_.bind(this));
    layers.on('remove', () => this.renderPanel.bind(this));
    layers.on('add', () => this.onAddLayer_.bind(this));
  }

  /**
   * TODO
   */
  registerLayerEvents_(layer) {
    layer.on('change:visible', () => this.renderPanel.bind(this));
    layer.on('change:extent', () => this.renderPanel.bind(this));
  }

  /**
   * TODO
   */
  unregisterViewEvents_(view) {
    view.un('change:resolution', () => this.renderPanel.bind(this));
  }

  /**
   * TODO
   */
  unregisterLayersEvents_(layers) {
    layers.forEach(this.unregisterLayerEvents_.bind(this));
    layers.un('remove', () => this.renderPanel.bind(this));
    layers.un('add', () => this.onAddLayer_.bind(this));
  }

  /**
   * TODO
   */
  unregisterLayerEvents_(layer) {
    layer.un('change:visible', () => this.renderPanel.bind(this));
    layer.un('change:extent', () => this.renderPanel.bind(this));
  }

  /**
   * TODO
   */
  onViewChange_(evt) {
    // removes listener from previous view
    this.unregisterViewEvents_(evt.oldValue);

    // attaches listeners to the new view
    const olMap = this.facadeMap_.getMapImpl();
    this.registerViewEvents_(olMap.getView());
  }

  /**
   * TODO
   */
  onAddLayer_(evt) {
    this.registerLayerEvents_(evt.element);
    this.renderPanel();
  }

  /**
   * TODO
   */
  registerImgErrorEvents_(html) {
    const imgElements = html.querySelectorAll('img');
    Array.prototype.forEach.call(imgElements, (imgElem) => {
      imgElem.addEventListener('error', (evt) => {
        const layerName = evt.target.getAttribute('data-layer-name');
        const legendErrorUrl = concatUrlPaths([M.config.THEME_URL, Layer.LEGEND_ERROR]);
        const layer = this.facadeMap_.getLayers().filter(l => l.name === layerName)[0];
        if (!isNullOrEmpty(layer)) {
          layer.setLegendURL(legendErrorUrl);
        }
      });
    });
  }

  /**
   * Set the map instance the control is associated with.
   * @param {ol.Map} map The map instance.
   */
  setMap(map) {
    super.setMap(map);
    this.renderPanel();
  }
}

/**
 * LayerSwitcher panel id
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerSwitcher.PANEL_ID = 'm-layerswitcher-panel';

export default LayerSwitcher;
