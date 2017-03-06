## Descripción

Buscador de vías y portales a través del Servicio de Geocodificación del Callejero Digital de Andalucía Unificado (CDAU), con autocompletado, a través de sus versiones REST JSON.
Posibilidad de limitar el ámbito de búsqueda estableciendo el parámetro 'locality' al código INE del municipio donde buscar.

## Recursos y uso

- js: [http://mapea4-sigc.juntadeandalucia.es/plugins/searchstreet/mapea.searchstreet.ol3.min.js](http://mapea4-sigc.juntadeandalucia.es/plugins/searchstreet/mapea.searchstreet.ol3.min.js)
- css: [http://mapea4-sigc.juntadeandalucia.es/plugins/searchstreet/searchstreet.min.css](http://mapea4-sigc.juntadeandalucia.es/plugins/searchstreet/searchstreet.min.css)

Configuración por defecto:
```
mapajs.addPlugin(new M.plugin.Searchstreet({}));
```

Limitar búsquedas a un municipio:
```
mapajs.addPlugin(new M.plugin.Searchstreet({
  "locality": "41091"
}));
```

## Ejemplo funcional

[JSFiddle](http://jsfiddle.net/sigcJunta/3xyz2jjq/)
