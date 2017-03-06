<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Prueba Ticket</title>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="es.guadaltel.framework.ticket.Ticket"%>
<%@ page import="es.guadaltel.framework.ticket.TicketFactory"%>
</head>
<body>
	<table align="center" width="500">

		<tr>
			<td>
				<%
				   String user = "MAPEA";
				   String password = "MAPEA";
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
                   String url = "index.jsp?wmcfile=callejero&layers=WFST*capa%20wfs*http://clientes.guadaltel.es/desarrollo/geossigc/wfs?*callejero2:prueba_pol_wfst*MPOLYGON&controls=drawfeature&ticket="+ticketStr;
				%>
			</td>
		</tr>
		<tr>
			<td><iframe src="<%=url%>" width="800" height="600"
					scrolling="no" marginwidth="0" marginheight="0" frameborder="1">
				</iframe></td>
		</tr>

	</table>
</body>
</html>
