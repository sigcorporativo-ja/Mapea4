package es.juntadeandalucia.mapea.parameter.parser;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import javax.ws.rs.core.MultivaluedMap;

import org.apache.commons.lang3.StringUtils;

import es.juntadeandalucia.mapea.parameter.Parameters;

public abstract class ParametersParser {
   
   public static Parameters parse (MultivaluedMap<String, String> queryParams) {
      String container = queryParams.getFirst("container");
      if ((container == null) || (container.trim().isEmpty())) {
         container = "map";
      }
      String wmcfiles = queryParams.getFirst("wmcfile");
      String layers = queryParams.getFirst("layers");
      String controls = queryParams.getFirst("controls");
      String label = queryParams.getFirst("label");
      String getfeatureinfo = queryParams.getFirst("getfeatureinfo");
      String zoom = queryParams.getFirst("zoom");
      String projection = queryParams.getFirst("projection");
      String center = queryParams.getFirst("center");
      String bbox = queryParams.getFirst("bbox");
      String maxextent = queryParams.getFirst("maxextent");
      String callbackFn = queryParams.getFirst("callback");
      String ticket = queryParams.getFirst("ticket");
      
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
      parameters.setCallbackFn(callbackFn);
      parameters.addTicket(ticket);
      
      return parameters;
   }
   
   public static List<String> parseControls (String controlsParameter) {
      List<String> controls = new LinkedList<String>();
      if (!StringUtils.isEmpty(controlsParameter)) {
         String[] controlsValues = controlsParameter.split(",");
         controls = Arrays.asList(controlsValues);
      }
      return controls;
   }

   public static List<String> parseWmcfiles (String wmcfileParameter) {
      List<String> wmcfiles = new LinkedList<String>();
      if (!StringUtils.isEmpty(wmcfileParameter)) {
         String[] wmcfileValues = wmcfileParameter.split(",");
         wmcfiles = Arrays.asList(wmcfileValues);
      }
      return wmcfiles;
   }

   public static List<String> parseLayers (String layerParameter) {
      List<String> layers = new LinkedList<String>();
      if (!StringUtils.isEmpty(layerParameter)) {
         String[] layersValues = layerParameter.split(",");
         layers = Arrays.asList(layersValues);
      }
      return layers;
   }
}
