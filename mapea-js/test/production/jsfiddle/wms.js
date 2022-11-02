  // OPCION 1: En el constructor del mapa, en modo cadena u objeto
  mapajs = M.map({
    container: "map",
    layers: ["WMS*Municipios*http://www.ideandalucia.es/wms/dea100_divisiones_administrativas?*terminos_municipales*false*true",
      new M.layer.WMS({
        url: 'http://www.callejerodeandalucia.es/servicios/base/wms?',
        name: 'batimetria',
        legend: 'Batimetria',
        transparent: true,
        tiled: false
      })
    ]
  });

  // OPCION 2: Con el metodo addLayers
  mapajs.addWMS(new M.layer.WMS({
    url: 'http://www.callejerodeandalucia.es/servicios/base/wms?',
    name: 'CDAU_toponimia',
    legend: 'Toponimia',
    transparent: true,
    tiled: false
  }));
