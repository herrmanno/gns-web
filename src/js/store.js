(function() {
	window.STORES = {};

	STORES.loaded = new Promise();

	STORES.loadStore = function(s) {
		return UTIL.loadScript('store/'+s);
	};

	AJAX.GET_JSON("route")
	.then(function(routes) {
		Promise.all(routes.stores.map(STORES.loadStore))
		.then(STORES.loaded.resolve);
	});

	/*
	 * Options: {name, url, load, obj, initFunctions}
	 */
	window.store = function(opt) {

		this.STORE_UPDATED = "STORE_UPDATED";

		this.STORE_GET_SUCESS = opt.name + "_GET_SUCCESS";
		this.STORE_GET_ERROR = opt.name + "_GET_ERROR";

		this.STORE_POST_SUCESS = opt.name + "_POST_SUCCESS";
		this.STORE_POST_ERROR = opt.name + "_POST_ERROR";

		this.STORE_DELETE_SUCESS = opt.name + "_DELETE_SUCCESS";
		this.STORE_DELETE_ERROR = opt.name + "_DELETE_ERROR";

		var self = this;

		var _name = opt.name;
		var _url = opt.url;
		var _data = opt.obj || {};


		this.init = function() {
			Listener.call(self, _name);

			opt.initFunctions.forEach(function(func) {
				new Function("self", func).call(self, self);
			});

			if(opt.load) {
				self.load();
			}
		};

		this.load = function(id) {
			if(!_url) return;
			var url = _url + (id ? '/'+id : '');

			AJAX.GET_JSON(url)
			.then(self.set);
		};


		this.get = function(identifier) {
			switch(typeof identifier) {
				case "string":
					return _data[identifier];
				case "object":
					return self.find(identifier);
				default:
					return _data;
			}
		};


		this.set = function(d) {
			_data = d;

			self.changed();
		};

		this.find = function(obj) {
			var result = _data.filter(function(el) {
				var eq = true;
				for(var key in obj) {
					if(eq && el.hasOwnProperty(key) && el[key] == obj[key]) {
						eq = true;
					} else {
						eq = false;
					}
				}
				return eq;
			});
			switch (result.length) {
				case 0:
					return null;
				case 1:
					return result[0];
				default:
					return result;
			}
		};

		this.post = function(id) {
			if(!_url) return;
			var url = _url + (id ? '/'+id : '');

			AJAX.POST_JSON(url, _data);
		};

		this.delete = function(id) {
			if(!id) {
				throw "Store#delete must be called with an id as argument";
			}
			var url = _url + (id ? '/'+id : '');

			AJAX.DELETE_JSON(url);
		};


		this.changed = function() {
			DISPATCHER.dispatch(self.STORE_UPDATED, _name);
		};

		self.init();

	};

	window.store.prototype = new Listener();
	window.store.prototype.constructor = window.store;
})();
