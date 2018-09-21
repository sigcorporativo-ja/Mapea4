/**
 * @module M/layer/Vector
 */
import VectorImpl from 'impl/layer/Vector';
import { isUndefined, isArray, isNullOrEmpty } from '../util/Utils';
import { generateStyleLayer } from '../style/utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import * as LayerType from './Type';
import * as dialog from '../dialog';
import FilterBase from '../filter/Base';
import StyleCluster from '../style/Cluster';
import Style from '../style/Style';
import * as EventType from '../event/eventtype';
// import { POINT, MULTI_POINT } from '../geom/GeoJSON';

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
   * @api
   */
  constructor(parameters = {}, options = {}, impl = new VectorImpl(options)) {
    // calls the super constructor
    super(parameters, impl);

    // checks if the implementation can create Vector
    if (isUndefined(VectorImpl)) {
      Exception('La implementación usada no puede crear capas Vector');
    }

    /**
     * TODO
     */
    this.style_ = options.style;

    /**
     * Filter
     * @private
     * @type {M.Filter}
     */
    this.filter_ = null;

    this.setStyle(this.style_);

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
      dialog.error('No se ha indicado un ID para obtener el feature');
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
      dialog.error('El filtro indicado no es correcto');
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
  setStyle(styleVar, applyToFeature = false, defaultStyle = Vector.DEFAULT_OPTIONS_STYLE) {
    let style = styleVar;
    if (isNullOrEmpty(style)) {
      style = defaultStyle;
    }
    if (this.getImpl().isLoaded()) {
      this.applyStyle_(style, applyToFeature)();
    } else {
      this.once(EventType.LOAD, this.applyStyle_(style, applyToFeature));
    }
  }

  /**
   * TODO
   */
  applyStyle_(styleParam, applyToFeature) {
    return () => {
      let style = styleParam;
      if (!(style instanceof Style)) {
        style = generateStyleLayer(style, this);
      }
      // const isCluster = style instanceof StyleCluster;
      // const isPoint = [POINT, MULTI_POINT].includes(this.getGeometryType());
      if (style instanceof Style) /* && (!isCluster || isPoint) ) */ {
        if (!isNullOrEmpty(this.style_)) {
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
    };
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
      legendUrl.indexOf(LayerBase.LEGEND_ERROR) === -1 && !isNullOrEmpty(this.style_)) {
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
