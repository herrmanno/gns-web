package state;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;

import com.google.gson.Gson;

abstract public class StateBase {

	public final STATE[] states;
	
	public StateBase(STATE... states) {
		this.states = states;
	}
	
	public static class STATE {
		public String name;
		public String url;
		public String[] actions;
		public String[] promises;
		public VIEW[] views;
		
		public STATE(String name, String url, String[] actions, String[] promises, VIEW... views) {
			this.name = name;
			this.url = url;
			this.actions = actions;
			this.promises = promises;
			this.views = views;
		}

		public STATE() {
			// TODO Auto-generated constructor stub
		}
	}
	
	public static class VIEW {
		public String name;
		public String html;
		public String[] stores;
		
		public VIEW(String name, String html, String... stores) {
			this.name = name;
			this.html = html;
			this.stores = stores;
		}

		public VIEW() {
			// TODO Auto-generated constructor stub
		}
	}
}
