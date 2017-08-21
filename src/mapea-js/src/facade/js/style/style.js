goog.provide('M.Style');

/**
 * @namespace M.Style
 */

(function() {

  /**
   * Abstract class
   *
   * @api stable
   */
  M.Style = (function(options, impl) {
    [this.options_, this.canvas_, this.layer_] = [options, document.createElement('canvas'), null];

    if (!M.utils.isNullOrEmpty(this.options_.icon) && !M.utils.isNullOrEmpty(this.options_.icon.src)) {
      let ctx = this.canvas_.getContext('2d');
      let img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0); // Or at whatever offset you like
      };
      img.src = this.options_.icon.src;
    }

    goog.base(this, impl);
  });
  goog.inherits(M.Style, M.facade.Base);

  /**
   * This function apply style
   *
   * @protected
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @function
   */
  M.Style.prototype.apply = function(layer) {
    this.layer_ = layer;
    this.getImpl().applyToLayer(layer);
  };

  /**
   * This function returns the value of the indicated attribute
   *
   * @protected
   * @param {String} attribute - Attribute to know the value
   * @return {Object} Attribute Value
   * @function
   */
  M.Style.prototype.get = function(attribute) {
    let attrValue;

    attrValue = this.options_[attribute];
    if (M.utils.isNullOrEmpty(attrValue)) {
      // we look up the attribute by its path. Example: getAttribute('foo.bar.attr')
      // --> return feature.properties.foo.bar.attr value
      let attrPath = attribute.split('.');
      if (attrPath.length > 1) {
        attrValue = attrPath.reduce((obj, attr) => !M.utils.isNullOrEmpty(obj) ? ((obj instanceof M.Style) ? obj.get(attr) : obj[attr]) : undefined, this);
      }
    }
    return attrValue;
  };

  /**
   * This function set value to property and apply new property
   *
   * @protected
   * @param {String} property - Property to change the value
   * @param {String} value - Value to property
   * @return {M.Style}
   * @function
   */
  M.Style.prototype.set = function(property, value) {
    this.setValue_(this.options_, property, value);
    this.getImpl().setOptionsToOLStyle(this.options_);
    this.apply(this.layer_);

    return this;
  };

  /**
   * This function set value to property
   *
   * @protected
   * @param {Object} obj - Style
   * @param {String} path - Path property
   * @param {String} value - Value property
   * @return {String} value
   * @function
   */
  M.Style.prototype.setValue_ = function(obj, path, value) {
    let keys = Array.isArray(path) ? path : path.split('.');
    for (var i = 0; i < keys.length - 1; i++) {
      let key = keys[i];
      if (!hasOwnProperty.call(obj, key)) {
        obj[key] = {};
      }
      obj = obj[key];
    }
    obj[keys[i]] = value;
    return value;
  };


  /**
   * This function returns data url to canvas
   *
   * @function
   * @protected
   * @return {String} data url to canvas
   */
  M.Style.prototype.toImage = function() {
    return this.canvas_.toDataURL('png');
  };

  /**
   * TODO
   */
  M.Style.prototype.serialize = function() {};

})();