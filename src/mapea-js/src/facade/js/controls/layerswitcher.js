import ControlBase from('./controlbase.js');
import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Template from('../utils/template.js');
import LayerBase from('../layers/layerbase.js');
import LayerType from('../layers/layertype.js')
import Map from('../map/Map.js');
import Vector from('../layers/vector.js');
import StylePoint from('../style/stylepoint.js')
import LayerSwitcherImpl from('../../../impl/js/controls/layerswitcher.js');

export class LayerSwitcher extends ControlBase {
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
    // calls the super constructor
    super(this, impl, LayerSwitcher.NAME);

    if (Utils.isUndefined(LayerSwitcherImpl)) {
      Exception('La implementación usada no puede crear controles LayerSwitcher');
    }
    // implementation of this control
    let impl = new LayerSwitcherImpl();

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
    this.impl().renderPanel();
  }

  /**
   * This function registers events on map and layers to render
   * the layerswitcher
   *
   * @function
   * @api stable
   */
  registerEvents() {
    this.impl().registerEvents();
  }

  /**
   * Unegisters events for map and layers from the layerswitcher
   *
   * @function
   * @api stable
   */
  unregisterEvents() {
    this.impl().unregisterEvents();
  }

  /**
   * Gets the variables of the template to compile
   */
  get templateVariables_(map) {
    return new Promise((success, fail) => {
      // gets base layers and overlay layers
      if (!Utils.isNullOrEmpty(map)) {

        let baseLayers = Map.baseLayers().filter(layer => LayerBase.displayInLayerSwitcher === true);
        let overlayLayers = Map.layers().filter((layer) => {
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
        'opacity': LayerBase.opacity(),
        'isIcon': isIcon
      };
      let legendUrl = LayerBase.legendURL();
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
