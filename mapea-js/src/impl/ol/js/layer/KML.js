/**
 * @module M/impl/layer/KML
 */
import { compileSync as compileTemplate } from 'M/util/Template';
import { get as getProj } from 'ol/proj';
import popupKMLTemplate from 'templates/kml_popup';
import Popup from 'M/Popup';
import { isNullOrEmpty, extend } from 'M/util/Utils';
import ClusteredFeature from 'M/feature/Clustered';
import * as EventType from 'M/event/eventtype';
import OLLayerVector from 'ol/layer/Vector';
import OLSourceVector from 'ol/source/Vector';
import Vector from './Vector';
import LoaderKML from '../loader/KML';
import FormatKML from '../format/KML';
import ImplUtils from '../util/Utils';
/**
 * @classdesc
 * @api
 */
class KML extends Vector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.layer.Vector}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @param {Object} vendorOptions vendor options for the base library
   * @api stable
   */
  constructor(options, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);

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
     *
     * @private
     * @type {Promise}
     */
    this.loadFeaturesPromise_ = null;

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
    this.map = map;
    this.fire(EventType.ADDED_TO_MAP);
    map.on(EventType.CHANGE_PROJ, this.setProjection_.bind(this), this);
    this.formater_ = new FormatKML();
    this.loader_ = new LoaderKML(this.map, this.url, this.formater_);
    this.ol3Layer = new OLLayerVector(extend({}, this.vendorOptions_, true));
    this.updateSource_();
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
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  updateSource_() {
    if (isNullOrEmpty(this.vendorOptions_.source)) {
      this.requestFeatures_().then((response) => {
        this.ol3Layer.setSource(new OLSourceVector({
          loader: () => {
            const screenOverlay = response.screenOverlay;
            // removes previous features
            this.facadeVector_.clear();
            this.facadeVector_.addFeatures(response.features);
            this.fire(EventType.LOAD, [response.features]);
            if (!isNullOrEmpty(screenOverlay)) {
              const screenOverLayImg = ImplUtils.addOverlayImage(screenOverlay, this.map);
              this.setScreenOverlayImg(screenOverLayImg);
            }
          },
        }));
        this.facadeVector_.addFeatures(response.features);
      });
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
   * This function return extent of all features or discriminating by the filter
   *
   * @function
   * @param {boolean} skipFilter - Indicates whether skip filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<number>} Extent of features
   * @api stable
   */
  getFeaturesExtent(skipFilter, filter) {
    const codeProj = this.map.getProjection().code;
    const features = this.getFeatures(skipFilter, filter);
    const extent = ImplUtils.getFeaturesExtent(features, codeProj);
    return extent;
  }

  /**
   * This function return extent of all features or discriminating by the filter
   *
   * @function
   * @param {boolean} skipFilter - Indicates whether skip filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<number>} Extent of features
   * @api stable
   */
  getFeaturesExtentPromise(skipFilter, filter) {
    return new Promise((resolve) => {
      const codeProj = this.map.getProjection().code;
      if (this.isLoaded() === true) {
        const features = this.getFeatures(skipFilter, filter);
        const extent = ImplUtils.getFeaturesExtent(features, codeProj);
        resolve(extent);
      } else {
        this.requestFeatures_().then((response) => {
          const extent = ImplUtils.getFeaturesExtent(response.features, codeProj);
          resolve(extent);
        });
      }
    });
  }

  /**
   *
   * @private
   * @function
   */
  requestFeatures_() {
    if (isNullOrEmpty(this.loadFeaturesPromise_)) {
      this.loadFeaturesPromise_ = new Promise((resolve) => {
        this.loader_.getLoaderFn((features) => {
          resolve(features);
        })(null, null, getProj(this.map.getProjection().code));
      });
    }
    return this.loadFeaturesPromise_;
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

export default KML;
