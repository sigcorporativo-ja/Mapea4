## Descripción

Buscador de elementos espaciales a través de un servicio de Geobúsquedas.

## Recursos y uso

- js: [http://mapea4-sigc.juntadeandalucia.es/plugins/geosearch/geosearch.ol.min.js](http://mapea4-sigc.juntadeandalucia.es/plugins/geosearch/geosearch.ol.min.js)
- css: [http://mapea4-sigc.juntadeandalucia.es/plugins/geosearch/geosearch.min.css](http://mapea4-sigc.juntadeandalucia.es/plugins/geosearch/geosearch.min.css)

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
