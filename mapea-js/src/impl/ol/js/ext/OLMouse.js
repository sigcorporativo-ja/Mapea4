import MousePosition from 'ol/control/MousePosition';
import { identityTransform, getTransform } from 'ol/proj';

/**
 * @classdesc
 * @api
 */
class Mouse extends MousePosition {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC selector
   * control
   *
   * @constructor
   * @extends {ol.control.Control}
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(vendorOptions) {
    super(vendorOptions);

    /**
     * Vendor options for the base library
     * @private
     * @type {Object}
     */
    this.vendorOptions_ = vendorOptions;
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api
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
   * @api
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  }

  /**
   * @param {Event} event Browser event.
   * @protected
   */
  handleMouseMove(event) {
    const map = this.getMap();
    this.lastMouseMovePixel_ = map.getEventPixel(event);
    this.updateHTML_(this.lastMouseMovePixel_);
  }

  /**
   * @param {Event} event Browser event.
   * @protected
   */
  handleMouseOut(event) {
    this.updateHTML_(null);
    this.lastMouseMovePixel_ = null;
  }

  /**
   * @private
   * @function
   */
  updateHTML_(pixel) {
    let html = this.undefinedHTML_;
    const projection = this.getProjection();
    if (pixel && this.mapProjection_) {
      if (!this.transform_) {
        if (projection) {
          this.transform_ = getTransform(this.mapProjection_, projection);
        } else {
          this.transform_ = identityTransform;
        }
      }
      const map = this.getMap();
      const coordinate = map.getCoordinateFromPixel(pixel);
      if (coordinate) {
        this.transform_(coordinate, coordinate);
        const coordinateFormat = this.getCoordinateFormat();
        if (coordinateFormat) {
          html = coordinateFormat(coordinate);
        } else {
          html = coordinate.toString();
        }
      }
      if (this.vendorOptions_.label) {
        html += ` | ${this.vendorOptions_.label}`;
      }
    }
    if (!this.renderedHTML_ || html !== this.renderedHTML_) {
      this.element.innerHTML = html;
      this.renderedHTML_ = html;
    }
  }
}

export default Mouse;
