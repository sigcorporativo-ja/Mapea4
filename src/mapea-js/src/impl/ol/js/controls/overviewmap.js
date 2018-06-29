import View from '../view/view';
import Evt from "facade/js/event/event";
import OLProj from "ol/proj";
import OLOverviewMap from "ol/control/OverviewMap";

/**
 * @namespace M.impl.control
 */
export default class OverviewMap extends OLOverviewMap {
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
    /**
     * @private
     * @type {number}
     * @expose
     */
    this.toggleDelay_ = 0;
    if (!Utils.isNullOrEmpty(options.toggleDelay)) {
      this.toggleDelay_ = options.toggleDelay;
    }

    /**
     * @private
     * @type {number}
     * @expose
     */
    this.collapsedButtonClass_ = 'g-cartografia-mundo';
    if (!Utils.isNullOrEmpty(options.collapsedButtonClass)) {
      this.collapsedButtonClass_ = options.collapsedButtonClass;
    }

    /**
     * @private
     * @type {number}
     * @expose
     */
    this.openedButtonClass_ = 'g-cartografia-flecha-derecha2';
    if (!Utils.isNullOrEmpty(options.openedButtonClass)) {
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
    let olLayers = [];
    map.getLayers().forEach(layer => {
      let olLayer = layer.getImpl().getOL3Layer();
      if (Utils.isNullOrEmpty(olLayer)) {
        layer.getImpl().on(Evt.ADDED_TO_MAP, this.addLayer_, this);
      }
      else {
        olLayers.push(olLayer);
      }
    });

    OLOverviewMap.call(this, {
      'layers': olLayers,
      'view': new View({
        'projection': OLProj.get(map.getProjection().code),
        'resolutions': map.getResolutions()
      })
    });

    let button = this.element.querySelector('button');
    if (this.collapsed_ === true) {
      if (button.classlist, contains(this.collapsedButtonClass_)) {
        button.classlist.remove(this.collapsedButtonClass_);
      }
      else {
        button.classlist.add(this.collapsedButtonClass_);
      }
    }
    else {
      if (button.classlist, contains(this.this.openedButtonClass_)) {
        button.classlist.remove(this.this.openedButtonClass_);
      }
      else {
        button.classlist.add(this.this.openedButtonClass_);
      }
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
    layer.un(Evt.ADDED_TO_MAP, this.addLayer_, this);
    this.getOverviewMap().addLayer(layer.getOL3Layer());
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
