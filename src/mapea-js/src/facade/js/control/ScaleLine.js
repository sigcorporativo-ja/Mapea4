import ControlBase from './Control';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import Template from '../util/Template';
import ScalelineImpl from 'impl/ol/js/control/ScaleLine';
import scalelineTemplate from "templates/scaleline.html";

export default class ScaleLine extends ControlBase {
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
    let impl = new ScaleLineImpl();

    // calls the super constructor
    super(impl, ScaleLine.NAME);

    if (Utils.isUndefined(ScaleLineImpl)) {
      Exception('La implementación usada no puede crear controles ScaleLine');
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
    return Template.compile(scalelineTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = (obj instanceof ScaleLine);
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
ScaleLine.NAME = 'scaleline';
