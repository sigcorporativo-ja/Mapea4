package es.juntadeandalucia.mapea.api;

import java.util.ResourceBundle;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.json.JSONArray;
import org.json.JSONObject;

import es.juntadeandalucia.mapea.builder.JSBuilder;

/**
 * This class manages the available actions an user can execute
 * 
 * @author Guadaltel S.A.
 */
@Path("/actions")
@Produces("application/javascript")
public class ActionsWS {

   private ResourceBundle versionProperties = ResourceBundle.getBundle("version");
//   private ResourceBundle configProperties = ResourceBundle.getBundle("config");
   
   /**
    * The available actions the user can execute
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the javascript code
    */
   @GET
   public String showAvailableActions (@QueryParam("callback") String callbackFn) {
      JSONArray actions = new JSONArray();
      
      actions.put("/version");
      actions.put("/controls");
      actions.put("/contexts");
      actions.put("/operations");
      actions.put("/services");
      actions.put("/version");
      actions.put("/themes");
      actions.put("/test/multitouch");
      actions.put("/build");
      actions.put("/srs");
      actions.put("/apk");
      
      return JSBuilder.wrapCallback(actions, callbackFn);
   }

   /**
    * The available controls the user can use
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the javascript code
    */
   @GET
   @Path("/controls")
   public String showAvailableControls (@QueryParam("callback") String callbackFn) {

      JSONArray controls = new JSONArray();
      
      controls.put("scale");
      controls.put("scaleline");
      controls.put("panzoombar (Only PC version)");
      controls.put("panzoom (Only PC version)");
      controls.put("mouse (Only PC version)");
      controls.put("navtoolbar");
      controls.put("measurebar");
      controls.put("overviewmap (Only PC version)");
      controls.put("location");
      controls.put("drawfeature");
      controls.put("modifyfeature");
      controls.put("deletefeature");
      controls.put("editattribute");
      
      return JSBuilder.wrapCallback(controls, callbackFn);
   }
   
   /**
    * Provides the version number and date of the current
    * build
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the javascript code
    */
   @GET
   @Path("/version")
   public String showVersion (@QueryParam("callback") String callbackFn) {

      JSONObject version = new JSONObject();
      
      version.put("number", versionProperties.getString("number"));
      version.put("date", versionProperties.getString("date"));
      
      return JSBuilder.wrapCallback(version, callbackFn);
   }
}
