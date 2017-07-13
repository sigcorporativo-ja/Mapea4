goog.provide('M.Style');

(function() {

  /**
   * Rec. options que es el json del estilo
   */
  M.Style = (function(options = {}) {
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
    if (!M.utils.isNullOrEmpty(options.icon)) {
      let ctx = this.canvas_.getContext('2d');
      let img = new Image;
      img.onload = function() {
        ctx.drawImage(img, 0, 0); // Or at whatever offset you like
      };
      img.src = options.icon.src;
    }
  });
  goog.inherits(M.Style, M.facade.Base);

  /**
   * TODO
   * Como es protected no se rellena, pero que se supone que debe hacer?
   */
  M.Style.prototype.apply_ = function(layer) {
    this.layer_ = layer;
  };

  /**
   * TODO
   * supongo que, solo se puede obtener las propiedades de primer nivel.
   * ej del polygon : fill, stroke y label.
   */
  M.Style.prototype.get = function(property) {
    return this.options_[property];
  };

  /**
   * supongo que, solo se pude hacer un set de fill, stroke y label, y que sería del objeto completo
   * es decir, que no se puede cambiar solo el color por ejemplo
   */
  M.Style.prototype.set = function(property, value) {
    this.options[property] = value;

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

})();
