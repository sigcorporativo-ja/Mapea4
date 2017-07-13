goog.provide('M.Style');

/**
 * TODO
 */
(function() {

  /**
   * Rec. options que es el json del estilo
   */
  M.Style = (function(options) {
    this.options_ = options;
    // si rec. una imagen podemos tener un canvas
    if (!M.utils.isNullOrEmpty(options.icon)) {
      let canvas = document.createElement('canvas');
      // ruta en el json
      canvas.toDataURL(options.icon.src);
      this.canvas_ = canvas;
    }
  });

  /**
   * TODO
   * Como es protected no se rellena, pero que se supone que debe hacer?
   */
  M.Style.prototype.apply_ = function(layer) {};

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
    // le pasamos las opciones de estilos a la impl
    this.getImpl().setStyle(this.options_);
    return this;
  };

  /**
   * TODO
   */
  M.Style.prototype.toImage = function() {
    return this.canvas_.toDataURL();
  };

  /**
   * TODO
   * Como es protected no se rellena
   */
  M.Style.prototype.serialize = function() {};

})();
