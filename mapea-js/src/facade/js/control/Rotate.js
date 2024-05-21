/**
 * @module M/control/Rotate
 */
import 'assets/css/controls/rotate.css';
import RotateImpl from 'impl/control/Rotate.js';
import template from 'templates/rotate.html';
import ControlBase from './Control.js';
import { compileSync as compileTemplate } from '../util/Template.js';
import { isUndefined } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import * as EventType from '../event/eventtype.js';

/**
 * @function
 * @private
 */
const rotateListener = (e, html, map) => {
  const htmlVar = html;
  let sliderContainer = e.target.parentElement.parentElement;
  let x = 0;
  let y = 0;

  while (sliderContainer && !Number.isNaN(sliderContainer.offsetLeft)
    && !Number.isNaN(sliderContainer.offsetTop)) {
    x += sliderContainer.offsetLeft - sliderContainer.scrollLeft;
    y += sliderContainer.offsetTop - sliderContainer.scrollTop;
    sliderContainer = sliderContainer.offsetParent;
  }
  x = e.clientX - x;
  y = e.clientY - y;

  const { clientWidth, clientHeight } = e.currentTarget;
  const perpendicularLine = [0, -clientHeight];
  // It needs this const to centre the button on mouse
  const angleToCenter = 45;

  const coords = [x - (clientWidth / 2), y - (clientHeight / 2)];
  const escalarProd = (perpendicularLine[0] * coords[0]) + (perpendicularLine[1] * coords[1]);
  const perpendicularMod = Math.sqrt((perpendicularLine[0] ** 2) + (perpendicularLine[1] ** 2));
  const pointerMod = Math.sqrt((coords[0] ** 2) + (coords[1] ** 2));
  const cosA = escalarProd / (perpendicularMod * pointerMod);
  const angle = Math.acos(cosA);
  let alfa = (angle * 180) / Math.PI;
  if (coords[0] < 0) {
    alfa = 360 - alfa;
  }
  map.setRotation(alfa);
  const transform = 'transform';
  htmlVar.querySelector('#m-rotate-marker').style.WebkitTransform = `rotate(${alfa + angleToCenter}deg)`;
  htmlVar.querySelector('#m-rotate-marker').style.MozTransform = `rotate(${alfa + angleToCenter}deg)`;
  htmlVar.querySelector('#m-rotate-marker').style[transform] = `rotate(${alfa + angleToCenter}deg)`;
};

/**
 * @public
 * @function
 * @api
 */
export const onMouseDown = (instance, html) => {
  const sliderContainer = html.querySelector('#m-rotate-slider-container');
  sliderContainer.addEventListener('mousedown', (e) => {
    instance.setActive(true);
    if (e.target.id !== 'm-rotate-button') {
      instance.setMouseDown(true);
    }
  });
};

/**
 * @public
 * @function
 * @api
 */
export const onMouseUp = (instance, html) => {
  document.body.addEventListener('mouseup', (e) => {
    instance.setActive(false);
  });
};

/**
 * @public
 * @function
 * @api
 */
export const onClick = (instance, html, map) => {
  const htmlVar = html;
  const sliderContainer = html.querySelector('#m-rotate-slider-container');
  const transform = 'transform';
  sliderContainer.addEventListener('click', (e) => {
    if (e.target.id === 'm-rotate-button' && !instance.getMouseDown()) {
      instance.getImpl().resetRotation();
      htmlVar.querySelector('#m-rotate-marker').style.WebkitTransform = 'rotate(40deg)';
      htmlVar.querySelector('#m-rotate-marker').style.MozTransform = 'rotate(40deg)';
      htmlVar.querySelector('#m-rotate-marker').style[transform] = 'rotate(40deg)';
    } else {
      rotateListener(e, html, map);
    }
    instance.setMouseDown(false);
  });
};

/**
 * @public
 * @function
 * @api
 */
export const onMouseMove = (instance, html, map) => {
  const sliderContainer = html.querySelector('#m-rotate-slider-container');
  sliderContainer.addEventListener('mousemove', (e) => {
    if (instance.getActive()) {
      rotateListener(e, html, map);
    }
  });
};

/**
 * @classdesc
 * @api
 */
class Rotate extends ControlBase {
  /**
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api
   */
  constructor() {
    if (isUndefined(RotateImpl)) {
      Exception('La implementación usada no puede crear controles Scale');
    }

    const impl = new RotateImpl();
    super(impl, Rotate.NAME);

    /**
     * @private
     * @type {boolean}
     */
    this.active_ = false;

    /**
     * @private
     * @type {boolean}
     */
    this.isMouseDown_ = false;
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map map to add the control
   * @returns {Promise} html response
   * @api
   */
  createView(map) {
    const html = compileTemplate(template);
    const transform = 'transform';
    html.querySelector('#m-rotate-marker').style.WebkitTransform = 'rotate(40deg)';
    html.querySelector('#m-rotate-marker').style.MozTransform = 'rotate(40deg)';
    html.querySelector('#m-rotate-marker').style[transform] = 'rotate(40deg)';
    onMouseDown(this, html);
    onMouseMove(this, html, map);
    onMouseUp(this, html);
    onClick(this, html, map);
    this.on(EventType.ADDED_TO_MAP, () => {
      this.getImpl().onChangeView(html);
    });
    return html;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof Rotate);
    return equals;
  }

  /**
   * @function
   * @public
   * @api
   */
  setActive(flag) {
    this.active_ = !!flag;
  }

  /**
   * @function
   * @public
   * @api
   */
  getActive() {
    return this.active_;
  }

  /**
   * @function
   * @public
   * @api
   */
  setMouseDown(flag) {
    this.isMouseDown_ = !!flag;
  }

  /**
   * @function
   * @public
   * @api
   */
  getMouseDown() {
    return this.isMouseDown_;
  }
}

/**
 * Name of the class
 * @const
 * @type {string}
 * @public
 * @api
 */
Rotate.NAME = 'rotate';

export default Rotate;
