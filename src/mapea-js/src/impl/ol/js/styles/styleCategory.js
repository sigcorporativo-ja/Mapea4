goog.provide('M.impl.style.Category');




(function() {

  /**
   * @classdesc
   *
   */

  M.impl.style.Category = function() {

    /**
     * TODO
     * @private
     * @type {M.style.Category}
     */
    this.facadeStyleCategory_ = null;
  };


  M.impl.style.Category.prototype.updateCanvas = function(canvas) {
    let canvasSize = this.getCanvasSize();
    let array = [];
    let c = canvas.getContext('2d');
    let cat = this.facadeStyleCategory_.categoryStyles_;
    let estilo = null;
    let imagen = null;
    for (i in cat) {
      let array_s_c = [];
      estilo = cat[i.toString()];
      imagen = estilo.toImage();
      array_s_c = [i, imagen, estilo];
      array.push(array_s_c);
    }
    let num_stilos = array.length;
    c.canvas.height = 80 * num_stilos;
    this.drawGeometryToCanvas(array, c, this.facadeStyleCategory_.attributeName_);
  };


  M.impl.style.Category.prototype.drawGeometryToCanvas = function(array, c, attributeName) {
    let length = array.length;
    let cont = 1;
    let coordinates = this.getCanvasSize();
    let x = c.canvas.width;
    let y = c.canvas.height;
    let categoria = null;
    let imagen = null;

    for (let i = 0; i < array.length; i++) {
      categoria = array[i][0];
      imagen = array[i][1];
      var image = new Image();
      image.height = 100;
      (function(categoryParam) {
        image.onload = function() {
          c.textAlign = 'letf';
          c.font = "12px Arial";
          c.textBaseline = "middle";
          c.drawImage(this, 0, (i / length) * y * 0.5);
          c.fillText(categoryParam, x / 2, ((i / length) * y * 0.5) + image.height / 2);
        };
      })(categoria);
      image.src = imagen;
      cont = cont + 1;
    }

  };

  // M.impl.style.Category.prototype.drawGeometryToCanvas = function(array) {
  //   // vectorContext.drawGeometry(new ol.geom.Point([50, 50]));
  //   let length = array.length;
  //   let cont = 1;
  //   let coordinates = this.getCanvasSize();
  //   let x = coordinates[0];
  //   let y = coordinates[1] * 0.5;
  //   for (let i = 0; i < array.length; i++) {
  //
  //     array[i].drawGeometry(new ol.geom.Point([50, (cont / length) * y]));
  //     cont = cont + 1;
  //   }
  //
  // };

  M.impl.style.Category.prototype.getCanvasSize = function() {
    return [200, 300];
  };

  /**
   * This function return the AttributeName
   * @function
   * @param {M.style.Category} styleCategory - styleCategory object
   * @returns {String}
   * @api stable
   */
  M.impl.style.Category.prototype.getAttributeName = function(styleCategory) {
    return styleCategory.AttributeName_;
  };

  /**
   * This function set the AttributeName defined by user
   * @function
   * @param {M.style.Category} styleCategory - styleCategory object
   * @param {String} newAttributeName - newAttributeName is the newAttributeName specified by the user
   * @returns {M.style.Category}
   * @public
   * @api stable
   */
  M.impl.style.Category.prototype.setAttributeName = function(styleCategory, newAttributeName) {
    styleCategory.AttributeName_ = newAttributeName;
    return styleCategory;

  };

  /**
   * This function return an Array with the diferents Categories
   * @function
   * @param {M.style.Category} styleCategory - styleCategory object
   * @returns {Array<String>}
   * @api stable
   */
  M.impl.style.Category.prototype.getCategories = function(styleCategory) {
    let array_value = [];
    let element = null;
    try {
      let layer = styleCategory.layer_;
      let array_features = layer.getFeatures(true);
      for (var i = 0; i < array_features.length; i++) {
        let json_var = array_features[i].getAttributes();
        for (var element_in_json in json_var) {
          element = json_var[element_in_json];
          if (element_in_json == styleCategory.AttributeName_ && array_value.indexOf(element) < 0) {
            array_value.push(element);
          }
        }
      }
    }
    catch (e) {
      M.exception('No existe layer');
    }
    return array_value;
  };

  /**
   *
   * @function
   * @param {M.style.Category} styleCategory - styleCategory object
   * @param {String} string - string is a specific Category provide by a user
   * @returns {M.style}
   * @api stable
   */
  M.impl.style.Category.prototype.getStyleForCategories = function(categoryStyle, string) {
    let layer = categoryStyle.layer_;
    let categories = categoryStyle.getCategories();
    if (categories.indexOf(string) < 0) {
      M.exception('Se ha escpecificado una Categoria inexistente');
    }
    else {
      layer.setFilter(M.filter.EQUAL(categoryStyle.AttributeName_, string));
      let feat = layer.getFeatures();
      let first = feat[0];
      layer.removeFilter();
      return first.style_;
    }
  };


  /**
   *
   * This function set the style of a specified Category defined by user
   * @function
   * @param {M.style.Category} styleCategory - styleCategory object
   * @param {String} string - string is a specific Category provide by a user
   * @returns {M.style.Category}
   * @api stable
   */
  M.impl.style.Category.prototype.setStyleForCategories = function(categoryStyle, string, style) {
    let categories = categoryStyle.getCategories();
    if (categories.indexOf(string) < 0) {
      M.exception('Se ha escpecificado una Categoria inexistente');
    }
    else {
      this.facadeStyleCategory_.layer_.setFilter(M.filter.EQUAL(categoryStyle.AttributeName_, string));
      let array_features = this.facadeStyleCategory_.layer_.getFeatures();
      for (var i = 0; i < array_features.length; i++) {
        array_features[i].setStyle(style);
      }
      this.facadeStyleCategory_.layer_.removeFilter();
    }
    this.facadeStyleCategory_.categoryStyles_[string] = style;
    return this;
  };

  /**
   * This function get the FacadeObject
   *
   * @function
   * @param {object}
   * @api stable
   */
  M.impl.style.Category.prototype.setFacadeObj = function(obj) {
    this.facadeStyleCategory_ = obj;
  };


  /**
   * This function apply the styleCategory object to specified layer
   *
   * @function
   * @param {M.layer.Vector} layer - layer is the layer where we want to apply the new Style
   * @returns {M.style.Category}
   * @api stable
   */
  M.impl.style.Category.prototype.applyToLayer = function(layer) {
    var colores = [];
    var color_random = null;
    var ya_filtrada = [];
    var array_features_aux = [];
    var categorias_existentes_aux = null;
    this.facadeStyleCategory_.layer_ = layer;
    let categoryStyles = this.facadeStyleCategory_.categoryStyles_;
    let arraycategoryStyle = [];
    for (var i in categoryStyles) {
      arraycategoryStyle.push(i);
    }
    var categorias_existentes = this.facadeStyleCategory_.getCategories();
    for (var a = 0; a < categorias_existentes.length; a++) {
      categorias_existentes_aux = categorias_existentes[a];
      if (ya_filtrada.indexOf(categorias_existentes_aux) <= 0) {
        if (arraycategoryStyle.indexOf(categorias_existentes_aux) >= 0) {
          let style = this.facadeStyleCategory_.categoryStyles_[categorias_existentes_aux];
          this.facadeStyleCategory_.setStyleForCategories(categorias_existentes_aux, style);
        }
        else {
          let color_escogido = false;
          while (color_escogido != true) {
            color_random = chroma.random().name();
            if (colores.indexOf(color_random) < 0) {
              color_escogido = true;
            }
          }
          let array_features = layer.getFeatures();
          let random = null;
          for (var f = 0; f < array_features.length; f++) {
            array_features_aux = array_features[f];
            let comprueba_categoria = array_features_aux.getAttributes()[this.facadeStyleCategory_.AttributeName_];
            if (comprueba_categoria == categorias_existentes_aux) {
              let type = array_features_aux.getGeometry().type;
              if (type == "Point") {
                random = new M.style.Point({
                  fill: {
                    color: color_random
                  },
                  stroke: {
                    color: color_random,
                    width: 1
                  },
                  radius: 6
                });
              }
              if (type == "Polygon") {
                random = new M.style.Polygon({
                  fill: {
                    color: color_random
                  },
                  stroke: {
                    color: color_random,
                    width: 2
                  },
                  radius: 5
                });
              }
              if (type == "LineString") {
                random = new M.style.Line({
                  fill: {
                    color: color_random,
                    width: 15
                  },
                  stroke: {
                    color: color_random,
                    width: 5
                  },
                });
              }
            }
          }
          this.facadeStyleCategory_.setStyleForCategories(categorias_existentes_aux, random);
        }
        ya_filtrada.push(categorias_existentes_aux);
      }
    }
  };
})();
