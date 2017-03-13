## Descripción

Herramientas de edición WFST sobre capas vectoriales:
- *drawfeature*: Dibuja nuevos features.
- *modifyfeature*: Modifica la geometría de un feature.
- *deletefeature*: Elimina el feature seleccionado.
- *editattribute*: Edita los atributos alfanuméricos de un feature.

Los cambios no se persisten en el servidor WFST hasta que no se pulse el botón de 'guardar cambios'.

Los cambios no persistidos pueden deshacerse con el botón 'deshacer'.

## Recursos y uso

- js: [http://mapea4-sigc.juntadeandalucia.es/plugins/wfstcontrols/mapea.wfstcontrols.ol3.min.js](http://mapea4-sigc.juntadeandalucia.es/plugins/wfstcontrols/mapea.wfstcontrols.ol3.min.js)
- css: [http://mapea4-sigc.juntadeandalucia.es/plugins/wfstcontrols/wfstcontrols.min.css](http://mapea4-sigc.juntadeandalucia.es/plugins/wfstcontrols/wfstcontrols.min.css)

Creación del plugin:
```
var edicionWFST = new M.plugin.WFSTControls(["drawfeature","modifyfeature","deletefeature","editattribute"],'nombreCapaWFS');
mapajs.addPlugin(edicionWFST);
```
Cambiar la capa WFS sobre la que se edita:
```
edicionWFST.setLayer('nombreNuevaCapaWFS');
```




