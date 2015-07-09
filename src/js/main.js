/*
 * Define Main-Class & init global Singleton
 */
(function() {
	var Main = function() {

		//------- Main Scfipts to load
		[
		 	"js/promise.js", "js/ajax.js", "js/render.js", "js/dispatcher.js",
		 	"js/store.js", "js/view.js", "js/router.js", "js/state.js", "js/action.js"
		 ]
			.forEach(UTIL.loadScript);
	};

	window.MAIN = new Main();
})();
