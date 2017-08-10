goog.provide('M.style.Category');
goog.require('M.Style');




(function() {



  M.style.Category = (function(AttributeName_, categoryStyles_) {

    this.AttributeName_ = AttributeName_;

    this.layer = null;

    this.categoryStyles_ = categoryStyles_;

    var impl = new M.impl.style.Category(AttributeName_, categoryStyles_);

    goog.base(this, impl);

  });


  goog.inherits(M.style.Category, M.Style);



  M.style.Category.prototype.apply_ = function(layer) {

    /*
    Aplicamos el categoryStyle a un "layer"
    */

    this.layer_ = layer;

    categorias_existentes = this.getCategories();



    for (var categoryStyle in this.categoryStyles_) {



      if (categorias_existentes.indexOf(categoryStyle) >= 0) {



        this.setStyleForCategories(categoryStyle, this.categoryStyles_[categoryStyle]);

      }

    }

  };





  M.style.Category.prototype.getAttributeName = function() {

    //devolvemos el AttributeName_

    return this.AttributeName_;

  };



  M.style.Category.prototype.setAttributeName = function(newAttributeName) {

    //modificamos el AttributeName_

    this.AttributeName_ = newAttributeName;

    return this;

  };




  M.style.Category.prototype.getCategories = function() {

    /*devolvemos los valores correspondientes dado un tipo que vendra
    dado por AttributeName_*/

    let array_value = [];

    try {

      let layer = this.layer_;

      let array_features = layer.getFeatures(true);

      for (var i = 0; i < array_features.length; i++) {

        let json_var = array_features[i].getAttributes();

        for (var element_in_json in json_var) {

          if (element_in_json == this.AttributeName_) {

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






  M.style.Category.prototype.getStyleForCategories = function(string) {

    /*
    Nos devolvera el estilo de una Categoria del tipo AttributeName_
    */

    let layer = this.layer_;

    let categories = this.getCategories(layer);

    if (categories.indexOf(string) < 0) {

      M.exception('Se ha escpecificado una Categoria inexistente');

    }

    else {

      layer.setFilter(M.filter.EQUAL(this.AttributeName_, string));

      feat = layer.getFeatures();

      let first = feat[0];

      layer.removeFilter();

      return first.style_;

    }

  };






  M.style.Category.prototype.setStyleForCategories = function(string, style) {


    /*
    modificamos el estilo de una Categoria del tipo AttributeName_

    IMPORTANTE: tambien tiene que modificarse en categoryStyles_

    */

    let layer = this.layer_;

    let categories = this.getCategories(layer);

    if (categories.indexOf(string) < 0) {

      M.exception('Se ha escpecificado una Categoria inexistente');

    }

    else {

      layer.setFilter(M.filter.EQUAL(this.AttributeName_, string));

      array_features = layer.getFeatures();

      for (var i = 0; i < array_features.length; i++) {

        array_features[i].setStyle(style);

      }

      layer.removeFilter();

    }

    this.categoryStyles_[string] = style;

    this.layer_ = layer;

    return this;

  }






  M.style.Category.prototype.serialize = function() {};


})();
