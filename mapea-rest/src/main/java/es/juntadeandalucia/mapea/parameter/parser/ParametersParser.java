package es.juntadeandalucia.mapea.parameter.parser;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

public abstract class ParametersParser {

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
