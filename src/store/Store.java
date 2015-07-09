package store;

import java.util.HashMap;
import java.util.HashSet;

import com.google.gson.Gson;

public class Store {
	
	private static final Gson gson = new Gson();

	private HashMap<String, HashSet<String>> handlers = new HashMap<String, HashSet<String>>();
	private final StoreInitObject initObject;


	public Store(StoreInitObject obj) {
		this.initObject = obj;
	}
	
	public void on(String action, String func) {
		HashSet<String> set = handlers.get(action);
		if(set != null)
			set.add(func);
		else {
			handlers.put(action, new HashSet<String>() {{
				add(func);
			}});
		}
	}

	public static String toJavaScript(Store s) {
		String cls = s.getClass().getSimpleName();
		String js = "(function() { \n";
		js +="\t var ctr = " + cls + " = function() {}; \n";
		js += "\t ctr.prototype = new window.store("+gson.toJson(s.initObject)+"); \n";
		js += "\t ctr.constructor = store; \n";
		js += "\t var self = window.STORES." + cls + " = new ctr(); \n";
		
		for(String actionName : s.handlers.keySet()) {
			for(String handler : s.handlers.get(actionName)) {
				js += "\n\t window.STORES."+cls+".registerHandler('"+actionName+"', function(data) { \n";
				js += "\t\t" + handler + "\n";
				js += "\t }); \n";
			}
		}
		
		js += "\n })(); \n";
		return js;
	}

	public static class StoreInitObject {
		private final String name, url;
		private final boolean load;
		private final Object obj;
		private final String[] initFunctions;
		
		public StoreInitObject(String name, String url, boolean load, Object obj, String[] initFunctions) {
			this.name = name;
			this.url = url;
			this.load = load;
			this.obj = obj;
			this.initFunctions = initFunctions;
		}
	}
	
}
