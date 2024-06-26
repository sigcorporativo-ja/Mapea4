/**
 * @module M/impl/layer/KML
 */
import { compileSync as compileTemplate } from 'M/util/Template';
import { get as getProj } from 'ol/proj';
import popupKMLTemplate from 'templates/kml_popup.html';
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

    /**
     * @private
     * @type {bool}
     */
    this.label_ = options.label;
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
    map.on(EventType.CHANGE_PROJ, this.setProjection_.bind(this), this);
    this.formater_ = new FormatKML({
      label: this.label_,
    });
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
    this.fire(EventType.ADDED_TO_MAP);
    this.facadeVector_?.fire(EventType.ADDED_TO_MAP);
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

      const popup_template = !isNullOrEmpty(this.template) ? this.template : popupKMLTemplate;

      const htmlAsText = compileTemplate(popup_template, {
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
   * Removes and creates the ol3layer
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  recreateOlLayer() {
    const olMap = this.map.getMapImpl();

    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }

    this.formater_ = new FormatKML({
      label: this.label_,
    });
    this.loader_ = new LoaderKML(this.map, this.url, this.formater_);
    this.ol3Layer = new OLLayerVector(extend({}, this.vendorOptions_, true));
    this.updateSource_(true);
    // sets its visibility if it is in range
    if (this.options.visibility !== false) {
      this.setVisible(this.inRange());
    }
    // sets its z-index
    if (this.zIndex_ !== null) {
      this.setZIndex(this.zIndex_);
    }

    olMap.addLayer(this.ol3Layer);
  }

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  updateSource_(force) {
    if (isNullOrEmpty(this.vendorOptions_.source)) {
      this.requestFeatures_(force).then((response) => {
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
   * Sets the url of the layer
   *
   * @public
   * @function
   * @api stable
   */
  setURL(newURL) {
    this.url = newURL;
    this.recreateOlLayer();
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
   *
   * @private
   * @function
   */
  requestFeatures_(force) {
    if (force || isNullOrEmpty(this.loadFeaturesPromise_)) {
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
      equals = equals && (this.template === obj.template);
    }
    return equals;
  }
}

export default KML;
