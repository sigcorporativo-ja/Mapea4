M.proxy(true);

var mapajs = M.map({
  'container': 'mapjs',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline", ],
  "getfeatureinfo": "plain"
});



var carreteras = new M.layer.WFS({
  name: "Carreteras",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "mapb_vc1_100",
  legend: "mapb_vc1_100 - CATEGORIAS",
  getfeatureinfo: "plain",
  geometry: 'LINE',
  extract: true,
});


mapajs.addLayers(carreteras);
carreteras.on(M.evt.LOAD, () => alert('carreteras cargados'));


// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
//
//cloropleth LINE

let stylesLine = [
    new M.style.Line({
    stroke: {
      color: 'cyan',
      width: 1
    },
    fill: {
      color: "black",
      width: 2
    }
  }),
  new M.style.Line({
    stroke: {
      color: '#337CEB',
      width: 3
    },
    fill: {
      color: "black",
      width: 2
    }
  }),
  new M.style.Line({
    stroke: {
      color: '#1f58ad',
      width: 5
    },
    fill: {
      color: "black",
      width: 2
    }
  }),
  new M.style.Line({
    stroke: {
      color: '#130668',
      width: 8
    },
    fill: {
      color: "black",
      width: 2
    }
  })
];

let choroplethl = new M.style.Choropleth("length", stylesLine, M.style.quantification.JENKS());


function choropleth() {
  let tiempo_ini = calculafecha();
  carreteras.setStyle(choroplethl);
  let tiempo_fin = calculafecha();
  calculadif(tiempo_ini, tiempo_fin);

}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// //////////////////////          Category      /////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
//

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
//
// //categoryStyleLiNE
//
let naranjal = new M.style.Line({
  stroke: {
    color: 'orange',
    width: 3
  },
  fill: {
    color: "black",
    width: 2
  }
});


let amarillol = new M.style.Line({
  stroke: {
    color: 'yellow',
    width: 2
  },
  fill: {
    color: "black",
    width: 2
  }
});

let rojol = new M.style.Line({
  stroke: {
    color: 'red',
    width: 5
  },
  fill: {
    color: "black",
    width: 2
  }
});


let azull = new M.style.Line({
  stroke: {
    color: 'blue',
    width: 1
  },
  fill: {
    color: "black",
    width: 2
  }
});


let categoryStylel = new M.style.Category("jerarquia", {
  "Red básica articulante": azull,
  "Red básica estructurante": azull,
  "Red complementaria": amarillol,
  "Red complementaria metropolitana": naranjal,
  "Red de interés general del Estado": rojol,
  "Red de otros organismos": amarillol,
  "Red intercomarcal": amarillol,
  "Red provincial": naranjal
});

function categoryStyle() {
  let tiempo_ini = calculafecha();
  carreteras.setStyle(categoryStylel);
  let tiempo_fin = calculafecha();
  calculadif(tiempo_ini, tiempo_fin);
}



// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// //////////////////////          Proportional      //////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////



let proportionalline = new M.style.Proportional('length', 4, 20, new M.style.Point({
  fill: {
    color: 'yellow',
    opacity: 0.5
  },
  stroke: {
    color: 'yellow'
  }
}));




function Proportional() {
  let tiempo_ini = calculafecha();
  carreteras.setStyle(proportionalline);
  let tiempo_fin = calculafecha();
  calculadif(tiempo_ini, tiempo_fin);
}



function desX() {
  let tiempo_ini = calculafecha();
  carreteras.setStyle(naranjal);
  let tiempo_fin = calculafecha();
  calculadif(tiempo_ini, tiempo_fin);
}



function calculadif(tiempo_ini, tiempo_fin) {
  let milisegundos_total = 0;
  let minutos_total = 0;
  let segundos_total = 0;

  let minutos_ini = tiempo_ini.getMinutes();
  let segundos_ini = tiempo_ini.getSeconds();
  let milisegundos_ini = tiempo_ini.getMilliseconds();


  let minutos_fin = tiempo_fin.getMinutes();
  let segundos_fin = tiempo_fin.getSeconds();
  let milisegundos_fin = tiempo_fin.getMilliseconds();

  minutos_total = minutos_fin - minutos_ini;
  segundos_total = segundos_fin - segundos_ini;
  if (milisegundos_fin < milisegundos_ini) {
    milisegundos_total = milisegundos_fin;
  }
  else {
    milisegundos_total = milisegundos_fin - milisegundos_ini;
  }
  console.log("ha tardado: " + minutos_total + " minutos  " + segundos_total + " segundos  " + milisegundos_total + " milisegundos  ")
}


function calculafecha() {
  return new Date();
}
