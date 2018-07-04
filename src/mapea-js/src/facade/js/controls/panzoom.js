import ControlBase from './controlbase';
import Utils from '../utils/utils';
import Exception from '../exception/exception';
import Template from '../utils/template';
import PanzoomImpl from '../../../impl/js/controls/Panzoom');

export default class Panzoom extends ControlBase {
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
    let impl = new PanzoomImpl();

    // calls the super constructor
    super(impl, Panzoom.NAME);

    if (Utils.isUndefined(PanzoomImpl)) {
      Exception('La implementación usada no puede crear controles Panzoom');
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
  createView(map) {
    return Template.compile(Panzoom.TEMPLATE, {
      'jsonp': true
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
    let equals = (obj instanceof Panzoom);
    return equals;
  }

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Panzoom.NAME = 'panzoom';

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Panzoom.TEMPLATE = 'panzoom.html';
}
