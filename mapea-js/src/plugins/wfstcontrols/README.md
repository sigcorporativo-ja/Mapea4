## Descripción

Herramientas de edición WFST sobre capas vectoriales:
- *drawfeature*: Dibuja nuevos features.
- *modifyfeature*: Modifica la geometría de un feature.
- *deletefeature*: Elimina el feature seleccionado.
- *editattribute*: Edita los atributos alfanuméricos de un feature.

Los cambios no se persisten en el servidor WFST hasta que no se pulse el botón de 'guardar cambios'.

Los cambios no persistidos pueden deshacerse con el botón 'deshacer'.

## Recursos y uso

- js: [https://mapea4-sigc.juntadeandalucia.es/plugins/wfstcontrols/wfstcontrols.ol.min.js](https://mapea4-sigc.juntadeandalucia.es/plugins/wfstcontrols/wfstcontrols.ol.min.js)
- css: [https://mapea4-sigc.juntadeandalucia.es/plugins/wfstcontrols/wfstcontrols.min.css](https://mapea4-sigc.juntadeandalucia.es/plugins/wfstcontrols/wfstcontrols.min.css)

Creación del plugin:
```
var edicionWFST = new M.plugin.WFSTControls(["drawfeature","modifyfeature","deletefeature","editattribute"],'nombreCapaWFS');
mapajs.addPlugin(edicionWFST);
```
Cambiar la capa WFS sobre la que se edita:
```
edicionWFST.setLayer('nombreNuevaCapaWFS');
```
## Ejemplo Funcional

http://jsfiddle.net/sigcJunta/6onxnaow/

## Tabla de compatibilidad de versiones   
En caso de utilizar un core de Mapea con número de versión explícito, debe cumplirse la siguiente relación:  

versión plugin | versión Mapea | 
--- | --- |
1.0.0 | 4.0.x 
1.1.1 | 4.1.x 
1.2.0 | 4.2.x 
