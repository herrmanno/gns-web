package web.service;

import java.io.BufferedReader;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.Query;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class ModelService extends AbstractService {
	
	private static final String REGEX = "model\\/.+";
	protected String puName;
	protected EntityManagerFactory emFactory;
	protected EntityManager em;
	protected Gson gson;

	public ModelService(String persistenceUnit) {
		super(REGEX);
		
		this.puName = persistenceUnit;
		
		emFactory = Persistence.createEntityManagerFactory(puName);
		em = emFactory.createEntityManager();
		
		gson = new Gson();
	}
	

	@Override
	public void service(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		switch (req.getMethod()) {
		case "GET":
			doGet(req, resp);
			break;
		case "POST":
			doPost(req, resp);
			break;
		case "DELETE":
			doDelete(req, resp);
			break;
		default:
			break;
		}
	}


	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		String path = req.getPathInfo().replace("/model/", "");
		
		//------- Load Collection 
		if(!path.contains("/")) {
			String queryString = String.format("SELECT c FROM %s c", "model."+path);
			System.out.println(queryString);
			Query query = em.createQuery(queryString);
			List<?> results = query.getResultList();
			
			resp.setContentType("text/json");
			resp.getWriter().write(gson.toJson(results));
		} else {
			String className = path.split("/")[0];
			Integer id = Integer.parseInt(path.split("/")[1]);
			Class<?> clazz = Class.forName("model."+className);
			Object result = em.find(clazz, id);
			
			resp.setContentType("text/json");
			resp.getWriter().write(gson.toJson(result));
		}
		
	}


	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		String path = req.getPathInfo();
		String className = path.split("/")[2];
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


	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws Exception {
		String path = req.getPathInfo();
		String className = path.split("/")[2];
		Integer id = Integer.parseInt(path.split("/")[3]);
		Class<?> clazz = Class.forName("model."+className);
		
	    
	    EntityTransaction tx = em.getTransaction();
		tx.begin();

    	Object data = em.find(clazz, id);
    	em.remove(data);
	    
	    tx.commit();
	    resp.sendError(200);
	}

}
