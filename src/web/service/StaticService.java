package web.service;

import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class StaticService extends AbstractService {
	
	private static final String REGEX = ".*";

	public StaticService() {
		super(REGEX);
	}
	

	@SuppressWarnings("resource")
	@Override
	public void service(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		ServletContext context = servlet.getServletContext();
		
		String fileName = req.getPathInfo();
		String path = context.getRealPath("/WEB-INF/"+fileName);
		
		
		InputStream is = new FileInputStream(path);
		OutputStream responseOutputStream = resp.getOutputStream();
		int bytes;
		while ((bytes = is.read()) != -1) {
			responseOutputStream.write(bytes);
		}
		
		resp.setContentType(context.getMimeType(path));
		resp.setStatus(200);
	}

}
