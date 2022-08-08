/**
 * @module M/impl/control/OverviewMap
 */
import { isNullOrEmpty, classToggle, replaceNode, extend } from 'M/util/Utils';
import OLControlOverviewMap from 'ol/control/OverviewMap';
import { get as getProj } from 'ol/proj';
import OLLayerTile from 'ol/layer/Tile';
import OLLayerImage from 'ol/layer/Image';
import * as EventType from 'M/event/eventtype';
import { WMS as WMSType } from 'M/layer/Type';
import View from '../View';

/**
 * @classdesc
 * @api
 */
class OverviewMap extends OLControlOverviewMap {
  /**
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(options, vendorOptions = {}) {
    super(extend({
      layers: [],
    }, vendorOptions, true));

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
   * This function sets de control facade of the class
   * @function
   * @param {M/control/OverviewMap}
   * @api
   */
  set facadeControl(c) {
    this.facadeControl_ = c;
  }

  /**
   * This function gets de control facade of the class
   * @function
   * @return {M/control/OverviewMap}
   * @api
   */
  get facadeControl() {
    return this.facadeControl_;
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
    this.update(map, element);
    if (!this.getCollapsed()) {
      this.addLayers(this.facadeMap_);
    }
  }

  /**
   * Updates the controls
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   */
  update(map, element) {
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
    this.addOpenEventListener(button, map);
    this.setTarget();
  }

  /**
   * This method adds the open event listener
   * @function
   * @api
   */
  addOpenEventListener(btn, map) {
    const button = btn;
    button.onclick = this.openEventListener.bind(this);
  }

  /**
   * This function execute the addLayers method when
   * the control is opened.
   * @function
   */
  openEventListener(evt) {
    const event = evt;
    if (this.getCollapsed() === true) {
      this.addLayers(this.facadeMap_);
      event.target.onclick = null;
    }
  }

  /**
   * Sets the target of overviewmap control
   * @function
   * @api
   */
  setTarget() {
    const facadeControl = this.facadeControl_;
    if (!isNullOrEmpty(facadeControl)) {
      const panel = facadeControl.getPanel();
      if (!isNullOrEmpty(panel)) {
        this.target_ = panel.getControlsContainer();
      }
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
    this.getOverviewMap().addLayer(layer.getOLLayer());
  }

  /**
   * This function adds the layers of map to overviewmap control
   * @function
   * @param {M/Map}
   */
  addLayers(map) {
    const olLayers = [];
    map.getLayers().forEach((layer) => {
      if ((layer.type === WMSType || layer.transparent === false) && layer.isVisible()) {
        // const olLayer = layer.getImpl().cloneOLLayer();
        const olLayer = layer.getImpl().getOLLayer();
        let layerAux = null;
        const properties = olLayer.getProperties();
        delete properties.map;
        if (layer.tiled === true) {
          layerAux = new OLLayerTile(properties);
        } else {
          layerAux = new OLLayerImage(properties);
        }
        if (isNullOrEmpty(layerAux)) {
          layer.getImpl().on(EventType.ADDED_TO_MAP, this.addLayer_.bind(this));
        } else {
          olLayers.push(layerAux);
        }
      }
    });
    const newView = new View({
      projection: getProj(map.getProjection().code),
      resolutions: map.getResolutions(),
    });

    map.getMapImpl().addControl(this);
    this.ovmap_.setView(newView);
    olLayers.forEach(layer => this.ovmap_.addLayer(layer));
    this.wasOpen_ = true;
  }

  /**
   * @overrides ol.control.Control.prototype
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

export default OverviewMap;
