goog.provide('M.Style');
(function() {
  /**   * Rec. options que es el json del estilo   */

  M.Style = (function(options, impl) {
    /**
     * TODO
     */
    this.options_ = options;
    /**
     * TODO
     */
    this.canvas_ = document.createElement('canvas');
    /**
     * TODO
     */
    this.layer_ = null;
    // si rec. una imagen podemos tener un canvas
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
   * TODO
   *
   */
  M.Style.prototype.apply = function(layer) {
    this.getImpl().applyToLayer(layer);
  };
  /**
   * TODO
   *
   */
  M.Style.prototype.unapply = function(layer) {};
  /**
   * TODO
   *
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
   * supongo que, solo se pude hacer un set de fill, stroke y label, y que sería del objeto completo
   * es decir, que no se puede cambiar solo el color por ejemplo
   */
  M.Style.prototype.set = function(property, value) {
    this.options_[property] = value;
    // TODO refrescamos de nuevo el estilo
    this.apply_(this.layer_);
    return this;
  };
  /**
   * TODO
   */
  M.Style.prototype.toImage = function() {
    return this.canvas_.toDataURL('png');
  };
  /**
   * TODO
   * Como es protected no se rellena
   */
  M.Style.prototype.serialize = function() {};
  /**
   * TODO
   *
   */
  M.Style.prototype.equals = function(style) {
    if (this.constructor === style.constructor) {
      return true;
    }
    else {
      return false;
    }
  };
})();
