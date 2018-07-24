import 'assets/css/controls/mouse';
import mouseTemplate from 'templates/mouse';
import MouseImpl from 'impl/control/Mouse';
import ControlBase from './Control';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import Template from '../util/Template';

export default class Mouse extends ControlBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a GetFeatureInfo
   * control to provides a popup with information about the place
   * where the user has clicked inside the map.
   *
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // implementation of this control
    const impl = new MouseImpl();

    // calls the super constructor
    super(impl, Mouse.NAME);

    if (Utils.isUndefined(MouseImpl)) {
      Exception('La implementación usada no puede crear controles Mouse');
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map map to add the control
   * @returns {Promise} html response
   * @api stable
   */
  static createView(map) {
    return Template.compile(mouseTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  static equals(obj) {
    const equals = (obj instanceof Mouse);
    return equals;
  }
}

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Mouse.NAME = 'mouse';
