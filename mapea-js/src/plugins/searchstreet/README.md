## Descripción

Buscador de vías y portales a través del Servicio de Geocodificación del Callejero Digital de Andalucía Unificado (CDAU), con autocompletado, a través de sus versiones REST JSON.
Posibilidad de limitar el ámbito de búsqueda estableciendo el parámetro 'locality' al código INE del municipio donde buscar.

## Recursos y uso

- js: [https://mapea4-sigc.juntadeandalucia.es/plugins/searchstreet/searchstreet.ol.min.js](https://mapea4-sigc.juntadeandalucia.es/plugins/searchstreet/searchstreet.ol.min.js)
- css: [https://mapea4-sigc.juntadeandalucia.es/plugins/searchstreet/searchstreet.min.css](https://mapea4-sigc.juntadeandalucia.es/plugins/searchstreet/searchstreet.min.css)

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

## Tabla de compatibilidad de versiones   
En caso de utilizar un core de Mapea con número de versión explícito, debe cumplirse la siguiente relación:  

versión plugin | versión Mapea | 
--- | --- |
1.0.0 | <= 4.0.0 
1.1.0 | >= 4.1.0
