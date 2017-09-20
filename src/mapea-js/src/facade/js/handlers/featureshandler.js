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
    this.selectedFeatures_ = {};

    /**
     * @private
     * @type {Object}
     * @expose
     */
    this.hoverFeatures_ = {};

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
        let features = impl.getFeaturesByLayer(evt, layer);
        let layerImpl = layer.getImpl();
        if (M.utils.isNullOrEmpty(features)) {
          if (M.utils.isFunction(layerImpl.unselectFeatures)) {
            layerImpl.unselectFeatures(features, evt.coord);
          }
          layer.fire(M.evt.UNSELECT_FEATURES, evt.coord);
        }
        else {
          if (M.utils.isFunction(layerImpl.selectFeatures)) {
            layerImpl.selectFeatures(features, evt.coord, evt);
          }
          layer.fire(M.evt.SELECT_FEATURES, [features, evt]);
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
        let features = impl.getFeaturesByLayer(evt, layer);
        let layerImpl = layer.getImpl();
        if (M.utils.isNullOrEmpty(features) && !M.utils.isNullOrEmpty(this.hoverFeatures_[layer.name])) {
          if (M.utils.isFunction(layerImpl.leaveFeature)) {
            layerImpl.leaveFeature(features, evt.coord, evt);
          }
          layer.fire(M.evt.LEAVE_FEATURE, evt.coord);
          this.hoverFeatures_[layer.name] = null;
          this.getImpl().removeCursorPointer();
        }
        else if (!M.utils.isNullOrEmpty(features) && M.utils.isNullOrEmpty(this.hoverFeatures_[layer.name])) {
          if (M.utils.isFunction(layerImpl.hoverFeature)) {
            layerImpl.hoverFeature(features, evt.coord);
          }
          layer.fire(M.evt.HOVER_FEATURE, [features, evt]);
          this.hoverFeatures_[layer.name] = features;
          this.getImpl().addCursorPointer();
        }
      }, this);
    }
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
      this.selectedFeatures_[layer.name] = [];
      this.hoverFeatures_[layer.name] = null;
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
    this.selectedFeatures_[layer.name] = null;
    this.hoverFeatures_[layer.name] = null;
    delete this.selectedFeatures_[layer.name];
    delete this.hoverFeatures_[layer.name];
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
