import { map as Mmap } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import { isNullOrEmpty } from 'facade/js/util/Utils';
import * as dialog from 'facade/js/dialog';
import Heatmap from 'facade/js/style/Heatmap';

const mapjs = Mmap({
  container: 'map',
});

const ayuntamientos = new WFS({
  url: 'https://clientes.guadaltel.es/desarrollo/geossigc/wfs?',
  namespace: 'mapea',
  name: 'assda_sv10_ayuntamiento_point_indicadores',
  legend: 'Prestaciones - Ámbito municipal',
  getfeatureinfo: 'plain',
  geometry: 'POINT',
  extract: true,
});

mapjs.addLayers(ayuntamientos);

const getValue = (field) => {
  return document.getElementById(field).value;
};

const domEls = {
  builder: document.querySelector('#style-builder'),
  toggleHandler: document.querySelector('#style-builder > .display-handler'),
  showButtonText: document.querySelector('#style-builder > .display-handler > span[data-role=\'show\']'),
  hideButtonText: document.querySelector('#style-builder > .display-handler > span[data-role=\'hide\']'),
  addColor: document.querySelector('#add-color'),
  removeColor: document.querySelector('#remove-color'),
  radioButton1: document.querySelectorAll('[name=gradient]')[0],
  radioButton2: document.querySelectorAll('[name=gradient]')[1],
  gradient: document.querySelector('.gradient'),
};

const getGradients = () => {
  const colors = document.querySelectorAll('.color>input');
  let values = [];
  colors.forEach(f => values.push(f.value));
  if (domEls.radioButton1.checked) {
    values = null;
  }
  return values;
};

const colorVarTemplate = (number) => {
  const template = `<div class='color'>
    <label for=''>Color ${number}</label>
    <input type='color'>
  </div>`;
  return template;
};

const eventHandlers = {
  toggleStyleBuilder() {
    if (domEls.builder.hasAttribute('opened')) {
      domEls.builder.removeAttribute('opened');
      domEls.showButtonText.className = '';
      domEls.hideButtonText.className = 'hidden';
    } else {
      domEls.builder.setAttribute('opened', true);
      domEls.hideButtonText.className = '';
      domEls.showButtonText.className = 'hidden';
    }
  },
  setStyle() {
    const attribute = getValue('attribute');
    if (isNullOrEmpty(attribute)) {
      dialog.error('El atributo no puede ser vacio', 'Error');
    }
    const blursize = getValue('blursize');
    const radius = getValue('radius');
    const opacity = getValue('opacity') || 1;
    const gradient = getGradients();
    const heatmap = new Heatmap(attribute, {
      blur: blursize,
      radius,
      gradient,
    }, {
      opacity,
    });
    ayuntamientos.setStyle(heatmap);
    eventHandlers.toggleStyleBuilder();
  },
  addColor: () => {
    const colors = document.querySelector('.colors');
    const childCount = colors.childElementCount + 1;
    colors.innerHTML = `${colors.innerHTML}${colorVarTemplate(childCount)}`;
  },
  removeColor: () => {
    const colors = document.querySelector('.colors');
    const lastChild = colors.lastElementChild;
    if (lastChild != null) {
      colors.removeChild(lastChild);
    }
  },
  clearStyle: () => ayuntamientos.clearStyle(),
};


domEls.addColor.onclick = eventHandlers.addColor;
domEls.removeColor.onclick = eventHandlers.removeColor;


domEls.radioButton1.onclick = () => {
  domEls.gradient.classList.add('hidden');
};

domEls.radioButton2.onclick = () => {
  domEls.gradient.classList.remove('hidden');
};

window.eventHandlers = eventHandlers;

window.mapjs = mapjs;
