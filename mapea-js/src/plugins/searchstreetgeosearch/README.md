## Descripción

Buscador combinado de elementos espaciales a través de un servicio de Geobúsquedas y de direcciones postales a través del CDAU.

## Recursos y uso

- js: https://mapea4-sigc.juntadeandalucia.es/plugins/searchstreetgeosearch/searchstreetgeosearch-x.y.z.ol.min.js
- css: https://mapea4-sigc.juntadeandalucia.es/plugins/searchstreetgeosearch/searchstreetgeosearch-x.y.z.min.css  

Donde x.y.z representan la versión del plugin a usar según la versión de Mapea, atendiendo a la tabla de compatibilidad de versiones que se muestra más adelante.  

Configuración por defecto:
```
mapajs.addPlugin(new M.plugin.SearchstreetGeosearch({}));
```

## Tabla de compatibilidad de versiones   
En caso de utilizar un core de Mapea con número de versión explícito, debe cumplirse la siguiente relación:  

versión plugin | versión Mapea |
--- | --- |
1.0.0 | <= 4.0.0
1.1.0 | 4.1.0
2.0.1 | >= 5.0.0
