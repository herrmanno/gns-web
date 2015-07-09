package routing;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

abstract public class AbstractRouting {

	public static class Actions {
		public static final String ROUTE_FINISHED = "ROUTE_FINISHED";
	}
	
	protected Set<Route> list = new HashSet<Route>();
	protected HashMap<String, String> handlers = new HashMap<String, String>();
	protected Set<String> stores = new HashSet<String>();

	
	public void on(String action, String func) {
		handlers.put(action, func);
	}
	
	protected void add(String view, String regex, String html, String... stores) {
		list.add(new Route(view, regex, html, stores));
	}
	
	protected void addGlobalStore(String storeClassName) {
		stores.add(storeClassName);
	}
	
	
	public Set<Route> getRoutes() {
		return list;
	}
	
	public class Route {
		private final String view;
		private final String regex;
		private final String html;
		private final List<String> stores = new ArrayList<String>();
		
		public Route(String view, String regex, String h, String... stores) {
			this.view = view;
			this.regex = regex;
			this.html = h;
			this.stores.addAll(Arrays.asList(stores));
		}
	}
	
	
}
