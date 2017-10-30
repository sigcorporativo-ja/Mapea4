goog.provide('M.handler.Features');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.facade.Base');

(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @api stable
   */
  M.handler.Features = (function(options = {}, impl = new M.impl.handler.Features(options)) {
    /**
     * @private
     * @type {M.Map}
     * @expose
     */
    this.map_ = null;

    /**
     * @private
     * @type {Array<M.layer.Vector>}
     * @expose
     */
    this.layers_ = [];

    /**
     * @private
     * @type {boolean}
     * @expose
     */
    this.activated_ = false;

    /**
     * @private
     * @type {Object}
     * @expose
     */
    this.prevSelectedFeatures_ = {};

    /**
     * @private
     * @type {Object}
     * @expose
     */
    this.prevHoverFeatures_ = {};

    // checks if the implementation has all methods
    if (!M.utils.isFunction(impl.addTo)) {
      M.exception('La implementación usada no posee el método addTo');
    }
    if (!M.utils.isFunction(impl.getFeaturesByLayer)) {
      M.exception('La implementación usada no posee el método getFeaturesByLayer');
    }
    // calls the super constructor
    goog.base(this, impl);
  });
  goog.inherits(M.handler.Features, M.facade.Base);

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @api stable
   * @export
   */
  M.handler.Features.prototype.addTo = function(map) {
    this.map_ = map;
    this.map_.on(M.evt.CLICK, this.clickOnMap_, this);
    this.map_.on(M.evt.MOVE, this.moveOverMap_, this);
    this.getImpl().addTo(this.map_);
    this.fire(M.evt.ADDED_TO_MAP);
  };

  /**
   * TODO
   *
   * @private
   * @function
   */
  M.handler.Features.prototype.clickOnMap_ = function(evt) {
    if (this.activated_ === true) {
      let impl = this.getImpl();

      this.layers_.forEach(function(layer) {
        if (layer.name != "cluster_cover") {
          let clickedFeatures = impl.getFeaturesByLayer(evt, layer);
          let prevFeatures = [...this.prevSelectedFeatures_[layer.name]];
          // no features selected then unselect prev selected features
          if (clickedFeatures.length === 0 && prevFeatures.length > 0) {
            this.unselectFeatures_(prevFeatures, layer, evt);
          }
          else if (clickedFeatures.length > 0) {
            let newFeatures = clickedFeatures.filter(f => !prevFeatures.some(pf => pf.equals(f)));
            let diffFeatures = prevFeatures.filter(f => !clickedFeatures.some(pf => pf.equals(f)));
            // unselect prev selected features which have not been selected this time
            if (diffFeatures.length > 0) {
              this.unselectFeatures_(diffFeatures, layer, evt);
            }
            // select new selected features
            if (newFeatures.length > 0) {
              this.selectFeatures_(newFeatures, layer, evt);
            }
          }
        }
      }, this);
    }
  };

  /**
   * TODO
   *
   * @private
   * @function
   */
  M.handler.Features.prototype.moveOverMap_ = function(evt) {
    if (this.activated_ === true) {
      let impl = this.getImpl();

      this.layers_.forEach(function(layer) {
        let hoveredFeatures = impl.getFeaturesByLayer(evt, layer);
        let prevFeatures = [...this.prevHoverFeatures_[layer.name]];
        // no features selected then unselect prev selected features
        if (hoveredFeatures.length === 0 && prevFeatures.length > 0) {
          this.leaveFeatures_(prevFeatures, layer, evt);
        }
        else if (hoveredFeatures.length > 0) {
          let newFeatures = hoveredFeatures.filter(f => !prevFeatures.some(pf => pf.equals(f)));
          let diffFeatures = prevFeatures.filter(f => !hoveredFeatures.some(pf => pf.equals(f)));
          // unselect prev selected features which have not been selected this time
          if (diffFeatures.length > 0) {
            this.leaveFeatures_(diffFeatures, layer, evt);
          }
          // select new selected features
          if (newFeatures.length > 0) {
            this.hoverFeatures_(newFeatures, layer, evt);
          }
        }
      }, this);
    }
  };

  /**
   * TODO
   *
   * @private
   * @function
   * @api stable
   */
  M.handler.Features.prototype.selectFeatures_ = function(features, layer, evt) {
    this.prevSelectedFeatures_[layer.name] = this.prevSelectedFeatures_[layer.name].concat(features);
    let layerImpl = layer.getImpl();
    if (M.utils.isFunction(layerImpl.selectFeatures)) {
      layerImpl.selectFeatures(features, evt.coord, evt);
    }
    layer.fire(M.evt.SELECT_FEATURES, [features, evt]);
  };

  /**
   * TODO
   *
   * @private
   * @function
   * @api stable
   */
  M.handler.Features.prototype.unselectFeatures_ = function(features, layer, evt) {
    // removes unselected features
    this.prevSelectedFeatures_[layer.name] =
      this.prevSelectedFeatures_[layer.name].filter(pf => !features.some(f => f.equals(pf)));
    let layerImpl = layer.getImpl();
    if (M.utils.isFunction(layerImpl.unselectFeatures)) {
      layerImpl.unselectFeatures(features, evt.coord);
    }
    layer.fire(M.evt.UNSELECT_FEATURES, [features, evt.coord]);
  };

  /**
   * TODO
   *
   * @private
   * @function
   * @api stable
   */
  M.handler.Features.prototype.hoverFeatures_ = function(features, layer, evt) {
    this.prevHoverFeatures_[layer.name] = this.prevHoverFeatures_[layer.name].concat(features);
    layer.fire(M.evt.HOVER_FEATURES, [features, evt]);
  };

  /**
   * TODO
   *
   * @private
   * @function
   * @api stable
   */
  M.handler.Features.prototype.leaveFeatures_ = function(features, layer, evt) {
    this.prevHoverFeatures_[layer.name] =
      this.prevHoverFeatures_[layer.name].filter(pf => !features.some(f => f.equals(pf)));
    layer.fire(M.evt.LEAVE_FEATURES, [features, evt.coord]);
  };

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.handler.Features.prototype.activate = function() {
    if (this.activated_ === false) {
      this.activated_ = true;
      this.fire(M.evt.ACTIVATED);
    }
  };

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.handler.Features.prototype.deactivate = function() {
    if (this.activated_ === true) {
      this.activated_ = false;
      this.fire(M.evt.DEACTIVATED);
    }
  };

  /**
   * Sets the panel of the control
   *
   * @public
   * @function
   * @param {M.ui.Panel} panel
   * @api stable
   * @export
   */
  M.handler.Features.prototype.addLayer = function(layer) {
    if (!M.utils.includes(this.layers_, layer)) {
      this.layers_.push(layer);
      this.prevSelectedFeatures_[layer.name] = [];
      this.prevHoverFeatures_[layer.name] = [];
    }
  };

  /**
   * Gets the panel of the control
   *
   * @public
   * @function
   * @returns {M.ui.Panel}
   * @api stable
   * @export
   */
  M.handler.Features.prototype.removeLayer = function(layer) {
    this.layers_.remove(layer);
    this.prevSelectedFeatures_[layer.name] = null;
    this.prevHoverFeatures_[layer.name] = null;
    delete this.prevSelectedFeatures_[layer.name];
    delete this.prevHoverFeatures_[layer.name];
  };

  /**
   * Destroys the handler
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  M.handler.Features.prototype.destroy = function() {
    // TODO
    // this.getImpl().destroy();
    // this.fire(M.evt.DESTROY);
  };
})();
