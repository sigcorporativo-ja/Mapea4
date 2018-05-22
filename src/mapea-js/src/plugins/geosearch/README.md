## Descripción

Buscador de elementos espaciales a través de un servicio de Geobúsquedas.

## Recursos y uso

- js: [https://mapea4-sigc.juntadeandalucia.es/plugins/geosearch/geosearch.ol.min.js](https://mapea4-sigc.juntadeandalucia.es/plugins/geosearch/geosearch.ol.min.js)
- css: [https://mapea4-sigc.juntadeandalucia.es/plugins/geosearch/geosearch.min.css](https://mapea4-sigc.juntadeandalucia.es/plugins/geosearch/geosearch.min.css)

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
En caso de utilizar un core de Mapea con número de versión explícito, debe cumplirse la siguiente relación:  

versión plugin | versión Mapea |
--- | --- |
1.0.0 | <= 4.0.0
1.1.0 | >= 4.1.0
