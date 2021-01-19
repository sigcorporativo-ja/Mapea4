import Measure from './measurebase.js';
import MeasureLengthImpl from '../../impl/ol/js/measurelength.js';
import measurelengthHTML from '../../templates/measurelength.html';

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
    const impl = new MeasureLengthImpl();

    // calls the super constructor
    super(impl, measurelengthHTML, MeasureLength.NAME);

    // checks if the implementation can create WMC layers
    if (M.utils.isUndefined(MeasureLengthImpl)) {
      M.Exception('La implementación usada no puede crear controles MeasureLength');
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
 * Name for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
MeasureLength.NAME = 'measurelength';

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
export const HELP_KEEP_MESSAGE = 'Click para continuar dibujando la línea';
