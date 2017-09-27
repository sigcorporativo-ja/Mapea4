goog.provide('M.impl.layer.Vector');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.renderutils');

(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Vector layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options - custom options for this layer
   * @api stable
   */
  M.impl.layer.Vector = (function(options) {
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

    // [WARN]
    //applyOLLayerSetStyleHook();

    goog.base(this, options);
  });
  goog.inherits(M.impl.layer.Vector, M.impl.Layer);

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  M.impl.layer.Vector.prototype.addTo = function(map) {
    this.map = map;
    map.on(M.evt.CHANGE_PROJ, this.setProjection_, this);

    this.ol3Layer = new ol.layer.Vector({
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(0, 158, 0, 0.1)'
        }),
        stroke: new ol.style.Stroke({
          color: '#fcfcfc',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#009E00'
          }),
          stroke: new ol.style.Stroke({
            color: '#fcfcfc',
            width: 2
          })
        })
      }),
      zIndex: M.impl.Map.Z_INDEX[M.layer.type.WFS] + 999
    });
    this.updateSource_();
    this.facadeVector_.setStyle(this.facadeVector_.getStyle());

    let style = this.facadeVector_.getStyle();
    if (!M.utils.isNullOrEmpty(style)) {
      this.facadeVector_.setStyle(this.facadeVector_.getStyle());
    }
    else {
      if (this instanceof M.impl.layer.WFS) {
        this.facadeVector_.setStyle(M.utils.generateStyleLayer(M.impl.layer.WFS.DEFAULT_OPTIONS_STYLE, this.facadeVector_));
      }
      else if (this instanceof M.impl.layer.GeoJSON) {
        this.facadeVector_.setStyle(M.utils.generateStyleLayer(M.impl.layer.GeoJSON.DEFAULT_OPTIONS_STYLE, this.facadeVector_));
      }
    }

    // sets its visibility if it is in range
    // if (this.options.visibility != false) {
    //   this.setVisible(this.inRange());
    // }
    // sets its z-index

    this.setVisible(this.visibility);

    if (this.zIndex_ !== null) {
      this.setZIndex(this.zIndex_);
    }
    this.setZIndex(999999);

    let olMap = this.map.getMapImpl();
    olMap.addLayer(this.ol3Layer);

    this.postComposeEvtKey_ = this.ol3Layer.on('postcompose', M.impl.renderutils.postRender.bind(this.ol3Layer), this);
  };
  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  M.impl.layer.Vector.prototype.updateSource_ = function() {
    if (M.utils.isNullOrEmpty(this.ol3Layer.getSource())) {
      this.ol3Layer.setSource(new ol.source.Vector());
    }
    this.redraw();
  };

  /**
   * This function indicates if the layer is in range
   *
   * @function
   * @api stable
   * @expose
   */
  M.impl.layer.Vector.prototype.inRange = function() {
    // vectors are always in range
    return true;
  };


  /**
   * This function add features to layer
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to add
   * @api stable
   */
  M.impl.layer.Vector.prototype.addFeatures = function(features, boolUpdateLayer) {

    if (M.utils.isNullOrEmpty(boolUpdateLayer)) {
      this.features_ = this.features_.concat(features);
    }
    else {
      this.updateLayer(features);
    }
    this.redraw();
  };


  /**
   * This function add features to layer
   *
   * TODO
   *
   */
  M.impl.layer.Vector.prototype.updateLayer = function(features) {
    let style = this.facadeVector_.getStyle();
    if (style instanceof(M.M.style.Simple)) {
      this.features_ = this.features_.concat(features);
      this.facadeVector_.setStyle(style);
    }
    else {
      if (style instanceof(M.style.Category) || style instanceof(M.style.Choropleth) || style instanceof(M.style.Proportional) || style instanceof(M.style.Chart)) {
        this.features_ = this.features_.concat(features);
        style.apply(this.facadeVector_);
      }
      else {
        let cluster = this.facadeVector_.getStyle();
        cluster.unapply(this.facadeVector_);
        this.features_ = this.features_.concat(features);
        cluster.getOldStyle().apply(this.facadeVector_);
        cluster.apply(this.facadeVector_);
      }
    }
  };


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
  M.impl.layer.Vector.prototype.getFeatures = function(skipFilter, filter) {
    let features = this.features_;
    if (!skipFilter) features = filter.execute(features);
    return features;
  };

  /**
   * TODO
   */
  M.impl.layer.Vector.prototype.setFeatures = function(features) {
    this.features_ = features;
    this.redraw();
  };

  /**
   * This function returns the feature with this id
   *
   * @function
   * @public
   * @param {string|number} id - Id feature
   * @return {null|M.feature} feature - Returns the feature with that id if it is found, in case it is not found or does not indicate the id returns null
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeatureById = function(id) {
    let feature = this.getOL3Layer().getSource().getFeatureById(id);
    return M.impl.Feature.olFeature2Facade(feature);
  };

  /**
   * This function remove the features indicated
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to remove
   * @api stable
   */
  M.impl.layer.Vector.prototype.removeFeatures = function(features) {
    let copyFeatures = [...this.features_];
    features.forEach(function(feature) {
      copyFeatures.splice(copyFeatures.indexOf(feature), 1);
    }.bind(this));
    this.features_ = copyFeatures;
    this.redraw();
  };

  /**
   * This function redraw layer
   *
   * @function
   * @public
   * @api stable
   */
  M.impl.layer.Vector.prototype.redraw = function() {
    let olLayer = this.getOL3Layer();
    if (!M.utils.isNullOrEmpty(olLayer)) {
      let olSource = olLayer.getSource();

      // remove all features from ol vector
      let olFeatures = [...olSource.getFeatures()];
      olFeatures.forEach(olSource.removeFeature, olSource);

      let features = this.facadeVector_.getFeatures();
      olSource.addFeatures(features.map(M.impl.Feature.facade2OLFeature));
    }
  };

  /**
   * This function return extent of all features or discriminating by the filter
   *
   * @function
   * @param {boolean} skipFilter - Indicates whether skip filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<number>} Extent of features
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeaturesExtent = function(skipFilter, filter) {
    let features = this.getFeatures(skipFilter, filter);
    return M.impl.utils.getFeaturesExtent(features);
  };

  /**
   * TODO
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  M.impl.layer.Vector.prototype.selectFeatures = function(features, coord, evt) {
    var feature = features[0];
    if (!M.utils.isNullOrEmpty(feature)) {
      let clickFn = feature.getAttribute('vendor.mapea.click');
      if (M.utils.isFunction(clickFn)) {
        clickFn(evt, feature);
      }
    }
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.Vector.prototype.unselectFeatures = function() {
    this.map.removePopup();
  };

  /**
   * This function set facade class vector
   *
   * @function
   * @param {object} obj - Facade vector
   * @api stable
   */
  M.impl.layer.Vector.prototype.setFacadeObj = function(obj) {
    this.facadeVector_ = obj;
  };

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  M.impl.layer.Vector.prototype.setProjection_ = function(oldProj, newProj) {
    let srcProj = ol.proj.get(oldProj.code);
    let dstProj = ol.proj.get(newProj.code);
    this.facadeVector_.getFeatures().forEach(f => f.getImpl().getOLFeature().getGeometry().transform(srcProj, dstProj));
  };

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @param {object} obj - Object to compare
   * @api stable
   */
  M.impl.layer.Vector.prototype.equals = function(obj) {
    var equals = false;
    if (obj instanceof M.impl.layer.Vector) {}
    return equals;
  };

  /**
   * This function refresh layer
   * @function
   * @api stable
   */
  M.impl.layer.Vector.prototype.refresh = function() {
    this.getOL3Layer().getSource().clear();
  };

})();
