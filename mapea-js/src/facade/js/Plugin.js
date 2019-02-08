/**
 * @module M/Plugin
 */
import Base from './Base';
import { isNullOrEmpty, isUndefined } from './util/Utils';
import Exception from './exception/exception';
import * as EventType from './event/eventtype';

/**
 * @classdesc
 * Main facade plugin object. This class creates a plugin
 * object which has an implementation Object
 * @api
 */
class Plugin extends Base {
  /**
   * This function provides the implementation
   * of the object
   *
   * @public
   * @function
   * @param {Object} map the map to add the plugin
   * @api
   */
  addTo(map) {
    // checks if the parameter is null or empty
    if (isNullOrEmpty(map)) {
      Exception('No ha especificado ningún mapa');
    }

    // checks if the implementation can add itself into the map
    const impl = this.getImpl();
    if (isUndefined(impl.addTo)) {
      Exception('La implementación usada no posee el método addTo');
    }

    const view = this.createView(map);
    // checks if the view is a promise
    if (view instanceof Promise) {
      view.then((html) => {
        impl.addTo(map, html);
        // executes load callback
        this.fire(EventType.ADDED_TO_MAP);
      });
    } else { // view is an HTML or text
      impl.addTo(map, view);
      // executes load callback
      this.fire(EventType.ADDED_TO_MAP);
    }
  }

  /**
   * This function creates the HTML view for this control
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @api
   */
  createView(map) {}

  /**
   * This function returns the controls of a plugin
   * @public
   * @function
   * @param {Array} controls
   * @api
   */
  getControls() {}
}

export default Plugin;
