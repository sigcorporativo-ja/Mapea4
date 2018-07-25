import Measure from './measurebase';
import FacadeMeasureLength from '../../../facade/js/measurelength';
import FacadeMeasure from '../../../facade/js/mesasurebase';

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureLength
 * control
 *
 * @constructor
 * @extends {M.impl.control.Measure}
 * @api stable
 */
export default class MeasureLength extends Measure {
  constructor() {
    super('LineString');

    /**
     * Help message
     * @private
     * @type {string}
     */
    this.helpMsg_ = FacadeMeasure.HELP_MESSAGE;

    /**
     * Help message
     * @private
     * @type {string}
     */
    this.helpMsgContinue_ = FacadeMeasureLength.HELP_KEEP_MESSAGE;
  }


  /**
   * This function add tooltip with measure distance
   * @public
   * @param {ol.geom.SimpleGeometry} geometry - Object geometry
   * @return {string} output - Indicates the measure distance
   * @api stable
   */
  formatGeometry(geometry) {
    const length = Math.round(geometry.getLength() * 100) / 100;
    let output;
    if (length > 100) {
      output = `${Math.round(((length / 1000) * 100) / 100)} km`;
    }
    else {
      output = `${Math.round(length * 100) / 100} m`;
    }
    return output;
  }

  /**
   * This function returns coordinates to tooltip
   * @public
   * @param {ol.geom.SimpleGeometry} geometry - Object geometry
   * @return {array} coordinates to tooltip
   * @api stable
   */
  getTooltipCoordinate(geometry) {
    return geometry.getLastCoordinate();
  }
}
