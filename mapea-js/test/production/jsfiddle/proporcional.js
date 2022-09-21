let mapajs = M.map({
  container: "map",
  controls: ['layerswitcher', 'overviewmap'],
  wmcfiles: ["mapa"]
});

let indicadoresMun = new M.layer.WFS({
  legend: "Municipios Indicadores",
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/wfs?",
  namespace: "tematicos",
  name: "ind_mun_simp",
  geometry: 'POLYGON',
});

mapajs.addLayers(indicadoresMun);

function aplicar() {

  let sizeMin = document.getElementById('min').value;
  let sizeMax = document.getElementById('max').value;

  let proportionalVector = new M.style.Proportional('tot_ibi', sizeMin, sizeMax, new M.style.Point({
    fill: {
      color: document.getElementById('relleno').value
    },
    stroke: {
      color: document.getElementById('borde').value,
      width: 2
    }
  }));

  //M.style.Proportional.SCALE_PROPORTION = 20;
  let proportionalIcon = new M.style.Proportional('tot_ibi', sizeMin, sizeMax, new M.style.Point({
    icon: {
      src: 'https://cdn0.iconfinder.com/data/icons/citycons/150/Citycons_building-128.png',
      opacity: 0.8,
      anchor: [0.5, 0.5],
      rotate: false,
      snaptopixel: true,
    }
  }));

  let proportionalSymbol = new M.style.Proportional('tot_ibi', sizeMin, sizeMax, new M.style.Point({
    icon: {
      form: M.style.form.LOZENGE,
      gradient: true,
      fontsize: 0.8,
      radius: 20,
      color: 'blue',
      fill: '#8A0829',
      gradientcolor: '#088A85'
    }
  }));

  switch (document.querySelector('input[name="tipo"]:checked').value) {
    case 'simple':
      indicadoresMun.setStyle(proportionalVector);
      break;
    case 'icono':
      indicadoresMun.setStyle(proportionalIcon);
      break;
    case 'symbol':
      indicadoresMun.setStyle(proportionalSymbol);
      break;
  }

}
