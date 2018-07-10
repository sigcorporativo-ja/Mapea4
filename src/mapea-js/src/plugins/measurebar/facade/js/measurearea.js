import Measure from "./measurebase";
import Utils from "facade/js/utils/utils";
import Exception from "facade/js/exception/exception";
import MeasureAreaImpl from "../../impl/ol/js/measurearea";

export default class MeasureArea extends Measure {

  constructor() {

    // implementation of this control
    let impl = new MeasureAreaImpl();

    // calls the super constructor
    super(impl, MeasureArea.TEMPLATE);

    // checks if the implementation can create WMC layers
    if (Utils.isUndefined(MeasureAreaImpl)) {
      Exception('La implementación usada no puede crear controles MeasureArea');
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
MeasureArea.HELP_KEEP_MESSAGE = 'Click para continuar dibujando el área';
