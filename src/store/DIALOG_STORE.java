package store;

import routing.AbstractRouting;

public class DIALOG_STORE extends Store {

	public static final String[] ACTIONS = new String[] {
		"DIALOG_OPEN",
		"DIALOG_CLOSE",
	};
	
	public static final String[] initFunctions = new String[] {
		//"UTIL.loadScript('js/dialog.js');",
		"UTIL.loadStylesheet('css/dialog.css');",
	}; 
	
	public DIALOG_STORE() {
		super(new StoreInitObject("DIALOG_STORE", "html", false, null, initFunctions));
		
		on("DIALOG_OPEN", "self.set('block');");
		on("DIALOG_CLOSE", "self.set('none');");
		
		on(AbstractRouting.Actions.ROUTE_FINISHED,
			"(!!document.getElementById('dialog-content').innerHTML ? ACTIONS.DIALOG_OPEN : ACTIONS.DIALOG_CLOSE)();"
		);
	}
	
}
