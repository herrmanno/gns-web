(function() {	
	var Router = function() {
		
		var self = this;
		this.ROUTE_FINISHED = "ROUTE_FINISHED";
		this.routing = false;
		var _mapping = {};
		var _viewState = {};
		var _handlers= [];
		
		this.init = function() {
			//------- Listener that fires ROUTE_FINISHED if all views are updated
			self.registerHandler("VIEW_UPDATED", function(name) {
				if(!_viewState[name]) _viewState[name] = {loading : false, html: null};
				_viewState[name].loading = false;
				
				var finished = true;
				for(var v in _viewState) {
					if(!_viewState.hasOwnProperty(v)) continue;
					if(finished && _viewState[v].loading)
						finished = false;
				}
				if(finished && !self.routing) {
					DISPATCHER.dispatch(self.ROUTE_FINISHED, null);
				}
			})
			
			AJAX.GET("route")
			.then(function(routesStr) {
				var routes = JSON.parse(routesStr);
				
				//------- register routes
				_mapping = routes.list;
				for(var i = 0; i < _mapping.length; i++) {
					_mapping[i].regex = new RegExp(_mapping[i].regex);
				}
				
				//------- register ActionListeners for Router
				for(var key in routes.handlers) {
					if(routes.handlers.hasOwnProperty(key)) {
						self.registerHandler(key, function(data) {
							new Function('self', 'data', routes.handlers[key]).call(self, self, data);
						});
					}
				}
				
				//------- load global stores
				routes.stores.forEach(loadStore);
				
				
				
				//------- Execute HashChange when mapping is loaded
				if(document.readyState === 'complete')
					self.setRoute(window.location.hash.substr(1));
				else {
					document.onload = function() {
						self.setRoute(window.location.hash.substr(1));
					}
				}
			});
			
			window.onhashchange = function(e) {
				self.setRoute(window.location.hash.substr(1));
			};
			
			
		}
		
		this.getViewstate = function(view) {
			if(view) {
				return _viewState[view] || {};
			} else {
				return _viewState;
			}
		}
		
		this.go = function(href) {
			href = href.toString();
			href = href.startsWith('#') ? href : '#' + href;
			window.location.hash = href;
		}
		
		this.findRoute = function(viewName, hash) {
			for(var i = 0; i < _mapping.length; i++) {
				var m = _mapping[i];
				if(m.view === viewName && hash.match(m.regex)) {
					return m;
				}
			}
			return null;
		}
		
		this.setRoute = function(hash) {
			self.routing = true;
			
			var views = document.querySelectorAll("*[data-view]");
			
			//------ set all available views to loading
			Array.prototype.forEach.call(views, function(view) {
				var viewName = view.dataset.view;
				if(!_viewState[viewName]) {
					_viewState[viewName] = {loading : true, html: null};
					return;
				} else {
					_viewState[viewName].loading = true;
				}
					
			});
			
			for(var v = 0; v < views.length; v++) {
				var last = v+1 == views.length;
				var view = views[v];
	
				var viewName = view.dataset.view;
				
				var route = self.findRoute(viewName, hash);
				
				//------- No Route found
				if(route == null) {
					view.innerHTML = null;
					_viewState[viewName].html = null;
					if(last)
						self.routing = false;
					DISPATCHER.dispatch('VIEW_UPDATED', viewName);
					continue;
				}
				
				var html = route.html + ".html";
				var stores = route.stores;
				
				//------- View istn registered yet
				if(!_viewState[viewName]) {
					_viewState[viewName] = {loading: true, html: html};
				}
				//------- View is registered
				else {
					//------- View's html needs to be updated
					if(_viewState[viewName].html != html) {
						_viewState[viewName].html = html;
					} else {
						//------- View's html does not need to change
						if(last)
							self.routing = false;
						DISPATCHER.dispatch('VIEW_UPDATED', viewName);
						continue;
					}
				}
						
				
				var _setHTML = function() {
					var arg1 = viewName.toString();
					var arg2 = html.toString();
					return function() {
						setHTML(arg1, arg2);
					};
				}();
				
				
				if(stores.length == 0) {
					_setHTML();
				} else {
					for(var s = 0; s < stores.length; s++) {
						if(s+1==stores.length) {
							loadStore(stores[s], _setHTML);
						} else {
							loadStore(stores[s], null);
						}
					}
				}
			}
			
			self.routing = false;
		}
		
		var setHTML = function(name, html) {
			var view = document.querySelectorAll('*[data-view="'+name+'"]')[0];
			AJAX.GET('html/'+html)
			.then(function(resp) {
				view.innerHTML = resp
				VIEW.initView(view);
			});
		};
		
		var loadStore = function(s, cb) {
			var script = document.querySelectorAll('script[src="store/'+s+'"]');
			//------- Store alreay loaded
			if(script.length > 0) {
				if(cb && typeof cb === 'function')
					cb();
				return;
			}
			
			MAIN.loadScript('store/'+s, cb);
		}
		
		//------- call 'Constructor'
		self.init();
	}
	
	Router.prototype = new Listener("ROUTER");
	
	window.ROUTER = new Router();
})();