goog.provide('M.impl.style.Category');


(function() {

  M.impl.style.Category = function() {
    this.facadeStyleCategory_ = null;
  };


  M.impl.style.Category.prototype.getAttributeName = function(styleCategory) {
    //devolvemos el AttributeName_
    return styleCategory.AttributeName_;

  };


  M.impl.style.Category.prototype.setAttributeName = function(styleCategory, newAttributeName) {
    //devolvemos el AttributeName_
    styleCategory.AttributeName_ = newAttributeName;
    return styleCategory;

  };


  M.impl.style.Category.prototype.getCategories = function(styleCategory) {

    /*devolvemos los valores correspondientes dado un tipo que vendra
    dado por AttributeName_*/

    let array_value = [];

    try {

      let layer = styleCategory.layer_;
      let array_features = layer.getFeatures(true);
      for (var i = 0; i < array_features.length; i++) {
        let json_var = array_features[i].getAttributes();
        for (var element_in_json in json_var) {
          if (element_in_json == styleCategory.AttributeName_) {
            array_value.push(json_var[element_in_json]);
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



  M.impl.style.Category.prototype.setStyleForCategories = function(categoryStyle, string, style) {

    /*
    modificamos el estilo de una Categoria del tipo AttributeName_

    IMPORTANTE: tambien tiene que modificarse en categoryStyles_

    */

    let layer = categoryStyle.layer_;

    let categories = categoryStyle.getCategories();

    if (categories.indexOf(string) < 0) {

      M.exception('Se ha escpecificado una Categoria inexistente');

    }

    else {

      layer.setFilter(M.filter.EQUAL(categoryStyle.AttributeName_, string));

      let array_features = layer.getFeatures();

      for (var i = 0; i < array_features.length; i++) {

        array_features[i].setStyle(style);

      }

      layer.removeFilter();

    }

    categoryStyle.categoryStyles_[string] = style;

    categoryStyle.layer_ = layer;

    return categoryStyle;

  };


  M.impl.style.Category.prototype.setFacadeObj = function(obj) {

    this.facadeStyleCategory_ = obj;

  }


  M.impl.style.Category.prototype.applyToLayer = function(layer) {

    /*
    Aplicamos el categoryStyle a un "layer"
    */

    this.facadeStyleCategory_.layer_ = layer;

    var categorias_existentes = this.facadeStyleCategory_.getCategories();

    for (var categoryStyle in this.facadeStyleCategory_.categoryStyles_) {

      if (categorias_existentes.indexOf(categoryStyle) >= 0) {

        this.facadeStyleCategory_.setStyleForCategories(categoryStyle, this.facadeStyleCategory_.categoryStyles_[categoryStyle]);

      }

    }

  }


})();
