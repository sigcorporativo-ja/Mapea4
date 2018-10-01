export class Binding {

  constructor(html, htmlParent, styleType, style, layer) {
    this.htmlParent_ = htmlParent;
    this.htmlTemplate_ = null;
    this.html_ = html;
    this.activated_ = true;
    this.selected_ = false;
    this.disabled_ = false;
    this.layer_ = layer;
    this.activateButton_ = htmlParent.querySelector(`[data-role="botonera"] [data-flap="${styleType}"]`);
    this.selectButton_ = htmlParent.querySelector(`[data-role="botonera"] [data-checkbox="${styleType}"]`);
    this.style_ = style;
    this.styleType_ = styleType;
    this.compilePromise_ = this.initializeView(this.html_, this.htmlParent_);
  }

  /**
   * This function compile with handlerbars a html template.
   *
   * @function
   * @return {Promise}
   */
  compileTemplate(htmlName, options) {
    return M.template.compile(htmlName, {
      'jsop': true,
      vars: options
    });
  }

  /**
   * This function compile with handlerbars a html template.
   *
   * @function
   * @return {Promise}
   */
  getCompilePromise() {
    return this.compilePromise_;
  }

  /**
   * This function compile with handlebars a html template.
   *
   * @function
   */
  initializeView(htmlName, htmlParent) {
    let optsTemplate = this.getOptionsTemplate();
    return this.compileTemplate(htmlName, optsTemplate).then((html) => {
      htmlParent.appendChild(html);
      this.htmlTemplate_ = html;
    });
  }

  /**
   * @function
   * @protected
   */
  getOptionsTemplate() {}

  /**
   * This function add the html template to html parent.
   *
   * @function
   */
  addTemplate(htmlName, htmlParent, options, callback = null) {
    this.compileTemplate(htmlName, options).then((html) => {
      htmlParent.innerHTML = html.innerHTML;
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  /**
   * This function compile with handlerbars a html template.
   *
   * @function
   */
  appendTemplate(htmlName, htmlParent, options, callback = null) {
    this.compileTemplate(htmlName, options).then((html) => {
      htmlParent.appendChild(html);
      if (typeof callback === 'function') {
        callback();
      }
    });
  }


  /**
   * This function generates the options style from his own html form.
   *
   * @function
   * @api stable
   */
  generateOptions() {
    let styleOpts = {};
    styleOpts["options"] = {};
    styleOpts["ranges"] = {};

    // styleOpts section
    this.querySelectorAllForEach('[data-options]', element => {
      let prop = element.dataset["options"];
      let value = element.value;
      if (element.type === "checkbox") {
        value = element.checked;
      }

      if (element.type === "number") {
        value = parseFloat(value);
      }

      styleOpts[prop] = value;
    });

    // styleOpts.options section
    this.querySelectorAllForEach("[data-style-options]", element => {
      let prop = element.dataset["styleOptions"];
      let value = element.value;
      if (element.type === "checkbox") {
        value = element.checked;
      }

      if (element.type === "number") {
        value = parseFloat(value);
      }

      styleOpts["options"][prop] = value;
    });

    // Array option section (eg: gradient heatmap )
    this.querySelectorAllForEach("[data-array-options]", element => {
      let prop = element.dataset["arrayOptions"];
      let value = element.value;

      if (!M.utils.isArray(styleOpts["options"][prop])) {
        styleOpts["options"][prop] = [];
      }

      styleOpts["options"][prop].push(value);

    });

    // Ranges cluster section
    this.querySelectorAllForEach("[data-ranges-id]", element => {
      let id = element.dataset["rangesId"];
      if (styleOpts["ranges"][id] == undefined) {
        styleOpts["ranges"][id] = {};
      }
      let path = element.dataset["rangesOptions"];
      let value = element.value;

      if (element.type === "number") {
        value = parseFloat(value);
      }

      Binding.createObj(styleOpts["ranges"][id], path, value);
    });

    return styleOpts;
  }

  /**
   * This function activate or deactivate the binding class.
   * @function
   * @param {boolean}
   */
  setActivated(flag) {
    this.activated_ = flag;
    if (flag === true) {
      this.activateButton_.classList.replace('check-selected', 'check-active');
      this.unhide();
    }

    if (flag === false) {
      this.activateButton_.classList.replace('check-active', 'check-selected');
      this.hide();
    }
  }

  /**
   * This function select or unselect the binding class.
   * @function
   * @param {boolean}
   */
  setSelected(flag) {
    this.selected_ = flag;
    this.selectButton_.checked = flag;
  }

  /**
   * This function disable or enable the binding class.
   * @function
   * @param {boolean}
   */
  setDisabled(flag) {
    this.disabled_ = flag;
    this.selectButton_.disabled = flag;
    if (flag === true) {
      this.activateButton_.classList.add('check-inactive');
      this.setSelected(!flag);
      this.setActivated(!flag);
      this.hide();
    }

    if (flag === false) {
      this.activateButton_.classList.remove('check-inactive');
    }
  }

  /**
   * This function hides the html view.
   * @function
   * @return {Binding}
   */
  hide() {
    this.getTemplate().classList.add('m-hidden');
    return this;
  }

  /**
   * This function shows the html view.
   * @function
   * @return {Binding}
   */
  unhide() {
    this.getTemplate().classList.remove('m-hidden');
    return this;
  }

  /**
   * This function gets the html template of binding class.
   * @function
   * @param {boolean}
   */
  getTemplate() {
    return this.htmlTemplate_;
  }

  /**
   * This function gets the html template of binding class.
   * @function
   * @param {boolean}
   */
  getParentTemplate() {
    return this.htmlParent_;
  }

  /**
   * TODO
   * @function
   * @param {string}
   */
  querySelector(selector) {
    return this.getTemplate().querySelector(selector);
  }

  /**
   * TODO
   * @function
   * @param {string}
   */
  querySelectorAll(selector) {
    return this.getTemplate().querySelectorAll(selector);
  }

  /**
   * TODO
   * @function
   * @param {string}
   */
  querySelectorAllForEach(selector, callback, scope = undefined) {
    Array.prototype.forEach.apply(this.querySelectorAll(selector), [callback, scope]);
  }

  /**
   * TODO
   * @function
   * @param {string}
   */
  querySelectorAllMap(selector, callback, scope = undefined) {
    return Array.prototype.map.apply(this.querySelectorAll(selector), [callback, scope]);
  }

  /**
   * TODO
   * @function
   * @param {string}
   */
  querySelectorParent(selector) {
    return this.getParentTemplate().querySelector(selector);
  }

  /**
   * TODO
   * @function
   * @param {string}
   */
  querySelectorAllParent(selector) {
    return this.getParentTemplate().querySelectorAll(selector);
  }

  /**
   * TODO
   * @function
   * @param {string}
   */
  querySelectorAllForEachParent(selector, callback, scope = undefined) {
    Array.prototype.forEach.apply(this.querySelectorAllParent(selector), [callback, scope]);
  }

  /**
   * TODO
   * @function
   * @param {string}
   */
  querySelectorAllMapParent(selector, callback, scope = undefined) {
    return Array.prototype.map.apply(this.querySelectorAllParent(selector), [callback, scope]);
  }

  /**
   * This function sets the layer of a binding class.
   * @function
   * @param {M.layer.Vector}
   * @returns {Binding}
   */
  setLayer(layer) {
    this.layer_ = layer;
    return this;
  }

  /**
   * This function sets the layer of a binding class.
   * @function
   * @param {M.layer.Vector}
   * @returns {Binding}
   */
  getActivateButton() {
    return this.activateButton_;
  }

  /**
   * This function sets the layer of a binding class.
   * @function
   * @param {M.layer.Vector}
   * @returns {Binding}
   */
  getSelectButton() {
    return this.selectButton_;
  }

  /**
   * This function sets the layer of a binding class.
   * @function
   * @param {M.layer.Vector}
   * @returns {Binding}
   */
  setIntegerAttributes() {
    let layer = this.layer_;
    if (layer instanceof M.layer.Vector) {
      let attributeNames = this.filterAttributesFeature("number").map(element => {
        return {
          name: element
        };
      });
      let selectElement = this.getTemplate().querySelector("[data-options='attributeName']");
      this.compileTemplate("attributestemplate.html", {
        attributes: attributeNames
      }).then(html => {
        selectElement.innerHTML = html.innerHTML;
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
   * This function sets the layer of a binding class.
   * @function
   * @param {M.layer.Vector}
   * @returns {Binding}
   */
  filterAttributesFeature(type) {
    let attributes = this.getFeaturesAttributes();
    let attributeNames = Object.keys(attributes);
    switch (type) {
      case "string":
        attributeNames = attributeNames.filter(element => isNaN(parseFloat(attributes[element])));
        break;
      case "number":
        attributeNames = attributeNames.filter(element => !isNaN(parseFloat(attributes[element])));
        break;
      default:
    }
    return attributeNames;
  }


  /**
   * This function sets the layer of a binding class.
   * @function
   * @param {M.layer.Vector}
   * @returns {Binding}
   */
  getFeaturesAttributes() {
    return this.layer_.getFeatures()[0].getAttributes();
  }

  /**
   * This function sets the layer of a binding class.
   * @function
   * @param {M.layer.Vector}
   * @returns {Binding}
   */
  hideAllOptionsSections() {
    this.querySelectorAllForEach(".styles-row", element => {
      element.classList.add("m-hidden");
    });
  }

  /**
   * This function sets the layer of a binding class.
   * @function
   * @param {M.layer.Vector}
   * @returns {Binding}
   */
  hideOptionSection(option) {
    let optionsSection = this.querySelector(`[data-id=${option}]`);
    optionsSection.classList.add("m-hidden");
  }

  /**
   * This function sets the layer of a binding class.
   * @function
   * @param {M.layer.Vector}
   * @returns {Binding}
   */
  showOptionSection(option) {
    let optionsSection = this.querySelector(`[data-id=${option}]`);
    optionsSection.classList.remove("m-hidden");
  }

  /**
   * This function adds an event listener for all HTMLInputElement and HTMLSelectElement.
   * @function
   * @param {function}
   */
  addInputListener(callback) {
    this.querySelectorAllForEach("input", element => {
      element.addEventListener("change", callback);
    });

    this.querySelectorAllForEach("select", element => {
      element.addEventListener("change", callback);
    });
  }

  /**
   * This function deactivate all html options of a binding class.
   * @function
   */
  deactivateBinding() {
    this.querySelectorAllForEach("input,select:not([data-options='attributeName']),label,span,.subtitle", element => {
      element.classList.add("m-hidden");
    });

    this.querySelector("[data-options='attributeName']").disabled = true;
    let option = document.createElement("option");
    option.value = "";
    option.innerText = "No existen atributos";
    this.querySelector("[data-options='attributeName']").add(option);
    this.querySelector("span").classList.remove("m-hidden");
  }

  /**
   * This function deactivate all html options of a binding class.
   * @function
   */
  activateBinding() {
    this.querySelectorAllForEach("input,select:not([data-options='attributeName']),label,span,.subtitle", element => {
      element.classList.remove("m-hidden");
    });

    this.querySelector("[data-options='attributeName']").disabled = false;
  }

  /**
   * @function
   */
  destroy() {
    this.htmlParent_.removeChild(this.htmlTemplate_);
  }

  /**
   * This function
   * @static
   * @function
   * @param {object}
   * @param {string}
   * @param {number|string|object}
   */
  static createObj(obj, path, value) {
    let keys = M.utils.isArray(path) ? path : path.split('.');
    let keyLength = keys.length;
    let key = keys[0];
    if (keyLength === 1) { // base case
      if (M.utils.isArray(value)) {
        value = [...value];
      }
      else if (M.utils.isObject(value)) {
        value = Object.assign({}, value);
      }
      obj[key] = value;
    }
    else if (keyLength > 1) { // recursive case
      if (M.utils.isNullOrEmpty(obj[key])) {
        obj[key] = {};
      }
      Binding.createObj(obj[key], keys.slice(1, keyLength), value);
    }
  }
}
