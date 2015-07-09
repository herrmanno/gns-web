package web.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class RouteService extends AbstractService {
	
	private static final String REGEX = "route";

	private Gson gson = new Gson();
	
	public RouteService() {
		super(REGEX);
	}

	@Override
	public void service(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		Object routing = Class.forName("routing.Routing").newInstance();
		resp.setContentType("text/json");
		resp.getWriter().write(gson.toJson(routing));
		resp.setStatus(200);
	}

}
