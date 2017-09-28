## Descripción

Plugin de impresión a través del servicio Geoprint. Las capacidades del mismo definen las opciones de impresión disponibles: dpi,
formatos y plantillas. En función de la plantilla elegida, en el construtctor del plugin habrá que incluir los parámetros que dicha 
plantilla necesite. Las plantillas 'imagen apaisada' e 'imagen cuadrada' no necesitan parámetros.

## Recursos y uso

- js: [https://mapea4-sigc.juntadeandalucia.es/plugins/printer/printer.ol.min.js](https://mapea4-sigc.juntadeandalucia.es/plugins/printer/printer.ol.min.js)
- css: [https://mapea4-sigc.juntadeandalucia.es/plugins/printer/printer.min.css](https://mapea4-sigc.juntadeandalucia.es/plugins/printer/printer.min.css)

Configuración por defecto sin parámetros:
```
mapajs.addPlugin(new M.plugin.Printer());
```

## Ejemplo funcional

[JSFiddle](http://jsfiddle.net/sigcJunta/b6d4hd53/)
