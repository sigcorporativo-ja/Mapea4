/**
 * @module M/Control
 */
import { isUndefined, isNullOrEmpty, removeHTML } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import Base from '../Base.js';
import * as EventType from '../event/eventtype.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * @api
 */
class Control extends Base {
  /**
   * @constructor
   * @api
   */
  constructor(implParam, name) {
    const impl = implParam;
    // calls the super constructor
    super(impl);

    // checks if the implementation can create WMC layers
    if (isUndefined(impl.addTo)) {
      Exception(getValue('exception').addto_method);
    }

    // checks if the implementation can create WMC layers
    if (isUndefined(impl.getElement)) {
      Exception(getValue('exception').getelement_method);
    }

    // checks if the implementation can create default controls
    if (isUndefined(impl.isByDefault)) {
      impl.isByDefault = true;
    }

    /**
     * @public
     * @type {string}
     * @api
     * @expose
     */
    this.name = name;

    /**
     * @private
     * @type {M.Map}
     * @expose
     */
    this.map_ = null;

    /**
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this.element_ = null;

    /**
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this.activationBtn_ = null;

    /**
     * @public
     * @type {boolean}
     * @api
     * @expose
     */
    this.activated = false;

    /**
     * @private
     * @type {M.ui.Panel}
     * @expose
     */
    this.panel_ = null;

    /**
     * @private
     * @type {Array}
     * @expose
     */
    this.controls_ = null;
  }

  /**
   * This function set implementation of this control
   *
   * @public
   * @function
   * @param {M.Map} impl to add the plugin
   * @api
   */
  setImpl(implParam) {
    const impl = implParam;
    // checks if the implementation can create WMC layers
    if (isUndefined(impl.addTo)) {
      Exception(getValue('exception').addto_method);
    }
    if (isUndefined(impl.getElement)) {
      Exception(getValue('exception').getelement_method);
    }
    // checks if the implementation can create default controls
    if (isUndefined(impl.isByDefault)) {
      impl.isByDefault = true;
    }
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @api
   * @export
   */
  addTo(map) {
    this.map_ = map;
    const impl = this.getImpl();
    const view = this.createView(map);
    if (view instanceof Promise) { // the view is a promise
      view.then((html) => {
        this.manageActivation(html);
        impl.addTo(map, html);
        this.fire(EventType.ADDED_TO_MAP);
      });
    } else { // view is an HTML or text or null
      this.manageActivation(view);
      impl.addTo(map, view);
      this.fire(EventType.ADDED_TO_MAP);
    }
  }

  /**
   * This function creates the HTML view for this control
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @api
   * @export
   */
  createView(map) {}

  /**
   * TODO
   *
   * @public
   * @function
   * @param {HTMLElement} html to add the plugin
   * @api
   * @export
   */
  manageActivation(html) {
    this.element_ = html;
    this.activationBtn_ = this.getActivationButton(this.element_);
    if (!isNullOrEmpty(this.activationBtn_)) {
      this.activationBtn_.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (!this.activated) {
          this.activate();
          this.activated = true;
        } else {
          this.deactivate();
          this.activated = false;
        }
      }, false);
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {HTMLElement} html to add the plugin
   * @api
   * @export
   */
  getActivationButton(html) {}

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api
   * @export
   */
  activate() {
    if (!isNullOrEmpty(this.element_)) {
      this.element_.classList.add('activated');
    }
    if (!isUndefined(this.getImpl().activate)) {
      this.getImpl().activate();
    }
    this.activated = true;
    this.fire(EventType.ACTIVATED);
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api
   * @export
   */
  deactivate() {
    if (!isNullOrEmpty(this.element_)) {
      this.element_.classList.remove('activated');
    }
    if (!isUndefined(this.getImpl().deactivate)) {
      this.getImpl().deactivate();
    }
    this.activated = false;
    this.fire(EventType.DEACTIVATED);
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api
   * @export
   */
  getElement() {
    return this.getImpl().getElement();
  }


  /**
   * Sets the panel of the control
   *
   * @public
   * @function
   * @param {M.ui.Panel} panel
   * @api
   * @export
   */
  setPanel(panel) {
    this.panel_ = panel;
  }

  /**
   * Gets the panel of the control
   *
   * @public
   * @function
   * @returns {M.ui.Panel}
   * @api
   * @export
   */
  getPanel() {
    return this.panel_;
  }

  /**
   * Destroys the control
   *
   * @public
   * @function
   * @api
   * @export
   */
  destroy() {
    removeHTML(this.getElement());
  }
}

export default Control;
