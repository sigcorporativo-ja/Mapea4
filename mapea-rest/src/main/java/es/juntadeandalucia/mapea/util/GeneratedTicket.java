package es.juntadeandalucia.mapea.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import es.guadaltel.framework.ticket.Ticket;
import es.guadaltel.framework.ticket.TicketFactory;

/**
 * Servlet implementation class GeneratedTicket
 */
public class GeneratedTicket extends HttpServlet {
   private static final long serialVersionUID = 1L;
   String user = "MAPEA";
   String password = "MAPEA";
   
   /**
    * @see HttpServlet#HttpServlet()
    */
   public GeneratedTicket() {
      super();
      // TODO Auto-generated constructor stub
   }

   /**
    * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
    */
   protected void doGet(HttpServletRequest request, HttpServletResponse response)
         throws ServletException, IOException {
      // TODO Auto-generated method stub
      Map<String, String> props = null;
      Ticket ticket = null;
      
      props = new HashMap<String, String>();
      props.put("user", user);
      props.put("pass", password);
      ticket = TicketFactory.createInstance();
      String ticketStr = "";
      try {
         ticketStr = ticket.getTicket(props);
         props = ticket.getProperties(ticketStr);
      } catch (Exception e) {
         e.getMessage();
      }
      String url = "http://localhost:8080/mapea/?wmcfile=callejero&layers=WFS*pruPol*http://clientes.guadaltel.es/desarrollo/geossigc/wfs*callejero2:prueba_pol_wfst&wfstcontrols=modifyfeature";
      url = url + "&ticket=" + ticketStr;
      response.sendRedirect(url);
   }

   /**
    * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
    */
   protected void doPost(HttpServletRequest request, HttpServletResponse response)
         throws ServletException, IOException {
      // TODO Auto-generated method stub
   }

}
