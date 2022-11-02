// En constructor
mapajs = M.map({
  container: 'map',
  controls: ["layerswitcher"],
  wmcfiles: ['http://www.callejerodeandalucia.es/wmc/context_cdau_callejero.xml*Mapa']
});

// En el mapa
var miWmc = new M.layer.WMC({
  url: 'http://www.callejerodeandalucia.es/wmc/context_cdau_satelite.xml',
  name: 'Satélite'
});
mapajs.addWMC(miWmc);
