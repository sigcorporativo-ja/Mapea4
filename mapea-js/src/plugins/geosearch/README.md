## Descripción

Buscador de elementos espaciales a través de un servicio de Geobúsquedas.

## Recursos y uso

- js: https://mapea4-sigc.juntadeandalucia.es/plugins/geosearch/geosearch-x.y.z.ol.min.js
- css: https://mapea4-sigc.juntadeandalucia.es/plugins/geosearch/geosearch-x.y.z.min.css  

Donde x.y.z representan la versión del plugin a usar según la versión de Mapea, atendiendo a la tabla de compatibilidad de versiones que se muestra más adelante.  

Configuración por defecto:
```
mapajs.addPlugin(new M.plugin.Geosearch({}));
```

Configuración detallada:
```
mapajs.addPlugin(new M.plugin.Geosearch({
  "core": "sigc",
  "url": "http://geobusquedas-sigc.juntadeandalucia.es/",
  "handler": "/search"
}));
```

## Ejemplo funcional

[JSFiddle](http://jsfiddle.net/sigcJunta/5sczf5cp/)

## Tabla de compatibilidad de versiones   
[Consulta el api resourcePlugin](https://mapea4-sigc.juntadeandalucia.es/mapea/api/actions/resourcesPlugins?name=geosearch) 
