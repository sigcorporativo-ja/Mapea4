import VectorImpl from 'impl/layer/Vector';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import LayerType from './Type';
import * as dialog from '../dialog';
import FilterBase from '../filter/Base';
import StyleCluster from '../style/Cluster';
import GeomGeoJSON from '../geom/GeoJSON';
import Style from '../style/Style';
import EvtManager from '../event/Manager';

export default class Vector extends LayerBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Vector layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Layer}
   * @param {Mx.parameters.Layer} userParameters - parameters
   * @param {Mx.parameters.LayerOptions} options - custom options for this layer
   * @api stable
   */
  constructor(parameters = {}, options = {}, impl = new VectorImpl(options)) {
    // calls the super constructor
    super(parameters, impl);

    // checks if the implementation can create Vector
    if (Utils.isUndefined(VectorImpl)) {
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

    // this.setStyle(this.style_);

    impl.on(EvtManager.LOAD, features => this.fire(EvtManager.LOAD, [features]));
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.Vector;
  }

  set type(newType) {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.Vector)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.Vector).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * This function add features to layer
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to add
   * @api stable
   */
  addFeatures(featuresParam, update = false) {
    let features = featuresParam;
    if (!Utils.isNullOrEmpty(features)) {
      if (!Utils.isArray(features)) {
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
   * @api stable
   */
  getFeatures(skipFilterParam) {
    let skipFilter = skipFilterParam;
    if (Utils.isNullOrEmpty(this.getFilter())) skipFilter = true;
    return this.getImpl().getFeatures(skipFilter, this.filter_);
  }

  /**
   * This function returns the feature with this id
   * @function
   * @public
   * @param {string|number} id - Id feature
   * @return {null|M.feature} feature - Returns the feature with that id if it is found,
     in case it is not found or does not indicate the id returns null
   * @api stable
   */
  getFeatureById(id) {
    let feature = null;
    if (!Utils.isNullOrEmpty(id)) {
      feature = this.getImpl().getFeatureById(id);
    }
    else {
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
   * @api stable
   */
  removeFeatures(featuresParam) {
    let features = featuresParam;
    if (!Utils.isArray(features)) {
      features = [features];
    }
    this.getImpl().removeFeatures(features);
  }

  /**
   * This function remove all features
   *
   * @function
   * @public
   * @api stable
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
   * @api stable
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
   * @api stable
   */
  redraw() {
    this.getImpl().redraw();
    // if (!Utils.isNullOrEmpty(this.getStyle())) {
    //   let style = this.getStyle();
    //   if (!(style instanceof M.style.Cluster)) {
    //     style.refresh();
    //   }
    //   else {
    //     let oldStyle = style.getOldStyle();
    //     if (!Utils.isNullOrEmpty(oldStyle)) {
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
   * @api stable
   */
  setFilter(filter) {
    if (Utils.isNullOrEmpty(filter) || (filter instanceof FilterBase)) {
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
    }
    else {
      dialog.error('El filtro indicado no es correcto');
    }
  }

  /**
   * This function return filter
   *
   * @function
   * @public
   * @return {M.Filter} returns filter assigned
   * @api stable
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
   * @api stable
   */
  getFeaturesExtent(skipFilterParam) {
    let skipFilter = skipFilterParam;
    if (Utils.isNullOrEmpty(this.getFilter())) skipFilter = true;
    return this.getImpl().getFeaturesExtent(skipFilter, this.filter_);
  }

  /**
   * This function remove filter
   *
   * @function
   * @public
   * @api stable
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
   * @api stable
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
  // setStyle(styleParam, applyToFeature = false, optionStyle = Vector.DEFAULT_OPTIONS_STYLE) {
  //   const styleC = styleParam;
  //   this.oldStyle_ = this.style_;
  //   let isNullStyle = false;
  //   if (styleC === null) {
  //     isNullStyle = true;
  //   }
  //   const applyStyleFn = (styleVar) => {
  //     let style = styleVar;
  //     const applyStyle = () => {
  //       if (Utils.isNullOrEmpty(style)) {
  //         style = Utils.generateStyleLayer(optionStyle, this);
  //       }
  //       const isCluster = style instanceof StyleCluster;
  //       const isPoint = [GeomGeoJSON.type.POINT, GeomGeoJSON.type.MULTI_POINT]
  //         .includes(Utils.getGeometryType(this));
  //       if (style instanceof Style && (!isCluster || isPoint)) {
  //         if (!Utils.isNullOrEmpty(this.oldStyle_)) {
  //           this.oldStyle_.unapply(this);
  //         }
  //         style.apply(this, applyToFeature, isNullStyle);
  //         this.style_ = style;
  //         this.fire(EvtManager.CHANGE_STYLE, [style, this]);
  //       }
  //       if (!Utils.isNullOrEmpty(this.getImpl().getMap())) {
  //         const layerswitcher = this.getImpl().getMap().getControls('layerswitcher')[0];
  //         if (!Utils.isNullOrEmpty(layerswitcher)) {
  //           layerswitcher.render();
  //         }
  //       }
  //     };
  //     return applyStyle;
  //   };
  //
  //   if (this.getImpl().isLoaded()) {
  //     applyStyleFn(styleC).bind(this)();
  //   }
  //   else {
  //     this.once(EvtManager.LOAD, applyStyleFn(styleC), this);
  //   }
  // }

  /**
   * This function return style vector
   *
   * TODO
   * @api stable
   */
  getStyle() {
    return this.style_;
  }

  /**
   * This function remove the style layer and style of all features
   *
   * @function
   * @public
   * @api stable
   */
  clearStyle() {
    this.style = null;
    this.getFeatures().forEach(feature => feature.clearStyle());
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  getLegendURL() {
    let legendUrl = this.getImpl().getLegendURL();
    if (legendUrl.indexOf(LayerBase.LEGEND_DEFAULT) !== -1 &&
      legendUrl.indexOf(LayerBase.LEGEND_ERROR) === -1 && !Utils.isNullOrEmpty(this.style_)) {
      legendUrl = this.style_.toImage();
    }
    return legendUrl;
  }
}

/**
 * Options style by default
 * @const
 * @type {object}
 * @public
 * @api stable
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
