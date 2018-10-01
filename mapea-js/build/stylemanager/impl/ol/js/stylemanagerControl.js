import namespace from 'util/decorator';

@namespace("M.impl.control")
export class StyleManagerControl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the StyleManagerControl.
   *
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor() {
    super();
  }
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    // specific code

    // super addTo
    super.addTo(map, html);
  }

  /**
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    M.dialog.info('Hello World!');
  }

  /**
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    M.dialog.info('Bye World!');
  }
}
