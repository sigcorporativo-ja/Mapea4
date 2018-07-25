import LabelImpl from 'impl/Label';
import Base from './Base';

export default class Label extends Base {
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
    // implementation of this control
    const impl = new LabelImpl(text, coordOpts, panMapIfOutOfView);

    // calls the super constructor
    super(impl);
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
    this.getImpl().hide();
  }

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
    this.getImpl().show(map);
  }

  /**
   * This function return popup created
   *
   * @public
   * @function
   * @returns {M.Popup} popup created
   * @api stable
   * @export
   */
  getPopup() {
    return this.getImpl().getPopup();
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  getCoordinate() {
    return this.getImpl().getCoordinate();
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  setCoordinate(coord) {
    this.getImpl().coordinate = coord;
  }

  /**
   * Template popup for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
}
Label.POPUP_TEMPLATE = 'label_popup.html';
