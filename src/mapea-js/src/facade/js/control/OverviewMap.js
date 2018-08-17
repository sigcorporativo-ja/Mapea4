/**
 * @module M/control/OverviewMap
 */
import OverviewMapImpl from 'impl/control/OverviewMap';
import overviewmapTemplate from 'templates/overviewmap';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { compile as compileTemplate } from '../util/Template';

/**
 * @classdesc
 * Main constructor of the class. Creates a GetFeatureInfo
 * control to provides a popup with information about the place
 * where the user has clicked inside the map.
 * @api
 */
class OverviewMap extends ControlBase {
  /**
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api
   */
  constructor(options = {}) {
    // implementation of this control
    const impl = new OverviewMapImpl(options);
    // calls the super constructor
    super(impl, OverviewMap.NAME);

    if (isUndefined(OverviewMapImpl)) {
      Exception('La implementación usada no puede crear controles OverviewMap');
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map map to add the control
   * @returns {Promise} html response
   * @api
   */
  createView(map) {
    return compileTemplate(overviewmapTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof OverviewMap);
    return equals;
  }
}

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api
 */
OverviewMap.NAME = 'overviewmap';

export default OverviewMap;
