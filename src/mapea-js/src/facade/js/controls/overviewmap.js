import ControlBase from('./controlbase.js');
import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Template from('../utils/template.js');
import OverviewMapImpl from('../../../impl/js/controls/OverviewMap.js');

export class OverviewMap extends ControlBase {
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
  constructor(options) {
    // calls the super constructor
    super(this, impl, OverviewMap.NAME);

    if (Utils.isUndefined(OverviewMapImpl)) {
      Exception('La implementación usada no puede crear controles OverviewMap');
    }

    options = (options || {});

    // implementation of this control
    let impl = new OverviewMapImpl(options);

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
    return Template.compile(OverviewMap.TEMPLATE, {
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
    let equals = (obj instanceof OverviewMap);
    return equals;
  }

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  OverviewMap.NAME = 'overviewmap';

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  OverviewMap.TEMPLATE = 'overviewmap.html';
}
