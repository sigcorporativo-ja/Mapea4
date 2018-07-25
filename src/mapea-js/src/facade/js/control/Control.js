import Utils from '../util/Utils';
import Exception from '../exception/exception';
import Base from '../Base';
import EvtManager from '../event/Manager';

export default class ControlBase extends Base {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @api stable
   */
  constructor(implParam, name) {
    const impl = implParam;
    // calls the super constructor
    super(impl);

    // checks if the implementation can create WMC layers
    if (Utils.isUndefined(impl.addTo)) {
      Exception('La implementación usada no posee el método addTo');
    }

    // checks if the implementation can create WMC layers
    if (Utils.isUndefined(impl.element)) {
      Exception('La implementación usada no posee el método getElement');
    }

    // checks if the implementation can create default controls
    if (Utils.isUndefined(impl.isByDefault)) {
      impl.isByDefault = true;
    }

    /**
     * @public
     * @type {string}
     * @api stable
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
     * @api stable
     * @expose
     */
    this.activated = false;

    /**
     * @private
     * @type {M.ui.Panel}
     * @expose
     */
    this.panel_ = null;
  }

  /**
   * This function set implementation of this control
   *
   * @public
   * @function
   * @param {M.Map} impl to add the plugin
   * @api stable
   */
  setImpl(implParam) {
    const impl = implParam;
    // checks if the implementation can create WMC layers
    if (Utils.isUndefined(impl.addTo)) {
      Exception('La implementación usada no posee el método addTo');
    }
    if (Utils.isUndefined(impl.getElement)) {
      Exception('La implementación usada no posee el método getElement');
    }
    // checks if the implementation can create default controls
    if (Utils.isUndefined(impl.isByDefault)) {
      impl.isByDefault = true;
    }
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @api stable
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
        this.fire(EvtManager.ADDED_TO_MAP);
      });
    }
    else { // view is an HTML or text or null
      this.manageActivation(view);
      impl.addTo(map, view);
      this.fire(EvtManager.ADDED_TO_MAP);
    }
  }

  /**
   * This function creates the HTML view for this control
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @api stable
   * @export
   */
  createView(map) {}

  /**
   * TODO
   *
   * @public
   * @function
   * @param {HTMLElement} html to add the plugin
   * @api stable
   * @export
   */
  manageActivation(html) {
    this.element_ = html;
    this.activationBtn_ = this.getActivationButton(this.element_);
    if (!Utils.isNullOrEmpty(this.activationBtn_)) {
      this.activationBtn_.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (!this.activated) {
          this.activate();
          this.activated = true;
        }
        else {
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
   * @api stable
   * @export
   */
  getActivationButton(html) {}

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  activate() {
    if (!Utils.isNullOrEmpty(this.element_)) {
      this.element_.classList.add('activated');
    }
    if (!Utils.isUndefined(this.getImpl().activate)) {
      this.getImpl().activate();
    }
    this.activated = true;
    this.fire(EvtManager.ACTIVATED);
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  deactivate() {
    if (!Utils.isNullOrEmpty(this.element_)) {
      this.element_.classList.remove('activated');
    }
    if (!Utils.isUndefined(this.getImpl().deactivate)) {
      this.getImpl().deactivate();
    }
    this.activated = false;
    this.fire(EvtManager.DEACTIVATED);
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api stable
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
   * @api stable
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
   * @api stable
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
   * @api stable
   * @export
   */
  destroy() {}
}
