## Descripción

Herramienta de medición de áreas y distancias.  
Con clicks del ratón se establecen los vértices de la línea/área de medición.  
Manteniendo pulsado SHIFT, la línea/área de edición se dibuja a mano alzada.

## Recursos y uso

- js: https://mapea4-sigc.juntadeandalucia.es/plugins/measurebar/measurebar-x.y.x.ol.min.js
- css: https://mapea4-sigc.juntadeandalucia.es/plugins/measurebar/measurebar-x.y.z.min.css  

Donde x.y.z representan la versión del plugin a usar según la versión de Mapea, atendiendo a la tabla de compatibilidad de versiones que se muestra más adelante.  


Configuración por defecto:
```
mapajs.addPlugin(new M.plugin.Measurebar());
```
Con los parámetros opcionales:

* longitud: valor entero que indica a partir de cuántos metros pasar a kilómetros en el control de medir distancias.
* distanciaArea: coeficiente de transformación por el que multiplicar la unidad de km2 en caso de querer usar otra unidad en el control de medir áreas.
* unidadMedida: Cadena con el nombre de la unidad de medida a utilizar en vez de km2 en el control de medir áreas.

Ejemplo:
```
mapajs.addPlugin(new M.plugin.Measurebar({longitud:1000, distanciaArea:100, unidadMedida:'ha' }));
```

## Ejemplo funcional

[JSFiddle](http://jsfiddle.net/sigcJunta/7kht2bvk/)  

## Tabla de compatibilidad de versiones   
[Consulta el api resourcePlugin](https://mapea4-sigc.juntadeandalucia.es/mapea/api/actions/resourcesPlugins?name=measurebar)
