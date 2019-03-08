/**
 * @module M/Style
 */
import Base from '../Base';
import { isNullOrEmpty, isArray, isObject, extendsObj, stringifyFunctions } from '../util/Utils';
import * as EventType from '../event/eventtype';

/**
 * @classdesc
 * @api
 */
class Style extends Base {
  /**
   * @constructor
   * @api
   */
  constructor(options, impl) {
    // call super constructor
    super(impl);

    /**
     * User options for this style
     * @private
     * @type {Object}
     */
    this.options_ = options;

    /**
     * The canvas element to draw the style
     * into a layer swticher
     * @private
     * @type {HTMLCanvasElement}
     */
    this.canvas_ = document.createElement('canvas');

    /**
     * The updateCanvas promise to manage
     * asynchronous request with icon images
     *
     * @private
     * @type {Promirse}
     */
    this.updateCanvasPromise_ = null;

    /**
     * Layer which this style is applied
     * @private
     * @type {M.layer.Vector}
     */
    this.layer_ = null;
  }

  /**
   * canvas getter
   * @public
   * @function
   * @return {HTMLCanvasElement}
   * @api
   */
  get canvas() {
    return this.canvas_;
  }

  /**
   * This function apply style
   *
   * @public
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @function
   * @api
   */
  apply(layer) {
    this.layer_ = layer;
    this.getImpl().applyToLayer(layer);
    this.updateCanvas();
  }

  /**
   * This function apply style
   *
   * @function
   * @protected
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @api
   */
  unapply(layer) {}

  /**
   * This function returns the value of the indicated attribute
   *
   * @function
   * @public
   * @param {String} attribute - Attribute to know the value
   * @return {Object} Attribute Value
   */
  get(attribute) {
    let attrValue;
    attrValue = this.options_[attribute];
    if (isNullOrEmpty(attrValue)) {
      const attrPath = attribute.split('.');
      if (attrPath.length > 1) {
        attrValue = attrPath.reduce((obj, attr) => {
          let value;
          if (!isNullOrEmpty(obj)) {
            value = obj[attr];
            if (obj instanceof Style) {
              value = obj.get(attr);
            }
          }
          return value;
        }, this);
      }
    }
    return attrValue;
  }

  /**
   * This function set value to property and apply new property
   *
   * @public
   * @param {String} property - Property to change the value
   * @param {String} value - Value to property
   * @return {M.Style}
   * @function
   * @api
   */

  set(property, value) {
    const oldValue = this.get(property);
    Style.setValue(this.options_, property, value);
    if (!isNullOrEmpty(this.layer_)) {
      this.getImpl().updateFacadeOptions(this.options_);
    }
    if (!isNullOrEmpty(this.feature_)) {
      this.applyToFeature(this.feature_);
    }
    this.fire(EventType.CHANGE, [property, oldValue, value]);
    this.refresh();
    return this;
  }

  /**
   * This function set value to property
   *
   * @private
   * @param {Object} obj - Style
   * @param {String} path - Path property
   * @param {String} value - Value property
   * @return {String} value
   * @function
   */
  static setValue(objPara, path, valueVar) {
    let value = valueVar;
    const obj = objPara;
    const keys = isArray(path) ? path : path.split('.');
    const keyLength = keys.length;
    const key = keys[0];
    if (keyLength === 1) { // base case
      if (isArray(value)) {
        value = [...value];
      } else if (isObject(value)) {
        value = Object.assign({}, value);
      }
      obj[key] = value;
    } else if (keyLength > 1) { // recursive case
      if (isNullOrEmpty(obj[key])) {
        obj[key] = {};
      }
      Style.setValue(obj[key], keys.slice(1, keyLength), value);
    }
  }

  /**
   * This function updates the style of the
   * layer
   *
   * @public
   * @function
   * @return {String} data url to canvas
   * @api
   */
  refresh(layer = null) {
    if (!isNullOrEmpty(layer)) {
      this.layer_ = layer;
    }
    if (!isNullOrEmpty(this.layer_)) {
      this.apply(this.layer_);
      this.updateCanvas();
      if (!isNullOrEmpty(this.layer_.getImpl().getMap())) {
        const layerswitcher = this.layer_.getImpl().getMap().getControls('layerswitcher')[0];
        if (!isNullOrEmpty(layerswitcher)) {
          layerswitcher.render();
        }
      }
    }
  }
  /**
   * This functions gets the options style.
   *
   * @function
   * @public
   * @return {object}
   * @api
   */
  getOptions() {
    return this.options_;
  }

  /**
   * This function returns data url to canvas
   *
   * @function
   * @public
   * @return {String} data url to canvas
   */
  toImage() {
    let styleImgB64;

    if (isNullOrEmpty(this.updateCanvasPromise_)) {
      if (!isNullOrEmpty(this.options_.icon) &&
        !isNullOrEmpty(this.options_.icon.src)) {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        const can = this.canvas_;
        image.onload = () => {
          const c = can;
          const ctx = c.getContext('2d');
          ctx.drawImage(this, 0, 0, 50, 50);
        };
        image.src = this.options_.icon.src;
        styleImgB64 = this.canvas_.toDataURL('png');
      } else {
        styleImgB64 = this.canvas_.toDataURL('png');
      }
    } else {
      styleImgB64 = this.updateCanvasPromise_.then(() => this.canvas_.toDataURL('png'));
    }

    return styleImgB64;
  }

  /**
   * This function updates the styles's canvas
   *
   * @public
   * @function
   * @api
   */
  updateCanvas() {
    this.updateCanvasPromise_ = this.getImpl().updateCanvas(this.canvas_);
  }

  /**
   * TODO
   *
   */
  equals(style) {
    return (this.constructor === style.constructor);
  }

  /**
   * This function clones the style
   *
   * @public
   * @return {M.Style}
   * @function
   * @api
   */
  clone() {
    const optsClone = {};
    extendsObj(optsClone, this.options_);
    const ImplClass = this.getImpl().constructor;
    const implClone = new ImplClass(optsClone);
    return new this.constructor(optsClone, implClone);
  }

  /**
   * This function implements the mechanism to
   * generate the JSON of this instance
   *
   * @public
   * @return {object}
   * @function
   * @api
   */
  toJSON() {
    const parameters = [stringifyFunctions(this.getOptions())];
    const deserializedMethod = this.getDeserializedMethod_();
    return { parameters, deserializedMethod };
  }

  /**
   * TODO
   *
   * @function
   * @return {String}
   * @api
   * @public
   */
  serialize() {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(this))));
  }

  /**
   * This function returns the style instance of the serialization
   * @function
   * @public
   * @param {string} serializedStyle - serialized style
   * @return {M.Style}
   */
  static deserialize(encodedSerializedStyle) {
    const serializedStyle = decodeURIComponent(escape(window.atob(encodedSerializedStyle)));
    const { parameters, deserializedMethod } = JSON.parse(serializedStyle);
    /* eslint-disable */
    return (new Function("serializedParams", `return ${deserializedMethod}(serializedParams)`))(parameters);
    /* eslint-enable */
  }
}

export default Style;
