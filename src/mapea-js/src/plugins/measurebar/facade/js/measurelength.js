import Measure from "./measurebase";
import Utils from "facade/js/utils/utils";
import Exception from "facade/js/exception/exception";
import MeasureLenghtImpl from "../../impl/ol/js/measurelength";

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureLength
 * control to provides measure distances
 *
 * @constructor
 * @extends {M.control.Measure}
 * @api stable
 */

export default class MeasureLength extends Measure {

  constructor() {
    // implementation of this control
    let impl = new MeasureLengthImpl();

    // calls the super constructor
    super(impl, MeasureLength.TEMPLATE);

    // checks if the implementation can create WMC layers
    if (Utils.isUndefined(MeasureLengthImpl)) {
      Exception('La implementación usada no puede crear controles MeasureLength');
    }
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof MeasureLength) {
      equals = (this.name === obj.name);
    }
    return equals;
  }
}

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
MeasureLength.TEMPLATE = 'measurelength.html';

/**
 * Help message
 * @const
 * @type {string}
 * @public
 * @api stable
 */
MeasureLength.HELP_KEEP_MESSAGE = 'Click para continuar dibujando la línea';
