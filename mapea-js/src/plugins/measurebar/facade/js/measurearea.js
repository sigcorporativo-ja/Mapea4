import Measure from './measurebase';
import MeasureAreaImpl from '../../impl/ol/js/measurearea';
import measureareaHTML from '../../templates/measurearea';

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureArea
 * control to provides area items drawn on the map
 *
 * @constructor
 * @param {number} distanciaArea -  factor de escala del area
 * @param {string} unidadMedida - unidad de medida del area
 * @extends {M.Control}
 * @api stable
 */
export default class MeasureArea extends Measure {
  constructor(distanciaArea, unidadMedida) {
    // implementation of this control
    const impl = new MeasureAreaImpl(distanciaArea, unidadMedida);

    // const calls the super constructor
    super(impl, measureareaHTML, MeasureArea.NAME);

    // checks if the implementation can create WMC layers
    if (M.utils.isUndefined(MeasureAreaImpl)) {
      M.Exception('La implementación usada no puede crear controles MeasureArea');
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
    if (obj instanceof MeasureArea) {
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
MeasureArea.NAME = 'measurearea';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */

MeasureArea.TEMPLATE = 'measurearea.html';

/**
 * Help message
 * @const
 * @type {string}
 * @public
 * @api stable
 */
export const HELP_KEEP_MESSAGE = 'Click para continuar dibujando el área';
