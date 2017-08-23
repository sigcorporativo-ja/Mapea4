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



  /**
   *
   * @function
   * @param {M.style.Category}
   * @returns {String}
   * @api stable
   */

  M.impl.style.Category.prototype.getAttributeName = function(styleCategory) {
    //devolvemos el AttributeName_
    return styleCategory.AttributeName_;

  };



  /**
   *
   *
   * @function
   * @param {M.style.Category|String}
   * @returns {M.style.Category}
   * @api stable
   */


  M.impl.style.Category.prototype.setAttributeName = function(styleCategory, newAttributeName) {
    //devolvemos el nuevo AttributeName_
    styleCategory.AttributeName_ = newAttributeName;
    return styleCategory;

  };



  /**
   *
   * @function
   * @param {M.style.Category}
   * @returns {Array<String>}
   * @api stable
   */

  M.impl.style.Category.prototype.getCategories = function(styleCategory) {

    /*devolvemos los valores correspondientes dado un tipo que vendra
    dado por AttributeName_*/

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
    //caso en que no se hubiera aplicado el apply
    catch (e) {
      M.exception('No existe layer');
    }
    return array_value;
  };



  /**
   *
   * @function
   * @param {M.style.Category|String}
   * @returns {M.style}
   * @api stable
   */


  M.impl.style.Category.prototype.getStyleForCategories = function(categoryStyle, string) {
    /*
    Nos devolvera el estilo de una Categoria del tipo AttributeName_
    */

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
   *
   * @function
   * @param {M.style.Category|String|M.Style}
   * @returns {M.style.Category}
   * @api stable
   */



  M.impl.style.Category.prototype.setStyleForCategories = function(categoryStyle, string, style) {

    /*
    modificamos el estilo de una Categoria del tipo AttributeName_
    IMPORTANTE: tambien tiene que modificarse en categoryStyles_
    */

    //let layer = categoryStyle.layer_;
    let categories = categoryStyle.getCategories();

    if (categories.indexOf(string) < 0) {
      M.exception('Se ha escpecificado una Categoria inexistente');
    }
    else {
      //layer.setFilter(M.filter.EQUAL(categoryStyle.AttributeName_, string));
      this.facadeStyleCategory_.layer_.setFilter(M.filter.EQUAL(categoryStyle.AttributeName_, string));
      let array_features = this.facadeStyleCategory_.layer_.getFeatures();
      for (var i = 0; i < array_features.length; i++) {
        array_features[i].setStyle(style);
      }
      //layer.removeFilter();
      this.facadeStyleCategory_.layer_.removeFilter();
    }

    //categoryStyle.categoryStyles_[string] = style;
    //categoryStyle.layer_ = layer;
    this.facadeStyleCategory_.categoryStyles_[string] = style;


    //return categoryStyle;
    return this;
  };



  /**
   * This function gets the Name
   *
   * @function
   * @param {object}
   * @api stable
   */


  M.impl.style.Category.prototype.setFacadeObj = function(obj) {
    this.facadeStyleCategory_ = obj;
  };






  /**
   * This function gets the Name
   *
   * @function
   * @param {M.layer.Vector}
   * @returns {M.style.Category}
   * @api stable
   */



  M.impl.style.Category.prototype.applyToLayer = function(layer) {

    /*
    Aplicamos el categoryStyle a un "layer"
    */
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


          //cogemos color y se almacena en colores
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
