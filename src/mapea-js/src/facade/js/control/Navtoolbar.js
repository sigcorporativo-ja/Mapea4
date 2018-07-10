import ControlBase from './Base';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import Template from '../util/Template';
import NavtoolbarImpl from '../../../impl/ol/js/control/Navtoolbar';
import navtoolbarTemplate from "templates/navtoolbar.html";

export default class Navtoolbar extends ControlBase {
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
    let impl = new NavtoolbarImpl();

    // calls the super constructor
    super(impl, Navtoolbar.NAME);

    if (Utils.isUndefined(NavtoolbarImpl)) {
      Exception('La implementación usada no puede crear controles Navtoolbar');
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
    return Template.compile(navtoolbarTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = (obj instanceof Navtoolbar);
    return equals;
  }

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Navtoolbar.NAME = 'navtoolbar';
}
