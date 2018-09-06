/**
 * @module M/ui/Panel
 */
import 'assets/css/panel';
import panelTemplate from 'templates/panel';
import * as Position from './position';
import { isNullOrEmpty, isArray, isString, includes } from '../util/Utils';
import MObject from '../Object';
import * as EventType from '../event/eventtype';
import ControlBase from '../control/Control';
import { compileSync as compileTemplate } from '../util/Template';

/**
 * @classdesc
 * @api
 */
class Panel extends MObject {
  /**
   * @constructor
   * @param {string} name of the panel
   * @param {Mx.parameters.Panel} options of the panel
   * @extends {M.Object}
   * @api
   */
  constructor(name, options = {}) {
    // calls the super constructor
    super();

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
    if (!isNullOrEmpty(options.collapsible)) {
      this.collapsible_ = options.collapsible;
    }

    /**
     * @public
     * @type {Position}
     * @api
     * @expose
     */
    this.position = Position.TL;
    if (!isNullOrEmpty(options.position)) {
      this.position = options.position;
    }

    /**
     * @private
     * @type {boolean}
     * @expose
     */
    this.collapsed_ = this.collapsible_;
    if (!isNullOrEmpty(options.collapsed)) {
      this.collapsed_ = (options.collapsed && (this.collapsible_ === true));
    }

    /**
     * @private
     * @type {boolean}
     * @expose
     */
    this.multiActivation_ = false;
    if (!isNullOrEmpty(options.multiActivation)) {
      this.multiActivation_ = options.multiActivation;
    }

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.className_ = null;
    if (!isNullOrEmpty(options.className)) {
      this.className_ = options.className;
    }

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.collapsedButtonClass_ = null;
    if (!isNullOrEmpty(options.collapsedButtonClass)) {
      this.collapsedButtonClass_ = options.collapsedButtonClass;
    } else if ((this.position === Position.TL) || (this.position === Position.BL)) {
      this.collapsedButtonClass_ = 'g-cartografia-flecha-derecha';
    } else if ((this.position === Position.TR) || (this.position === Position.BR)) {
      this.collapsedButtonClass_ = 'g-cartografia-flecha-izquierda';
    }

    /**
     * @private
     * @type {string}
     * @expose
     */
    this.openedButtonClass_ = null;
    if (!isNullOrEmpty(options.openedButtonClass)) {
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
    this.controlsContainer_ = null;

    /**
     * @private
     * @type {String}
     * @expose
     */
    this.tooltip_ = null;
    if (!isNullOrEmpty(options.tooltip)) {
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
   * @api
   */
  destroy() {
    if (this.element_ != null) {
      this.areaContainer_.removeChild(this.element_);
    }
    this.controlsContainer_ = null;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api
   */
  addTo(map, areaContainer) {
    this.map_ = map;
    this.areaContainer_ = areaContainer;
    const html = compileTemplate(panelTemplate);
    this.element_ = html;

    if (!isNullOrEmpty(this.tooltip_)) {
      this.element_.setAttribute('title', this.tooltip_);
    }
    this.buttonPanel_ = html.querySelector('button.m-panel-btn');
    if (!isNullOrEmpty(this.className_)) {
      this.className_.split(/\s+/).forEach((className) => {
        html.classList.add(className);
      });
    }

    if (this.collapsed_ === true) {
      this.collapse_(html, this.buttonPanel_);
    } else {
      this.open_(html, this.buttonPanel_);
    }

    if (this.collapsible_ !== true) {
      html.classList.add('no-collapsible');
    }

    this.controlsContainer_ = html.querySelector('div.m-panel-controls');
    areaContainer.appendChild(html);

    this.buttonPanel_.addEventListener('click', (evt) => {
      evt.preventDefault();
      if (this.collapsed_ === false) {
        this.collapse_(html, this.buttonPanel_);
      } else {
        this.open_(html, this.buttonPanel_);
      }
    });

    this.addControls(this.controls_);
    this.fire(EventType.ADDED_TO_MAP, html);
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  collapse_(html) {
    html.classList.remove('opened');
    this.buttonPanel_.classList.remove(this.openedButtonClass_);
    html.classList.add('collapsed');
    this.buttonPanel_.classList.add(this.collapsedButtonClass_);
    this.collapsed_ = true;
    this.fire(EventType.HIDE);
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  open_(html) {
    html.classList.remove('collapsed');
    this.buttonPanel_.classList.remove(this.collapsedButtonClass_);
    html.classList.add('opened');
    this.buttonPanel_.classList.add(this.openedButtonClass_);
    this.collapsed_ = false;
    this.fire(EventType.SHOW);
  }

  /**
   * Call private method open_
   *
   * @public
   * @function
   */
  open() {
    this.open_(this.element_);
  }

  /**
   * Call private method collapse_
   *
   * @public
   * @function
   */
  collapse() {
    this.collapse_(this.element_);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api
   */
  getControls() {
    return this.controls_;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api
   */
  addControls(controlsParam) {
    let controls = controlsParam;
    if (!isNullOrEmpty(controls)) {
      if (!isArray(controls)) {
        controls = [controls];
      }
      controls.forEach((control) => {
        if (control instanceof ControlBase) {
          if (!this.hasControl(control)) {
            this.controls_.push(control);
            control.setPanel(this);
            control.on(EventType.DESTROY, this.removeControl_.bind(this), this);
          }
          if (!isNullOrEmpty(this.controlsContainer_)) {
            control.on(EventType.ADDED_TO_MAP, this.moveControlView_.bind(this), this);
            this.map_.addControls(control);
          }
          control.on(EventType.ACTIVATED, this.manageActivation_.bind(this), this);
        }
      });
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api
   */
  hasControl(controlParam) {
    let hasControl = false;
    if (!isNullOrEmpty(controlParam)) {
      if (isString(controlParam)) {
        hasControl = this.controls_.filter(control => control.name === controlParam)[0] != null;
      } else if (controlParam instanceof ControlBase) {
        hasControl = includes(this.controls_, controlParam);
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
   * @api
   */
  removeControls(controlsParam) {
    let controls = controlsParam;
    if (!isNullOrEmpty(controls)) {
      if (!isArray(controls)) {
        controls = [controls];
      }
      controls.forEach((controlParam) => {
        const control = controlParam;
        if ((control instanceof ControlBase) && this.hasControl(control)) {
          this.controls = this.controls_.filter(control2 => !control.equals(control2));
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
   * @api
   */
  removeControl_(controlsParam) {
    const controls = this.map_.controls(controlsParam);
    controls.forEach((control) => {
      const index = this.controls_.indexOf(control);
      if (index !== -1) {
        this.controls_.splice(index, 1);
      }
    });
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api
   */
  removeClassName(className) {
    if (!isNullOrEmpty(this.element_)) {
      this.element_.classList.remove(className);
    } else {
      this.className_ = this.className_.replace(new RegExp(`s* ${className} s*`), '');
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {array<M.Control>} controls
   * @api
   */
  addClassName(className) {
    if (!isNullOrEmpty(this.element_)) {
      this.element_.classList.add(className);
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
   * @api
   */
  moveControlView_(control) {
    const controlElem = control.getElement();
    if (!isNullOrEmpty(this.controlsContainer_)) {
      this.controlsContainer_.appendChild(controlElem);
    }
    control.fire(EventType.ADDED_TO_PANEL);
  }

  /**
   * TODO
   *
   * @private
   * @function
   * @param {array<M.Control>} controls
   * @api
   */
  manageActivation_(control) {
    if (this.multiActivation_ !== true) {
      this.controls_.forEach((panelControl) => {
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
   * @api
   */
  equals(obj) {
    let equals = false;
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
   * @api
   * @returns {HTMLElement}
   */
  getTemplatePanel() {
    return this.element_;
  }

  /**
   * Returns the button panel
   *
   * @public
   * @function
   * @api
   * @returns {HTMLElement}
   */
  getButtonPanel() {
    return this.buttonPanel_;
  }

  /**
   * Returns is collapsed
   *
   * @public
   * @function
   * @api
   * @returns {Boolean}
   */
  isCollapsed() {
    return this.collapsed_;
  }
}

export default Panel;
