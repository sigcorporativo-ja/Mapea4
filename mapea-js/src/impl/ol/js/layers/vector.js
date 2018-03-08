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

    /*TODO*/
    this.load_ = false;

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

    this.ol3Layer = new ol.layer.Vector();
    this.updateSource_();

    this.setVisible(this.visibility);

    if (this.zIndex_ !== null) {
      this.setZIndex(this.zIndex_);
    }
    this.setZIndex(999999);

    let olMap = this.map.getMapImpl();
    olMap.addLayer(this.ol3Layer);
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
  M.impl.layer.Vector.prototype.addFeatures = function(features, update) {
    features.forEach(function(newFeature) {
      let feature = this.features_.find(feature => feature.equals(newFeature));
      if (M.utils.isNullOrEmpty(feature)) {
        this.features_.push(newFeature);
      }
    }.bind(this));
    if (update) {
      this.updateLayer_();
    }
    let style = this.facadeVector_.getStyle();
    if (style instanceof M.style.Cluster) {
      style.getImpl().deactivateTemporarilyChangeEvent(this.redraw.bind(this));
      style.refresh();
    }
    else {
      this.redraw();
    }
  };


  /**
   * This function add features to layer and redraw with a layer style
   * @function
   * @private
   * @api stable
   */
  M.impl.layer.Vector.prototype.updateLayer_ = function() {
    let style = this.facadeVector_.getStyle();
    if (style instanceof(M.style.Simple)) {
      this.facadeVector_.setStyle(style);
    }
    else {
      if (style instanceof M.style.Cluster) {
        let cluster = this.facadeVector_.getStyle();
        cluster.unapply(this.facadeVector_);
        cluster.getOldStyle().apply(this.facadeVector_);
        cluster.apply(this.facadeVector_);
      }
      else {
        style.apply(this.facadeVector_);
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
   * This function returns the feature with this id
   *
   * @function
   * @public
   * @param {string|number} id - Id feature
   * @return {null|M.feature} feature - Returns the feature with that id if it is found, in case it is not found or does not indicate the id returns null
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeatureById = function(id) {
    return this.features_.find(feature => feature.getId() === id);
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
    this.features_ = this.features_.filter(f => !(features.includes(f)));
    let style = this.facadeVector_.getStyle();
    if (style instanceof M.style.Cluster) {
      style.getImpl().deactivateTemporarilyChangeEvent(this.redraw.bind(this));
      style.refresh();
    }
    else {
      this.redraw();
    }
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
      if (olSource instanceof ol.source.Cluster) {
        olSource = olSource.getSource();
      }
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
    if (oldProj.code !== newProj.code) {
      let srcProj = ol.proj.get(oldProj.code);
      let dstProj = ol.proj.get(newProj.code);

      let style = this.facadeVector_.getStyle();
      if (style instanceof M.style.Cluster) {
        style.getImpl().deactivateChangeEvent();
      }

      this.facadeVector_.getFeatures().forEach(f =>
        f.getImpl().getOLFeature().getGeometry().transform(srcProj, dstProj));

      if (style instanceof M.style.Cluster) {
        style.getImpl().activateChangeEvent();
      }
    }
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

  /**
   * TODO
   * @function
   * @api stable
   */
  M.impl.layer.Vector.prototype.isLoaded = function() {
    return true;
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.Vector.prototype.destroy = function() {
    var olMap = this.map.getMapImpl();
    if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    this.map = null;
  };
})();
