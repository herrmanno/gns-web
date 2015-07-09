package web.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import util.PersistentBagTypeAdapter;

abstract public class ModelServlet extends HttpServlet {
	
	protected final String puName;
	protected EntityManagerFactory emFactory;
	protected EntityManager em;
	protected GsonBuilder gsonBuilder;
	protected Gson gson;
	
	public ModelServlet(String persistenceUnitName) {
		this.puName = persistenceUnitName;
		
		emFactory = Persistence.createEntityManagerFactory(puName);
		em = emFactory.createEntityManager();
		
		gsonBuilder = new GsonBuilder();
		gsonBuilder.registerTypeAdapterFactory(PersistentBagTypeAdapter.FACTORY);
		
		gson = gsonBuilder.create();
	}
	
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		try {
			_doGet(req, resp);
		} catch (Exception e) {
			resp.sendError(500, e.getMessage());
		}
	}


	private void _doGet(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		String pathInfo = req.getPathInfo().substring(1);
		
		//------- Load Collection 
		if(!pathInfo.contains("/")) {
			String queryString = String.format("SELECT c FROM %s c", "model."+pathInfo);
			System.out.println(queryString);
			Query query = em.createQuery(queryString);
			List<?> results = query.getResultList();
			
			resp.setContentType("text/json");
			resp.getWriter().write(gson.toJson(results));
		} else {
			String className = pathInfo.split("/")[0];
			Integer id = Integer.parseInt(pathInfo.split("/")[1]);
			Class<?> clazz = Class.forName("model."+className);
			Object result = em.find(clazz, id);
			
			resp.setContentType("text/json");
			resp.getWriter().write(gson.toJson(result));
		}
		
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		try {
			_doPost(req, resp);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	protected void _doPost(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		String pathInfo = req.getPathInfo().substring(1);
		String className = pathInfo.split("/")[0];
		Class<?> clazz = Class.forName("model."+className);
		
		StringBuilder sb = new StringBuilder();
	    BufferedReader br = req.getReader();
	    String str;
	    while( (str = br.readLine()) != null ){
	        sb.append(str);
	    }    
	    
	    Object data = gson.fromJson(sb.toString(), clazz);
	    
	    em.getTransaction().begin();
	    em.persist(data);
	    em.getTransaction().commit();
	    
	    resp.sendError(200);
	}
	
	
	
}
