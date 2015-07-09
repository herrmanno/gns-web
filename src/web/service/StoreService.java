package web.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import store.Store;

public class StoreService extends AbstractService {
	
	private static final String REGEX = "store\\/.+";

	public StoreService() {
		super(REGEX);
	}
	

	@Override
	public void service(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		String storeName = req.getPathInfo().substring(1).replace("/", ".");
		
		Store store = (Store) Class.forName(storeName).newInstance();
		String js = Store.toJavaScript(store);
		resp.getWriter().write(js);
		resp.setContentType("text/javascript");
		resp.setStatus(200);
	}

}
