package es.juntadeandalucia.mapea.api;

import javax.validation.groups.ConvertGroup.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

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
	@GET
	@ApiOperation(value = "nivel de zoom aplicado", notes = "Ejemplo: http://mapea4-sigc.juntadeandalucia.es/?zoom=6")

	public String iframe(
			// wmc
			@ApiParam(value = "wmcfile 	indica el/los ficheros WMC a cargar \n- url: url del WMC\n" + "- nombre: nombre que aparecerá en el selector\n" + "ó\n"
					+ "- nombrePredefinido: nombre de uno de los contextos predefinidos disponibles", example = "vacio", required = false) @QueryParam("wmcfile") String wmc,
			// layers
			@ApiParam(value = "indica el/las capas a cargar \n - tipoCapa: tipo capa OGC\n" + "- nombreLeyenda: nombre que aparecerá en la leyenda\n"
					+ "- urlServicio: url al servicio OGC\n" + "- nombreCapa: nombre de la capa OGC\n"
					+ "- transparent: 'false' si es una capa base, 'true' en caso contrario\n"
					+ "- tiled: 'true' si queremos dividir la capa en tiles, 'false' en caso contrario ", example = "vacio", required = false) @QueryParam("layers") String layers,

			// Zoom
			@ApiParam(value = "nivel de zoom aplicado", example = "6", required = false) @QueryParam("zoom") String zoom,

			// center
			@ApiParam(value = "coordenadas de centrado del mapa.  \n - coordX: coordenada X\n" + 
					"- coordY: coordY\n" + 
					"- dibujar chincheta: 'false' para solo centrar y 'true' para dibujar una chincheta", example = "235061.9,4141933.04*true", required = false) @QueryParam("center") String coord) {

		return "http://localhost:8080/mapea/?wmcfile=mapa&zoom=" + zoom;
	}

}
