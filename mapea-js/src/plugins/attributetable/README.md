## Descripción

Panel en el que seleccionar una de las capas vectoriales del mapa para que se listen sus elementos en forma de tabla. El panel
puede desacoplarse del lateral.

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
// numero de elementos por pagina
mapajs.addPlugin(new M.plugin.AttributeTable({
  "pages": "8"
}));

```

## Ejemplo funcional

[JSFiddle](http://jsfiddle.net/sigcJunta/t4oLhuo4/)  

## Tabla de compatibilidad de versiones   
En caso de utilizar un core de Mapea con número de versión explícito, debe cumplirse la siguiente relación:  

versión plugin | versión Mapea |
--- | --- |
1.0.0 | <= 4.1.0
1.0.1 | 4.2.0
2.0.0 | >=5.0.0
