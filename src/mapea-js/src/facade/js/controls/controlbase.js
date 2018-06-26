import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Base from('../facade.js');

export class ControlBase extends Base {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @api stable
   */
  constructor(impl, name) {

    // calls the super constructor
    super(this, impl);

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
  set impl(impl) {
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
    let impl = this.impl();
    let view = this.createView(map);
    if (view instanceof Promise) { // the view is a promise
      view.then((html) => {
        this.manageActivation(html);
        impl.addTo(map, html);
        this.fire(Evt.ADDED_TO_MAP);
      });
    } else { // view is an HTML or text or null
      this.manageActivation(view);
      impl.addTo(map, view);
      this.fire(Evt.ADDED_TO_MAP);
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
    this.activationBtn_ = this.activationButton(this.element_);
    if (!Utils.isNullOrEmpty(this.activationBtn_)) {
      this.activationBtn_.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (!this.activated) {
          this.activate();
          this.activated = true;
        } else {
          this.deactivate();
          this.activated = false;
        }
      }, false, this);
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
  get activationButton(html) {}

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
      this.element_.classlist.add('activated');
    }
    if (!Utils.isUndefined(this.impl().activate)) {
      this.impl().activate();
    }
    this.activated = true;
    this.fire(Evt.ACTIVATED);
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
      this.element_.classlist.remove('activated');
    }
    if (!Utils.isUndefined(this.impl().deactivate)) {
      this.impl().deactivate();
    }
    this.activated = false;
    this.fire(Evt.DEACTIVATED);
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  get element() {
    return this.impl().element();
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
  set panel(panel) {
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
  get panel() {
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
  destroy() {
    // this.getImpl().destroy();
    // this.fire(M.evt.DESTROY);
  }
}
