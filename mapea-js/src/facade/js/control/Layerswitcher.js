/**
 * @module M/control/LayerSwitcher
 */
import 'assets/css/controls/layerswitcher';
import LayerSwitcherImpl from 'impl/control/Layerswitcher';
import layerswitcherTemplate from 'templates/layerswitcher';
import ControlBase from './Control';
import LayerBase from '../layer/Layer';
import LayerGroup from '../layer/LayerGroup';
import { isUndefined, isNullOrEmpty } from '../util/Utils';
import Exception from '../exception/exception';
import { compileSync as compileTemplate } from '../util/Template';
import * as LayerType from '../layer/Type';
import Vector from '../layer/Vector';
import StylePoint from '../style/Point';
import * as EventType from '../event/eventtype';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Main constructor of the class. Creates a GetFeatureInfo
 * control to provides a popup with information about the place
 * where the user has clicked inside the Map.
 * @api
 *
 */
class LayerSwitcher extends ControlBase {
  /**
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api
   */
  constructor() {
    // implementation of this control
    const impl = new LayerSwitcherImpl();
    // calls the super constructor
    super(impl, LayerSwitcher.NAME);

    if (isUndefined(LayerSwitcherImpl)) {
      Exception(getValue('exception').layerswitcher_method);
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
      this.fire(EventType.ADDED_TO_MAP);
    });
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map map to add the control
   * @returns {Promise} html response
   * @api
   */
  createView(map) {
    return new Promise((resolve) => {
      LayerSwitcher.getTemplateVariables(this.map_).then((templateVars) => {
        const html = compileTemplate(layerswitcherTemplate, {
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
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof LayerSwitcher);
    return equals;
  }

  /**
   * This function registers events on map and layers to render
   * the layerswitcher
   *
   * @function
   * @api
   */
  render() {
    this.getImpl().renderPanel();
  }

  /**
   * This function registers events on map and layers to render
   * the layerswitcher
   *
   * @function
   * @api
   */
  registerEvents() {
    this.getImpl().registerEvents();
  }

  /**
   * Unegisters events for map and layers from the layerswitcher
   *
   * @function
   * @api
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
      if (!isNullOrEmpty(map)) {
        const baseLayers = map.getBaseLayers()
          .filter(layer => layer.displayInLayerSwitcher === true);
        const layerGroups = map.getLayerGroup();
        const orderedLayerGroups = LayerSwitcher.orderLayerGroups(layerGroups);
        const overlayLayers = map.getRootLayers().filter((layer) => {
          const isTransparent = (layer.transparent === true);
          const displayInLayerSwitcher = (layer.displayInLayerSwitcher === true);
          const isNotWMC = (layer.type !== LayerType.WMC);
          const isNotWMSFull = !((layer.type === LayerType.WMS) && isNullOrEmpty(layer.name));
          const hasNoGrp = layer.getLayerGroup && layer.getLayerGroup() === null;
          return (isTransparent && isNotWMC && isNotWMSFull && displayInLayerSwitcher && hasNoGrp);
        }).reverse();

        const baseLayersPromise = Promise.all(baseLayers.map(LayerSwitcher.parseLayerForTemplate));
        const overlayLayersPromise = Promise.all(overlayLayers
          .map(LayerSwitcher.parseLayerForTemplate));
        const layerGroupsPromise = Promise.all(orderedLayerGroups
          .map(layerGroup => LayerSwitcher.parseGroupForTemplate(layerGroup, baseLayers))
          .filter(g => !isNullOrEmpty(g)));
        baseLayersPromise.then((parsedBaseLayers) => {
          layerGroupsPromise.then((parsedLayerGroups) => {
            overlayLayersPromise.then(parsedOverlayLayers => success({
              baseLayers: parsedBaseLayers,
              overlayLayers: parsedOverlayLayers,
              layerGroups: parsedLayerGroups,
            }));
          });
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
    if (isNullOrEmpty(layerTitle)) {
      layerTitle = layer.name;
    }
    if (isNullOrEmpty(layerTitle)) {
      layerTitle = 'Servicio WMS';
    }
    let isIcon = false;
    if (layer instanceof Vector) {
      const style = layer.getStyle();
      if (style instanceof StylePoint && !isNullOrEmpty(style.get('icon.src'))) {
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
      } else {
        layerVarTemplate.legend = layer.type !== 'KML' ? legendUrl : null;
        success(layerVarTemplate);
      }
    });
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  static parseGroupForTemplate(groupLayer, baseLayers) {
    const layersOfLayerGroup = [...groupLayer.getChildren()];
    let layerTitle = groupLayer.title;
    if (isNullOrEmpty(layerTitle)) {
      layerTitle = groupLayer.id;
    }
    if (isNullOrEmpty(layerTitle)) {
      layerTitle = 'Conjunto de Servicios WMS';
    }
    let varTemplate = {
      id: groupLayer.id,
      title: layerTitle,
      order: groupLayer.order,
      collapsed: groupLayer.collapsed,
      layers: [],
      layerGroups: [],
    };

    layersOfLayerGroup.forEach((child) => {
      if (child instanceof LayerBase) {
        varTemplate.layers.push(LayerSwitcher.parseLayerForTemplate(child));
      } else if (child instanceof LayerGroup) {
        const varGroup = LayerSwitcher.parseGroupForTemplate(child, baseLayers);
        if (!isNullOrEmpty(varGroup)) {
          varTemplate.layerGroups.push(varGroup);
        }
      }
    });

    // Resolve the layers promise
    const promiseLayers = Promise.all(varTemplate.layers);
    promiseLayers.then((layers) => {
      if (!isNullOrEmpty(varTemplate)) {
        varTemplate.layers = layers;
      }
    });

    let visibleLevel = 0;
    const layers = groupLayer.getAllLayers();
    if (layers.every(l => l.isVisible())) {
      visibleLevel = 2;
    } else if (layers.some(l => l.isVisible())) {
      visibleLevel = 1;
    }
    varTemplate.visible = visibleLevel;
    if (isNullOrEmpty(varTemplate.layers) && isNullOrEmpty(varTemplate.layerGroups)) {
      varTemplate = null;
    }
    return varTemplate;
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  static orderLayerGroups(layerGroups) {
    return layerGroups.sort((a, b) => { // Descending order
      return b.order - a.order;
    });
  }
}

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api
 */
LayerSwitcher.NAME = 'layerswitcher';

export default LayerSwitcher;
