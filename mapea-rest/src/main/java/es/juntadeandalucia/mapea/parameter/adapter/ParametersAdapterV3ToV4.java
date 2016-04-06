package es.juntadeandalucia.mapea.parameter.adapter;

import java.util.HashMap;
import java.util.LinkedList;
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
      adaptWFSTPlugin(query);
      adaptMeasurePlugin(query);
      adaptGeosearchPlugin(query);
      adaptSearchcallejero(query);
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
      adaptSearchcallejero(adaptedQuery);
      
      return adaptedQuery;
   }

   private static void adaptSearchcallejero (Map<String, String[]> query) {
      String[] operations = query.remove("operations");
      if ((operations != null) && (operations.length > 0) && (operations[0] != null)) {
         String operationParameters = operations[0];
         if (operationParameters.toLowerCase().indexOf("searchcallejero") != -1) {
            // adds searchcallejero as geosearch
            query.put("geosearch", new String[0]);
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
               controlParameters = controlParameters.replaceAll("\\,?" + wfstcontrol, "").replaceAll("^\\,", "");
               wfstcontrolsPluginStr += wfstcontrol + ",";
            }
         }
         if (!StringUtils.isEmpty(wfstcontrolsPluginStr)) {
            // removes last ","
            wfstcontrolsPluginStr = wfstcontrolsPluginStr.substring(0, wfstcontrolsPluginStr.length() - 1);
            
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
   
   private static void adaptSearchcallejero (MultivaluedMap<String, String> query) {
      List<String> operations = query.remove("operations");
      if ((operations != null) && !operations.isEmpty()) {
         String operationParameters = operations.get(0);
         if (operationParameters.toLowerCase().indexOf("searchcallejero") != -1) {
            // adds searchcallejero as geosearch
            query.put("geosearch", new LinkedList<String>());
         }
      }
   }
   
   private static void adaptGeosearchPlugin (MultivaluedMap<String, String> query) {
      List<String> geosearch = query.get("geosearch");
      if ((geosearch != null) && !geosearch.isEmpty()) {
         String geosearchValue = geosearch.get(0);
         if (!StringUtils.isEmpty(geosearchValue)) {
            String geosearchAdapted = geosearchValue.replaceAll(
                  "^(http\\:\\/\\/[^\\*]+)(\\/[^\\*]+)(\\/[^\\*]+)\\/?$", "$1*$2*$3");
            geosearch.clear();
            geosearch.add(geosearchAdapted);
         }
      }
   }

   private static void adaptMeasurePlugin (MultivaluedMap<String, String> query) {
      List<String> controls = query.get("controls");
      if ((controls != null) && !controls.isEmpty()) {
         String controlParameters = controls.get(0);
         if (controlParameters.toLowerCase().indexOf("measurebar") != -1) {
            // removes measurebar from controls
            controls.clear();
            controls.add(controlParameters.replaceAll("\\,?measurebar", "").replaceAll("^\\,", ""));
            // adds measurebar as plugin
            List<String> plugins = query.get("plugins");
            if (plugins == null) {
               plugins = new LinkedList<String>();
               query.put("plugins", plugins);
            }
            // keeping specified plugins
            String allPlugins = "";
            if (!plugins.isEmpty()) {
               allPlugins = plugins.get(0);
               allPlugins = allPlugins.concat(",");
            }
            allPlugins = allPlugins.concat("measurebar");
            plugins.clear();
            plugins.add(allPlugins);
         }
      }
   }

   private static void adaptWFSTPlugin (MultivaluedMap<String, String> query) {
      List<String> controls = query.get("controls");
      if ((controls != null) && !controls.isEmpty()) {
         String[] wfstcontrols = { "drawfeature", "deletefeature", "modifyfeature", "editattribute" };
         String wfstcontrolsPluginStr = "";
         String controlParameters = controls.get(0);
         for (String wfstcontrol : wfstcontrols) {
            if (controlParameters.toLowerCase().indexOf(wfstcontrol) != -1) {
               controlParameters = controlParameters.replaceAll("\\,?" + wfstcontrol, "").replaceAll("^\\,", "");
               wfstcontrolsPluginStr += wfstcontrol + ",";
            }
         }
         if (!StringUtils.isEmpty(wfstcontrolsPluginStr)) {
            // removes last ","
            wfstcontrolsPluginStr = wfstcontrolsPluginStr.substring(0, wfstcontrolsPluginStr.length() - 1);
            
            // add wfstcontrols as parameter
            List<String> wfstcontrolsPlugin = new LinkedList<String>();
            wfstcontrolsPlugin.add(wfstcontrolsPluginStr);
            query.put("wfstcontrols", wfstcontrolsPlugin);
            
            // updates controls parameter
            controls.clear();
            controls.add(controlParameters);
         }
      }
   }
}
