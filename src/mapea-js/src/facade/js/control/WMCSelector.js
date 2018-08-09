/**
 * @module M/control/WMCSelector
 */
import wmcselectorTemplate from 'templates/wmcselector';
import 'assets/css/controls/wmcselector';
import WMCSelectorImpl from 'impl/control/WMCSelector';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import Template from '../util/Template';

/**
 * @classdesc
 * @api
 */
class WMCSelector extends ControlBase {
  /**
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // implementation of this control
    const impl = new WMCSelectorImpl();

    // calls the super constructor
    super(impl, WMCSelector.NAME);

    // checks if the implementation can create WMC layers
    if (isUndefined(WMCSelectorImpl)) {
      Exception('La implementación usada no puede crear controles WMCSelector');
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    // compiles the template
    return Template.compile(wmcselectorTemplate, {
      vars: {
        layers: map.getWMC(),
      },
    });
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof WMCSelector) {
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
WMCSelector.NAME = 'wmcselector';

export default WMCSelector;
