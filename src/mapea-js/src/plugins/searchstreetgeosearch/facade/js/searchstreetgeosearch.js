goog.provide('P.plugin.SearchstreetGeosearch');
goog.require('P.plugin.Autocomplete');

(function() {
  /**
   * @classdesc Main facade plugin object. This class creates a plugin
   *            object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Mx.parameters.SearchstreetGeosearch} parameters - parameters SearchstreetGeosearch
   * @api stable
   */
  M.plugin.SearchstreetGeosearch = (function(parameters) {
    parameters = (parameters || {});

    /**
     * Parameters SearchstreetGeosearch
     *
     * @private
     * @type {Mx.parameters.SearchstreetGeosearch}
     */
    this.parameters_ = parameters;

    /**
     * Name plugin
     *
     * @public
     * @type {string}
     * @api stable
     */
    this.name = "searchstreetgeosearch";

    /**
     * Facade of the map
     *
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * SearchstreetGeosearch control
     *
     * @private
     * @type {M.control.SearchstreetGeosearch}
     */
    this.control_ = null;

    /**
     * INE code to specify the search
     *
     * @private
     * @type {number}
     */
    this.locality_ = parameters.locality;

    goog.base(this);
  });
  goog.inherits(M.plugin.SearchstreetGeosearch, M.Plugin);

  /**
   * @inheritdoc
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the control
   * @api stable
   */
  M.plugin.SearchstreetGeosearch.prototype.addTo = function(map) {
    this.map_ = map;
    var this_ = this;
    this.control_ = new M.control.SearchstreetGeosearch(this.parameters_);

    goog.dom.classlist.add(map._areasContainer.getElementsByClassName("m-top m-right")[0],
      "top-extra");

    this.control_.on(M.evt.ADDED_TO_MAP, function() {
      this.fire(M.evt.ADDED_TO_MAP);

      // Checks if the received INE code is correct.
      var comCodIne = M.utils.addParameters(M.config.SEARCHSTREET_URLCOMPROBARINE, {
        codigo: this.locality_
      });
      M.remote.get(comCodIne).then(
        function(response) {
          var results = JSON.parse(response.text);
          if (M.utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
            this_.locality_ = "";
          }
          var autocompletador = new M.plugin.Autocomplete({
            'locality': this_.locality_,
            'target': this_.control_.getInput(),
            'html': this_.control_.getHtml()
          });
          this_.map_.addPlugin(autocompletador);
        });
    }, this);
    this.panel_ = new M.ui.Panel('SearchstreetGeosearch', {
      'collapsible': true,
      'className': 'm-geosearch',
      'position': M.ui.position.TL,
      'tooltip': 'Buscador de calles y geobúsquedas'
    });
    this.panel_.addControls(this.control_);
    this.map_.addPanels(this.panel_);
  };

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  M.plugin.SearchstreetGeosearch.prototype.destroy = function() {
    this.map_.removeControls([this.control_]);
    this.name = null;
    this.parameters_ = null;
    this.map_ = null;
    this.control_ = null;
    this.locality_ = null;
  };

  /**
   * This function compare if pluging recieved by param is instance of M.plugin.SearchstreetGeosearch
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  M.plugin.SearchstreetGeosearch.prototype.equals = function(plugin) {
    if (plugin instanceof M.plugin.SearchstreetGeosearch) {
      return true;
    }
    else {
      return false;
    }
  };
})();
