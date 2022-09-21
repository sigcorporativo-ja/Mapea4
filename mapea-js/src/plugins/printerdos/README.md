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
params.parameters.imagenCoordenadas | (opcional) Imagen rosa de los vientos
params.parameters.imagenAndalucia | (opcional) Logo Junta de Andalucía
options.legend | (opcional) Indica si se desea mostrar la leyenda
options.dpi | (opcional) Valor por defecto para el selector dpi
options.layout | (opcional) Plantilla preseleccionada
options.format | (opcional) Valor por defecto para el selector de formato
options.forceScale | (opcional) Check de forzar escala marcado, false por defecto  
options.labeling.conflictResolution | (opcional) Cuando su valor es verdadero no permite que se superpongan dos etiquetas
options.labeling.goodnessOfFit | (opcional) Establece el porcentaje de la etiqueta que debe ubicarse dentro de la geometría para permitir dibujar la etiqueta
options.labeling.allowOverruns | (opcional) Cuando su valor es falso no permite que las etiquetas de las líneas vayan más allá del principio / final de la línea
options.labeling.autoWrap | (opcional) Número de píxeles que son en los que una etiqueta larga debe dividirse en varias líneas
options.labeling.conflictResolution | (opcional) 
options.labeling.followLine | (opcional) Cuando su valor es verdadero activa etiquetas curvas en geometrías lineales
options.labeling.group | (opcional) Cuando su valor es verdadero las geometrías con las mismas etiquetas se agrupan y se consideran una sola entidad para etiquetar
options.labeling.maxDisplacement | (opcional) La distancia, en píxeles, a la que se puede desplazar una etiqueta desde su posición natural en un intento de encontrar una posición que no entre en conflicto con las etiquetas ya dibujadas
options.labeling.spaceAround | (opcional) la distancia mínima entre dos etiquetas, en píxeles
options.layout | (opcional) Plantilla preseleccionada


Establecimiento de parámetros y valores preseleccionados:
```javascript
mapajs.addPlugin(new M.plugin.Printer({
  url: 'https://geoprint-sigc.juntadeandalucia.es/geoprint3/print/SIGC',
  params: {
    urlApplication: 'https://geoprint-sigc.juntadeandalucia.es/geoprint3',
    layout: {
      outputFilename: 'impresion_${yyyy-MM-dd_hhmmss}',
    },
    parameters: {
      imagenCoordenadas: 'file://windrose.png',
      imagenAndalucia: 'file://logo_JA.png',
    }
  },
  options: {
      legend: true,
      dpi: 300,
      layout: 'A4 landscape (SIGC)',
      format: 'png',
      conflictResolution: false,
      goodnessOfFit: 0.5,
      allowOverruns: false,
      autoWrap: 400,
      conflictResolution: true,
      followLine: true,
      group: false,
      maxDisplacement: 400,
      spaceAround: 50
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
