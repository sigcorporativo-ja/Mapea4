package es.juntadeandalucia.mapea.parameter.adapter;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.ws.rs.core.MultivaluedMap;

import org.apache.commons.lang3.StringUtils;

public abstract class ParametersAdapterV3ToV4 {

   /**
    * This method adapts the query v3 to new format v4 to allow backward compatibility
    * 
    * @param queryParameters
    */
   public static void adapt (MultivaluedMap<String, String> query) {
      Map<String, String[]> adaptedQuery = adapt(multivaluedMapToMap(query));
      for (Entry<String, String[]> entry : adaptedQuery.entrySet()) {
         query.put(entry.getKey(), Arrays.asList(entry.getValue()));
      }
   }

   /**
    * This method adapts the query v3 to new format v4 to allow backward compatibility
    * 
    * @param queryParameters
    */
   public static Map<String, String[]> adapt (Map<String, String[]> query) {
      Map<String, String[]> adaptedQuery = new HashMap<String, String[]>();
      for (Entry<String, String[]> entry : query.entrySet()) {
         adaptedQuery.put(entry.getKey(), entry.getValue());
      }
      adaptWFSTPlugin(adaptedQuery);
      adaptMeasurePlugin(adaptedQuery);
      adaptGeosearchPlugin(adaptedQuery);
      adaptOperations(adaptedQuery);
      return adaptedQuery;
   }

   private static void adaptOperations (Map<String, String[]> query) {
      String[] operations = query.remove("operations");
      if ((operations != null) && (operations.length > 0)) {
         for (String operation : operations) {
            if (operation.toLowerCase().indexOf("searchcallejero") != -1) {
               // adds searchcallejero as geosearch
               query.put("geosearch", new String[0]);
            }
            else if (operation.toLowerCase().indexOf("searchstreet") != -1) {
               // checks if user specified locality parameter
               String[] locality = query.remove("locality");
               if (locality == null) {
                  locality = new String[0];
               }
               // adds searchstreet as plugin
               query.put("searchstreet", locality);
            }
         }
      }
   }

   private static void adaptGeosearchPlugin (Map<String, String[]> query) {
      String[] geosearch = query.get("geosearch");
      if ((geosearch != null) && (geosearch.length > 0) && (geosearch[0] != null)) {
         String geosearchValue = geosearch[0];
         if (!StringUtils.isEmpty(geosearchValue)) {
            String geosearchAdapted = geosearchValue.replaceAll(
                  "^(http\\:\\/\\/[^\\*]+)(\\/[^\\*]+)(\\/[^\\*]+)\\/?$", "$1*$2*$3");
            geosearch[0] = geosearchAdapted;
         }
      }
   }

   private static void adaptWFSTPlugin (Map<String, String[]> query) {
      String[] controls = query.get("controls");
      if ((controls != null) && (controls.length > 0) && (controls[0] != null)) {
         String[] wfstcontrols = { "drawfeature", "deletefeature", "modifyfeature", "editattribute" };
         String wfstcontrolsPluginStr = "";
         String controlParameters = controls[0];
         for (String wfstcontrol : wfstcontrols) {
            if (controlParameters.toLowerCase().indexOf(wfstcontrol) != -1) {
               controlParameters = controlParameters.replaceAll("\\,?" + wfstcontrol, "")
                     .replaceAll("^\\,", "");
               wfstcontrolsPluginStr += wfstcontrol + ",";
            }
         }
         if (!StringUtils.isEmpty(wfstcontrolsPluginStr)) {
            // removes last ","
            wfstcontrolsPluginStr = wfstcontrolsPluginStr.substring(0,
                  wfstcontrolsPluginStr.length() - 1);
            // add wfstcontrols as parameter
            String[] wfstcontrolsPlugin = new String[1];
            wfstcontrolsPlugin[0] = wfstcontrolsPluginStr;
            query.put("wfstcontrols", wfstcontrolsPlugin);
            // updates controls parameter
            controls[0] = controlParameters;
         }
      }
   }

   private static void adaptMeasurePlugin (Map<String, String[]> query) {
      String[] controls = query.get("controls");
      if ((controls != null) && (controls.length > 0) && (controls[0] != null)) {
         String controlParameters = controls[0];
         if (controlParameters.toLowerCase().indexOf("measurebar") != -1) {
            // removes measurebar from controls
            controls[0] = controlParameters.replaceAll("\\,?measurebar", "").replaceAll("^\\,", "");
            // adds measurebar as plugin
            String[] plugins = query.get("plugins");
            if (plugins == null) {
               plugins = new String[1];
               query.put("plugins", plugins);
            }
            // keeping specified plugins
            String allPlugins = "";
            if ((plugins.length > 0) && (plugins[0] != null)) {
               allPlugins = plugins[0];
               allPlugins = allPlugins.concat(",");
            }
            allPlugins = allPlugins.concat("measurebar");
            plugins[0] = allPlugins;
         }
      }
   }

   private static Map<String, String[]> multivaluedMapToMap (MultivaluedMap<String, String> multivaluedMap) {
      Map<String, String[]> map = new HashMap<String, String[]>();
      if (multivaluedMap != null) {
         for (Entry<String, List<String>> entry : multivaluedMap.entrySet()) {
            String key = entry.getKey();
            List<String> values = entry.getValue();
            map.put(key, values.toArray(new String[values.size()]));
         }
      }
      return map;
   }
}
