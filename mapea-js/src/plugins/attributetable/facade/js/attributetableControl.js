import Draggabilly from 'draggabilly';
import AttributeTableControlImpl from '../../impl/ol/js/attributetableControl.js';
import attributetableHTML from '../../templates/attributetable.html';
import tableDataHTML from '../../templates/tableData.html';

export default class AttributeTableControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a AttributeTableControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(numPages) {
    const impl = new AttributeTableControlImpl();

    super(impl, 'attributetableControl');

    [this.facadeMap_, this.selectAllActive_, this.template_,
      this.areaTable_, this.layer_, this.numPages_,
      this.draggable_,
    ] = [null, false, null, null, null, numPages, null];
    this.pages_ = {
      total: 0,
      actual: 1,
      element: 0,
    };

    this.sortProperties_ = {
      active: false,
      sortBy: null,
      sortType: null,
    };

    if (M.utils.isUndefined(AttributeTableControlImpl)) {
      M.exception('La implementación usada no puede crear controles AttributeTableControl');
    }
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    this.facadeMap_ = map;
    const options = {
      jsonp: true,
      vars: {
        layers: map.getWFS().concat(map.getKML()
          .concat(map.getMVT().concat(map.getLayers().filter((layer) => {
            return layer.type === 'GeoJSON';
          })))),
      },
    };
    const html = M.template.compileSync(attributetableHTML, options);
    /* Draggable */
    const panel = this.getPanel();
    if (!M.utils.isNullOrEmpty(panel)) {
      const htmlPanel = panel.getTemplatePanel();
      htmlPanel.querySelector('.g-cartografia-localizacion4').addEventListener('click', () => {
        if (this.getPanel().isCollapsed()) {
          htmlPanel.style.removeProperty('left');
          htmlPanel.style.removeProperty('top');
        }

        if (M.window.WIDTH >= M.config.MOBILE_WIDTH) {
          if (this.getPanel().isCollapsed()) {
            this.deactivateDraggable_();
          } else {
            this.activateDraggable_();
          }
        }
      });
      this.template_ = html;
      this.areaTable_ = html.querySelector('div#m-attributetable-datas');
      html.querySelector('#m-attributetable-layer').addEventListener('click', this.openPanel_.bind(this));
      html.querySelector('#m-attributetable-select').addEventListener('change', (evt) => {
        this.pages_ = {
          total: 0,
          actual: 1,
          element: 0,
        };
        this.sortProperties_ = {
          active: false,
          sortBy: null,
          sortType: null,
        };
        this.renderPanel_(evt.target[evt.target.selectedIndex].getAttribute('name'));
      });
    }
    return html;
  }

  /**
   * This function refresh the panel info
   *
   * @private
   * @function
   */
  refresh_() {
    this.renderPanel_();
  }

  /**
   * This function render to panel info
   *
   * @private
   * @function
   * @param {null|string} name- Name Layer
   * @return {HTMLElement}
   */
  renderPanel_(name) {
    if (!M.utils.isNullOrEmpty(name)) {
      this.layer_ = this.hasLayer_(name)[0];
    }
    let headerAtt;
    let attributes = [];
    const features = this.layer_.getFeatures();
    if (!M.utils.isNullOrEmpty(features)) {
      headerAtt = Object.keys(features[0].getAttributes());
      features.forEach((feature) => {
        const properties = Object.values(feature.getAttributes());
        if (!M.utils.isNullOrEmpty(properties)) {
          attributes.push(properties);
        }
      });
      if (this.sortProperties_.active) {
        attributes = this.sortAttributes_(attributes, headerAtt);
      }
    }
    let params = {};
    if (!M.utils.isUndefined(headerAtt)) {
      params = {
        headerAtt,
        legend: this.layer_.legend,
        pages: this.pageResults_(attributes),
        attributes: (M.utils.isNullOrEmpty(attributes)) ? false : attributes
          .slice(this.pages_.element, this.pages_.element + this.numPages_),
      };
    }
    const options = { jsonp: true, vars: params };
    const html = M.template.compileSync(tableDataHTML, options);
    const content = this.areaTable_.querySelector('table');
    if (!M.utils.isNullOrEmpty(content)) {
      this.areaTable_.removeChild(this.areaTable_.querySelector('#m-attributetable-content-attributes'));
    }
    const notResult = this.areaTable_.querySelector('.m-attributetable-notResult');
    if (!M.utils.isNullOrEmpty(notResult)) {
      // notResult.parentElement.removeChild(notResult);
      const parent = this.areaTable_.querySelector('#m-attributetable-content-attributes').parentElement;
      parent.removeChild(this.areaTable_.querySelector('#m-attributetable-content-attributes'));
    }
    this.areaTable_.appendChild(html);
    if (M.utils.isNullOrEmpty(html.querySelector('div.m-attributetable-notResult'))) {
      this.areaTable_.querySelector('#m-attributetable-next').addEventListener('click', this.nextPage_.bind(this));
      html.querySelector('#m-attributetable-previous').addEventListener('click', this.previousPage_.bind(this));
      html.querySelector('input[value=selectAll]').addEventListener('click', this.selectAll.bind(this));
      html.querySelector('#m-attributetable-attributes').addEventListener('click', this.openPanel_.bind(this));
      html.querySelector('#m-attributetable-refresh').addEventListener('click', this.refresh_.bind(this));
      const header = Array.prototype.slice.call(this.areaTable_.querySelector('tr').querySelectorAll('td'), 1);
      header.forEach((td) => {
        td.addEventListener('click', this.sort_.bind(this));
      });
      this.hasNext_(html);
      this.hasPrevious_(html);
    } else {
      html.querySelector('#m-attributetable-refresh').addEventListener('click', this.refresh_.bind(this));
    }
    this.rePosition_();
    return html;
  }

  /**
   *This functi;on is has Layer map
   *
   * @private
   * @param {array<string>| string| M.Layer} layerSearch -
        Array of layer names, layer name or layer instance
   * @function
   */
  hasLayer_(layerSearch) {
    const layersFind = [];
    if (M.utils.isNullOrEmpty(layerSearch) || (!M.utils.isArray(layerSearch) &&
        !M.utils.isString(layerSearch) && !(layerSearch instanceof M.Layer))) {
      M.dialog.error('El parametro para el método hasLayer no es correcto.', 'Error');
      return layersFind;
    }

    if (M.utils.isString(layerSearch)) {
      this.facadeMap_.getLayers().forEach((lay) => {
        if (lay.name === layerSearch) {
          layersFind.push(lay);
        }
      });
    }

    if (layerSearch instanceof M.Layer) {
      this.facadeMap_.getLayers().forEach((lay) => {
        if (lay.equals(layerSearch)) {
          layersFind.push(lay);
        }
      });
    }
    if (M.utils.isArray(layerSearch)) {
      this.facadeMap_.getLayers().forEach((lay) => {
        if (layerSearch.indexOf(lay.name) >= 0) {
          layersFind.push(lay);
        }
      });
    }
    return layersFind;
  }

  /**
   *This function determines whether to select or deselect all inputs
   *
   * @private
   * @function
   */
  selectAll() {
    this.selectAllActive_ = !this.selectAllActive_;
    if (this.selectAllActive_ === true) {
      this.addSelectAll_();
    } else {
      this.removeSelectAll_();
    }
  }

  /**
   * This function add check inputs
   *
   * @private
   * @function
   */
  addSelectAll_() {
    const checks = this.areaTable_.querySelectorAll('input');
    checks.forEach((element) => {
      element.setAttribute('checked', true);
    });
  }

  /**
   * This function remove check inputs
   *
   * @private
   * @function
   */
  removeSelectAll_() {
    const checks = this.areaTable_.querySelectorAll('input');
    checks.forEach((element) => {
      element.removeAttribute('checked');
    });
  }

  /**
   * This function returns the number of pages based on the number of attributes indicated
   *
   * @private
   * @function
   * @param {array<string>} attributes - attributes to page
   * @retrun {number} Returns the number of pages
   */
  pageResults_(attributes) {
    this.pages_.total = Math.ceil(attributes.length / this.numPages_);
    return this.pages_;
  }

  /**
   * This function sets a next page if possible
   *
   * @private
   * @function
   */
  nextPage_() {
    if (this.pages_.total > this.pages_.actual) {
      this.pages_.actual = this.pages_.actual + 1;
      this.pages_.element = this.pages_.element + this.numPages_;
      this.renderPanel_();
      if (this.renderPanel_()) {
        this.hasNext_();
        this.hasPrevious_();
      }
    }
  }

  /**
   * This function sets a previous page if possible
   *
   * @private
   * @function
   */
  previousPage_() {
    if (this.pages_.total >= this.pages_.actual) {
      this.pages_.actual = this.pages_.actual - 1;
      this.pages_.element = this.pages_.element - this.numPages_;
      this.renderPanel_();
      if (this.renderPanel_()) {
        this.hasPrevious_();
      }
    }
  }
  /**
   * This function adds / deletes classes if you have next results
   *
   * @private
   * @function
   */
  hasNext_(html) {
    let element = this.template_;
    if (!M.utils.isNullOrEmpty(html)) element = html;
    if (this.pages_.actual < this.pages_.total) {
      element.querySelector('#m-attributetable-next').classList.remove('m-attributetable-hidden');
    }
  }

  /**
   * This function adds / deletes classes if you have previous results
   *
   * @private
   * @function
   */
  hasPrevious_(html) {
    let element = this.template_;
    if (!M.utils.isNullOrEmpty(html)) element = html;
    if (this.pages_.actual <= this.pages_.total && this.pages_.actual !== 1) {
      element.querySelector('#m-attributetable-previous').classList.remove('m-attributetable-hidden');
    }
  }

  /**
   * This function sets the order
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Event
   */
  sort_(evt) {
    if (this.sortProperties_.active === false) this.sortProperties_.active = true;
    if (this.sortProperties_.sortBy !== evt.target.innerHTML) {
      this.sortProperties_.sortType = '<';
    } else {
      this.sortProperties_.sortType = (this.sortProperties_.sortType === '>') ? '<' : '>';
    }
    this.sortProperties_.sortBy = evt.target.innerHTML;
    this.renderPanel_();
  }

  /**
   * This function sort attributes
   *
   * @private
   * @function
   * @param {array<string>} attributes - Attributes to sort
   * @param {array<string>} headerAtt - name attributes
   * @return {array<string>} attributes - Ordered attributes
   */
  sortAttributes_(attributes, headerAtt) {
    const sortBy = this.sortProperties_.sortBy;
    const pos = headerAtt.indexOf(sortBy);
    let attributesSort = attributes.sort((a, b) => {
      return a[pos] - b[pos];
    });
    if (this.sortProperties_.sortType === '>') {
      attributesSort = attributesSort.reverse();
    }
    return attributesSort;
  }


  /**
   * This function open/close the layers/table panel
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Event
   * @api stable
   */
  openPanel_(evt) {
    const id = evt.target.id;
    if (id === 'm-attributetable-layer') {
      const element = this.template_.querySelector('select#m-attributetable-select');
      element.classList.toggle('m-attributetable-hidden');
      element.classList.toggle('show');
    } else if (id === 'm-attributetable-attributes') {
      this.template_.querySelector('#m-attributetable-table').classList.toggle('m-attributetable-hidden');
      this.template_.querySelector('#m-attributetable-tfoot').classList.toggle('m-attributetable-hidden');
    }
    this.rePosition_();
  }


  /**
   * This function activates the draggable function to the plugin
   *
   * @private
   * @function
   * @api stable
   */
  activateDraggable_() {
    if (M.utils.isNullOrEmpty(this.draggable_)) {
      const panel = this.getPanel().getTemplatePanel();
      this.draggable_ = new Draggabilly(panel, {
        containment: '.m-mapea-container',
        handle: '.m-attributetable-container>div.m-attributetable-panel div.title',
      });
    }
    this.draggable_.enable();
  }


  /**
   * This function deactivates the draggable function to the plugin
   *
   * @private
   * @function
   * @api stable
   */
  deactivateDraggable_() {
    const panel = document.querySelector('.m-attributetable');
    panel.style.position = 'relative';
    this.draggable_.disable();
  }


  /**
   * This function adjusts the panel position
   *
   * @private
   * @function
   * @api stable
   */
  rePosition_() {
    const panel = this.getPanel().getTemplatePanel();
    if (parseInt(panel.style.left.replace('px', ''), 10) + panel.clientWidth > document.querySelector('.m-mapea-container').clientWidth) {
      panel.style.left = `${document.querySelector('.m-mapea-container').clientWidth - panel.clientWidth}px`;
    }
    if (parseInt(panel.style.top.replace('px', ''), 10) + panel.clientHeight > document.querySelector('.m-mapea-container').clientHeight) {
      panel.style.top = `${document.querySelector('.m-mapea-container').clientHeight - panel.clientHeight - 10}px`;
    }
  }

  /**
   * This function return if this is equals to control parameter
   * @public
   * @api
   */
  equals(control) {
    return control instanceof AttributeTableControl;
  }
}
