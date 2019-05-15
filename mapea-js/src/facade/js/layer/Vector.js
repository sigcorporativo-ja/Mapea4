/**
 * @module M/layer/Vector
 */
import VectorImpl from 'impl/layer/Vector';
import { geojsonTo4326 } from 'impl/util/Utils';
import { isUndefined, isArray, isNullOrEmpty, isString } from '../util/Utils';
import { generateStyleLayer } from '../style/utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import * as LayerType from './Type';
import * as dialog from '../dialog';
import FilterBase from '../filter/Base';
import StyleCluster from '../style/Cluster';
import Style from '../style/Style';
import * as EventType from '../event/eventtype';
import { getValue } from '../i18n/language';

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

    /**
     * TODO
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
   * This function add features to layer
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to add
   * @api
   */
  addFeatures(featuresParam, update = false) {
    let features = featuresParam;
    if (!isNullOrEmpty(features)) {
      if (!isArray(features)) {
        features = [features];
      }
      this.getImpl().addFeatures(features, update);
    }
  }

  /**
   * This function returns all features or discriminating by the filter
   *
   * @function
   * @public
   * @param {boolean} applyFilter - Indicates whether execute filter
   * @return {Array<M.Feature>} returns all features or discriminating by the filter
   * @api
   */
  getFeatures(skipFilterParam) {
    let skipFilter = skipFilterParam;
    if (isNullOrEmpty(this.getFilter())) skipFilter = true;
    return this.getImpl().getFeatures(skipFilter, this.filter_);
  }

  /**
   * This function returns the feature with this id
   * @function
   * @public
   * @param {string|number} id - Id feature
   * @return {null|M.feature} feature - Returns the feature with that id if it is found,
     in case it is not found or does not indicate the id returns null
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
   * This function remove the features indicated
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to remove
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
   * This function remove all features
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
   * This function refresh layer
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
   * This function redraw layer
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
   * This function set a filter
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
   * This function return filter
   *
   * @function
   * @public
   * @return {M.Filter} returns filter assigned
   * @api
   */
  getFilter() {
    return this.filter_;
  }

  /**
   * This function return extent of all features or discriminating by the filter
   *
   * @function
   * @param {boolean} applyFilter - Indicates whether execute filter
   * @return {Array<number>} Extent of features
   * @api
   */
  getFeaturesExtent(skipFilterParam) {
    let skipFilter = skipFilterParam;
    if (isNullOrEmpty(this.getFilter())) skipFilter = true;
    return this.getImpl().getFeaturesExtent(skipFilter, this.filter_);
  }

  /**
   * This function remove filter
   *
   * @function
   * @public
   * @api
   */
  removeFilter() {
    this.setFilter(null);
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @public
   * @param {object} obj - Object to compare
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
   * This function sets the style to layer
   *
   * @function
   * @public
   * @param {M.Style}
   * @param {bool}
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
      style = generateStyleLayer(style, this);
    }
    // const isCluster = style instanceof StyleCluster;
    // const isPoint = [POINT, MULTI_POINT].includes(this.getGeometryType());
    if (style instanceof Style) /* && (!isCluster || isPoint) ) */ {
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
   * This function return style vector
   *
   * TODO
   * @api
   */
  getStyle() {
    return this.style_;
  }

  /**
   * This function remove the style layer and style of all features
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
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  getLegendURL() {
    let legendUrl = this.getImpl().getLegendURL();
    if (legendUrl.indexOf(LayerBase.LEGEND_DEFAULT) !== -1 &&
      legendUrl.indexOf(LayerBase.LEGEND_ERROR) === -1 && this.style_ instanceof Style) {
      legendUrl = this.style_.toImage();
    }
    return legendUrl;
  }

  /**
   * This function gets the geometry type of a layer.
   * @function
   * @public
   * @param {M.layer.Vector} layer - layer vector
   * @return {string} geometry type of layer
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
   * This function indicates the layer max extent
   *
   * @function
   * @api
   */
  getMaxExtent() {
    return this.getFeaturesExtent();
  }

  /**
   * This function indicates the layer max extent
   *
   * @function
   * @api
   */
  calculateMaxExtent() {
    return this.getImpl().getFeaturesExtentPromise(true, this.filter_);
  }

  /**
   * This function gets the geojson representation of the layer
   * @function
   * @api
   */
  toGeoJSON() {
    const code = this.map_.getProjection().code;
    const featuresAsJSON = this.getFeatures().map(feature => feature.getGeoJSON());
    return { type: 'FeatureCollection', features: geojsonTo4326(featuresAsJSON, code) };
  }
}

/**
 * Options style by default
 * @const
 * @type {object}
 * @public
 * @api
 */
Vector.DEFAULT_OPTIONS_STYLE = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
  radius: 5,
};

export default Vector;
