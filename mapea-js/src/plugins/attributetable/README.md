## Descripción

Panel en el que seleccionar una de las capas vectoriales del mapa para que se listen sus elementos en forma de tabla. El panel
puede desacoplarse del lateral. Permite la selección de elementos, que son resaltados visualmente en el mapa, y el zoom a los 
elementos seleccionados.

## Recursos y uso

- js: https://mapea4-sigc.juntadeandalucia.es/plugins/attributetable/attributetable-x.y.z.ol.min.js
- css: https://mapea4-sigc.juntadeandalucia.es/plugins/attributetable/attributetable-x.y.z.min.css

Donde x.y.z representan la versión del plugin a usar según la versión de Mapea, atendiendo a la tabla de compatibilidad de versiones que se muestra más adelante.

Configuración por defecto:
```javascript
mapajs.addPlugin(new M.plugin.AttributeTable({}));
```

Configuración detallada:
```javascript
// numero de elementos por pagina y estilo de seleccion
mapajs.addPlugin(new M.plugin.AttributeTable({
  pages: 8,
  selectedStyle: estiloSeleccion
}));
```

## Ejemplo funcional

[JSFiddle](http://jsfiddle.net/sigcJunta/t4oLhuo4/)  

## Tabla de compatibilidad de versiones   
[Consulta el api resourcePlugin](https://mapea4-sigc.juntadeandalucia.es/mapea/api/actions/resourcesPlugins?name=attributetable) 