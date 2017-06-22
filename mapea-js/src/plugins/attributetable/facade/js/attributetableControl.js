goog.provide('P.control.AttributeTableControl');
goog.require('goog.dom.classlist');
goog.require('goog.fx.Dragger');
goog.require('goog.dom');
goog.require('goog.style');

/**
 * @classdesc
 * Main constructor of the class. Creates a AttributeTableControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.AttributeTableControl = (function (numPages) {
  [this.facadeMap_, this.selectAllActive_, this.template_, this.areaTable_, this.layer_, this.numPages_] = [null, false, null, null, null, numPages];
  this.pages_ = {
    total: 0,
    actual: 1,
    element: 0
  };

  this.sortProperties_ = {
    active: false,
    sortBy: null,
    sortType: null
  };
  if (M.utils.isUndefined(M.impl.control.AttributeTableControl)) {
    M.exception('La implementación usada no puede crear controles AttributeTableControl');
  }
  var impl = new M.impl.control.AttributeTableControl();
  goog.base(this, impl, "AttributeTable");
});
goog.inherits(M.control.AttributeTableControl, M.Control);

/**
 * This function creates the view
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.AttributeTableControl.prototype.createView = function (map) {
  this.facadeMap_ = map;
  return new Promise(function (success, fail) {

    M.template.compile('attributetable.html', {
      'jsonp': true,
      vars: {
        layers: map.getWFS().concat(map.getKML().concat(map.getLayers().filter(function (layer) {
          return layer.type === "GeoJSON";
        })))
      }
    }).then(
      function (html) {
        let attributePanel = this.dragPanel_();
        this.template_ = html;
        this.areaTable_ = html.querySelector('div#m-attributetable-datas');
        goog.events.listen(html.querySelector('#m-attributetable-layer'), goog.events.EventType.CLICK, this.openPanel_, false, this);
        goog.events.listen(html.querySelector('#m-attributetable-select'), goog.events.EventType.MOUSEENTER, function () {
          if (M.window.WIDTH >= M.config.MOBILE_WIDTH) {
            attributePanel.setEnabled(false);
          }
        }, false, this);
        goog.events.listen(html.querySelector('#m-attributetable-select'), goog.events.EventType.MOUSELEAVE, function () {
          if (M.window.WIDTH >= M.config.MOBILE_WIDTH) {
            attributePanel.setEnabled(true);
          }
        }, false, this);
        goog.events.listen(html.querySelector('#m-attributetable-select'), goog.events.EventType.CHANGE,
          function (evt) {
            this.pages_ = {
              total: 0,
              actual: 1,
              element: 0
            };
            this.sortProperties_ = {
              active: false,
              sortBy: null,
              sortType: null
            };
            this.renderPanel_(evt.target[evt.target.selectedIndex].getAttribute("name"));
          }, false, this);
        success(html);
      }.bind(this));
  }.bind(this));
};

/**
 * This function enable the drag function
 *
 * @private
 * @function
 */
M.control.AttributeTableControl.prototype.dragPanel_ = function () {
  let templatePanel = this.getPanel().getTemplatePanel();
  let attributePanel = new goog.fx.Dragger(templatePanel);
  attributePanel.setHysteresis(50);
  attributePanel.setEnabled(false);

  let marginTop = templatePanel.getBoundingClientRect().top;

  goog.events.listen(templatePanel.querySelector('.g-cartografia-localizacion4'), goog.events.EventType.CLICK, function () {
    if (M.window.WIDTH >= M.config.MOBILE_WIDTH) {
      if (this.getPanel().isCollapsed()) {
        attributePanel.setEnabled(false);
        attributePanel.defaultAction(0, 0);
      }
      else {
        this.calculateDragLimits_(templatePanel, attributePanel, marginTop);
        attributePanel.setEnabled(true);
      }
    }
  }, false, this);

  var onresize = function () {
    this.calculateDragLimits_(templatePanel, attributePanel, marginTop);
  }.bind(this);
  window.addEventListener("resize", onresize);
  return attributePanel;
};

/**
 * This function refresh the panel info
 *
 * @private
 * @function
 * @param {HTMLElement} templatePanel- panel template
 * @param {goog.fx.Dragger} attributePanel- panel that will be dragged
 */
M.control.AttributeTableControl.prototype.calculateDragLimits_ = function (templatePanel, attributePanel, marginTop) {
  if (M.window.WIDTH >= M.config.MOBILE_WIDTH) {
    if (!M.utils.isNullOrEmpty(templatePanel)) {
      this.templatePanel = templatePanel;
    }
    if (!M.utils.isNullOrEmpty(attributePanel)) {
      this.attributePanel = attributePanel;
    }
    if (!M.utils.isNullOrEmpty(marginTop)) {
      this.marginTop = marginTop;
    }

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let tableWidth = this.templatePanel.offsetWidth;
    let tableHeight = this.templatePanel.offsetHeight;
    let limits = new goog.math.Rect(-(windowWidth - tableWidth - 50), -this.marginTop, windowWidth - tableWidth - 40, windowHeight - tableHeight);
    this.attributePanel.setLimits(limits);
  }
};

/**
 * This function refresh the panel info
 *
 * @private
 * @function
 */
M.control.AttributeTableControl.prototype.refresh_ = function () {
  this.renderPanel_();
};

/**
 * This function render to panel info
 *
 * @private
 * @function
 * @param {null|string} name- Name Layer
 * @return {Promise}
 */
M.control.AttributeTableControl.prototype.renderPanel_ = function (name) {
  if (!M.utils.isNullOrEmpty(name)) {
    this.layer_ = this.hasLayer_(name)[0];
  }
  let headerAtt = Object.keys(this.layer_.getFeatures()[0].getAttributes());
  let geomPos = headerAtt.indexOf("geometry");
  headerAtt.splice(geomPos, 1);

  let features = this.layer_.getFeatures();
  let attributes = [];
  features.forEach(function (feature) {
    let properties = Object.values(feature.getAttributes());
    if (geomPos !== -1) {
      properties.splice(geomPos, 1);
    }
    if (!M.utils.isNullOrEmpty(properties)) {
      attributes.push(properties);
    }
  });

  if (this.sortProperties_.active) {
    attributes = this.sortAttributes_(attributes, headerAtt);
  }

  return new Promise(function (success, fail) {
    M.template.compile('tableData.html', {
      'jsonp': true,
      'vars': {
        headerAtt: headerAtt,
        legend: this.layer_.legend,
        pages: this.pageResults_(attributes),
        attributes: (M.utils.isNullOrEmpty(attributes)) ? false : attributes.slice(this.pages_.element, this.pages_.element + this.numPages_)
      }
    }).then(function (html) {
      let content = this.areaTable_.querySelector("table");
      if (!M.utils.isNullOrEmpty(content)) {
        this.areaTable_.removeChild(this.areaTable_.querySelector("#m-attributetable-content-attributes"));
      }
      let notResult = this.areaTable_.querySelector(".m-attributetable-notResult");
      if (!M.utils.isNullOrEmpty(notResult)) {
        //notResult.parentElement.removeChild(notResult);
        this.areaTable_.removeChild(this.areaTable_.querySelector("#m-attributetable-content-attributes"));
      }
      this.areaTable_.appendChild(html);
      if (M.utils.isNullOrEmpty(html.querySelector('div.m-attributetable-notResult'))) {
        goog.events.listen(this.areaTable_.querySelector('#m-attributetable-next'), goog.events.EventType.CLICK, this.nextPage_, false, this);
        goog.events.listen(html.querySelector('#m-attributetable-previous'), goog.events.EventType.CLICK, this.previousPage_, false, this);
        goog.events.listen(html.querySelector('input[value=selectAll]'), goog.events.EventType.CLICK, this.selectAll, false, this);
        goog.events.listen(html.querySelector('#m-attributetable-attributes'), goog.events.EventType.CLICK, this.openPanel_, false, this);
        goog.events.listen(html.querySelector('#m-attributetable-refresh'), goog.events.EventType.CLICK, this.refresh_, false, this);
        let header = Array.prototype.slice.call(this.areaTable_.querySelector("tr").querySelectorAll("td"), 1);
        header.forEach(function (td) {
          goog.events.listen(td, goog.events.EventType.CLICK, this.sort_, false, this);
        }.bind(this));
        this.hasNext_(html);
        this.hasPrevious_(html);
      }
      success();
      this.calculateDragLimits_();
    }.bind(this));
  }.bind(this));
};

/**
 *This function is has Layer map
 *
 * @private
 * @param {array<string>| string| M.Layer} layerSearch - Array of layer names, layer name or layer instance
 * @function
 */
M.control.AttributeTableControl.prototype.hasLayer_ = function (layerSearch) {
  var layersFind = [];
  if (M.utils.isNullOrEmpty(layerSearch) || (!M.utils.isArray(layerSearch) && !M.utils.isString(layerSearch) && !(layerSearch instanceof M.Layer))) {
    M.dialog.error("El parametro para el método hasLayer no es correcto.", "Error");
    return layersFind;
  }

  if (M.utils.isString(layerSearch)) {
    this.facadeMap_.getLayers().forEach(function (lay) {
      if (lay.name == layerSearch) {
        layersFind.push(lay);
      }
    });
  }

  if (layerSearch instanceof M.Layer) {
    this.facadeMap_.getLayers().forEach(function (lay) {
      if (lay.equals(layerSearch)) {
        layersFind.push(lay);
      }
    });
  }
  if (M.utils.isArray(layerSearch)) {
    this.facadeMap_.getLayers().forEach(function (lay) {
      if (layerSearch.indexOf(lay.name) >= 0) {
        layersFind.push(lay);
      }
    });
  }
  return layersFind;
};

/**
 *This function determines whether to select or deselect all inputs
 *
 * @private
 * @function
 */
M.control.AttributeTableControl.prototype.selectAll = function () {
  this.selectAllActive_ = !this.selectAllActive_ ? true : false;
  if (this.selectAllActive_ === true) {
    this.addSelectAll_();
  }
  else {
    this.removeSelectAll_();
  }
};

/**
 * This function add check inputs
 *
 * @private
 * @function
 */
M.control.AttributeTableControl.prototype.addSelectAll_ = function () {
  let checks = this.areaTable_.querySelectorAll('input');
  checks.forEach(function (element) {
    element.setAttribute('checked', true);
  });
};

/**
 * This function remove check inputs
 *
 * @private
 * @function
 */
M.control.AttributeTableControl.prototype.removeSelectAll_ = function () {
  let checks = this.areaTable_.querySelectorAll('input');
  checks.forEach(function (element) {
    element.removeAttribute('checked');
  });
};

/**
 * This function returns the number of pages based on the number of attributes indicated
 *
 * @private
 * @function
 * @param {array<string>} attributes - attributes to page
 * @retrun {number} Returns the number of pages
 */
M.control.AttributeTableControl.prototype.pageResults_ = function (attributes) {
  this.pages_.total = Math.ceil(attributes.length / this.numPages_);
  return this.pages_;
};

/**
 * This function sets a next page if possible
 *
 * @private
 * @function
 */
M.control.AttributeTableControl.prototype.nextPage_ = function () {
  if (this.pages_.total > this.pages_.actual) {
    this.pages_.actual = this.pages_.actual + 1;
    this.pages_.element = this.pages_.element + this.numPages_;
    this.renderPanel_().then(function () {
      this.hasNext_();
      this.hasPrevious_();
    }.bind(this));
  }
};

/**
 * This function sets a previous page if possible
 *
 * @private
 * @function
 */
M.control.AttributeTableControl.prototype.previousPage_ = function () {
  if (this.pages_.total >= this.pages_.actual) {
    this.pages_.actual = this.pages_.actual - 1;
    this.pages_.element = this.pages_.element - this.numPages_;
    this.renderPanel_().then(function () {
      this.hasPrevious_();
    }.bind(this));
  }
};

/**
 * This function adds / deletes classes if you have next results
 *
 * @private
 * @function
 */
M.control.AttributeTableControl.prototype.hasNext_ = function (html) {
  let element = this.template_;
  if (!M.utils.isNullOrEmpty(html)) element = html;
  if (this.pages_.actual < this.pages_.total) {
    goog.dom.classlist.remove(element.querySelector('#m-attributetable-next'), 'm-attributetable-hidden');
  }
};

/**
 * This function adds / deletes classes if you have previous results
 *
 * @private
 * @function
 */
M.control.AttributeTableControl.prototype.hasPrevious_ = function (html) {
  let element = this.template_;
  if (!M.utils.isNullOrEmpty(html)) element = html;
  if (this.pages_.actual <= this.pages_.total && this.pages_.actual !== 1) {
    goog.dom.classlist.remove(element.querySelector('#m-attributetable-previous'), 'm-attributetable-hidden');
  }
};

/**
 * This function sets the order
 *
 * @private
 * @function
 * @param {goog.events.BrowserEvent} evt - Event
 */
M.control.AttributeTableControl.prototype.sort_ = function (evt) {
  if (this.sortProperties_.active === false) this.sortProperties_.active = true;
  if (this.sortProperties_.sortBy !== evt.target.innerHTML) {
    this.sortProperties_.sortType = "<";
  }
  else {
    this.sortProperties_.sortType = (this.sortProperties_.sortType === ">") ? "<" : ">";
  }
  this.sortProperties_.sortBy = evt.target.innerHTML;
  this.renderPanel_();
};

/**
 * This function sort attributes
 *
 * @private
 * @function
 * @param {array<string>} attributes - Attributes to sort
 * @param {array<string>} headerAtt - name attributes
 * @return {array<string>} attributes - Ordered attributes
 */
M.control.AttributeTableControl.prototype.sortAttributes_ = function (attributes, headerAtt) {
  let sortBy = this.sortProperties_.sortBy;
  let pos = headerAtt.indexOf(sortBy);
  let attributesSort = attributes.sort(function (a, b) {
    return a[pos] - b[pos];
  });
  if (this.sortProperties_.sortType === ">") {
    attributesSort = attributesSort.reverse();
  }
  return attributesSort;
};


/**
 * This function open/close the layers/table panel
 *
 * @private
 * @function
 * @param {goog.events.BrowserEvent} evt - Event
 * @api stable
 */
M.control.AttributeTableControl.prototype.openPanel_ = function (evt) {
  let id = evt.target.id;
  if (id === "m-attributetable-layer") {
    let element = this.template_.querySelector("select#m-attributetable-select");
    goog.dom.classlist.toggle(element, 'm-attributetable-hidden');
    goog.dom.classlist.toggle(element, 'show');
  }
  else if (id === "m-attributetable-attributes") {
    goog.dom.classlist.toggle(this.template_.querySelector("#m-attributetable-table"), 'm-attributetable-hidden');
    goog.dom.classlist.toggle(this.template_.querySelector("#m-attributetable-tfoot"), 'm-attributetable-hidden');
  }
  this.calculateDragLimits_();
};
