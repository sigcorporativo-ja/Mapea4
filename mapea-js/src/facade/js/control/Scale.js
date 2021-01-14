/**
 * @module M/control/Scale
 */
import 'assets/css/controls/scale.css';
import scaleTemplate from 'templates/scale.html';
import ScaleImpl from 'impl/control/Scale.js';
import ControlBase from './Control.js';
import { isUndefined, isNullOrEmpty } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import { compileSync as compileTemplate } from '../util/Template.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * @api
 */
class Scale extends ControlBase {
  /**
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api
   */
  constructor(options = {}) {
    // implementation of this control
    const impl = new ScaleImpl(options);

    // calls the super constructor
    super(impl, Scale.NAME);

    if (isUndefined(ScaleImpl)) {
      Exception(getValue('exception').scale_method);
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
    return compileTemplate(scaleTemplate, {
      vars: {
        title: getValue('scale').title,
        scale: getValue('scale').scale,
      },
    });
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof Scale);
    return equals;
  }

  /**
   * Destroys the control
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    super.destroy();
    const panel = this.getPanel();
    if (!isNullOrEmpty(panel)) {
      panel.removeClassName('m-with-scale');
    }
  }
}

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api
 */
Scale.NAME = 'scale';

export default Scale;
