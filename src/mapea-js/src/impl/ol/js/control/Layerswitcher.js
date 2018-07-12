import Utils from 'facade/js/util/Utils';
import LayerSwitcherFacade from 'facade/js/control/Layerswitcher';
import Layer from 'facade/js/layer/Layer';
import Control from "./Control"
/**
 * @namespace M.impl.control
 */
export default class LayerSwitcher extends Control {
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
    let olMap = map.getMapImpl();

    // panel
    this.panel = element.getElementsByTagName('div')[LayerSwitcher.PANEL_ID];

    // click layer event
    this.panel.addEventListener("click", this.clickLayer, false);

    // change slider event
    this.panel.addEventListener("input", this.clickLayer, false);

    ol.control.Control.call(this, {
      'element': element,
      'target': null
    });
    olMap.addControl(this);
  }

  /**
   * Sets the visibility of the clicked layer
   *
   * @public
   * @function
   * @api stable
   */
  clickLayer(evt) {
    evt = (evt || window.event);
    if (!Utils.isNullOrEmpty(evt.target)) {
      let layerName = evt.target.getAttribute('data-layer-name');
      if (!Utils.isNullOrEmpty(layerName)) {
        evt.stopPropagation();
        let layer = this.facadeMap_.getLayers().filter(l => l.name === layerName)[0];
        // checkbox
        if (evt.target.classlist.contains('m-check')) {
          /* sets the layer visibility only if
             the layer is not base layer and visible */
          if (layer.transparent === true || !layer.isVisible()) {
            let opacity = evt.target.parentElement.parentElement.querySelector('div.tools > input');
            if (!Utils.isNullOrEmpty(opacity)) {
              layer.setOpacity(opacity.value);
            }
            layer.setVisible(!layer.isVisible());
          }
        }
        // range
        else if (evt.target.classlist.contains('m-layerswitcher-transparency')) {
          layer.setOpacity(evt.target.value);
        }
        // remove span
        else if (evt.target.classlist.contains('m-layerswitcher-remove')) {
          this.facadeMap_.removeLayers(layer);
        }
      }
    }
  }

  /**
   * Re-draw the layer panel to represent the current state of the layers.
   *
   * @public
   * @function
   * @api stable
   */
  renderPanel() {
    LayerSwitcherFacade.getTemplateVariables_(this.facadeMap_).then(templateVars => {
      let html = Template.compile(LayerSwitcherFacade.TEMPLATE, {
        'vars': templateVars
      });
      this.registerImgErrorEvents_(html);
      let newPanel = html.querySelector('div#'.concat(LayerSwitcher.PANEL_ID));
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
    if (!Utils.isNullOrEmpty(this.facadeMap_)) {
      let olMap = this.facadeMap_.getMapImpl();

      this.registerViewEvents_(olMap.getView());
      this.registerLayersEvents_(olMap.getLayers());
      olMap.on('change:view', this.onViewChange_, this);
    }
  };

  /**
   * Unegisters events for map and layers from the layerswitcher
   *
   * @public
   * @function
   * @api stable
   */
  unregisterEvents() {
    if (!Utils.isNullOrEmpty(this.facadeMap_)) {
      let olMap = this.facadeMap_.getMapImpl();

      this.unregisterViewEvents_(olMap.getView());
      this.unregisterLayersEvents_(olMap.getLayers());
      olMap.un('change:view', this.onViewChange_, this);
    }
  };

  /**
   * TODO
   */
  registerViewEvents_(view) {
    view.on('change:resolution', this.renderPanel, this);
  };

  /**
   * TODO
   */
  registerLayersEvents_(layers) {
    layers.forEach(this.registerLayerEvents_, this);
    layers.on('remove', this.renderPanel, this);
    layers.on('add', this.onAddLayer_, this);
  };

  /**
   * TODO
   */
  registerLayerEvents_(layer) {
    layer.on('change:visible', this.renderPanel, this);
    // layer.on('change:opacity', this.renderPanel, this);
    layer.on('change:extent', this.renderPanel, this);
  };

  /**
   * TODO
   */
  unregisterViewEvents_(view) {
    view.un('change:resolution', this.renderPanel, this);
  };

  /**
   * TODO
   */
  unregisterLayersEvents_(layers) {
    layers.forEach(this.registerLayerEvents_, this);
    layers.un('remove', this.renderPanel, this);
    layers.un('add', this.onAddLayer_, this);
  };

  /**
   * TODO
   */
  unregisterLayerEvents_(layer) {
    layer.un('change:visible', this.renderPanel, this);
    layer.un('change:extent', this.renderPanel, this);
  }

  /**
   * TODO
   */
  onViewChange_(evt) {
    // removes listener from previous view
    this.unregisterViewEvents_(evt.oldValue);

    // attaches listeners to the new view
    let olMap = this.facadeMap_.getMapImpl();
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
    let imgElements = html.querySelectorAll('img');
    Array.prototype.forEach.call(imgElements, imgElem => {
      imgElem.addEventListener("error", evt => {
        let layerName = evt.target.getAttribute('data-layer-name');
        let legendErrorUrl = Utils.concatUrlPaths([Config.THEME_URL, Layer.LEGEND_ERROR]);
        let layer = this.facadeMap_.getLayers().filter(l => l.name === layerName)[0];
        if (!Utils.isNullOrEmpty(layer)) {
          layer.setLegendURL(legendErrorUrl);
        }
      }, false);
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
LayerSwitcher.PANEL_ID_ = 'm-layerswitcher-panel';
