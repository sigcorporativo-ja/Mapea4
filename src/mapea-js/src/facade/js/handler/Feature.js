/**
 * @module M/handler/Feature
 */
import HandlerImpl from 'impl/handler/Feature';
import { isFunction, includes } from '../util/Utils';
import Exception from '../exception/exception';
import Base from '../Base';
import FacadeFeature from '../feature/Feature';
import * as EventType from '../event/eventtype';

/**
 * @classdesc
 * Main constructor of the class. Creates a layer
 * with parameters specified by the user
 * @api
 */
class Features extends Base {
  /**
   *
   * @constructor
   * @extends {M.facade.Base}
   * @api
   */
  constructor(options = {}, impl = new HandlerImpl(options)) {
    // calls the super constructor
    super(impl);

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
    if (!isFunction(impl.addTo)) {
      Exception('La implementación usada no posee el método addTo');
    }
    if (!isFunction(impl.getFeaturesByLayer)) {
      Exception('La implementación usada no posee el método getFeaturesByLayer');
    }
  }
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @api
   * @export
   */
  addTo(map) {
    this.map_ = map;
    this.map_.on(EventType.MOVE, this.moveOverMap_.bind(this));
    this.map_.on(EventType.CLICK, this.clickOnMap_.bind(this));
    this.getImpl().addTo(this.map_);
    this.fire(EventType.ADDED_TO_MAP);
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  clickOnMap_(evt) {
    if (this.activated_ === true) {
      const impl = this.getImpl();

      this.layers_.forEach((layer) => {
        const clickedFeatures = impl.getFeaturesByLayer(evt, layer);
        const prevFeatures = [...(this.prevSelectedFeatures_[layer.name])];
        // no features selected then unselect prev selected features
        if (clickedFeatures.length === 0 && prevFeatures.length > 0) {
          this.unselectFeatures(prevFeatures, layer, evt);
        } else if (clickedFeatures.length > 0) {
          const newFeatures = clickedFeatures.filter(f => !prevFeatures.some(pf => pf.equals(f)));
          const diffFeatures = prevFeatures.filter(f => !clickedFeatures.some(pf => pf.equals(f)));
          // unselect prev selected features which have not been selected this time
          if (diffFeatures.length > 0) {
            this.unselectFeatures(diffFeatures, layer, evt);
          }
          // select new selected features
          if (newFeatures.length > 0) {
            this.selectFeatures(newFeatures, layer, evt);
          }
        }
      });
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
      const impl = this.getImpl();

      this.layers_.forEach((layer) => {
        const hoveredFeatures = impl.getFeaturesByLayer(evt, layer);
        const prevFeatures = [...this.prevHoverFeatures_[layer.name]];
        // no features selected then unselect prev selected features
        if (hoveredFeatures.length === 0 && prevFeatures.length > 0) {
          this.leaveFeatures_(prevFeatures, layer, evt);
        } else if (hoveredFeatures.length > 0) {
          const newFeatures = hoveredFeatures
            .filter(f => (f instanceof FacadeFeature) && !prevFeatures.some(pf => pf.equals(f)));
          const diffFeatures = prevFeatures.filter(f => !hoveredFeatures.some(pf => pf.equals(f)));
          // unselect prev selected features which have not been selected this time
          if (diffFeatures.length > 0) {
            this.leaveFeatures_(diffFeatures, layer, evt);
          }
          // select new selected features
          if (newFeatures.length > 0) {
            this.hoverFeatures_(newFeatures, layer, evt);
          }
        }
      });
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  selectFeatures(features, layer, evt) {
    this.prevSelectedFeatures_[layer.name] = this.prevSelectedFeatures_[layer.name]
      .concat(features);
    const layerImpl = layer.getImpl();
    if (isFunction(layerImpl.selectFeatures)) {
      layerImpl.selectFeatures(features, evt.coord, evt);
    }
    layer.fire(EventType.SELECT_FEATURES, [features, evt]);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  unselectFeatures(features, layer, evt) {
    // removes unselected features
    this.prevSelectedFeatures_[layer.name] =
      this.prevSelectedFeatures_[layer.name].filter(pf => !features.some(f => f.equals(pf)));
    const layerImpl = layer.getImpl();
    if (isFunction(layerImpl.unselectFeatures)) {
      layerImpl.unselectFeatures(features, evt.coord);
    }
    layer.fire(EventType.UNSELECT_FEATURES, [features, evt.coord]);
  }

  /**
   * TODO
   *
   * @private
   * @function
   * @api
   */
  hoverFeatures_(features, layer, evt) {
    this.prevHoverFeatures_[layer.name] = this.prevHoverFeatures_[layer.name].concat(features);
    layer.fire(EventType.HOVER_FEATURES, [features, evt]);
    this.getImpl().addCursorPointer();
  }

  /**
   * TODO
   *
   * @private
   * @function
   * @api
   */
  leaveFeatures_(features, layer, evt) {
    this.prevHoverFeatures_[layer.name] =
      this.prevHoverFeatures_[layer.name].filter(pf => !features.some(f => f.equals(pf)));
    layer.fire(EventType.LEAVE_FEATURES, [features, evt.coord]);
    this.getImpl().removeCursorPointer();
  }

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api
   * @export
   */
  activate() {
    if (this.activated_ === false) {
      this.activated_ = true;
      this.fire(EventType.ACTIVATED);
    }
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api
   * @export
   */
  deactivate() {
    if (this.activated_ === true) {
      this.activated_ = false;
      this.fire(EventType.DEACTIVATED);
    }
  }

  /**
   * Sets the panel of the control
   *
   * @public
   * @function
   * @param {M.ui.Panel} panel
   * @api
   * @export
   */
  addLayer(layer) {
    if (!includes(this.layers_, layer)) {
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
   * @api
   * @export
   */
  removeLayer(layer) {
    this.layers_ = this.layers_.filter(layer2 => !layer2.equals(layer));
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
   * @api
   * @export
   */
  destroy() {
    // TODO
    // this.getImpl().destroy();
    // this.fire(M.evt.DESTROY);
  }
}

export default Features;
