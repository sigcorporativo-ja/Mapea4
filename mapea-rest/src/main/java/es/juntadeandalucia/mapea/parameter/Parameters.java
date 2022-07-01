package es.juntadeandalucia.mapea.parameter;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import es.juntadeandalucia.mapea.parameter.parser.ParametersParser;

public class Parameters {
   private String callbackFn;
   private JSONObject parameters;

   public Parameters() {
      this.parameters = new JSONObject();
   }

   public void addContainer (String container) {
      if (container != null) {
         parameters.put("container", container);
      }
   }

   public void addWmcfiles (String rawWmcfiles) {
      if (rawWmcfiles != null) {
         List<String> wmcfiles = ParametersParser.parseWmcfiles(rawWmcfiles);
         if (!wmcfiles.isEmpty()) {
            JSONArray jWmcfiles = new JSONArray();
            for (String wmcfile : wmcfiles) {
               jWmcfiles.put(wmcfile);
            }
            parameters.put("wmcfiles", jWmcfiles);
         }
      }
   }

   public void addLayers (String rawLayers) {
      List<String> layers = ParametersParser.parseLayers(rawLayers);
      if (!layers.isEmpty()) {
         JSONArray jLayers = new JSONArray();
         for (String layer : layers) {
            jLayers.put(layer);
         }
         parameters.put("layers", jLayers);
      }
   }

   public void addLabel (String label) {
      if (label != null) {
         parameters.put("label", label);
      }
   }

   public void addGetFeatureInfo (String getfeatureinfo) {
      if (getfeatureinfo != null) {
         parameters.put("getfeatureinfo", getfeatureinfo);
      }
   }

   public void addLayerswitcher (String layerswitcher) {
      if (layerswitcher != null) {
         parameters.put("layerswitcher", layerswitcher);
      }
   }

   public void addZoom (String zoom) {
      if (zoom != null) {
         parameters.put("zoom", zoom);
      }
   }

   public void addProjection (String projection) {
      if (projection != null) {
         parameters.put("projection", projection);
      }
   }

   public void addCenter (String center) {
      if (center != null) {
         parameters.put("center", center);
      }
   }

   public void addBbox (String bbox) {
      if (bbox != null) {
         parameters.put("bbox", bbox);
      }
   }

   public void addMaxextent (String maxextent) {
      if (maxextent != null) {
         parameters.put("maxExtent", maxextent);
      }
   }

   public void addTicket (String ticket) {
      if (ticket != null) {
         parameters.put("ticket", ticket);
      }
   }

   public void addControls (String rawControls) {
      if (rawControls != null) {
         List<String> controls = ParametersParser.parseControls(rawControls);
         if (!controls.isEmpty()) {
            JSONArray jControls = new JSONArray();
            for (String control : controls) {
               jControls.put(control);
            }
            parameters.put("controls", jControls);
         }
      }
   }

   public void addBGColorContainer (String color) {
      if (color != null) {
         parameters.put("bgColorContainer", color);
      }
   }

   public JSONObject toJSON () {
      return parameters;
   }

   public String getCallbackFn () {
      return callbackFn;
   }

   public void setCallbackFn (String callbackFn) {
      this.callbackFn = callbackFn;
   }
}
