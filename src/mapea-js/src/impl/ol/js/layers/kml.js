import Vector from "./vector";
import Utils from "facade/js/utils/utils";
import Exception from "facade/js/exception/exception";
import LoaderKML from "../loader/kml";
import Popup from "facade/js/popup";
import FormatKML from "../format/kml";
import EventsManager from "facade/js/event/eventsmanager";
import ImplUtils from "../util/utils";
import ClusteredFeature from "facade/js/feature/clusteredfeature";
import Template from "facade/js/utils/templates";
import FacadeKML from "facade/js/layer/kml";

export default class KML extends Vector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.layer.Vector}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor(options) {

    // calls the super constructor
    super(options);

    /**
     * Popup showed
     * @private
     * @type {M.impl.Popup}
     */
    this.popup_ = null;

    /**
     * Tab popup
     * @private
     * @type {Object}
     */
    this.tabPopup_ = null;

    /**
     * Image tag for the screenOverlay
     * @private
     * @type {HTMLElement}
     */
    this.screenOverlayImg_ = null;
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   */
  setVisible(visibility) {
    this.visibility = visibility;

    // layer
    if (!Utils.isNullOrEmpty(this.ol3Layer)) {
      this.ol3Layer.setVisible(visibility);
    }

    // screen overlay
    if (!Utils.isNullOrEmpty(this.screenOverlayImg_)) {
      let display = 'none';
      if (visibility === true) {
        display = 'inherit';
      }
      this.screenOverlayImg_.style['display'] = display;
    }
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  addTo(map) {
    super.addTo(map);

    let formater = new FormatKML();
    let loader = new LoaderKML(map, this.url, formater);
    this.ol3Layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: this.url,
        format: formater,
        loader: loader.getLoaderFn(features, screenOverlay => {
          // removes previous features
          this.facadeVector_.clear();
          this.facadeVector_.addFeatures(features);
          this.fire(EventsManager.LOAD, [features]);
          if (!Utils.isNullOrEmpty(screenOverlay)) {
            let screenOverLayImg = ImplUtils.addOverlayImage(screenOverlay, map);
            this.setScreenOverlayImg(screenOverLayImg);
          }
        })
      })
    });
    // sets its visibility if it is in range
    if (this.options.visibility !== false) {
      this.setVisible(this.inRange());
    }
    // sets its z-index
    if (this.zIndex_ !== null) {
      this.setZIndex(this.zIndex_);
    }
    let olMap = this.map.getMapImpl();
    olMap.addLayer(this.ol3Layer);
  }

  /**
   * This function checks if an object is equals
   * to this layer
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  selectFeatures(features, coord, evt) {
    // TODO: manage multiples features
    let feature = features[0];

    if (!(feature instanceof ClusteredFeature) && (this.extract === true)) {
      let featureName = feature.getAttribute('name');
      let featureDesc = feature.getAttribute('description');
      let featureCoord = feature.getImpl().getOLFeature().getGeometry().getFirstCoordinate();

      Template.compile(FacadeKML.POPUP_TEMPLATE, {
        'jsonp': true,
        'vars': {
          'name': featureName,
          'desc': featureDesc
        },
        'parseToHtml': false
      }).then(htmlAsText => {
        this.tabPopup_ = {
          'icon': 'g-cartografia-comentarios',
          'title': featureName,
          'content': htmlAsText
        };
        const popup = this.map.getPopup();
        if (Utils.isNullOrEmpty(popup)) {
          this.popup_ = new Popup();
          this.popup_.addTab(this.tabPopup_);
          this.map.addPopup(this.popup_, featureCoord);
        }
        else {
          popup.addTab(this.tabPopup_);
        }
      });
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  unselectFeatures() {
    if (!Utils.isNullOrEmpty(this.popup_)) {
      this.popup_.hide();
      this.popup_ = null;
    }
  }

  /**
   * Sets the screen overlay image for this KML
   *
   * @public
   * @function
   * @api stable
   */
  setScreenOverlayImg(screenOverlayImg) {
    this.screenOverlayImg_ = screenOverlayImg;
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    let olMap = this.map.getMapImpl();

    if (!Utils.isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }

    this.removePopup();
    this.options = null;
    this.map = null;
  }

  /**
   * This function destroys KML popup
   *
   * @public
   * @function
   * @api stable
   */
  removePopup() {
    if (!Utils.isNullOrEmpty(this.popup_)) {
      if (this.popup_.getTabs().length > 1) {
        this.popup_.removeTab(this.tabPopup_);
      }
      else {
        this.map.removePopup();
      }
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof KML) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.extract === obj.extract);
    }
    return equals;
  }
}
