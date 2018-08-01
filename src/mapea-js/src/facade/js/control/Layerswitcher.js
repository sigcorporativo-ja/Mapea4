import 'assets/css/controls/layerswitcher';
import LayerSwitcherImpl from 'impl/control/Layerswitcher';
import layerswitcherTemplate from 'templates/layerswitcher';
import ControlBase from './Control';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import Template from '../util/Template';
import LayerType from '../layer/Type';
import Vector from '../layer/Vector';
import StylePoint from '../style/Point';
import EvtManager from '../event/Manager';

export default class LayerSwitcher extends ControlBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a GetFeatureInfo
   * control to provides a popup with information about the place
   * where the user has clicked inside the Map.
   *
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // implementation of this control
    const impl = new LayerSwitcherImpl();
    // calls the super constructor
    super(impl, LayerSwitcher.NAME);

    if (Utils.isUndefined(LayerSwitcherImpl)) {
      Exception('La implementación usada no puede crear controles LayerSwitcher');
    }
  }

  /**
   * @inheritDoc
   */
  addTo(map) {
    this.map_ = map;
    const impl = this.getImpl();
    const view = this.createView(map);
    view.then((html) => {
      this.manageActivation(html);
      impl.addTo(map, html);
      this.fire(EvtManager.ADDED_TO_MAP);
    });
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map map to add the control
   * @returns {Promise} html response
   * @api stable
   */
  createView(map) {
    return new Promise((resolve) => {
      LayerSwitcher.getTemplateVariables(this.map_).then((templateVars) => {
        const html = Template.compile(layerswitcherTemplate, {
          vars: templateVars,
        });
        resolve(html);
      });
    });
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  /* eslint-disable */
  equals(obj) {
    let equals = (obj instanceof LayerSwitcher);
    return equals;
  }
  /* eslint-enable */

  /**
   * This function registers events on map and layers to render
   * the layerswitcher
   *
   * @function
   * @api stable
   */
  render() {
    this.getImpl().renderPanel();
  }

  /**
   * This function registers events on map and layers to render
   * the layerswitcher
   *
   * @function
   * @api stable
   */
  registerEvents() {
    this.getImpl().registerEvents();
  }

  /**
   * Unegisters events for map and layers from the layerswitcher
   *
   * @function
   * @api stable
   */
  unregisterEvents() {
    this.getImpl().unregisterEvents();
  }

  /**
   * Gets the variables of the template to compile
   */
  static getTemplateVariables(map) {
    return new Promise((success, fail) => {
      // gets base layers and overlay layers
      if (!Utils.isNullOrEmpty(map)) {
        const baseLayers = map.getBaseLayers()
          .filter(layer => layer.displayInLayerSwitcher === true);
        const overlayLayers = map.getLayers().filter((layer) => {
          const isTransparent = (layer.transparent === true);
          const displayInLayerSwitcher = (layer.displayInLayerSwitcher === true);
          const isNotWMC = (LayerType !== LayerType.WMC);
          const isNotWMSFull = !((LayerType === LayerType.WMS) && Utils.isNullOrEmpty(layer.name));
          return (isTransparent && isNotWMC && isNotWMSFull && displayInLayerSwitcher);
        }).reverse();

        const baseLayersPromise = Promise.all(baseLayers.map(LayerSwitcher.parseLayerForTemplate));
        const overlayLayersPromise = Promise.all(overlayLayers
          .map(LayerSwitcher.parseLayerForTemplate));
        baseLayersPromise.then((parsedBaseLayers) => {
          overlayLayersPromise.then(parsedOverlayLayers => success({
            baseLayers: parsedBaseLayers,
            overlayLayers: parsedOverlayLayers,
          }));
        });
      }
    });
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  static parseLayerForTemplate(layer) {
    let layerTitle = layer.legend;
    if (Utils.isNullOrEmpty(layerTitle)) {
      layerTitle = layer.name;
    }
    if (Utils.isNullOrEmpty(layerTitle)) {
      layerTitle = 'Servicio WMS';
    }
    let isIcon = false;
    if (layer instanceof Vector) {
      const style = layer.getStyle();
      if (style instanceof StylePoint && !Utils.isNullOrEmpty(style.get('icon.src'))) {
        isIcon = true;
      }
    }
    return new Promise((success, fail) => {
      const layerVarTemplate = {
        base: (layer.transparent === false),
        visible: (layer.isVisible() === true),
        id: layer.name,
        title: layerTitle,
        outOfRange: !layer.inRange(),
        opacity: layer.getOpacity(),
        isIcon,
      };
      const legendUrl = layer.getLegendURL();
      if (legendUrl instanceof Promise) {
        legendUrl.then((url) => {
          layerVarTemplate.legend = url;
          success(layerVarTemplate);
        });
      }
      else {
        layerVarTemplate.legend = legendUrl;
        success(layerVarTemplate);
      }
    });
  }
}

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
LayerSwitcher.NAME = 'layerswitcher';