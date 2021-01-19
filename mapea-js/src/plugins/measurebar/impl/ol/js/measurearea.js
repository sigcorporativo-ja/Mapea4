import { HELP_KEEP_MESSAGE } from '../../../facade/js/measurearea.js';

import FacadeMeasure from '../../../facade/js/measurebase.js';
import FacadeMeasureLength from '../../../facade/js/measurelength.js';
import MeasureImpl from './measurebase.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureArea
 * control
 *
 * @constructor
 * @extends {M.impl.control.Measure}
 * @api stable
 */
export default class MeasureArea extends MeasureImpl {
  constructor() {
    super('Polygon');
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
    this.helpMsgContinue_ = HELP_KEEP_MESSAGE;
  }

  /**
   * This function add tooltip with extent of the area
   * @public
   * @param {ol.geom.SimpleGeometry} geometry - Object geometry
   * @return {string} output - Indicate the extent of the area
   * @api stable
   */
  formatGeometry(geometry) {
    let area = null;
    const projection = this.facadeMap_.getProjection();
    area = ol.sphere.getArea(geometry, { projection: projection.code });

    let output;
    if (area > 10000) {
      output = `${((Math.round((area / 1000000) * 100) / 100))} km<sup>2</sup>`;
    } else {
      output = `${(Math.round(area * 100) / 100)} m<sup>2</sup>`;
    }
    return output;
  }

  /**
   * This function returns coordinates to tooltip
   * @public
   * @param {ol.geom.Geometry} geometry - Object geometry
   * @return {array} coordinates to tooltip
   * @api stable
   */
  getTooltipCoordinate(geometry) {
    return geometry.getInteriorPoint().getCoordinates();
  }

  activate() {
    const measureLength = this.facadeMap_.getControls().filter((control) => {
      return (control instanceof FacadeMeasureLength);
    })[0];

    if (measureLength) {
      measureLength.deactivate();
    }

    super.activate();
  }
}
