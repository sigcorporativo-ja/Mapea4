## Descripción

Plugin de impresión a través del servicio Geoprint3. Recibe como parámetro opcional la Configuración de impresión que consumir, siendo una Configuración un conjunto de plantillas y opciones de impresión (formatos, dpi) agrupadas bajo una denomincación. Así, cada aplicación web podrá tener su propia Configuración para imprimir plantillas personalizadas. 

## Recursos y uso

- js: https://mapea4-sigc.juntadeandalucia.es/plugins/printerdos/printerdos-x.y.z.ol.min.js
- css: https://mapea4-sigc.juntadeandalucia.es/plugins/printerdos/printerdos-x.y.z.min.css  

Donde x.y.z representan la versión del plugin a usar según la versión de Mapea, atendiendo a la compatibilidad de versiones que se muestra más adelante.  

Configuración por defecto sin parámetros:
```javascript
mapajs.addPlugin(new M.plugin.Printer());
```  
parámetro | descripción |  
--- | --- |  
url | (opcional) Url de la Configuración que consumir |  
params.urlApplication | (opcional) Instancia de Geoprint3 |  
params.layout.outputFilename | (opcional) Nombre fichero generado |  
options.layout | (opcional) Plantilla preseleccionada

Establecimiento de parámetros y valores preseleccionados:
```javascript
mapajs.addPlugin(new M.plugin.Printer({
  url: 'https://geoprint-sigc.juntadeandalucia.es/geoprint3/print/SIGC',
  params: {
    urlApplication: 'https://geoprint-sigc.juntadeandalucia.es/geoprint3',
    layout: {
      outputFilename: 'impresion_${yyyy-MM-dd_hhmmss}',
    }
  },
  options: {
      layout: 'A4 landscape (SIGC)'
    }
}));
```

## Ejemplo funcional

[JSFiddle](https://jsfiddle.net/sigcJunta/f6tpy27o/)  
 

## Tabla de compatibilidad de versiones   
[Consulta el api resourcePlugin](https://mapea4-sigc.juntadeandalucia.es/mapea/api/actions/resourcesPlugins?name=printerdos)  
