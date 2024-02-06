/**
 * @module M/impl/layer/Vector
 */
import ClusteredFeature from 'M/feature/Clustered';
import StyleCluster from 'M/style/Cluster';
import { isNullOrEmpty, isFunction, beautifyAttributeName, includes } from 'M/util/Utils';
import * as EventType from 'M/event/eventtype';
import Style from 'M/style/Style';
import { compileSync as compileTemplate } from 'M/util/Template';
import Popup from 'M/Popup';
import { get as getProj } from 'ol/proj';
import OLLayerVector from 'ol/layer/Vector';
import OLSourceVector from 'ol/source/Vector';
import OLSourceCluster from 'ol/source/Cluster';
import PopupTemplate from 'templates/geojson_popup.html';
import Layer from './Layer';
import ImplUtils from '../util/Utils';
import Feature from '../feature/Feature';

/**
 * @classdesc
 * @api
 */
class Vector extends Layer {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Vector layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options - custom options for this layer
   * @param {Object} vendorOptions vendor options for the base library
   * @api stable
   */
  constructor(options, vendorOptions) {
    super(options, vendorOptions);

    /**
     * The facade layer instance
     * @private
     * @type {M.layer.Vector}
     * @expose
     */
    this.facadeVector_ = null;

    /**
     * Features of this layer
     * @private
     * @type {Array<M.Feature>}
     * @expose
     */
    this.features_ = [];

    /**
     * Postcompose event key
     * @private
     * @type {string}
     */
    this.postComposeEvtKey_ = null;

    /**
     * Property that sets if the
     * layer is loaded
     *
     * @private
     * @type {bool}
     */
    this.load_ = false;

    /**
     * TODO
     */
    this.loaded_ = false;

    // [WARN]
    // applyOLLayerSetStyleHook();
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

    this.ol3Layer = new OLLayerVector(this.vendorOptions_);
    this.updateSource_();

    if (this.opacity_) {
      this.setOpacity(this.opacity_);
    }
    this.setVisible(this.visibility);
    const olMap = this.map.getMapImpl();
    olMap.addLayer(this.ol3Layer);
    this.fire(EventType.ADDED_TO_MAP);
    this.facadeVector_?.fire(EventType.ADDED_TO_MAP);
  }

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  updateSource_() {
    if (isNullOrEmpty(this.vendorOptions_.source)) {
      if (isNullOrEmpty(this.ol3Layer.getSource())) {
        this.ol3Layer.setSource(new OLSourceVector());
      }
      this.redraw();
      this.loaded_ = true;
      this.fire(EventType.LOAD, [this.features_]);
    }
  }

  /**
   * This function indicates if the layer is in range
   *
   * @function
   * @api stable
   * @expose
   */
  inRange() {
    // vectors are always in range
    return true;
  }

  /**
   * This function add features to layer
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to add
   * @api stable
   */
  addFeatures(features, update, checkDuplicate = true) {
    if (checkDuplicate === true) {
      features.forEach((newFeature) => {
        const feature = this.features_.find(feature2 => feature2.equals(newFeature));
        if (isNullOrEmpty(feature)) {
          this.features_.push(newFeature);
        }
      });
    } else {
      this.features_.push(...features);
    }

    if (update) {
      this.updateLayer_();
    }
    const style = this.facadeVector_.getStyle();
    if (style instanceof StyleCluster) {
      style.getImpl().deactivateTemporarilyChangeEvent(this.redraw.bind(this));
      style.refresh();
    } else {
      this.redraw();
    }
  }


  /**
   * This function add features to layer and redraw with a layer style
   * @function
   * @private
   * @api stable
   */
  updateLayer_() {
    const style = this.facadeVector_.getStyle();
    if (!isNullOrEmpty(style)) {
      if (style instanceof Style) {
        this.facadeVector_.setStyle(style);
      } else if (style instanceof StyleCluster) {
        const cluster = this.facadeVector_.getStyle();
        cluster.unapply(this.facadeVector_);
        cluster.getOldStyle().apply(this.facadeVector_);
        cluster.apply(this.facadeVector_);
      } else {
        style.apply(this.facadeVector_);
      }
    }
  }


  /**
   * This function returns all features or discriminating by the filter
   *
   * @function
   * @public
   * @param {boolean} skipFilter - Indicates whether skyp filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<M.Feature>} returns all features or discriminating by the filter
   * @api stable
   */
  getFeatures(skipFilter, filter) {
    let features = this.features_;
    if (!skipFilter) features = filter.execute(features);
    return features;
  }

  /**
   * This function returns the feature with this id
   *
   * @function
   * @public
   * @param {string|number} id - Id feature
   * @return {null|M.feature} feature - Returns the feature with that id if it is found,
    in case it is not found or does not indicate the id returns null
   * @api stable
   */
  getFeatureById(id) {
    return this.features_.filter(feature => feature.getId() === id)[0];
  }

  /**
   * This function remove the features indicated
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to remove
   * @api stable
   */
  removeFeatures(features) {
    this.features_ = this.features_.filter(f => !(features.includes(f)));
    const style = this.facadeVector_.getStyle();
    if (style instanceof StyleCluster) {
      style.getImpl().deactivateTemporarilyChangeEvent(this.redraw.bind(this));
      style.refresh();
    } else {
      this.redraw();
    }
  }

  /**
   * This function redraw layer
   *
   * @function
   * @public
   * @api stable
   */
  redraw() {
    const olLayer = this.getOLLayer();
    if (!isNullOrEmpty(olLayer)) {
      const style = this.facadeVector_.getStyle();
      let olSource = olLayer.getSource();
      if (olSource instanceof OLSourceCluster) {
        olSource = olSource.getSource();
      }

      if (style instanceof StyleCluster) {
        style.getImpl().deactivateChangeEvent();
      }

      // remove all features from ol vector
      const olFeatures = [...olSource.getFeatures()];
      olFeatures.forEach(olSource.removeFeature, olSource);

      const features = this.facadeVector_.getFeatures();
      olSource.addFeatures(features.map(Feature.facade2OLFeature));

      if (style instanceof StyleCluster) {
        style.getImpl().activateChangeEvent();
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
    const features = this.getFeatures(skipFilter, filter);
    let extent = ImplUtils.getFeaturesExtent(features, this.map.getProjection().code);
    if (extent === null) {
      extent = this.map.getProjection().getExtent();
    }
    return extent;
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
    const feature = features[0];
    if (!(feature instanceof ClusteredFeature) && (this.extract === true)) {
      // unselects previous features
      this.unselectFeatures();

      if (!isNullOrEmpty(feature)) {
        const clickFn = feature.getAttribute('vendor.mapea.click');
        if (isFunction(clickFn)) {
          clickFn(evt, feature);
        } else {
          const popup_template = !isNullOrEmpty(this.template) ? this.template : PopupTemplate;

          let htmlAsText = compileTemplate(popup_template, {
            vars: this.parseFeaturesForTemplate_(features),
            parseToHtml: false,
          });
          if (this.name){
            const layerNameHTML = `<div>${this.name}</div>`
            htmlAsText = layerNameHTML + htmlAsText;
          }
          
          const featureTabOpts = {
            icon: 'g-cartografia-pin',
            title: this.name,
            content: htmlAsText,
          };
          let popup = this.map.getPopup();
          if (isNullOrEmpty(popup)) {
            popup = new Popup();
            popup.addTab(featureTabOpts);
            this.map.addPopup(popup, coord);
          } else {
            popup.addTab(featureTabOpts);
          }
        }
      }
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  unselectFeatures() {
    // this.map.removePopup();
  }
  /**
   * This function set facade class vector
   *
   * @function
   * @param {object} obj - Facade vector
   * @api stable
   */
  setFacadeObj(obj) {
    this.facadeVector_ = obj;
  }

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  setProjection_(oldProj, newProj) {
    if (oldProj.code !== newProj.code) {
      const srcProj = getProj(oldProj.code);
      const dstProj = getProj(newProj.code);

      const style = this.facadeVector_.getStyle();
      if (style instanceof StyleCluster) {
        style.getImpl().deactivateChangeEvent();
      }

      this.facadeVector_.getFeatures().forEach(feature => feature.getImpl()
        .getOLFeature().getGeometry().transform(srcProj, dstProj));

      if (style instanceof StyleCluster) {
        style.getImpl().activateChangeEvent();
      }
    }
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  parseFeaturesForTemplate_(features) {
    const featuresTemplate = {
      features: [],
    };

    features.forEach((feature) => {
      if (!(feature instanceof ClusteredFeature)) {
        const properties = feature.getAttributes();
        const propertyKeys = Object.keys(properties);
        const attributes = [];
        propertyKeys.forEach((key) => {
          let addAttribute = true;
          // adds the attribute just if it is not in
          // hiddenAttributes_ or it is in showAttributes_
          if (!isNullOrEmpty(this.showAttributes_)) {
            addAttribute = includes(this.showAttributes_, key);
          } else if (!isNullOrEmpty(this.hiddenAttributes_)) {
            addAttribute = !includes(this.hiddenAttributes_, key);
          }
          if (addAttribute) {
            attributes.push({
              key: beautifyAttributeName(key),
              value: properties[key],
            });
          }
        });
        const featureTemplate = {
          id: feature.getId(),
          attributes,
        };
        featuresTemplate.features.push(featureTemplate);
      }
    });
    return featuresTemplate;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @param {object} obj - Object to compare
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof Vector && this.constructor === obj.constructor) {
      equals = true;
    }
    return equals;
  }

  /**
   * This function refresh layer
   * @function
   * @api stable
   */
  refresh() {
    this.getOLLayer().getSource().clear();
  }

  /**
   * TODO
   * @function
   * @api stable
   */
  isLoaded() {
    return this.loaded_;
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
    this.map = null;
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
        this.requestFeatures_().then((features) => {
          const extent = ImplUtils.getFeaturesExtent(features, codeProj);
          resolve(extent);
        });
      }
    });
  }
}

export default Vector;
