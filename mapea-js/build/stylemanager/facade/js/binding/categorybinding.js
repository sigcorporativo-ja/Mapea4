import {
  Binding
}
from './binding';
import {
  SimpleCategoryBinding
}
from './simplecategorybinding';

export class CategoryBinding extends Binding {
  constructor(html, htmlParent, styleType, styleParams, layer, controller) {
    super(html, htmlParent, styleType, styleParams, layer);
    this.styleCategories_ = {};

    this.compilePromise_.then(() => {
      let selectElement = this.getTemplate().querySelector("[data-options='attributeName']");
      selectElement.addEventListener('input', () => {
        this.renderAttributeOptions();
      });
    });
    this.selectedCategory_ = null;
    this.clickedOnTable_ = false;
    this.controller_ = controller;
  }

  /**
   * This function sets the attribute layer to the binding.
   * @function
   * @param {M.layer.Vector}
   */
  setLayer(layer) {
    this.layer_ = layer;
    this.setAttributes();
    this.refreshOptionsButtons();
    return this;
  }

  /**
   * This function shows the html view.
   * @function
   * @return {Binding}
   */
  unhide() {
    this.getTemplate().classList.remove('m-hidden');
    this.getParentTemplate().querySelector("[data-buttons-option-category]").classList.remove("m-hidden");
    return this;
  }

  /**
   * This function hides the html view.
   * @function
   * @return {Binding}
   */
  hide() {
    this.getTemplate().classList.add('m-hidden');
    this.getParentTemplate().querySelector("[data-buttons-option-category]").classList.add("m-hidden");
    return this;
  }

  /**
   * @function
   */
  addEventClickListener() {
    this.querySelectorAllForEach("td:first-child", element => {
      element.addEventListener("click", () => {
        this.toggleCategory(element.id);
      });
    });
  }

  /**
   * This function refresh the html options buttons template.
   * @function
   */
  refreshOptionsButtons() {
    let options = SimpleCategoryBinding.OPTIONS_POINT_SUBMENU;

    if (this.getGeometry() !== "point") {
      options = SimpleCategoryBinding.OPTIONS_SUBMENU;
    }

    this.addOptionsButtons(options, () => {
      this.compatibleSectionListener("icon", "form");
      this.compatibleSectionListener("form", "icon");
    });
  }

  /**
   * This function sets the layer of a binding class.
   * @function
   */
  addOptionsButtons(options, callback = null) {
    let parentHtml = this.getParentTemplate().querySelector("[data-buttons-option-category]");
    this.addTemplate('buttonoptions2.html', parentHtml, {
      buttonsParams: options
    }, (html) => {
      if (typeof callback === "function") {
        callback();
      }
      options.forEach(option => this.addEventOptionListener(option, options));
      options.forEach(option => this.addEventCheckListener(option, options));
      this.deactivateSubmenu();
      this.addEventCheckFromSubmenu();
    });
  }

  addEventCheckFromSubmenu() {
    this.querySelectorAllForEachParent("[data-buttons-option-category] input", input => {
      input.addEventListener("change", () => {
        this.controller_.selectPanel("stylecategory");
        this.controller_.setCompatibleStylePanels("stylecategory");
        this.controller_.showActivePanel("stylecategory");

      });
    });
  }

  /**
   * This function adds the listener click event that shows the compatible sections buttons.
   * @param {string}
   * @param {string}
   */
  compatibleSectionListener(optionEnable, optionDisable) {
    let input = this.querySelectorParent(`[data-buttons-option-category] input[data-apply="${optionEnable}"]`);
    if (input != null) {
      input.addEventListener("change", () => {
        if (input.checked === true) {
          this.disableOption(optionDisable);
        }
        else {
          this.enableOption(optionDisable);
        }
      });
    }
  }

  /**
   * This function disable a button options passed by paramenter.
   * @function
   * @param {string}
   */
  disableOption(option) {
    let input = this.getParentTemplate().querySelector(`[data-buttons-option-category] input[data-apply="${option}"]`);
    let clickable = this.getParentTemplate().querySelector(`[data-buttons-option-category] input[data-apply="${option}"]+label`);
    this.hideOptionSection(option);
    if (clickable != null) {
      clickable.classList.add("check-inactive");
      clickable.classList.add("check-selected");
      clickable.classList.remove("m-option-active");
    }
    if (input != null) {
      input.disabled = true;
      input.checked = false;
    }
  }

  /**
   * This function enable a button options passed by paramenter.
   * @function
   * @param {string}
   */
  enableOption(option) {
    let input = this.getParentTemplate().querySelector(`[data-buttons-option-category] input[data-apply="${option}"]`);
    let clickable = this.getParentTemplate().querySelector(`[data-buttons-option-category] input[data-apply="${option}"]+label`);
    if (clickable != null) {
      clickable.classList.remove("check-inactive");
    }
    if (input != null) {
      input.disabled = false;
    }
  }

  /**
   * TODO
   * @const
   */
  static get OPTIONS_POINT_SUBMENU() {
    return [{
      id: "fill",
      name: "Relleno"
     }, {
      id: "stroke",
      name: "Trazo"
     }, {
      id: "label",
      name: "Etiqueta"
      }, {
      id: "icon",
      name: "Icono"
    }, {
      id: "form",
      name: "Fuente"
    }];
  }

  /**
   * TODO
   * @const
   */
  static get OPTIONS_SUBMENU() {
    return [{
      id: "fill",
      name: "Relleno"
     }, {
      id: "stroke",
      name: "Trazo"
     }, {
      id: "label",
      name: "Etiqueta"
      }];
  }

  /**
   * TODO
   * @function
   */
  toggleCategory(id) {
    Object.values(this.styleCategories_).forEach(simpleBinding => {
      simpleBinding.hide();
    });
    if (this.clickedOnTable_ === false) {
      this.activateSubmenu();
      this.clickedOnTable_ = true;
    }
    let simpleBinding = this.styleCategories_[id];
    this.selectedCategory_ = simpleBinding;
    let options = this.selectedCategory_.getOptions();
    this.checkInput("fill", options["fill"]);
    this.checkInput("stroke", options["stroke"]);
    this.checkInput("label", options["label"]);
    this.checkInput("form", options["form"]);
    this.checkInput("icon", options["icon"]);
    if (simpleBinding != null) {
      simpleBinding.unhide();
      simpleBinding.showCompatibleSections();
    }
    Object.values(this.styleCategories_).forEach(simpleBinding => {
      simpleBinding.setLayer(this.layer_, false);
    });
  }

  /**
   * TODO
   * @function
   */
  renderAttributeOptions(flag = false) {
    let selectButton = this.querySelector("[data-options='attributeName']");
    let value = selectButton.value;
    if (this.style_ != null && flag === true) {
      value = this.style_.getAttributeName();
    }
    let attributeExists = !M.utils.isNullOrEmpty(value);
    let values = this.getAllValuesAttribute(value)
      .filter(value => !(M.utils.isNullOrEmpty(value)))
      .map(value => {
        return {
          name: value
        };
      }).splice(0, CategoryBinding.MAXNUMBER_CATEGORIES);

    this.removeCategories();
    this.createCategories(values);
    this.addCategoriesView(values, attributeExists);
  }

  /**
   * TODO
   * @function
   */
  addCategoriesView(values, attributeExists) {
    let parent = this.querySelector("[data-options='values']");
    this.compileTemplate('categorystyles.html', {
      values: values,
      attributeExists: attributeExists
    }).then(html => {
      parent.innerHTML = html.innerHTML;
      Object.values(this.styleCategories_).forEach(binding => {
        binding.refreshTemplate();
        binding.hide();
      });
      this.addEventClickListener();
      this.addEventSelectedListener();
      this.addLegendListenerAll();
    });
  }

  /**
   * TODO
   * @function
   */
  createCategories(values) {
    let categoriesStyle = this.style_ == null ? null : this.style_.getCategories();
    values.forEach(value => {
      let categoryStyle = categoriesStyle == null ? null : categoriesStyle[value.name];
      this.styleCategories_[value.name] = new SimpleCategoryBinding('simpleoptions.html', this.htmlTemplate_, "stylesimple", categoryStyle, this.layer_, this);
      this.styleCategories_[value.name].compilePromise_.then(() => {
        this.styleCategories_[value.name].refreshLegend(value.name, true);
      });
      this.setGeometryCategory(this.styleCategories_[value.name]);

    });

    let otherCategory = categoriesStyle == null ? null : categoriesStyle["other"];
    this.styleCategories_["other"] = new SimpleCategoryBinding('stylesimple.html', this.htmlTemplate_, "stylesimple", otherCategory, this.layer_, this);
    this.styleCategories_["other"].compilePromise_.then(() => {
      this.styleCategories_["other"].refreshLegend("other", true);
    });
    this.setGeometryCategory(this.styleCategories_["other"]);
  }

  /**
   * TODO
   * @function
   */
  removeCategories() {
    Object.values(this.styleCategories_).forEach(binding => binding.destroy());
    this.styleCategories_ = {};
  }

  /**
   * TODO
   * @function
   */
  setAttributes() {
    let layer = this.layer_;
    if (layer instanceof M.layer.Vector) {
      let selected = this.style_ == null ? "" : this.style_.getAttributeName();
      let attributeNames = this.filterAttributesFeature("string").map(element => {
        return {
          name: element,
          selected: selected
        };
      });
      let selectElement = this.getTemplate().querySelector("[data-options='attributeName']");
      this.compileTemplate("attributestemplate.html", {
        attributes: attributeNames
      }).then(html => {
        selectElement.innerHTML = html.innerHTML;
        this.renderAttributeOptions(true);
        if (attributeNames.length === 0) {
          this.deactivateBinding();
        }
        else {
          this.activateBinding();
        }
      });
    }
  }

  /**
   * TODO
   * @function
   */
  setGeometryCategory(category) {
    let geometry = this.layer_.getFeatures()[0].getGeometry().type;
    switch (geometry) {
      case "Point":
      case "MultiPoint":
        category.geometry_ = 'point';
        break;
      case "LineString":
      case "MultiLineString":
        category.geometry_ = 'line';
        break;
      case "Polygon":
      case "MultiPolygon":
        category.geometry_ = 'polygon';
        break;
      default:
        M.dialog.error('Geometria no soportada', 'Error');
    }
  }

  /**
   * @function
   */
  showSection(option) {
    this.querySelectorAllForEach(`[data-id='${option}']`, element => {
      element.classList.remove("m-hidden");
    });
  }

  /**
   * @function
   */
  hideSection(option) {
    this.querySelectorAllForEach(`[data-id='${option}']`, element => {
      element.classList.add("m-hidden");
    });
  }

  /**
   * @function
   */
  addEventOptionListener(option, options) {
    let element = this.querySelectorParent(`[data-buttons-option-category] [data-label='${option.id}']`);
    let input = this.querySelectorParent(`[data-buttons-option-category] input[data-apply='${option.id}']`);
    element.addEventListener("click", () => {
      if (input.disabled === false) {
        options.forEach(option => this.hideSection(option.id));
        this.showSection(option.id);
        this.activeSection(option.id);
      }
    });
  }

  /**
   * @function
   */
  addEventCheckListener(option, options) {
    let element = this.querySelectorParent(`[data-buttons-option-category] input[data-apply='${option.id}']`);
    element.addEventListener("click", () => {
      this.checkSection(option.id, options);
    });
  }

  /**
   * @function
   */
  activeSection(id) {
    let selector = this.querySelectorParent(`[data-buttons-option-category] [data-selector='${id}']`);
    this.querySelectorAllForEachParent(`[data-buttons-option-category] [data-selector]`, element => {
      element.classList.remove("check-active");
      element.classList.add("check-selected");
    });
    selector.classList.remove("check-selected");
    selector.classList.add("check-active");
  }

  /**
   * @function
   */
  setSelectedRow(id) {
    this.querySelectorAllForEach("td:first-child", element => {
      element.classList.remove("m-table-cell-selected");
    });
    this.querySelector(`[id='${id}']`).classList.add("m-table-cell-selected");
  }

  addEventSelectedListener() {
    this.querySelectorAllForEach("td:first-child", element => {
      let id = element.id;
      element.addEventListener("click", () => this.setSelectedRow(id));
    });
  }


  /**
   * @function
   */
  checkSection(id, options) {
    let element = this.querySelectorParent(`[data-buttons-option-category] #cat-${id}`);
    if (element.checked === true) {
      if (this.selectedCategory_ != null) {
        this.selectedCategory_[id] = true;
      }
      options.forEach(option => this.hideSection(option.id));
      this.showSection(id);
      this.activeSection(id);
    }
    else {
      if (this.selectedCategory_ != null) {
        this.selectedCategory_[id] = false;
      }
    }
    this.selectedCategory_.refreshLegend();
  }

  /**
   * @function
   */
  checkInput(id, flag) {
    let element = this.querySelectorParent(`[data-buttons-option-category] #cat-${id}`);
    if (element != null) {
      element.checked = flag;
    }
  }

  /**
   * @function
   */
  activateSubmenu() {
    this.querySelectorAllForEachParent("[data-buttons-option-category] input", input => input.disabled = false);
    this.querySelectorAllForEachParent("[data-buttons-option-category] label[data-selector]", label => {
      label.classList.remove("check-inactive");
      label.classList.add("check-selected");
    });
  }

  /**
   * @function
   */
  deactivateSubmenu() {
    this.querySelectorAllForEachParent("[data-buttons-option-category] input", input => input.disabled = true);
    this.querySelectorAllForEachParent("[data-buttons-option-category] label[data-selector]", label => {
      label.classList.add("check-inactive");
      label.classList.remove("check-selected");
    });
  }

  /**
   * This function sets the geometry of binding class.
   * @function
   * @return {string}
   */
  getGeometry() {
    let geometry = this.layer_.getFeatures()[0].getGeometry().type;
    switch (geometry) {
      case "Point":
      case "MultiPoint":
        geometry = 'point';
        break;
      case "LineString":
      case "MultiLineString":
        geometry = 'line';
        break;
      case "Polygon":
      case "MultiPolygon":
        geometry = 'polygon';
        break;
      default:
        M.dialog.error('Geometria no soportada', 'Error');
    }
    return geometry;
  }

  /**
   * TODO
   * @function
   */
  getAllValuesAttribute(attribute) {
    let features = this.layer_.getFeatures();
    return features.map(feature => feature.getAttribute(attribute)).filter((elem, pos, arr) => arr.indexOf(elem) == pos);
  }

  /**
   * TODO
   * @function
   */
  generateOptions() {
    let styleOptions = {};
    let styleCategories = {};
    styleOptions["attributeName"] = this.querySelector("[data-options='attributeName']").value;

    Object.keys(this.styleCategories_).forEach(value => {
      let simpleBinding = this.styleCategories_[value];
      let options = this.styleCategories_[value].generateOptions().options;
      let fill = simpleBinding.fill;
      let stroke = simpleBinding.stroke;
      let icon = simpleBinding.icon || simpleBinding.form;
      let label = simpleBinding.label;
      let valuesFill = options.fill != null ? Object.values(options.fill).filter(value => value != null) : [];
      if (fill || stroke || icon || label) {
        styleCategories[value] = this.styleCategories_[value].style;
      }
    }, this);

    styleOptions["options"] = styleCategories;

    return styleOptions;
  }

  /**
   * TODO
   * @function
   */
  generateStyle() {
    let opts = this.generateOptions();
    let style = null;
    if (opts.attributeName !== "") {
      style = new M.style.Category(opts.attributeName, opts.options);
    }
    return style;
  }

  /**
   * This function adds an event listener for all HTMLInputElement and HTMLSelectElement.
   * @function
   * @param {function}
   */
  addLegendListenerAll() {
    Object.keys(this.styleCategories_).forEach(category => {
      let binding = this.styleCategories_[category];
      binding.imgId = category;
      binding.addLegendListener();
    });
  }

  /**
   * TODO
   * @const
   */
  static get MAXNUMBER_CATEGORIES() {
    return 30;
  }
}
