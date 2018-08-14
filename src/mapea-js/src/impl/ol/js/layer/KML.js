import { compile as compileTemplate } from 'facade/js/util/Template';
import popupKMLTemplate from 'templates/kml_popup';
import Popup from 'facade/js/Popup';
import { isNullOrEmpty } from 'facade/js/util/Utils';
import ClusteredFeature from 'facade/js/feature/Clustered';
import * as EventType from 'facade/js/event/eventtype';
import OLLayerVector from 'ol/layer/Vector';
import OLSourceVector from 'ol/source/Vector';
import Vector from './Vector';
import LoaderKML from '../loader/KML';
import FormatKML from '../format/KML';
import ImplUtils from '../util/Utils';

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
    if (!isNullOrEmpty(this.ol3Layer)) {
      this.ol3Layer.setVisible(visibility);
    }

    // screen overlay
    if (!isNullOrEmpty(this.screenOverlayImg_)) {
      let display = 'none';
      if (visibility === true) {
        display = 'inherit';
      }
      this.screenOverlayImg_.style[display] = display;
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

    const formater = new FormatKML();
    const loader = new LoaderKML(map, this.url, formater);
    this.ol3Layer = new OLLayerVector({
      source: new OLSourceVector({
        url: this.url,
        format: formater,
        loader: loader.getLoaderFn((loaderData) => {
          const features = loaderData.features;
          const screenOverlay = loaderData.screenOverlay;
          // removes previous features
          this.facadeVector_.clear();
          this.facadeVector_.addFeatures(features);
          this.fire(EventType.LOAD, [features]);
          if (!isNullOrEmpty(screenOverlay)) {
            const screenOverLayImg = ImplUtils.addOverlayImage(screenOverlay, map);
            this.setScreenOverlayImg(screenOverLayImg);
          }
        }),
      }),
    });
    // sets its visibility if it is in range
    if (this.options.visibility !== false) {
      this.setVisible(this.inRange());
    }
    // sets its z-index
    if (this.zIndex_ !== null) {
      this.setZIndex(this.zIndex_);
    }
    const olMap = this.map.getMapImpl();
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
    const feature = features[0];

    if (!(feature instanceof ClusteredFeature) && (this.extract === true)) {
      const featureName = feature.getAttribute('name');
      const featureDesc = feature.getAttribute('description');
      const featureCoord = feature.getImpl().getOLFeature().getGeometry().getFirstCoordinate();

      const htmlAsText = compileTemplate(popupKMLTemplate, {
        vars: {
          name: featureName,
          desc: featureDesc,
        },
        parseToHtml: false,
      });
      this.tabPopup_ = {
        icon: 'g-cartografia-comentarios',
        title: featureName,
        content: htmlAsText,
      };
      const popup = this.map.getPopup();
      if (isNullOrEmpty(popup)) {
        this.popup_ = new Popup();
        this.popup_.addTab(this.tabPopup_);
        this.map.addPopup(this.popup_, featureCoord);
      } else {
        popup.addTab(this.tabPopup_);
      }
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
    if (!isNullOrEmpty(this.popup_)) {
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
    const olMap = this.map.getMapImpl();

    if (!isNullOrEmpty(this.ol3Layer)) {
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
    if (!isNullOrEmpty(this.popup_)) {
      if (this.popup_.getTabs().length > 1) {
        this.popup_.removeTab(this.tabPopup_);
      } else {
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
