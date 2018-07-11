/**
 * @namespace M.window
 */
export default class Window {
  static listen_() {
    window.addEventListener("resize", e => {
      Window.WIDTH = e.target.innerWidth;
      Window.HEIGHT = e.target.innerHeight;
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
Window.WIDTH = window.innerWidth;

/**
 * TODO
 * @public
 * @type {Number}
 * @api stable
 * @expose
 */
Window.HEIGHT = window.innerHeight;

// Starting listen resize event
Window.listen_();
