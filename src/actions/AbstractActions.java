package actions;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class AbstractActions {

	protected Set<String> actions = new HashSet<String>();
	
	public void add(String... action) {
		actions.addAll(Arrays.asList(action));
	}
	
	public Set<String> getActions() {
		return actions;
	}
	
	public String[] getActionsAsArray() {
		return actions.toArray(new String[actions.size()]);
	}
}
