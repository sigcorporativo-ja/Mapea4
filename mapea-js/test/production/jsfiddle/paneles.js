var mapajs = M.map({
  container: "map",
  wmcfiles: ["mapa"],
  layers: ["WFS*Provincias*http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?*tematicos:Provincias*MPOLYGON"]
});

/***crear un panel nuevo ***/
var panelToolsExtra = new M.ui.Panel('toolsExtra', {
  "collapsible": true,
  "className": 'm-tools',
  //"collapsedButtonClass": 'g-cartografia-herramienta',
  "position": M.ui.position.TR
});
var newControl = new M.control.Location();
panelToolsExtra.addControls(newControl);
mapajs.addPanels(panelToolsExtra);


/***añadir control a un panel existente**/
//por defecto, el plugin WFST crea un panel (edit) para añadir sus controles
mapajs.addPlugin(new M.plugin.WFSTControls(["drawfeature"]));
var newControl = new M.control.Location();
//obtenemos el panel existente y le insertamos en nuevo control
mapajs.getPanels('edit')[0].addControls([newControl]);

// funcion para abrir el panel y cambiarle el color
function abrirPanel() {
  panelToolsExtra.getTemplatePanel().style.backgroundColor = "red";
  panelToolsExtra.open();
}
