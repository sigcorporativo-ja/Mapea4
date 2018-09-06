import layerswitcherTemplate from 'templates/layerswitcher';
import { isNullOrEmpty, concatUrlPaths } from 'facade/js/util/Utils';
import { compileSync as compileTemplate } from 'facade/js/util/Template';
import LayerSwitcherFacade from 'facade/js/control/Layerswitcher';
import Layer from 'facade/js/layer/Layer';

import Control from './Control';

/**
 * @module M/impl/control/LayerSwitcher
 */
class LayerSwitcher extends Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layerswitcher
   * control
   * Source code from: https://github.com/walkermatt/ol3-layerswitcher
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor() {
    super();
    this.mouseoutTimeId = null;
    this.panel = null;
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
    this.panel.addEventListener('input', this.clickLayer.bind(this), false);
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
  clickLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    if (!isNullOrEmpty(evt.target)) {
      const layerName = evt.target.getAttribute('data-layer-name');
      if (!isNullOrEmpty(layerName)) {
        evt.stopPropagation();
        const layer = this.facadeMap_.getLayers().filter(l => l.name === layerName)[0];
        // checkbox
        if (evt.target.classList.contains('m-check')) {
          /* sets the layer visibility only if
             the layer is not base layer and visible */
          if (layer.transparent === true || !layer.isVisible()) {
            const opacity = evt.target.parentElement.parentElement.querySelector('div.tools > input');
            if (!isNullOrEmpty(opacity)) {
              layer.setOpacity(opacity.value);
            }
            layer.setVisible(!layer.isVisible());
          }
        } else if (evt.target.classList.contains('m-layerswitcher-transparency')) {
          // range
          layer.setOpacity(evt.target.value);
          // remove span
        } else if (evt.target.classList.contains('m-layerswitcher-remove')) {
          this.facadeMap_.removeLayers(layer);
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
