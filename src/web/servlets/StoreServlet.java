package web.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import store.Store;

public class StoreServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1371469279634337267L;
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String storeName = req.getPathInfo().substring(1);
		Store store;
		try {
			store = (Store) Class.forName("store."+storeName).newInstance();
			String js = Store.toJavaScript(store);
			resp.setContentType("text/javascript");
			resp.getWriter().write(js);
			resp.setStatus(200);
			
		} catch (Exception e) {
			e.printStackTrace();
			resp.sendError(500);
		}

	}

}
