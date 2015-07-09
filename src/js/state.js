(function() {
	var State = function() {

		var self = this;
		this.state = undefined;
		this.mapping = null;
		this.args = null;

		this.init = function() {
			Promise.all([ACTIONS.loaded, STORES.loaded])
			.then(self.ajaxMapping);

			//self.ajaxMapping();
		};

		this.ajaxMapping = function() {
			AJAX.GET_JSON('state')
			.then(function(states) {
				self.mapping = states;
				self.initMapping();
				self.initListener();
			});
		};

		this.initMapping = function() {
			//------- create a method for every state
			self.mapping.forEach(function(state) {
				if(!state.name) throw "Every State needs a name attibute";
				if(!state.url) throw "Every State needs an url attibute";
				state.actions = state.actions || [];
				state.promises = state.promises || [];
				state.views = state.views || [];

				self[state.name] = function(args, extern) {

					if(self.state && state.name === self.state.name && args === self.args)
						return;

					if(!!state.redirect) {
						self[state.redirect](args, extern);
						return;
					}

					//TODO handler promises & actions

					extern = !! extern;

					//------- set current state & arguments
					self.state = state;
					self.args = args;
					//------- create Listener for every action

					self.registerHandler('ROUTE_FINISHED', DISPATCHER.dispatch.bind(DISPATCHER, 'STATE_'+state.name, args), true);

					state.actions.forEach(function(action) {
						self.registerHandler('ROUTE_FINISHED', function() {
							DISPATCHER.dispatch(action, args);
						}, true);
					});

					//------- set url and render views
					var url = self.urlFromState(state.url, args);
					ROUTER.setRoute(url);

					//------- set url for browser
					self.setUrl(url);
				};
			});
		};

		this.initListener = function() {
			window.onhashchange = self.onHashChange();
		};

		this.onHashChange = function() {
			var s = self.stateFromUrl(window.location.hash.substr(1));
			self[s.state](s.args, true);
		};

		this.setUrl = function(url) {
			if(window.location.hash.substr(1) === url)
				return;

			var l = window.onhashchange;
			window.onhashchange = null;

			window.location.hash = url;

			window.onhashchange = l;
		};

		this.regexFromUrl = function(url) {
			var regex = /:([\w]+)/;
			while(url.match(regex)) {
				url = url.replace(regex, "([^\/]+)");
			}
			return url+'$';
		};

		this.argsFromUrl = function(pattern, url) {
			var r = self.regexFromUrl(pattern);
			var names = pattern.match(r);
			var values = url.match(r);

			var args = {};
			names.forEach(function(name, i) {
				if(i === 0) return;
				args[name.substr(1)] = values[i];
			});

			return args;
		};

		this.stateFromUrl = function(url) {
			var s;
			self.mapping.forEach(function(state) {
				if(s)
					return;

				var r = self.regexFromUrl(state.url);
				if(url.match(r)) {
					var args = self.argsFromUrl(state.url, url);
					s = {
						"state": state.name,
						"args": args
					};
				}
			});

			if(!s) throw "No State found for url "+url;

			return s;
		};

		this.urlFromState = function(url, args) {
			var regex = /:([\w]+)/;
			while(url.match(regex)) {
				url = url.replace(regex, function(m) {
					return args[m.substr(1)];
				});
			}
			return url;
		};

		this.htmlForView = function(viewName) {
			var v = self.viewForName(viewName);
			return v && v.html;
		};

		this.storesForView = function(viewName) {
			var v = self.viewForName(viewName);
			return v && v.stores || [];
		};

		this.viewForName = function(viewName) {
			var ret = null;
			self.state.views.forEach(function(view) {
				if(!ret && view.name == viewName)
					ret = view;
			});
			return ret;
		};


		self.init();
	};

	State.prototype = new Listener("STATE");

	window.STATE = new State();
})();
