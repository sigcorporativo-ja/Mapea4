import {
  Binding
}
from './binding';

export class ChartBinding extends Binding {
  constructor(html, htmlParent, styleType, styleParams, layer) {
    super(html, htmlParent, styleType, styleParams, layer);
    this.variables_ = [];
    if (styleParams != null) {
      this.variables_ = styleParams.getOptions().variables.map(variable => variable.attribute);
    }
    this.compilePromise_.then(() => {
      this.addKeyEnterListener();
      this.addRenderCompatibleListener();
      this.addAttributeListener();
      this.refreshVariables();
    });
  }

  setLayer(layer) {
    this.layer_ = layer;
    this.renderAttributes();
    return this;
  }
  /**
   * @function
   * @param {string}
   */
  addAttribute(attr) {
    this.variables_.push(attr);
  }

  /**
   * @function
   * @param {string}
   */
  removeAttribute(attr) {
    this.variables_ = this.variables_.filter(attr2 => attr2 != attr);
  }

  addAttributeFromParamenter(attribute) {
    this.addAttribute(attribute);
    this.addVariableTemplate(attribute);
    this.refreshPagination();
  }

  /**
   * @function
   */
  addAttributeFromInput() {
    let inputAttribute = this.querySelector("[data-attribute]");
    let attribute = inputAttribute.value;
    if (attribute !== "") {
      if (this.variables_.includes(attribute)) {
        M.dialog.info("El atributo ya ha sido agregado.", "Nombre de variable repetida");
      }
      else {
        let allowedAttrs = this.layer_.getFeatures()[0].getAttributes();
        if (allowedAttrs.hasOwnProperty(attribute)) {
          this.addAttributeFromParamenter(attribute);
        }
        else {
          M.dialog.info("No existe ninguna variable con ese nombre.", "Nombre de variable incorrecto.");
        }
      }
    }
    else {
      M.dialog.info("No está permitido introducir una cadena vacía.", "Nombre de variable vacía.");

    }
  }

  /**
   * @function
   */
  removeAttributeFromInput() {
    let inputAttribute = this.querySelector("[data-attribute]");
    let attribute = inputAttribute.value;
    this.removeAttribute(attribute);
  }

  /**
   * @function
   */
  addAttributeListener() {
    let button = this.querySelector("[data-add]");
    button.addEventListener("click", () => {
      this.addAttributeFromInput();
    });
  }

  /**
   * @function
   */
  addKeyEnterListener() {
    let inputElement = this.querySelector("[data-attribute]");
    inputElement.addEventListener("keydown", this.keyEnterListener());
  }

  /**
   * @function
   */
  keyEnterListener() {
    return (evt) => {
      if (evt.key === "Enter") {
        this.addAttributeFromInput();
      }
    };
  }

  /**
   * @function
   */
  addVariableTemplate(attribute) {
    let parent = this.querySelector("[data-variables]");
    let variables = [];
    let variable;
    let legend = ChartBinding.DEFAULT_OPTIONS_VARIABLE.legend;
    let label = ChartBinding.DEFAULT_OPTIONS_VARIABLE.label;
    if (this.style_ != null) {
      variables = this.style_.getOptions().variables;
    }
    if (variables.length !== 0) {
      variable = variables.find(variable => variable.attribute === attribute);
      if (variable != null) {
        legend = variable.legend;
        label = variable.label;
      }
    }
    this.compileTemplate("variablechart.html", {
      attribute: attribute,
      legend: legend,
      label: label
    }).then(html => {
      parent.append(...html.children);
      let removeElement = this.querySelector(`[data-remove="${attribute}"]`);
      if (removeElement != null) {
        this.addRemoveVarSectionListener(removeElement);
        this.addLabelOptionListener(attribute);
      }
    });
  }

  /**
   * @function
   */
  removeVariableTemplate(selector) {
    let parent = this.querySelector(".m-chart-variables");
    this.querySelectorAllForEach(`.m-chart-variables [data-delete="${selector}"]`, element => {
      parent.removeChild(element);
    });
  }

  /**
   * @function
   */
  removeVariableSection(attr) {
    this.removeAttribute(attr);
    this.removeVariableTemplate(attr);
    this.refreshPagination();
  }

  /**
   * @function
   */
  refreshVariables() {
    let variables = [...this.variables_];
    variables.forEach(variable => {
      this.removeVariableSection(variable);
      this.addAttributeFromParamenter(variable);
    });
  }

  /**
   * @function
   */
  addRemoveVarSectionListener(element) {
    element.addEventListener("click", this.removeVarSectionListener(element).bind(this));
  }

  /**
   * @function
   */
  removeVarSectionListener(element) {
    let attribute = element.dataset["remove"];
    return () => {
      this.removeVariableSection(attribute);
    };
  }

  /**
   * @function
   */
  refreshPagination() {
    let options = this.variables_.map((attribute, index) => {
      let option = {
        attribute: attribute,
        number: index + 1
      };
      return option;
    });

    let parent = this.querySelector("[data-pagination]");
    this.compileTemplate("paginationchart.html", {
      ranges: options
    }).then(html => {
      parent.innerHTML = html.innerHTML;
      this.addClickPagerListener();
      let firstAttr = this.variables_.slice(-1)[0];
      if (firstAttr != null) {
        this.showVariableSection(firstAttr)();
      }
    });
  }

  /**
   * @function
   */
  addClickPagerListener() {
    this.querySelectorAllForEach("[data-page-selector]", element => {
      let selector = element.dataset["pageSelector"];
      element.addEventListener("click", this.showVariableSection(selector).bind(this));
    });
  }

  /**
   * @function
   */
  clickPagerListener(selector) {
    this.querySelectorAllForEach("[data-target]", element => {
      element.classList.add("m-hidden");
    });

    this.querySelectorAllForEach(`[data-target="${selector}"]`, element => {
      element.classList.remove("m-hidden");
    });
  }

  /**
   * @function
   */
  activePageListener(selector) {
    this.querySelectorAllForEach("[data-page-selector]", element2 => {
      element2.classList.remove("m-page-active");
    });
    let element = this.querySelector(`[data-page-selector="${selector}"]`);
    if (element != null) {
      element.classList.add("m-page-active");
    }
  }

  /**
   * @function
   */
  showVariableSection(selector) {
    return () => {
      this.clickPagerListener(selector);
      this.activePageListener(selector);
    };
  }

  /**
   * @function
   */
  renderCompatibleOpts(type) {
    this.querySelectorAllForEach("[data-type]", element => {
      let types = element.dataset["type"].split(",");
      if (!types.includes(type)) {
        element.classList.add("m-hidden");
      }
      else {
        element.classList.remove("m-hidden");
      }
    });
  }

  /**
   * @function
   */
  renderCompatibleListener() {
    let selectElement = this.querySelector("[data-style-options='type']");
    let selectType = selectElement.selectedOptions[0].value;
    this.renderCompatibleOpts(selectType);
  }

  /**
   * @function
   */
  addRenderCompatibleListener() {
    let selectElement = this.querySelector("[data-style-options='type']");
    selectElement.addEventListener("change", this.renderCompatibleListener.bind(this));
  }

  /**
   * @function
   */
  renderAttributes() {
    let attributes = this.layer_.getFeatures()[0].getAttributes();
    let keys = Object.keys(attributes);
    keys = keys.filter(key => {
      return !isNaN(parseFloat(attributes[key]));
    });

    this.compileTemplate('attributeschart.html', {
      attributes: keys
    }).then(html => {
      this.querySelector("[data-attribute]").innerHTML = html.innerHTML;
    });
  }

  /**
   * @function
   */
  toggleLabelOptions(name) {
    let element = this.querySelector(`[data-label-target="${name}"]`);
    let classList = element.classList;
    let result = classList.contains("m-hidden") === true ? classList.remove("m-hidden") : classList.add("m-hidden");
  }

  /**
   * @function
   */
  addLabelOptionListener(name) {
    let checkbox = this.querySelector(`[data-variable-option="${name}.labelshow"]`);
    checkbox.addEventListener("change", () => {
      this.toggleLabelOptions(name);
    });
  }

  /**
   * @function
   */
  generateVariableOptions() {
    let obj = {};

    this.querySelectorAllForEach("input[data-variable-option]", element => {
      let path = element.dataset["variableOption"];
      let value = element.value;
      if (element.type === "number") {
        value = parseFloat(value);
      }

      if (element.type === "checkbox") {
        value = element.checked;
      }
      Binding.createObj(obj, path, value);
    });

    let optVars = this.variables_.map(attribute => {
      obj[attribute]["attribute"] = attribute;

      return obj[attribute];
    });

    optVars = optVars.map(option => {
      // options text label, show the % of data
      if (option.labelshow === true) {
        option["label"]["text"] = (value, values) => {
          return Math.round(value / values.reduce((tot, curr) => tot + curr) * 100) + '%';
        };
      }
      // delete every option label
      else {
        option["label"] = undefined;
      }
      return option;
    });

    return optVars;
  }

  /**
   * @function
   */
  generateStyle() {
    let options = this.generateOptions().options;
    let varsOpts = this.generateVariableOptions();
    let scheme = M.style.chart.schemes[options.scheme];

    let style = new M.style.Chart({
      type: options.type,
      scheme: scheme,
      radius: options.radius,
      donutRadio: options.donutRadius,
      offsetX: options.offsetX,
      offsetY: options.offsetY,
      variables: varsOpts.length === 0 ? [new M.style.chart.Variable({
        attribute: "default"
      })] : varsOpts,
      fill3DColor: options.fill3DColor
    });

    return style;
  }

  /**
   * @function
   *
   */
  getOptionsTemplate() {
    let options = ChartBinding.DEFAULT_OPTIONS_STYLE;
    if (this.style_ != null) {
      options = this.style_.getOptions();
      options["scheme"] = this.getSchemeName();
      // parse variable options

    }
    return options;
  }

  /**
   * @function
   */
  getSchemeName() {

    const arrayEquals = (array, array2) => {
      let include = false;
      let include2 = false;
      if (array instanceof Array && array2 instanceof Array) {
        include = array.every((element, index) => element === array2[index]);
        include2 = array2.every((element, index) => element === array[index]);
      }
      return include && include2;
    };

    if (this.style_ != null) {
      let scheme = this.style_.getOptions()["scheme"];
      let schemesChart = M.style.chart.schemes;
      name = Object.keys(schemesChart).find(name => arrayEquals(scheme, schemesChart[name]));

    }
    return name;
  }
}

/**
 * @const
 */
ChartBinding.DEFAULT_OPTIONS_STYLE = {
  donutRatio: 4,
  fill3DColor: "#ff00f0",
  offsetX: 0,
  offsetY: 0,
  radius: 12,
  rotateWithView: false,
  scheme: ["#ffa500", "blue", "red", "green", "cyan", "magenta", "yellow", "#0f0"],
  type: "pie"
};

/**
 * @const
 */
ChartBinding.DEFAULT_OPTIONS_VARIABLE = {
  legend: "Ejemplo de leyenda",
  label: {
    fill: "#ff0000",
    scale: 1,
    text: (value, values) => {
      return Math.round(value / values.reduce((tot, curr) => tot + curr) * 100) + '%';
    },
    radiusIncrement: 2,
    stroke: {
      color: "#000000",
      width: 1
    }
  }
};
