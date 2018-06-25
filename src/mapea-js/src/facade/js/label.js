import Base from('./facade.js');
import Utils from('./utils/utils.js');
import Exception from('./exception/exception.js');

export class Label extends Base {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Label
   * control to provides a popup with specified information
   * @constructor
   * @param {string} text - Text to show
   * @param {array} coordOpts - Coordinate to display popup
   * @extends {M.facade.Base}
   * @api stable
   */
  constructor(text, coordOpts, panMapIfOutOfView) {
    // calls the super constructor
    super();
    // implementation of this control
    let impl = new Label(text, coordOpts, panMapIfOutOfView);
  }

  /**
   * This function remove the popup with information
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  hide() {
    this.impl().hide();
  };

  /**
   * This function displays the popup with information
   *
   * @public
   * @function
   * @param {M.Map} map - Facade map
   * @api stable
   * @export
   */
  show(map) {
    this.impl().show(map);
  };

  /**
   * This function return popup created
   *
   * @public
   * @function
   * @returns {M.Popup} popup created
   * @api stable
   * @export
   */
  get popup() {
    return this.impl().popup();
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  get coordinate() {
    return this.impl().coordinate();
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  set coordinate(coord) {
    this.impl().coordinate = coord;
  };

  /**
   * Template popup for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Label.POPUP_TEMPLATE = 'label_popup.html';
};
