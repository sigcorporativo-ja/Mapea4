/**
 * @module M/layer/Vector
 */
import VectorImpl from 'impl/layer/Vector.js';
import { geojsonTo4326 } from 'impl/util/Utils.js';
import { isUndefined, isArray, isNullOrEmpty, isString, normalize } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import LayerBase from './Layer.js';
import * as LayerType from './Type.js';
import * as dialog from '../dialog.js';
import FilterBase from '../filter/Base.js';
import StyleCluster from '../style/Cluster.js';
import Style from '../style/Style.js';
import * as EventType from '../event/eventtype.js';
import { getValue } from '../i18n/language.js';
import Generic from '../style/Generic.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a Vector layer
 * with parameters specified by the user
 * @api
 */
class Vector extends LayerBase {
  /**
   * @constructor
   * @extends {M.Layer}
   * @param {Mx.parameters.Layer} userParameters - parameters
   * @param {Mx.parameters.LayerOptions} options - custom options for this layer
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(parameters = {}, options = {}, vendorOptions = {}, implParam) {
    // calls the super constructor
    const impl = implParam || new VectorImpl(options, vendorOptions);
    super(parameters, impl);

    // checks if the implementation can create Vector
    if (isUndefined(VectorImpl)) {
      Exception(getValue('exception').vectorlayer_method);
    }

    // extract
    this.extract = parameters.extract;
    if (isNullOrEmpty(this.extract)) {
      this.extract = true; // by default
    }

    /**
     * Style of the layer
     * @private
     * @type {M.Style}
     */
    this.style_ = null;

    /**
     * Filter
     * @private
     * @type {M.Filter}
     */
    this.filter_ = null;

    this.setStyle(options.style);

    impl.on(EventType.LOAD, features => this.fire(EventType.LOAD, [features]));
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.Vector;
  }

  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.Vector)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.Vector).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'extract' the features properties
   */
  get extract() {
    return this.getImpl().extract;
  }

  set extract(newExtract) {
    if (!isNullOrEmpty(newExtract)) {
      if (isString(newExtract)) {
        this.getImpl().extract = (normalize(newExtract) === 'true');
      } else {
        this.getImpl().extract = newExtract;
      }
    } else {
      this.getImpl().extract = true;
    }
  }

  /**
   * Adds features to layer. Only features that are not already in the layer
   * will be added. Two features are equal if the have the same id.
   * @function
   * @public
   * @param {Array<M.feature>|M.feature} features Features to add
   * @param {boolean} [update=false] Update layer
   * @api
   */
  addFeatures(featuresParam, update = false, checkDuplicate = true) {
    let features = featuresParam;
    if (!isNullOrEmpty(features)) {
      if (!isArray(features)) {
        features = [features];
      }
      this.getImpl().addFeatures(features, update, checkDuplicate);
    }
  }

  /**
   * Returns all features. If the layer has a Filter, it can skip it and return all features,
   * or apply it and return only features that comply with the Filter (default behaviour).
   *
   * @function
   * @public
   * @param {boolean} [skipFilter=false]  Indicates whether skip the layer filter, if any.
   * @return {Array<M.Feature>} Features
   * @api
   */
  getFeatures(skipFilterParam) {
    let skipFilter = skipFilterParam;
    if (isNullOrEmpty(this.getFilter())) skipFilter = true;
    return this.getImpl().getFeatures(skipFilter, this.filter_);
  }

  /**
   * Searchs and returns the feature with this id, if any.
   *
   * @function
   * @public
   * @param {string|number} id  Id ofthe feature
   * @return {null|M.feature} Feature with id, if it is found, null otherwise
   * @api
   */
  getFeatureById(id) {
    let feature = null;
    if (!isNullOrEmpty(id)) {
      feature = this.getImpl().getFeatureById(id);
    } else {
      dialog.error(getValue('dialog').id_feature);
    }
    return feature;
  }

  /**
   * Removes the features indicated
   *
   * @function
   * @public
   * @param {Array<M.feature>|M.feature} features - Features to remove
   * @api
   */
  removeFeatures(featuresParam) {
    let features = featuresParam;
    if (!isArray(features)) {
      features = [features];
    }
    this.getImpl().removeFeatures(features);
  }

  /**
   * Removes all features and filter from the layer
   *
   * @function
   * @public
   * @api
   */
  clear() {
    this.removeFilter();
    this.removeFeatures(this.getFeatures(true));
  }

  /**
   * Refreshes the layer
   *
   * @function
   * @public
   * @api
   */
  refresh() {
    this.getImpl().refresh(true);
    this.redraw();
  }

  /**
   * Redraws the layer
   *
   * @function
   * @public
   * @api
   */
  redraw() {
    this.getImpl().redraw();
    // if (!isNullOrEmpty(this.getStyle())) {
    //   let style = this.getStyle();
    //   if (!(style instanceof M.style.Cluster)) {
    //     style.refresh();
    //   }
    //   else {
    //     let oldStyle = style.getOldStyle();
    //     if (!isNullOrEmpty(oldStyle)) {
    //       oldStyle.refresh(this);
    //     }
    //
    //   }
    // }
  }

  /**
   * Sets a filter to the layer. Only features that comply with the filter are
   * active as long as the filter is set.
   *
   * @function
   * @public
   * @param {M.Filter} filter - filter to set
   * @api
   */
  setFilter(filter) {
    if (isNullOrEmpty(filter) || (filter instanceof FilterBase)) {
      this.filter_ = filter;
      const style = this.style_;
      if (style instanceof StyleCluster) {
        // deactivate change cluster event
        style.getImpl().deactivateChangeEvent();
      }
      this.redraw();
      if (style instanceof StyleCluster) {
        // activate change cluster event
        style.getImpl().activateChangeEvent();

        // Se refresca el estilo para actualizar los cambios del filtro
        // ya que al haber activado el evento change de source cluster tras aplicar el filter
        // no se actualiza automaticamente
        style.refresh();
      }
    } else {
      dialog.error(getValue('dialog').vector_filter);
    }
  }

  /**
   * Returns the filter of the layer, if any, null otherwise
   *
   * @function
   * @public
   * @return {M.Filter|null} Filter assigned to the layer
   * @api
   */
  getFilter() {
    return this.filter_;
  }

  /**
   * Returns the minimun extent that contains all features,
   *  skipping the layer filter, if set, or not.
   *
   * @function
   * @param {boolean} [skipFilter=false] - Indicates whether to slkip filter
   * @return {Array<number>} Extent that contains all the features
   * @api
   */
  getFeaturesExtent(skipFilterParam) {
    let skipFilter = skipFilterParam;
    if (isNullOrEmpty(this.getFilter())) skipFilter = true;
    return this.getImpl().getFeaturesExtent(skipFilter, this.filter_);
  }

  /**
   * Removes the current filter. All previously filtered features will be active again.
   *
   * @function
   * @public
   * @api
   */
  removeFilter() {
    this.setFilter(null);
  }

  /**
   * Checks if an object is equal to this layer. Two vector layers are equal
   *  if they are Vector type
   * and both have the same name.
   *
   * @function
   * @public
   * @param {object} obj Object to compare
   * @return {boolean} True if equal, false otherwise
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof Vector) {
      equals = this.name === obj.name;
    }
    return equals;
  }

  /**
   * Sets a style to the layer
   *
   * @function
   * @public
   * @param {M.Style}
   * @param {boolean} [applyToFeature=false] True to apply the style at layer level,
   *  false to apply style to each feature
   * @api
   */
  setStyle(style, applyToFeature = false, defaultStyle = Vector.DEFAULT_OPTIONS_STYLE) {
    if (this.getImpl().isLoaded()) {
      if (isNullOrEmpty(this.getStyle())) {
        this.applyStyle_(defaultStyle, applyToFeature);
      }
      if (!isNullOrEmpty(style)) {
        this.applyStyle_(style, applyToFeature);
      }
    } else {
      this.once(EventType.LOAD, () => {
        if (isNullOrEmpty(this.getStyle())) {
          this.applyStyle_(defaultStyle, applyToFeature);
        }
        if (!isNullOrEmpty(style)) {
          this.applyStyle_(style, applyToFeature);
        }
      });
    }
  }

  /**
   * TODO
   */
  applyStyle_(styleParam, applyToFeature) {
    let style = styleParam;
    if (isString(style)) {
      style = Style.deserialize(style);
    } else if (!(style instanceof Style)) {
      style = new Generic(style);
    }

    if (style instanceof Style) {
      if (!isNullOrEmpty(this.style_) && this.style_ instanceof Style) {
        this.style_.unapply(this);
      }
      style.apply(this, applyToFeature);
      this.style_ = style;
      this.fire(EventType.CHANGE_STYLE, [style, this]);
    }
    if (!isNullOrEmpty(this.getImpl().getMap())) {
      const layerswitcher = this.getImpl().getMap().getControls('layerswitcher')[0];
      if (!isNullOrEmpty(layerswitcher)) {
        layerswitcher.render();
      }
    }
    this.fire(EventType.CHANGE_STYLE, [style, this]);
  }

  /**
   * Returns the style of the layer
   *
   * @return {M.Style} The style of the layer
   * @api
   */
  getStyle() {
    return this.style_;
  }

  /**
   * Removes the style of the layer, both at layer and at feature level
   *
   * @function
   * @public
   * @api
   */
  clearStyle() {
    this.setStyle(null);
    this.getFeatures().forEach(feature => feature.clearStyle());
  }

  /**
   * Builds an image for the legend for this layer,
   *  or returns the url of an image if previously set as legend
   *
   * @function
   * @return {string} png image in base64 or url
   * @api
   */
  getLegendURL() {
    let legendUrl = this.getImpl().getLegendURL();
    if (legendUrl.indexOf(LayerBase.LEGEND_DEFAULT) !== -1 &&
      legendUrl.indexOf(LayerBase.LEGEND_ERROR) === -1 && this.style_ instanceof Style) {
      if (this.style_ instanceof StyleCluster && this.style_.getStyles().length > 0) {
        legendUrl = this.style_.getStyles()[0].toImage();
      } else {
        legendUrl = this.style_.toImage();
      }
    }
    return legendUrl;
  }

  /**
   * Gets the geometry type of the layer.
   * @function
   * @public
   * @return {string} geometry type of layer
   * @api
   */
  getGeometryType() {
    let geometry = null;
    if (!isNullOrEmpty(this.getFeatures())) {
      const firstFeature = this.getFeatures()[0];
      if (!isNullOrEmpty(firstFeature) && !isNullOrEmpty(firstFeature.getGeometry())) {
        geometry = firstFeature.getGeometry().type;
      }
    }
    return geometry;
  }

  /**
   * Gets the minimum extent that includes all features from this layer
   *
   * @function
   * @return {Array<number>} Minimun extent that contains all the features
   * @api
   */
  getMaxExtent() {
    return this.getFeaturesExtent();
  }

  /**
   * Calculates the max extent of the layer
   *
   * @function
   * @return {Promise} Promise object representing the maxExtent of the layer
   * @api
   */
  calculateMaxExtent() {
    return this.getImpl().getFeaturesExtentPromise(true, this.filter_);
  }

  /**
   * Generates the GeoJSON representation of the layer
   * @function
   * @return {Object} Layer in GeoJSON format
   * @api
   */
  toGeoJSON() {
    const code = this.map_.getProjection().code;
    const featuresAsJSON = this.getFeatures().map(feature => feature.getGeoJSON());
    return { type: 'FeatureCollection', features: geojsonTo4326(featuresAsJSON, code) };
  }
}

/**
 * Default params for style vector layers
 * @const
 * @type {object}
 * @public
 * @api
 */
Vector.DEFAULT_PARAMS = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
};

/**
 * Default style for Vector layers
 * @const
 * @type {object}
 * @public
 * @api
 */
Vector.DEFAULT_OPTIONS_STYLE = {
  point: {
    ...Vector.DEFAULT_PARAMS,
    radius: 5,
  },
  line: {
    ...Vector.DEFAULT_PARAMS,
  },
  polygon: {
    ...Vector.DEFAULT_PARAMS,
  },
};

export default Vector;
