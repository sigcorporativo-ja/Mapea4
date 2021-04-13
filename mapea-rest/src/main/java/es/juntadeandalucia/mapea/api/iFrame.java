package es.juntadeandalucia.mapea.api;

import java.util.ArrayList;
import java.util.ResourceBundle;

import javax.validation.groups.ConvertGroup.List;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.apache.xerces.utils.regex.REUtil;

import es.juntadeandalucia.mapea.builder.JSBuilder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ResponseHeader;
import io.swagger.annotations.SecurityDefinition;

@Path("/iframe")
@Api(value = "iFrame Service", description = "Api del front")
@Produces("application/javascript")
public class iFrame {

	ArrayList<String> campos = new ArrayList();
	ArrayList<String> camposNull = new ArrayList();
	private static final String url = ResourceBundle.getBundle("configuration").getString("swagger.url");
	@POST
	@ApiOperation(value = " ", notes = "Mapea puede ser integrado en paǵinas web mediante el uso de iframes. A través del API REST se puede incluir un visualizador interactivo en cualquier página web sin necesidad de disponer de conocimientos específicos en programación ni en el ámbito de los SIG. Para ello únicamente es necesario que el usuario configure el mapa a visualizar a través de una URL:\n"
			+ "\n"
			+ "http://mapea4-sigc.juntadeandalucia.es/?wmcfile=callejero,cdau_satelite&controls=mouse,layerswitcher,overviewmap,scaleline,location&layers=WMS\\*Redes\\*http://www.ideandalucia.es/wms/mta400v_2008?\\*Redes_energeticas\\*true&getfeatureinfo=html\n"
			+ "\n" + "Esto puede integrarse directamente en un iframe, como se hacía anteriormente:\n" + "\n"
			+ "\\<iframe height=\"350px\" width=\"500px\" src=\"http://mapea4-sigc.juntadeandalucia.es/?wmcfile=callejero,cdau_satelite&controls=mouse,layerswitcher,overviewmap,scaleline,location&layers=WMS\\*Redes\\*http://www.ideandalucia.es/wms/mta400v_2008?\\*Redes_energeticas\\*true&getfeatureinfo=html\"></iframe\\>\n"
			+ "\n"
			+ "    !!! En la mayoría de los mapas, puede utilizarse cualquier tamaño de iframe, pero para la correcta visualización y funcionamiento del mismo cuando hay bastantes controles, el tamaño mínimo de este iframe debe de ser width=\"600\" height=\"400\"\n"
			+ "\n"
			+ "Por tanto, mediante parámetros en la url, podremos configurar un mapa incrustable mediante un iframe. Los parámetros posibles a configurar son:")

	public String iframe(
			// wmc
			@ApiParam(value = "wmcfile indica el/los ficheros WMC a cargar \n- url: url del WMC\n"
					+ "- nombre: nombre que aparecerá en el selector\n" + "ó\n"
					+ "- nombrePredefinido: nombre de uno de los contextos predefinidos disponibles\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?wmcfile=http://www.callejerodeandalucia.es/wmc/context_cdau_callejero.xml*mapa,cdau_satelite", required = false) @QueryParam("wmcfile") String wmc,

			// layers
			@ApiParam(value = "indica el/las capas a cargar \n - tipoCapa: tipo capa OGC\n"
					+ "- nombreLeyenda: nombre que aparecerá en la leyenda\n" + "- urlServicio: url al servicio OGC\n"
					+ "- nombreCapa: nombre de la capa OGC\n"
					+ "- transparent: 'false' si es una capa base, 'true' en caso contrario"
					+ "- tiled: 'true' si queremos dividir la capa en tiles, 'false' en caso contrario\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?layers=WMS\\*Municipios\\*http://www.ideandalucia.es/wms/dea100_divisiones_administrativas?\\*terminos_municipales\\*false\\*true", required = false) @QueryParam("layers") String layers,

			// Zoom
			@ApiParam(value = "nivel de zoom aplicado\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?zoom=6", required = false) @QueryParam("zoom") String zoom,

			// center
			@ApiParam(value = "coordenadas de centrado del mapa.  \n - coordX: coordenada X\n" + "- coordY: coordY\n"
					+ "- dibujar chincheta: 'false' para solo centrar y 'true' para dibujar una chincheta\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?center=235061.9,4141933.04*true&zoom=6", required = false) @QueryParam("center") String center,
			// label
			@ApiParam(value = "cadena de texto que será visualizada como texto html en un popup en el centro del mapa o en las coordenadas indicadas mediante center \n"
					+ "- texto: texto a mostrar. soporta código html\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?label=texto_con_html", required = false) @QueryParam("label") String label,

			// bbox
			@ApiParam(value = "encuadre de visualización del mapa \n" + "- minX: coordenada menor eje X\n"
					+ "- minY: coordenada menor eje Y\n" + "- maxX: coordenada mayor eje X\n"
					+ "- maxY: coordenada mayor eje Y\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?bbox=323020.1,4126873.2,374759.9,4152013.3", required = false) @QueryParam("bbox") String bbox,

			// maxextent
			@ApiParam(value = "máxima extensión permitida; a diferencia del bbox, no se dibujará el mapa fuera de los límites establecidos \n"
					+ "- minX: coordenada menor eje X\n" + "- minY: coordenada menor eje Y\n"
					+ "- maxX: coordenada mayor eje X\n" + "- maxY: coordenada mayor eje Y\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?maxextent=323020.1,4126873.2,374759.9,4152013.3", required = false) @QueryParam("maxextent") String maxextent,

			// controls
			@ApiParam(value = "controles a incluir en el mapa \n"
					+ "Pueden incluiser los siguientes controles, separados por coma:\n" + "- scale: escala del mapa\n"
					+ "- scaleLine: línea de escala\n" + "- panzoom: control de zoom\n"
					+ "- panzoombar: control de zoom con barra de nivel\n"
					+ "- layerswitcher: control de gestión de capas\n" + "- mouse: coordenadas del ratón\n"
					+ "- overviewmap: mapa miniatura\n" + "- location: representa la posición del usuario\n"
					+ "Más información en Controles básicos(https://github.com/sigcorporativo-ja/Mapea4/wiki/Controles-b%C3%A1sicos)\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?controls=layerswitcher,overviewmap,mouse,panzoombar", required = false) @QueryParam("controls") String controls,

			// getfeatureinfo
			@ApiParam(value = "añade la herramienta de consulta \n"
					+ "Soporta tres formatos, teniendo en cuenta que el servidor debe soportar el indicado:\n"
					+ "- plain: texto plano (por defecto si no se indica ninguno)\n"
					+ "- gml: respuesta en formato GML\n" + "- html: respuesta en HTML\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?controls=navtoolbar&layers=WMS\\*Capa2\\*http://www.ideandalucia.es/wms/mta400r_2008?\\*MTA400\\*false,WMS\\*Capa1*http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_GeoParques?\\*GeoParques\\*true&getfeatureinfo=html", required = false) @QueryParam("getfeatureinfo") String getfeatureinfo,

			// projection
			@ApiParam(value = "permite configurar el sistema de referencia en el cual se visualiza el mapa.  \n"
					+ "- EPSG: código EPSG a utilizar\n"
					+ "- unidades: 'm' para metros y 'd' para grados \n\n"
					+ "http://mapea4-sigc.juntadeandalucia.es/?layers=WMS\\*Capa%20wms\\*http://www.ideandalucia.es/wms/mta400r_2008?\\*MTA400\\*false&projection=EPSG:4326\\*d", required = false) @QueryParam("projection") String projection,

			// geosearch
			@ApiParam(value = "buscador de elementos espaciales a través de un servicio de Geobúsquedas. \n"
					+ "- urlGB: url del servicio de geobúsquedas\n"
					+ "- core: core del servicio sobre el que realizar las consultas\n"
					+ "- manejador: manejador del core indicado\n"
					+ "!!! Si no se indica un servicio/core distinto, se usará el de por defecto del SIGC\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?geosearch=http://geobusquedas-sigc.juntadeandalucia.es/\\*sigc\\*/search ", example = "", required = false) @QueryParam("geosearch") String geosearch,

			// geosearchbylocation
			@ApiParam(value = "buscador de elementos espaciales cercano a la posición del usuario\n"
					+ "- urlCompleta: url del servicio de geobúsquedas, incluido core y manejador\n"
					+ "- distancia: radio de búsqueda en metros\n"
					+ "!!! Si no se indica alguno de los parámetros, se tomarán los de por defecto\n\n "
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?geosearchbylocation=500", required = false) @QueryParam("geosearchbylocation") String geosearchbylocation,

			// searchstreet
			@ApiParam(value = "control para búsqueda de direcciones\n"
					+ "- codigoINE: indicar el código INE de un municipio para filtrar las búsqueda por el mismo\n\n"
					+ "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?searchstreet=41091", required = false) @QueryParam("searchstreet") String searchstreet) {

		camposNull.add(wmc);
		camposNull.add(layers);
		camposNull.add(zoom);
		camposNull.add(center);
		camposNull.add(label);
		camposNull.add(bbox);
		camposNull.add(maxextent);
		camposNull.add(controls);
		camposNull.add(getfeatureinfo);
		camposNull.add(projection);
		camposNull.add(geosearch);
		camposNull.add(geosearchbylocation);
		camposNull.add(searchstreet);

		campos.add("wmcfile=" + wmc);
		campos.add("layers=" + layers);
		campos.add("zoom=" + zoom);
		campos.add("center=" + center);
		campos.add("label=" + label);
		campos.add("bbox=" + bbox);
		campos.add("maxextent=" + maxextent);
		campos.add("controls=" + controls);
		campos.add("getfeatureinfo=" + getfeatureinfo);
		campos.add("projection=" + projection);
		campos.add("geosearch=" + geosearch);
		campos.add("geosearchbylocation=" + geosearchbylocation);
		campos.add("searchstreet=" + searchstreet);

		String estructura = url+"/?";
		int valor = 0;
		for (int i = 0; i < campos.size(); i++) {
			if (camposNull.get(i) != null) {
				if (valor == 0) {
					estructura += campos.get(i);
					valor++;
				} else {
					
					estructura += "&" + campos.get(i);
				}
			}
		}
		return estructura;

	}

}
