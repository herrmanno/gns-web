package web.service;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import state.StateBase;

public class StateService extends AbstractService {
	
	private static final String REGEX = "state";

	private Gson gson = new Gson();
	
	public StateService() {
		super(REGEX);
	}

	@Override
	public void service(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		Class<?> cls = Class.forName("state.State");
		InputStream is = cls.getResourceAsStream("state.json");
		if(is != null) {
			sendJSON(resp, is);
		} else {
			sendInstance(resp, cls);
		}
		
		resp.setContentType("text/json");
		resp.setStatus(200);
	}

	private void sendInstance(HttpServletResponse resp, Class<?> cls)
			throws InstantiationException, IllegalAccessException, IOException {
		StateBase state = (StateBase) cls.newInstance();
		resp.getWriter().write(gson.toJson(state.states));
	}

	private void sendJSON(HttpServletResponse resp, InputStream is) throws IOException {
		byte[] bytes=new byte[is.available()];
		is.read(bytes);
		String json = new String(bytes);
		resp.getWriter().write(json);
	}

}
