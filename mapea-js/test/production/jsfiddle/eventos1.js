var mapajs = M.map({
  container: "map",
  wmcfiles: ["mapa", "satelite", "hibrido"]
});

panelToolsExtra = new M.ui.Panel('toolsExtra', {
  "collapsible": true,
  "className": 'm-tools',
  //"collapsedButtonClass": 'g-cartografia-herramienta',
  "position": M.ui.position.TL
});
var newControl = new M.control.Location();

newControl.on(M.evt.ADDED_TO_PANEL, function() {
  console.log('Control añadido al Panel');
});
newControl.on(M.evt.ACTIVATED, function() {
  console.log('Control Activado');
});
newControl.on(M.evt.DEACTIVATED, function() {
  console.log('Control Desactivado');
});

panelToolsExtra.addControls([newControl]);

mapajs.addPanels(panelToolsExtra);

mapajs.on(M.evt.CHANGE_WMC, function() {
  console.log('Activado un contexto WMC');
});
