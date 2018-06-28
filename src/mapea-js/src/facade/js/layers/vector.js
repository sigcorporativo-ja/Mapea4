import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import LayerBase from('./layerbase.js');
import VectorImpl from('../../../impl/js/layers/vector.js');
import LayerType from('./layertype.js');
import Dialog from("../dialog.js");
import Filter from("../filter/filter.js");
import Cluster from('../style/stylecluster.js');
import WFS from("./wfs.js");
import Geojson from('../geom/geojson.js');
import GeoJSON from('./geojson.js');
import Style from('../style/style.js');

export class Vector extends LayerBase {
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
    super(this, parameters, impl);

    // checks if the implementation can create Vector
    if (Utils.isUndefined(VectorImpl)) {
      Exception('La implementación usada no puede crear capas Vector');
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


    this.style_ = options.style;
    this.style = this.style_;

    impl.on(Evt.LOAD, (features) => this.fire(Evt.LOAD, [features]));
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
  addFeatures(features, update = false) {
    if (!Utils.isNullOrEmpty(features)) {
      if (!Utils.isArray(features)) {
        features = [features];
      }
      this.impl().addFeatures(features, update);
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
  get features(skipFilter) {
    if (Utils.isNullOrEmpty(this.filter())) skipFilter = true;
    return this.impl().features(skipFilter, this.filter_);
  }

  /**
   * This function returns the feature with this id
   * @function
   * @public
   * @param {string|number} id - Id feature
   * @return {null|M.feature} feature - Returns the feature with that id if it is found, in case it is not found or does not indicate the id returns null
   * @api stable
   */
  get featureById(id) {
    let feature = null;
    if (!Utils.isNullOrEmpty(id)) {
      feature = this.impl().featureById(id);
    } else {
      Dialog.error("No se ha indicado un ID para obtener el feature");
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
  removeFeatures(features) {
    if (!Utils.isArray(features)) {
      features = [features];
    }
    this.impl().removeFeatures(features);
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
    this.removeFeatures(this.features(true));
  }

  /**
   * This function refresh layer
   *
   * @function
   * @public
   * @api stable
   */
  refresh() {
    this.impl().refresh(true);
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
    this.impl().redraw();
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
  set filter(filter) {
    if (Utils.isNullOrEmpty(filter) || (filter instanceof Filter)) {
      this.filter_ = filter;
      let style = this.style();
      if (style instanceof Cluster) {
        // deactivate change cluster event
        style.impl().deactivateChangeEvent();
      }
      this.redraw();
      if (style instanceof Cluster) {
        // activate change cluster event
        style.impl().activateChangeEvent();

        // Se refresca el estilo para actualizar los cambios del filtro
        // ya que al haber activado el evento change de source cluster tras aplicar el filter
        // no se actualiza automaticamente
        style.refresh();
      }
    } else {
      Dialog.error("El filtro indicado no es correcto");
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
  get filter() {
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
  get featuresExtent(skipFilter) {
    if (Utils.isNullOrEmpty(this.filter())) skipFilter = true;
    return this.impl().featuresExtent(skipFilter, this.filter_);
  }

  /**
   * This function remove filter
   *
   * @function
   * @public
   * @api stable
   */
  removeFilter() {
    this.filter(null);
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
  set style(style, applyToFeature = false) {
    this.oldStyle_ = this.style_;
    let isNullStyle = false;
    if (style === null) {
      isNullStyle = true;
    }
    const applyStyleFn = (style) => {
      const applyStyle = () => {
        if (Utils.isNullOrEmpty(style)) {
          if (this instanceof WFS) {
            style = Utils.generateStyleLayer(LayerBase.WFS.DEFAULT_OPTIONS_STYLE, this);
          } else {
            style = Utils.generateStyleLayer(GeoJSON.DEFAULT_OPTIONS_STYLE, this);
          }
        }
        let isCluster = style instanceof Cluster;
        let isPoint = [Geojson.POINT, Geojson.MULTI_POINT].includes(Utils.geometryType(this));
        if (style instanceof Style && (!isCluster || isPoint)) {
          if (!Utils.isNullOrEmpty(this.oldStyle_)) {
            this.oldStyle_.unapply(this);
          }
          style.apply(this, applyToFeature, isNullStyle);
          this.style_ = style;
          this.fire(Evt.CHANGE_STYLE, [style, this]);
        }
        if (!Utils.isNullOrEmpty(this.impl().map())) {
          let layerswitcher = this.impl().map().controls('layerswitcher')[0];
          if (!Utils.isNullOrEmpty(layerswitcher)) {
            layerswitcher.render();
          }
        }
      };
      return applyStyle;
    }

    if (this.impl().isLoaded()) {
      applyStyleFn(style).bind(this)();
    } else {
      this.once(Evt.LOAD, applyStyleFn(style), this);
    }
  }

  /**
   * This function return style vector
   *
   * TODO
   * @api stable
   */
  get style() {
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
    this.features().forEach(feature => feature.clearStyle());
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  get legendURL() {
    let legendUrl = this.impl().legendURL();
    if (legendUrl.indexOf(LayerBase.LEGEND_DEFAULT) !== -1 && legendUrl.indexOf(LayerBase.LEGEND_ERROR) === -1 && !Utils.isNullOrEmpty(this.style_)) {
      legendUrl = this.style_.toImage();
    }
    return legendUrl;
  }
}
