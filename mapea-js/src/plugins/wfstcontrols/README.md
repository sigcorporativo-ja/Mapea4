## Descripción

Herramientas de edición WFST sobre capas vectoriales:
- *drawfeature*: Dibuja nuevos features.
- *modifyfeature*: Modifica la geometría de un feature.
- *deletefeature*: Elimina el feature seleccionado.
- *editattribute*: Edita los atributos alfanuméricos de un feature.

Los cambios no se persisten en el servidor WFST hasta que no se pulse el botón de 'guardar cambios'.

Los cambios no persistidos pueden deshacerse con el botón 'deshacer'.

## Recursos y uso

- js: https://mapea4-sigc.juntadeandalucia.es/plugins/wfstcontrols/wfstcontrols-x.y.z.ol.min.js
- css: https://mapea4-sigc.juntadeandalucia.es/plugins/wfstcontrols/wfstcontrols-x.y.z.min.css  

Donde x.y.z representan la versión del plugin a usar según la versión de Mapea, atendiendo a la tabla de compatibilidad de versiones que se muestra más adelante.  

Creación del plugin:
```
var edicionWFST = new M.plugin.WFSTControls(["drawfeature","modifyfeature","deletefeature","editattribute"],'nombreCapaWFS';
mapajs.addPlugin(edicionWFST);
```
Cambiar la capa WFS sobre la que se edita:
```
edicionWFST.setLayer('nombreNuevaCapaWFS');
```
## Ejemplo Funcional

http://jsfiddle.net/sigcJunta/6onxnaow/

## Tabla de compatibilidad de versiones   
[Consulta el api resourcePlugin](https://mapea4-sigc.juntadeandalucia.es/mapea/api/actions/resourcesPlugins?name=wfstcontrols)
