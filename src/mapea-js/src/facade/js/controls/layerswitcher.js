import ControlBase from './controlbase';
import Utils from '../utils/utils';
import Exception from '../exception/exception';
import Template from '../utils/template';
import LayerBase from '../layers/layerbase';
import LayerType from '../layers/layertype';
import Map from '../map/map';
import Vector from '../layers/vector';
import StylePoint from '../style/stylepoint';
import LayerSwitcherImpl from '../../../impl/js/controls/layerswitcher';

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
    let impl = new LayerSwitcherImpl();
    // calls the super constructor
    super(impl, LayerSwitcher.NAME);

    if (Utils.isUndefined(LayerSwitcherImpl)) {
      Exception('La implementación usada no puede crear controles LayerSwitcher');
    }

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
    return LayerSwitcher.templateVariables_(map).then(templateVars =>
      Template.compile(LayerSwitcher.TEMPLATE, {
        'jsonp': true,
        'vars': templateVars
      }));
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = (obj instanceof LayerSwitcher);
    return equals;
  }

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
  getTemplateVariables_(map) {
    return new Promise((success, fail) => {
      // gets base layers and overlay layers
      if (!Utils.isNullOrEmpty(map)) {

        let baseLayers = Map.getBaseLayers().filter(layer => LayerBase.displayInLayerSwitcher === true);
        let overlayLayers = Map.getLayers().filter((layer) => {
          let isTransparent = (LayerBase.transparent === true);
          let displayInLayerSwitcher = (LayerBase.displayInLayerSwitcher === true);
          let isNotWMC = (LayerType !== LayerType.WMC);
          let isNotWMSFull = !((LayerType === LayerType.WMS) && Utils.isNullOrEmpty(LayerBase.name));
          return (isTransparent && isNotWMC && isNotWMSFull && displayInLayerSwitcher);
        }).reverse();

        let baseLayersPromise = Promise.all(baseLayers.map(LayerSwitcher.parseLayerForTemplate_));
        let overlayLayersPromise = Promise.all(overlayLayers.map(LayerSwitcher.parseLayerForTemplate_));
        baseLayersPromise.then(parsedBaseLayers => {
          overlayLayersPromise.then(parsedOverlayLayers => success({
            'baseLayers': parsedBaseLayers,
            'overlayLayers': parsedOverlayLayers
          }));
        });
      }
      // success({
      //   'baseLayers': baseLayers.map(M.control.LayerSwitcher.parseLayerForTemplate_),
      //   'overlayLayers': overlayLayers.map(M.control.LayerSwitcher.parseLayerForTemplate_)
      // });
    });
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  static parseLayerForTemplate_(layer) {
    let layerTitle = LayerBase.legend;
    if (Utils.isNullOrEmpty(layerTitle)) {
      layerTitle = LayerBase.name;
    }
    if (Utils.isNullOrEmpty(layerTitle)) {
      layerTitle = 'Servicio WMS';
    }
    // return new Promise((success, fail) => success({
    //   'base': (LayerBase.transparent === false),
    //   'visible': (LayerBase.isVisible() === true),
    //   'id': LayerBase.name,
    //   'title': layerTitle,
    //   'legend': LayerBase.getLegendURL(),
    //   'outOfRange': !LayerBase.inRange(),
    //   'opacity': LayerBase.getOpacity()
    // }));
    let isIcon = false;
    if (layer instanceof Vector) {
      let style = LayerBase.style();
      if (style instanceof StylePoint && !Utils.isNullOrEmpty(style.get('icon.src'))) {
        isIcon = true;
      }
    }
    return new Promise((success, fail) => {
      let layerVarTemplate = {
        'base': (LayerBase.transparent === false),
        'visible': (LayerBase.isVisible() === true),
        'id': LayerBase.name,
        'title': layerTitle,
        'outOfRange': !LayerBase.inRange(),
        'opacity': LayerBase.getOpacity(),
        'isIcon': isIcon
      };
      let legendUrl = LayerBase.getLegendURL();
      if (legendUrl instanceof Promise) {
        legendUrl.then(url => {
          layerVarTemplate['legend'] = url;
          success(layerVarTemplate);
        });
      } else {
        layerVarTemplate['legend'] = legendUrl;
        success(layerVarTemplate);
      }
    });
  }

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  LayerSwitcher.NAME = 'layerswitcher';

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  LayerSwitcher.TEMPLATE = 'layerswitcher.html';
}
