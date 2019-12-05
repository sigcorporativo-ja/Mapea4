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
    this._map = null;

    /**
     * @private
     * @type {array}
     * @expose
     */
    this._controls = [];

    /**
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this._buttonPanel = null;

    /**
     * @private
     * @type {boolean}
     * @expose
     */
    this._collapsible = false;
    if (!isNullOrEmpty(options.collapsible)) {
      this._collapsible = options.collapsible;
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
    this._collapsed = this._collapsible;
    if (!isNullOrEmpty(options.collapsed)) {
      this._collapsed = (options.collapsed && (this._collapsible === true));
    }

    /**
     * @private
     * @type {boolean}
     * @expose
     */
    this._multiActivation = false;
    if (!isNullOrEmpty(options.multiActivation)) {
      this._multiActivation = options.multiActivation;
    }

    /**
     * @private
     * @type {string}
     * @expose
     */
    this._className = null;
    if (!isNullOrEmpty(options.className)) {
      this._className = options.className;
    }

    /**
     * @private
     * @type {string}
     * @expose
     */
    this._collapsedButtonClass = null;
    if (!isNullOrEmpty(options.collapsedButtonClass)) {
      this._collapsedButtonClass = options.collapsedButtonClass;
    } else if ((this.position === Position.TL) || (this.position === Position.BL)) {
      this._collapsedButtonClass = 'g-cartografia-flecha-derecha';
    } else if ((this.position === Position.TR) || (this.position === Position.BR)) {
      this._collapsedButtonClass = 'g-cartografia-flecha-izquierda';
    }

    /**
     * @private
     * @type {string}
     * @expose
     */
    this._openedButtonClass = null;
    if (!isNullOrEmpty(options.openedButtonClass)) {
      this._openedButtonClass = options.openedButtonClass;
    } else if ((this.position === Position.TL) || (this.position === Position.BL)) {
      this._openedButtonClass = 'g-cartografia-flecha-izquierda';
    } else if ((this.position === Position.TR) || (this.position === Position.BR)) {
      this._openedButtonClass = 'g-cartografia-flecha-derecha';
    }

    /**
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this._element = null;

    /**
     * TODO
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this._areaContainer = null;

    /**
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this._controlsContainer = null;

    /**
     * @private
     * @type {String}
     * @expose
     */
    this._tooltip = null;
    if (!isNullOrEmpty(options.tooltip)) {
      this._tooltip = options.tooltip;
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
    if (this._element != null) {
      this._areaContainer.removeChild(this._element);
    }
    this._controlsContainer = null;
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
    this._map = map;
    this._areaContainer = areaContainer;
    const html = compileTemplate(panelTemplate);
    this._element = html;

    if (!isNullOrEmpty(this._tooltip)) {
      this._element.setAttribute('title', this._tooltip);
    }
    this._buttonPanel = html.querySelector('button.m-panel-btn');
    if (!isNullOrEmpty(this._className)) {
      this._className.split(/\s+/).forEach((className) => {
        html.classList.add(className);
      });
    }

    if (this._collapsed === true) {
      this.collapse();
    } else {
      this.open();
    }

    if (this._collapsible !== true) {
      html.classList.add('no-collapsible');
    }

    this._controlsContainer = html.querySelector('div.m-panel-controls');
    areaContainer.appendChild(html);

    this._buttonPanel.addEventListener('click', (evt) => {
      evt.preventDefault();
      if (this._collapsed === false) {
        this.collapse();
      } else {
        this.open();
      }
    });

    this.addControls(this._controls);
    this.fire(EventType.ADDED_TO_MAP, html);
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  _collapse(html) {
    html.classList.remove('opened');
    this._buttonPanel.classList.remove(this._openedButtonClass);
    html.classList.add('collapsed');
    this._buttonPanel.classList.add(this._collapsedButtonClass);
    this._collapsed = true;
    this.fire(EventType.HIDE);
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  _open(html) {
    html.classList.remove('collapsed');
    this._buttonPanel.classList.remove(this._collapsedButtonClass);
    html.classList.add('opened');
    this._buttonPanel.classList.add(this._openedButtonClass);
    this._collapsed = false;
    this.fire(EventType.SHOW);
  }

  /**
   * Call private method _open
   *
   * @public
   * @function
   */
  open() {
    this._open(this._element);
  }

  /**
   * Call private method _collapse
   *
   * @public
   * @function
   */
  collapse() {
    this._collapse(this._element);
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
    return this._controls;
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
            this._controls.push(control);
            control.setPanel(this);
            control.on(EventType.DESTROY, this._removeControl.bind(this), this);
          }
          if (!isNullOrEmpty(this._controlsContainer)) {
            control.on(EventType.ADDED_TO_MAP, this._moveControlView.bind(this), this);
            this._map.addControls(control);
          }
          control.on(EventType.ACTIVATED, this._manageActivation.bind(this), this);
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
        hasControl = this._controls.filter(control => control.name === controlParam)[0] != null;
      } else if (controlParam instanceof ControlBase) {
        hasControl = includes(this._controls, controlParam);
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
          this._controls = this._controls.filter(control2 => !control.equals(control2));
          control.setPanel(null);
        }
      }, this);
      // if this panel hasn't any controls then it's removed
      // from the map
      if (this._controls.length === 0) {
        this._map.removePanel(this);
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
  _removeControl(controlsParam) {
    const controls = this._map.controls(controlsParam);
    controls.forEach((control) => {
      const index = this._controls.indexOf(control);
      if (index !== -1) {
        this._controls.splice(index, 1);
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
    if (!isNullOrEmpty(this._element)) {
      this._element.classList.remove(className);
    } else {
      this._className = this._className.replace(new RegExp(`s* ${className} s*`), '');
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
    if (!isNullOrEmpty(this._element)) {
      this._element.classList.add(className);
    } else {
      this._className = this._className.concat(' ').concat(className);
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
  _moveControlView(control) {
    const controlElem = control.getElement();
    if (!isNullOrEmpty(this._controlsContainer)) {
      this._controlsContainer.appendChild(controlElem);
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
  _manageActivation(control) {
    if (this._multiActivation !== true) {
      this._controls.forEach((panelControl) => {
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
    return this._element;
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
    return this._buttonPanel;
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
    return this._collapsed;
  }

  /**
   * Returns is collapsed
   *
   * @public
   * @function
   * @api
   * @returns {Boolean}
   */
  setCollapsed(flag) {
    this._collapsed = flag;
  }

  /**
   * TODO
   */
  getControlsContainer() {
    return this._controlsContainer;
  }
}

export default Panel;
