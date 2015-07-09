package web.servlets;

import java.io.IOException;
import java.util.LinkedList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import web.service.AbstractService;
import web.service.ActionService;
import web.service.RouteService;
import web.service.StateService;
import web.service.StaticService;
import web.service.StoreService;

public class MainFilter extends HttpServlet {

	private final LinkedList<AbstractService> services = new LinkedList<AbstractService>();
	
	public void registerService(AbstractService service) {
		this.services.addFirst(service);
		service.setServlet(this);
	}

	@Override
	public void init() throws ServletException {
		registerService(new StaticService());
		registerService(new StoreService());
		registerService(new RouteService());
		registerService(new StateService());
		registerService(new ActionService());
	}
	
	
	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
		String path = req.getRequestURI().substring(req.getContextPath().length());
		path = path.substring(path.indexOf("/")+1);

		if (path.isEmpty()) {
			req.getRequestDispatcher("index.html").forward(req, resp);
			return;
		}
		
		
		for(AbstractService s : services) {
			if(s.regex.matcher(path).matches()) {
				try {
					s.service(req, resp);
				} catch (Exception e) {
					resp.sendError(500, e.getMessage());
				} finally {
					return;
				}
			}
		}
		
	}

	/*
	private void sendRoutes(ServletRequest request, ServletResponse response) {
		AbstractRouting routing;
		try {
			routing = (AbstractRouting) Class.forName("routing.Routing").newInstance();
			response.setContentType("text/json");
			response.getWriter().write(gson.toJson(routing));
			((HttpServletResponse) response).setStatus(200);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	private void sendActions(ServletRequest request, ServletResponse response) {
		AbstractActions actions;
		try {
			actions = (AbstractActions) Class.forName("actions.Actions").newInstance();
			response.setContentType("text/json");
			response.getWriter().write(gson.toJson(actions.getActions()));
			((HttpServletResponse) response).setStatus(200);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	*/


}
