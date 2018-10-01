package es.juntadeandalucia.mapea.util;

import java.util.LinkedList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;


public abstract class Utils {

   public static List<String> commaSeparatedToList(String commaSeparatedValues) {
      List<String> valuesList = new LinkedList<String>();
      
      if (!StringUtils.isEmpty(commaSeparatedValues)) {
         String[] values = commaSeparatedValues.split(",");
         for (String value : values) {
            valuesList.add(value.trim());
         }
      }
      
      return valuesList;
   }

   public static String escape (String content) {
      return JSONObject.valueToString(content);
   }
}
