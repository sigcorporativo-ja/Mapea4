import Position from('./position.js');
import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Base from('../facade.js');
import Object from('../object.js')


export class Panel extends Object {
  /**
   * @classdesc
   * TODO
   *
   * @constructor
   * @param {string} name of the panel
   * @param {Mx.parameters.Panel} options of the panel
   * @extends {M.Object}
   * @api stable
   */


  constructor(name, options) {

    // calls the super constructor
    super();

    options = (options || {});

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
     * @type {array}
     * @expose
     */
    this.controls_ = [];



    /**
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this.buttonPanel_ = null;

    /**
     * @private
     * @type {boolean}
     * @expose
     */
    this.collapsible_ = false;
    if (Utils.isNullOrEmpty(options.collapsible)) {
      this.collapsible_ = options.collapsible;
    }

    /**
     * @public
     * @type {Position}
     * @api stable
     * @expose
     */
    this.position = Position.TL;
    if (Utils.isNullOrEmpty(options.position)) {
      this.position = options.position;
    }

    /**
     * @private
     * @type {boolean}
     * @expose
     */
    this.collapsed_ = this.collapsible_;
    if (Utils.isNullOrEmpty(options.collapsed)) {
      this.collapsed_ = (options.collapsed && (this.collapsible_ === true));
    }

    /**
     * @private
     * @type {boolean}
     * @expose
     */
    this.multiActivation_ = false;
    if (Utils.isNullOrEmpty(options.multiActivation)) {
      this.multiActivation_ = options.multiActivation;
    }

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.className_ = null;
    if (Utils.isNullOrEmpty(options.className)) {
      this.className_ = options.className;
    }

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.collapsed_ButtonClass = null;
    if (!Utils.isNullOrEmpty(options.collapsedButtonClass)) {
      this.collapsed_ButtonClass = options.collapsedButtonClass;
    } else if ((this.position === Position.TL) || (this.position === Position.BL)) {
      this.collapsed_ButtonClass = 'g-cartografia-flecha-derecha';
    } else if ((this.position === Position.TR) || (this.position === Position.BR)) {
      this.collapsed_ButtonClass = 'g-cartografia-flecha-izquierda';
    }

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.openedButtonClass_ = null;
    if (!Utils.isNullOrEmpty(options.openedButtonClass)) {
      this.openedButtonClass_ = options.openedButtonClass;
    } else if ((this.position === Position.TL) || (this.position === Position.BL)) {
      this.openedButtonClass_ = 'g-cartografia-flecha-izquierda';
    } else if ((this.position === Position.TR) || (this.position === Position.BR)) {
      this.openedButtonClass_ = 'g-cartografia-flecha-derecha';
    }

    /**
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this.element_ = null;

    /**
     * TODO
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this.areaContainer_ = null;

    /**
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this.controls_Container = null;

    /**
     * @private
     * @type {String}
     * @expose
     */
    this.tooltip_ = null;
    if (!Utils.isNullOrEmpty(options.tooltip)) {
      this.tooltip_ = options.tooltip;
    }
  }


  /**
   * TODO
   *
   * @public
   * @function
   @param {HTMLElement} html panel
   @param {HTMLElement} html area
   * @api stable
   */
  destroy() {
    if (this.element_ != null) {
      this.areaContainer_.removeChild(this.element_);
    }
    this.controls_Container = null;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  addTo(map, areaContainer) {
    this.map_ = map;
    this.areaContainer_ = areaContainer;
    Template.compile(Panel.TEMPLATE, {
      'jsonp': true
    }).then((html) => {
      this.element_ = html;
      if (!Utils.isNullOrEmpty(this.tooltip_)) {
        this.element_.setAttribute("title", this.tooltip_);
      }
      this.buttonPanel_ = html.querySelector('button.m-panel-btn');
      if (!Utils.isNullOrEmpty(this.className_)) {
        this.className_.split(/\s+/).forEach(className => {
          html.classList.add(className);
        });
      }

      if (this.collapsed_ === true) {
        this._collapse(html, this.buttonPanel_);
      } else {
        this._open(html, this.buttonPanel_);
      }

      if (this.collapsible_ !== true) {
        goog.dom.classlist.add(html, 'no-collapsible');
      }

      this.controls_Container = html.querySelector('div.m-panel-controls');
      html.appendChild(areaContainer);

      this.buttonPanel_.addEventListener('click', evt => {
        evt.preventDefault();
        if (this.collapsed_ === false) {
          this._collapse(html, this.buttonPanel_);
        } else {
          this._open(html, this.buttonPanel_);
        }
      }, false, this);

      this.addControls(this.controls_);
      this.fire(Evt.ADDED_TOmap_, html);
    });
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  _collapse(html) {
    html.classlist.remove('opened');
    this.buttonPanel_.classlist.remove(this.openedButtonClass_);
    html.classlist.add('collapsed');
    this.buttonPanel_.classlist.add(this.collapsed_ButtonClass);
    this.collapsed_ = true;
    this.fire(Evt.HIDE);
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  _open(html) {
    html.classlist.remove('collapsed');
    this.buttonPanel_.classlist.remove(this.collapsed_ButtonClass);
    html.classlist.add('opened');
    this.buttonPanel_.classlist.add(this.openedButtonClass_);
    this.collapsed_ = false;
    this.fire(Evt.SHOW);
  }

  /**
   * Call private method _open
   *
   * @public
   * @function
   */
  open() {
    this._open(this.element_);
  }

  /**
   * Call private method _collapse
   *
   * @public
   * @function
   */
  collapse() {
    this._collapse(this.element_);
  }


  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  get Controls() {
    return this.controls_;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  addControls(controls) {
    if (!Utils.isNullOrEmpty(controls)) {
      if (!Utils.isArray(controls)) {
        controls = [controls];
      }
      controls.forEach((control) => {
        if (control instanceof ControlBase) {
          if (!this.hasControl(control)) {
            this.controls_.push(control);
            control.setPanel(this);
            control.on(Evt.DESTROY, this._removeControl, this);
          }
          if (!Utils.isNullOrEmpty(this.controls_Container)) {
            control.on(Evt.ADDED_TOmap_, this._moveControlView, this);
            this.map_.addControls(control);
          }
          control.on(Evt.ACTIVATED, this._manageActivation, this);
        }
      }, this);
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  hasControl(controlParam) {
    var hasControl = false;
    if (!Utils.isNullOrEmpty(controlParam)) {
      if (Utils.isString(controlParam)) {
        hasControl = this.controls_.filter(control => control.name === controlParam)[0] != null;
      } else if (controlParam instanceof ControlBase) {
        hasControl = Utils.includes(this.controls_, controlParam);
      }
    }
    return hasControl;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  removeControls(controls) {
    if (!Utils.isNullOrEmpty(controls)) {
      if (!Utils.isArray(controls)) {
        controls = [controls];
      }
      controls.forEach((control) => {
        if ((control instanceof ControlBase) && this.hasControl(control)) {
          this.controls_.remove(control);
          control.panel = null;
        }
      }, this);
      // if this panel hasn't any controls then it's removed
      // from the map
      if (this.controls_.length === 0) {
        this.map_.removePanel(this);
      }
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  _removeControl(controlsParam) {
    let controls = this.map_.controls(controlsParam);
    controls.forEach(control => {
        let index = this.controls_.indexOf(control);
        if (index !== -1) {
          this.controls_.splice(index, 1);
        });
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  removeClassName = function (className) {
    if (!Utils.isNullOrEmpty(this.element_)) {
      this.element_.classlist.remove(className);
    } else {
      this.className_ = this.className_.replace(new RegExp('\s*' + className + '\s*'), '');
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  addClassName(className) {
    if (!Utils.isNullOrEmpty(this.element_)) {
      this.element_.classlist.add(className);
    } else {
      this.className_ = this.className_.concat(' ').concat(className);
    }
  }

  /**
   * TODO
   *
   * @private
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  _moveControlView(control) {
    let controlElem = control.element();
    if (!Utils.isNullOrEmpty(this.controls_Container)) {
      this.controls_Container.appendChild(controlElem);
    }
    control.fire(Evt.ADDED_TO_PANEL);
  }

  /**
   * TODO
   *
   * @private
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  _manageActivation(control) {
    if (this.multiActivation_ !== true) {
      this.controls_.forEach(panelControl => {
        if (!panelControl.equals(control) && panelControl.activated) {
          panelControl.deactivate();
        }
      });
    }
  }

  /**
   * TODO
   *
   * @private
   * @function
   * @param {array<M.Control>} controls
   * @api stable
   */
  equals(obj) {
    var equals = false;
    if (obj instanceof Panel) {
      equals = (obj.name === this.name);
    }
    return equals;
  }

  /**
   * Returns the template panel
   *
   * @public
   * @function
   * @api stable
   * @returns {HTMLElement}
   */
  get templatePanel() {
    return this.element_;
  }

  /**
   * Returns is collapsed
   *
   * @public
   * @function
   * @api stable
   * @returns {Boolean}
   */
  isCollapsed() {
    return this.collapsed_;
  }

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Panel.TEMPLATE = 'panel.html';
}
