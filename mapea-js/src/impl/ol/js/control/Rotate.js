/**
 * @module M/impl/control/Rotate
 */
import Control from './Control';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMC selector
 * control
 * @api
 */
class Rotate extends Control {
  /**
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(vendorOptions) {
    super(vendorOptions);

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
    super.addTo(map, element);
    const olMap = map.getMapImpl();
    // panel
    this.panel = element;
    if (this.panel) {
      this.panel.style.display = 'none';
    }

    this.panel.querySelector('button').addEventListener('click', () => {
      olMap.getView().setRotation(0);
    });

    olMap.on('change:view', (e) => {
      const olView = e.target.getView();
      olView.on('change:rotation', (ev) => {
        const newView = ev.target;
        const rotation = newView.getRotation();
        if (rotation !== 0) {
          this.panel.style.display = '';
        } else {
          this.panel.style.display = 'none';
        }
        const iconRotation = `rotate(${(rotation * 360) / (2 * Math.PI)}deg)`;
        this.panel.querySelector('button').style.transform = iconRotation;
      });
    });
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getElement() {
    return this.element;
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

/**
 * Rotate panel id
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Rotate.PANEL_ID = 'm-layerswitcher-panel';

export default Rotate;
