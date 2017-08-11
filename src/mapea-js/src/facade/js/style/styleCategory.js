goog.provide('M.style.Category');
goog.require('M.Style');




(function() {



  M.style.Category = (function(AttributeName_, categoryStyles_) {

    this.AttributeName_ = AttributeName_;

    this.layer = null;

    this.categoryStyles_ = categoryStyles_;

    var impl = new M.impl.style.Category(AttributeName_, categoryStyles_);

    goog.base(this, this, impl);

  });


  goog.inherits(M.style.Category, M.Style);



  M.style.Category.prototype.apply_ = function(layer) {

    this.layer_ = layer;

    return this.getImpl().applyToLayer(layer);

  };





  M.style.Category.prototype.getAttributeName = function() {

    return this.getImpl().getAttributeName(this);

  };



  M.style.Category.prototype.setAttributeName = function(newAttributeName) {

    return this.getImpl().setAttributeName(this, newAttributeName);

  };




  M.style.Category.prototype.getCategories = function() {

    return this.getImpl().getCategories(this);

  };






  M.style.Category.prototype.getStyleForCategories = function(string) {

    return this.getImpl().getStyleForCategories(this, string);

  };






  M.style.Category.prototype.setStyleForCategories = function(string, style) {

    return this.getImpl().setStyleForCategories(this, string, style);

  };






  M.style.Category.prototype.serialize = function() {};


})();
