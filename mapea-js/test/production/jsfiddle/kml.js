// capa KML pasada en el constructor
/*mapajs = M.map({
				container:"map",
         controls: ["layerswitcher"],
         center: [548830,4077720],
        zoom: 8,
        layers: ["KML*capaKML*http://mapea-sigc.juntadeandalucia.es/sepim_server/api/datos/kml/1194/item/469*true"]
			});
*/

mapajs = M.map({
  container: "map",
  controls: ["layerswitcher", "mouse"],
  center: [320000, 4170000],
  zoom: 2,
  wmcfile: ["mapa"],
  layers: ["KML*Arboleda*http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml*true"]
});

function addKML() {
  //añadir la capa mediante objeto
  mapajs.addKML(new M.layer.KML({
    url: "http://mapea-sigc.juntadeandalucia.es/sepim_server/api/datos/kml/1193/item/341",
    name: "capaKML",
    extract: true
  }));
  //añadir la capa mediante cadena
  //mapajs.addKML("KML*capaKML*http://mapea-sigc.juntadeandalucia.es/sepim_server/api/datos/kml/1194/item/469*true");
}

function removeKML() {
  capasKML = mapajs.removeKML({ name: "capaKML" });

}
