import Base from(.. / facade.js);
import Utils from('../utils/utils.js');

/**
 * @namespace M.Style
 */

export class Style extends Base {
  /**   * Rec. options que es el json del estilo   */

  /**
   * Abstract class
   *
   * @api stable
   */
  constructor(options, impl) {
    super(this, impl);
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


    // this.updateCanvas();
  }

  /**
   * This function apply style
   *
   * @public
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @function
   * @api stable
   */
  apply(layer) {
    this.layer_ = layer;
    this.impl().applyToLayer(layer);
    this.updateCanvas();
  }

  /**
   * This function apply style
   *
   * @function
   * @protected
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @api stable
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
    if (Utils.isNullOrEmpty(attrValue)) {
      // we look up the attribute by its path. Example: getAttribute('foo.bar.attr')
      // --> return feature.properties.foo.bar.attr value
      let attrPath = attribute.split('.');
      if (attrPath.length > 1) {
        attrValue = attrPath.reduce((obj, attr) => !Utils.isNullOrEmpty(obj) ? ((obj instanceof Style) ? obj.get(attr) : obj[attr]) : undefined, this);
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
   * @api stable
   */
  set(property, value) {
    let oldValue = this.get(property);
    Style.setValue_(this.options_, property, value);
    if (!Utils.isNullOrEmpty(this.layer_)) {
      this.impl().updateFacadeOptions(this.options_);
    }
    if (!Utils.isNullOrEmpty(this.feature_)) {
      this.applyToFeature(this.feature_);
    }
    this.fire(M.evt.CHANGE, [property, oldValue, value]);
    this.refresh();
    return this;
  };
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
  static setValue_(obj, path, value) {
    let keys = Utils.isArray(path) ? path : path.split('.');
    let keyLength = keys.length;
    let key = keys[0];
    if (keyLength === 1) { // base case
      if (Utils.isArray(value)) {
        value = [...value];
      } else if (Utils.isObject(value)) {
        value = Object.assign({}, value);
      }
      obj[key] = value;
    } else if (keyLength > 1) { // recursive case
      if (Utils.isNullOrEmpty(obj[key])) {
        obj[key] = {};
      }
      Style.setValue_(obj[key], keys.slice(1, keyLength), value);
    }
  }

  /**
   * This function updates the style of the
   * layer
   *
   * @public
   * @function
   * @return {String} data url to canvas
   * @api stable
   */
  refresh(layer = null) {
    if (!Utils.isNullOrEmpty(layer)) {
      this.layer_ = layer;
    }
    if (!Utils.isNullOrEmpty(this.layer_)) {
      this.apply(this.layer_);
      this.updateCanvas();
      if (!Utils.isNullOrEmpty(this.layer_.impl().map())) {
        let layerswitcher = this.layer_.impl().map().controls('layerswitcher')[0];
        if (!Utils.isNullOrEmpty(layerswitcher)) {
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
   * @api stable
   */
  get options() {
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

    if (Utils.isNullOrEmpty(this.updateCanvasPromise_)) {
      if (!Utils.isNullOrEmpty(this.options_.icon) && !Utils.isNullOrEmpty(this.options_.icon.src)) {
        let image = new Image();
        image.crossOrigin = "Anonymous";
        let can = this.canvas_;
        image.onload = () => {
          let c = can;
          let ctx = c.getContext("2d");
          ctx.drawImage(this, 0, 0, 50, 50);
        }
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
   * TODO
   */
  serialize() {};

  /**
   * This function updates the styles's canvas
   *
   * @public
   * @function
   * @api stable
   */
  updateCanvas() {
    this.updateCanvasPromise_ = this.impl().updateCanvas(this.canvas_);
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
   * @api stable
   */

  clone() {
    let optsClone = {};
    Utils.extends(optsClone, this.options_);
    let implClass = this.impl().constructor;
    let implClone = new implClass(optsClone);
    return new this.constructor(optsClone, implClone);
  }

}
