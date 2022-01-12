## Descripción

Buscador de elementos espaciales a través de un servicio de Geobúsquedas basado en la ubicación del usuario.

## Recursos y uso

- js: https://mapea4-sigc.juntadeandalucia.es/plugins/geosearchbylocation/geosearchbylocation-x.y.z.ol.min.js
- css: https://mapea4-sigc.juntadeandalucia.es/plugins/geosearchbylocation/geosearchbylocation-x-y-z.min.css  

Donde x.y.z representan la versión del plugin a usar según la versión de Mapea, atendiendo a la tabla de compatibilidad de versiones que se muestra más adelante.  

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

[JSFiddle](https://jsfiddle.net/sigcJunta/hwq8at6e/)

## Tabla de compatibilidad de versiones   
[Consulta el api resourcePlugin](https://mapea4-sigc.juntadeandalucia.es/mapea/api/actions/resourcesPlugins?name=geosearchbylocation)
