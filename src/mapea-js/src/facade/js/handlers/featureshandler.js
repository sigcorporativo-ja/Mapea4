import Utils from('./utils/utils.js');
import Exception from('./exception/exception.js');
import Base from('./facade.js');
import HandlerImpl from('../../../impl/js/handlers/featureshandler.js');
import Feature from('../feature/feature.js');

export class Handler extends Base {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @api stable
   */
  constructor(options = {}, impl = new HandlerImpl(options)) {

    // calls the super constructor
    super(this, impl);

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
    if (!Utils.isFunction(impl.addTo)) {
      Exception('La implementación usada no posee el método addTo');
    }
    if (!Utils.isFunction(impl.getFeaturesByLayer)) {
      Exception('La implementación usada no posee el método getFeaturesByLayer');
    }
  }
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @api stable
   * @export
   */
  addTo(map) {
    this.map_ = map;
    this.map_.on(Evt.CLICK, this.clickOnMap_, this);
    this.map_.on(Evt.MOVE, this.moveOverMap_, this);
    this.impl().addTo(this.map_);
    this.fire(Evt.ADDED_TO_MAP);
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  clickOnMap_(evt) {
    if (this.activated_ === true) {
      let impl = this.impl();

      this.layers_.forEach((layer) => {
        let clickedFeatures = impl.featuresByLayer(evt, layer);
        let prevFeatures = [...this.prevSelectedFeatures_[layer.name]];
        // no features selected then unselect prev selected features
        if (clickedFeatures.length === 0 && prevFeatures.length > 0) {
          this.unselectFeatures(prevFeatures, layer, evt);
        } else if (clickedFeatures.length > 0) {
          let newFeatures = clickedFeatures.filter(f => !prevFeatures.some(pf => pf.equals(f)));
          let diffFeatures = prevFeatures.filter(f => !clickedFeatures.some(pf => pf.equals(f)));
          // unselect prev selected features which have not been selected this time
          if (diffFeatures.length > 0) {
            this.unselectFeatures(diffFeatures, layer, evt);
          }
          // select new selected features
          if (newFeatures.length > 0) {
            this.selectFeatures(newFeatures, layer, evt);
          }
        }
      }, this);
    }
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  moveOverMap_(evt) {
    if (this.activated_ === true) {
      let impl = this.impl();

      this.layers_.forEach((layer) => {
        let hoveredFeatures = impl.featuresByLayer(evt, layer);
        let prevFeatures = [...this.prevHoverFeatures_[layer.name]];
        // no features selected then unselect prev selected features
        if (hoveredFeatures.length === 0 && prevFeatures.length > 0) {
          this.leaveFeatures_(prevFeatures, layer, evt);
        } else if (hoveredFeatures.length > 0) {
          let newFeatures = hoveredFeatures.filter(f => (f instanceof Feature) && !prevFeatures.some(pf => pf.equals(f)));
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
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  selectFeatures(features, layer, evt) {
    this.prevSelectedFeatures_[layer.name] = this.prevSelectedFeatures_[layer.name].concat(features);
    let layerImpl = layer.impl();
    if (Utils.isFunction(layerImpl.selectFeatures)) {
      layerImpl.selectFeatures(features, evt.coord, evt);
    }
    layer.fire(Evt.SELECT_FEATURES, [features, evt]);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  unselectFeatures(features, layer, evt) {
    // removes unselected features
    this.prevSelectedFeatures_[layer.name] =
      this.prevSelectedFeatures_[layer.name].filter(pf => !features.some(f => f.equals(pf)));
    let layerImpl = layer.impl();
    if (Utils.isFunction(layerImpl.unselectFeatures)) {
      layerImpl.unselectFeatures(features, evt.coord);
    }
    layer.fire(Evt.UNSELECT_FEATURES, [features, evt.coord]);
  }

  /**
   * TODO
   *
   * @private
   * @function
   * @api stable
   */
  hoverFeatures_(features, layer, evt) {
    this.prevHoverFeatures_[layer.name] = this.prevHoverFeatures_[layer.name].concat(features);
    layer.fire(Evt.HOVER_FEATURES, [features, evt]);
    this.impl().addCursorPointer();
  }

  /**
   * TODO
   *
   * @private
   * @function
   * @api stable
   */
  leaveFeatures_(features, layer, evt) {
    this.prevHoverFeatures_[layer.name] =
      this.prevHoverFeatures_[layer.name].filter(pf => !features.some(f => f.equals(pf)));
    layer.fire(Evt.LEAVE_FEATURES, [features, evt.coord]);
    this.impl().removeCursorPointer();
  }

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  activate() {
    if (this.activated_ === false) {
      this.activated_ = true;
      this.fire(Evt.ACTIVATED);
    }
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  deactivate() {
    if (this.activated_ === true) {
      this.activated_ = false;
      this.fire(Evt.DEACTIVATED);
    }
  }

  /**
   * Sets the panel of the control
   *
   * @public
   * @function
   * @param {M.ui.Panel} panel
   * @api stable
   * @export
   */
  addLayer(layer) {
    if (!Utils.includes(this.layers_, layer)) {
      this.layers_.push(layer);
      this.prevSelectedFeatures_[layer.name] = [];
      this.prevHoverFeatures_[layer.name] = [];
    }
  }

  /**
   * Gets the panel of the control
   *
   * @public
   * @function
   * @returns {M.ui.Panel}
   * @api stable
   * @export
   */
  removeLayer(layer) {
    this.layers_.remove(layer);
    this.prevSelectedFeatures_[layer.name] = null;
    this.prevHoverFeatures_[layer.name] = null;
    delete this.prevSelectedFeatures_[layer.name];
    delete this.prevHoverFeatures_[layer.name];
  }

  /**
   * Destroys the handler
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  destroy() {
    // TODO
    // this.impl().destroy();
    // this.fire(M.evt.DESTROY);
  }
}
