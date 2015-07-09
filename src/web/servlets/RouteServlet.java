package web.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

public class RouteServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1371469279634337267L;

	private Gson gson;
	
	@Override
	public void init() throws ServletException {
		gson = new GsonBuilder().create();
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		Object routing;
		try {
			routing = Class.forName("routing.Routing").newInstance();
			resp.setContentType("text/json");
			resp.getWriter().write(gson.toJson(routing));
			resp.setStatus(200);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
