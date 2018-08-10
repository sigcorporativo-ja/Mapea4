import { isNullOrEmpty, classToggle, replaceNode } from 'facade/js/util/Utils';
import OLControlOverviewMap from 'ol/control/OverviewMap';
import { get as getProj } from 'ol/proj';
import * as EventType from 'facade/js/event/eventtype';
import View from '../View';

/**
 * @namespace M.impl.control
 */
export default class OverviewMap extends OLControlOverviewMap {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC selector
   * control
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(options) {
    super({});
    /**
     * @private
     * @type {number}
     * @expose
     */
    this.toggleDelay_ = 0;
    if (!isNullOrEmpty(options.toggleDelay)) {
      this.toggleDelay_ = options.toggleDelay;
    }

    /**
     * @private
     * @type {number}
     * @expose
     */
    this.collapsedButtonClass_ = 'g-cartografia-mundo';
    if (!isNullOrEmpty(options.collapsedButtonClass)) {
      this.collapsedButtonClass_ = options.collapsedButtonClass;
    }

    /**
     * @private
     * @type {number}
     * @expose
     */
    this.openedButtonClass_ = 'g-cartografia-flecha-derecha2';
    if (!isNullOrEmpty(options.openedButtonClass)) {
      this.openedButtonClass_ = options.openedButtonClass;
    }
    this.facadeMap_ = null;
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    const olLayers = [];
    map.getLayers().forEach((layer) => {
      const olLayer = layer.getImpl().getOL3Layer();
      if (isNullOrEmpty(olLayer)) {
        layer.getImpl().on(EventType.ADDED_TO_MAP, this.addLayer_, this);
      } else {
        olLayers.push(olLayer);
      }
    });
    OLControlOverviewMap.call(this, {
      layers: olLayers,
      view: new View({
        projection: getProj(map.getProjection().code),
        resolutions: map.getResolutions(),
      }),
    });

    const button = this.element.querySelector('button');
    if (this.collapsed_ === true) {
      if (button.classList.contains(this.collapsedButtonClass_)) {
        button.classList.remove(this.collapsedButtonClass_);
      } else {
        button.classList.add(this.collapsedButtonClass_);
      }
    } else if (button.classList.contains(this.openedButtonClass_)) {
      button.classList.remove(this.openedButtonClass_);
    } else {
      button.classList.add(this.openedButtonClass_);
    }

    map.getMapImpl().addControl(this);
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  getElement() {
    return this.element;
  }

  /**
   * function remove the event 'click'
   *
   * @private
   * @function
   */
  addLayer_(layer) {
    layer.un(EventType.ADDED_TO_MAP, this.addLayer_, this);
    this.getOverviewMap().addLayer(layer.getOL3Layer());
  }

  /**
   * @override ol.control.Control.prototype
   */
  handleToggle_() {
    classToggle(this.element, 'ol-collapsed');
    const button = this.element.querySelector('button');
    classToggle(button, this.openedButtonClass_);
    classToggle(button, this.collapsedButtonClass_);

    setTimeout(() => {
      if (this.collapsed_) {
        replaceNode(this.collapseLabel_, this.label_);
      } else {
        replaceNode(this.label_, this.collapseLabel_);
      }
      this.collapsed_ = !this.collapsed_;

      // manage overview map if it had not been rendered before and control
      // is expanded
      const ovmap = this.ovmap_;
      if (!this.collapsed_ && !ovmap.isRendered()) {
        ovmap.updateSize();
        this.resetExtent_();
        ovmap.addEventListener('postrender', (event) => {
          this.updateBox_();
        });
      }
    }, this.toggleDelay_);
  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  }
}
