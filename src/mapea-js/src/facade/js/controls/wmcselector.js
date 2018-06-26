import ControlBase from('./controlbase.js');
import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Template from('../utils/template.js');
import WMCSelectorImpl from('../../../impl/js/controls/wmcselector.js');
import Map from('../maps/maps.js');

export class WMCSelector extends ControlBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMCSelector
   * control to provides a way to select an specific WMC
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // calls the super constructor
    super(this, impl, 'wmcselector');

    // checks if the implementation can create WMC layers
    if (Utils.isUndefined(WMCSelectorImpl)) {
      Exception('La implementación usada no puede crear controles WMCSelector');
    }

    // implementation of this control
    let impl = new WMCSelectorImpl();

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
    return Template.compile(WMCSelector.TEMPLATE, {
      'jsonp': true,
      'vars': {
        'layers': Map.WMC()
      }
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

  /**
   * Template for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  WMCSelector.TEMPLATE = 'wmcselector.html';
}
