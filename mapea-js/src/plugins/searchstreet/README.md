## Descripción

Buscador de vías y portales a través del Servicio de Geocodificación del Callejero Digital de Andalucía Unificado (CDAU), con autocompletado, a través de sus versiones REST JSON.
Posibilidad de limitar el ámbito de búsqueda estableciendo el parámetro 'locality' al código INE del municipio donde buscar.

## Recursos y uso

- js: https://mapea4-sigc.juntadeandalucia.es/plugins/searchstreet/searchstreet-x.y.z.ol.min.js
- css: https://mapea4-sigc.juntadeandalucia.es/plugins/searchstreet/searchstreet-x.y.z.min.css  

Donde x.y.z representan la versión del plugin a usar según la versión de Mapea, atendiendo a la tabla de compatibilidad de versiones que se muestra más adelante.  

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
versión plugin | versión Mapea |
--- | --- |
1.0.0 | <= 4.0.0
1.1.0 | 4.1.0
2.0.1 | >= 5.0.0
