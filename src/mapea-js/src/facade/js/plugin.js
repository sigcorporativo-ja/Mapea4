import Base from("./facade.js");
import Utils from "./utils/utils.js"
import Exception from "./exception/exception.js"

export class Plugin extends Base {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.facade.Base}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(impl) {

    // calls the super constructor
    super()

    this.impl_ = this
  }
}

/**
 * This function provides the implementation
 * of the object
 *
 * @public
 * @function
 * @param {Object} map the map to add the plugin
 * @api stable
 */
addTo(map) {
  // checks if the parameter is null or empty
  if (Utils.isNullOrEmpty(map)) {
    Exception('No ha especificado ningún mapa');
  }

  // checks if the implementation can add itself into the map
  let impl = this.impl();
  if (Utils.isUndefined(impl.addTo)) {
    Exception('La implementación usada no posee el método addTo');
  }

  let view = this.createView(map);
  // checks if the view is a promise
  if (view instanceof Promise) {
    view.then(html => {
      impl.addTo(map, html);
      // executes load callback
      this.fire(Evt.ADDED_TO_MAP);
    });
  } else { // view is an HTML or text
    impl.addTo(map, view);
    // executes load callback
    this.fire(Evt.ADDED_TO_MAP);
  }
}

/**
 * This function creates the HTML view for this control
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @api stable
 */
createView(map) {}
}
