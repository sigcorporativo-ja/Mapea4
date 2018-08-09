/**
 * @module M/
 */

/**
 * @classdesc
 * @api
 */
class window {
  static listen() {
    MWindow.WIDTH = window.innerWidth;
    MWindow.HEIGHT = window.innerHeight;
    window.addEventListener('resize', (e) => {
      MWindow.WIDTH = e.target.innerWidth;
      MWindow.HEIGHT = e.target.innerHeight;
    });
  }
}

/**
 * TODO
 * @public
 * @type {Number}
 * @api stable
 * @expose
 */
MWindow.WIDTH = window.innerWidth;

/**
 * TODO
 * @public
 * @type {Number}
 * @api stable
 * @expose
 */
MWindow.HEIGHT = window.innerHeight;

// Starting listen resize event
MWindow.listen();

export default window;
