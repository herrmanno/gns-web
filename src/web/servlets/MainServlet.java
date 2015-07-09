package web.servlets;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MainServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1371469279634337267L;

	@SuppressWarnings("resource")
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String fileName = req.getPathInfo().substring(1);
		String path = getServletContext().getRealPath("/WEB-INF/"+fileName);
		InputStream is = new FileInputStream(path);

		resp.setContentType(getServletContext().getMimeType(path));
		
		OutputStream responseOutputStream = resp.getOutputStream();
		int bytes;
		while ((bytes = is.read()) != -1) {
			responseOutputStream.write(bytes);
		}
		
		resp.setStatus(200);
	}
}
