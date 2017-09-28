## Descripción

Buscador de elementos espaciales a través de un servicio de Geobúsquedas basado en la ubicación del usuario.

## Recursos y uso

- js: [https://mapea4-sigc.juntadeandalucia.es/plugins/geosearchbylocation/geosearchbylocation.ol.min.js](http://mapea4-sigc.juntadeandalucia.es/plugins/geosearchbylocation/geosearchbylocation.ol.min.js)
- css: [https://mapea4-sigc.juntadeandalucia.es/plugins/geosearchbylocation/geosearchbylocation.min.css](http://mapea4-sigc.juntadeandalucia.es/plugins/geosearchbylocation/geosearchbylocation.min.css)

Configuración por defecto:
```
mapajs.addPlugin(new M.plugin.Geosearchbylocation({}));
```

Configuración detallada:
```
mapajs.addPlugin(new M.plugin.Geosearchbylocation({
"distance":"5000",
"core":"fuentesymanantiales",
"url":"http://geobusquedas-sigc.juntadeandalucia.es/geobusquedas",
"handler":"search"}));
```

## Ejemplo funcional

[JSFiddle](http://jsfiddle.net/sigcJunta/hwq8at6e/)
