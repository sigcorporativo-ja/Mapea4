/**
 * @module M/impl/control/ScaleLine
 */
import OLControlScaleLine from 'ol/control/ScaleLine';
// import ProjUnits from 'ol/proj/Units';
import { getPointResolution, METERS_PER_UNIT } from 'ol/proj';
import { assert } from 'ol/asserts';

/**
 * @type {string}
 */
const UNITS_PROP = 'units';

const Units = {
  DEGREES: 'degrees',
  IMPERIAL: 'imperial',
  NAUTICAL: 'nautical',
  METRIC: 'metric',
  US: 'us',
};

const LEADING_DIGITS = [1, 2, 5];

/**
 * @classdesc
 * Main constructor of the class. Creates a WMC selector
 * control
 * @api
 */
class ScaleLine extends OLControlScaleLine {
  /**
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(vendorOptions) {
    super(vendorOptions);


    this.facadeMap_ = null;

    this.keyEvent_ = null;
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
    this.removeChangeListener(UNITS_PROP, this.handleUnitsChanged);
    this.keyEvent_ = this.addChangeListener(UNITS_PROP, this.handleUnitsChanged);
    map.getMapImpl().addControl(this);
  }

  /**
   * TODO
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

  /**
   * @private
   */
  handleUnitsChanged_() {
    this.updateElement_();
  }

  /**
   * @private
   */
  updateElement_() {
    const viewState = this.viewState_;

    if (!viewState) {
      if (this.renderedVisible_) {
        this.element.style.display = 'none';
        this.renderedVisible_ = false;
      }
      return;
    }

    const center = viewState.center;
    const projection = viewState.projection;
    const units = this.getUnits();
    const pointResolutionUnits = units === Units.DEGREES ? 'degrees' : 'm';
    let pointResolution =
      getPointResolution(projection, viewState.resolution, center, pointResolutionUnits);
    if (projection.getUnits() !== 'degrees' && projection.getMetersPerUnit() &&
      pointResolutionUnits === 'm') {
      pointResolution *= projection.getMetersPerUnit();
    }

    if (projection.getUnits() === 'd') {
      pointResolution /= 120000;
    }
    let nominalCount = this.minWidth_ * pointResolution;
    let suffix = '';
    if (units === Units.DEGREES) {
      const metersPerDegree = METERS_PER_UNIT.degrees;
      if (projection.getUnits() === 'degrees') {
        nominalCount *= metersPerDegree;
      } else {
        pointResolution /= metersPerDegree;
      }
      if (nominalCount < metersPerDegree / 60) {
        suffix = '\u2033'; // seconds
        pointResolution *= 3600;
      } else if (nominalCount < metersPerDegree) {
        suffix = '\u2032'; // minutessep
        pointResolution *= 60;
      } else {
        suffix = '\u00b0'; // degrees
      }
    } else if (units === Units.IMPERIAL) {
      if (nominalCount < 0.9144) {
        suffix = 'in';
        pointResolution /= 0.0254;
      } else if (nominalCount < 1609.344) {
        suffix = 'ft';
        pointResolution /= 0.3048;
      } else {
        suffix = 'mi';
        pointResolution /= 1609.344;
      }
    } else if (units === Units.NAUTICAL) {
      pointResolution /= 1852;
      suffix = 'nm';
    } else if (units === Units.METRIC) {
      if (nominalCount < 0.001) {
        suffix = 'μm';
        pointResolution *= 1000000;
      } else if (nominalCount < 1) {
        suffix = 'mm';
        pointResolution *= 1000;
      } else if (nominalCount < 1000) {
        suffix = 'm';
      } else {
        suffix = 'km';
        pointResolution /= 1000;
      }
    } else if (units === Units.US) {
      if (nominalCount < 0.9144) {
        suffix = 'in';
        pointResolution *= 39.37;
      } else if (nominalCount < 1609.344) {
        suffix = 'ft';
        pointResolution /= 0.30480061;
      } else {
        suffix = 'mi';
        pointResolution /= 1609.3472;
      }
    } else {
      assert(false, 33); // Invalid units
    }

    let i = 3 * Math.floor(Math.log(this.minWidth_ * pointResolution) / Math.log(10));
    let count;
    let width;
    const flag = true;
    while (flag) {
      count = LEADING_DIGITS[((i % 3) + 3) % 3] * (10 ** (Math.floor(i / 3)));
      width = Math.round(count / pointResolution);
      if (Number.isNaN(width)) {
        this.element.style.display = 'none';
        this.renderedVisible_ = false;
        return;
      } else if (width >= this.minWidth_) {
        break;
      }
      i += 1;
    }

    const html = count.toString().concat(' ').concat(suffix);
    if (this.renderedHTML_ !== html) {
      this.innerElement_.innerHTML = html;
      this.renderedHTML_ = html;
    }

    if (this.renderedWidth_ !== width) {
      this.innerElement_.style.width = width.toString().concat('px');
      this.renderedWidth_ = width;
    }

    if (!this.renderedVisible_) {
      this.element.style.display = '';
      this.renderedVisible_ = true;
    }
  }
}

export default ScaleLine;
