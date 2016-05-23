package es.juntadeandalucia.mapea.api;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import es.juntadeandalucia.mapea.builder.JSBuilder;
import es.juntadeandalucia.mapea.parameter.Parameters;

@Produces("application/javascript; charset=UTF-8") 
@Path("/")
public class BuilderWS {

   /**
    * Provides the code to build a map using the Javascript
    * API
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the javascript code
    */
   @GET
   @Path("/js")
   public String js(
         @DefaultValue("map") @QueryParam("container") String container,
         @QueryParam("wmcfile") String wmcfiles,
         @QueryParam("layers") String layers,
         @DefaultValue("navtoolbar") @QueryParam("controls") String controls,
         @QueryParam("label") String label,
         @QueryParam("getfeatureinfo") String getfeatureinfo,
         @QueryParam("zoom") String zoom,
         @QueryParam("projection") String projection,
         @QueryParam("center") String center,
         @QueryParam("bbox") String bbox,
         @QueryParam("maxextent") String maxextent,
         @QueryParam("geosearch") String geosearch,
         @QueryParam("geosearchbylocation") String geosearchbylocation,
         @QueryParam("callback") String callbackFn) {

      Parameters parameters = new Parameters();
      parameters.addContainer(container);
      parameters.addWmcfiles(wmcfiles);
      parameters.addLayers(layers);
      parameters.addControls(controls);
      parameters.addLabel(label);
      parameters.addGetFeatureInfo(getfeatureinfo);
      parameters.addZoom(zoom);
      parameters.addProjection(projection);
      parameters.addCenter(center);
      parameters.addBbox(bbox);
      parameters.addMaxextent(maxextent);
      parameters.addGeosearch(geosearch);
      parameters.addGeosearchByLocation(geosearchbylocation);
      String codeJS = JSBuilder.build(parameters, callbackFn);

      return codeJS;
   }
}
