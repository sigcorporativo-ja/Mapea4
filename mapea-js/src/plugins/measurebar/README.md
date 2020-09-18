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

## Ejemplo funcional

[JSFiddle](http://jsfiddle.net/sigcJunta/7kht2bvk/)  

## Tabla de compatibilidad de versiones   
versión plugin | versión Mapea |
--- | --- |
1.0.0 | <= 4.3.0
2.0.0 | >= 5.0.0
3.0.0 | >= 5.2.0
