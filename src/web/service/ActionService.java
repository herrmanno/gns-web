package web.service;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import actions.AbstractActions;

public class ActionService extends AbstractService {
	
	private static final String REGEX = "actions";

	private Gson gson = new Gson();
	
	public ActionService() {
		super(REGEX);
	}

	@Override
	public void service(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		Class<?> clazz = Class.forName("actions.Actions");
		
		InputStream is = clazz.getResourceAsStream("actions.json");
		if(is != null) {
			sendJSON(resp, is);
		} else {
			sendInstance(resp, clazz);
		}
				
		resp.setContentType("text/json");
		resp.setStatus(200);
	}

	private void sendInstance(HttpServletResponse resp, Class<?> clazz) throws Exception {
		AbstractActions actions = (AbstractActions) clazz.newInstance();
		resp.getWriter().write(gson.toJson(actions.getActions()));
	}

	private void sendJSON(HttpServletResponse resp, InputStream is) throws IOException {
		byte[] bytes=new byte[is.available()];
		is.read(bytes);
		String json = new String(bytes);
		resp.getWriter().write(json);
	}

}
