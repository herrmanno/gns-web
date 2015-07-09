/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	window.onerror = function(msg, url, linenumber) {
	    var text = 'Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber;
	    alert(text);
	};
	
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	
	__webpack_require__(5);
	
	__webpack_require__(6);
	__webpack_require__(1);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);


/***/ },
/* 1 */
/***/ function(module, exports) {

	(function() {
		var Dispatcher = function() {
			var self = this;
			var _listeners = [];
			this.queue = [];
	
			this.registerListener = function(l) {
				_listeners.push(l);
			};
	
			this.dispatch = function(type, data) {
				self.queue.push({type: type, data: data});
				_listeners.forEach(function(l) {
					l.on(type, data);
				});
			};
	
		};
	
		window.DISPATCHER = new Dispatcher();
	})();
	
	(function() {
		window.Listener = function(name) {
			var self = this;
			this.listener_name = name;
			var _handlers = [];
	
	
			this.init = function() {
				DISPATCHER.registerListener(self);
			};
	
			this.registerHandler = function(type, h, once) {
				once = once || false;
				_handlers.push({type: type, handler:h, once: once});
	
				for(var index in DISPATCHER.queue) {
					var action = DISPATCHER.queue[index];
					self.on(action.type, action.data);
				}
			};
	
			this.on = function(type, data) {
				_handlers.forEach(function(h, index) {
					if(h.type === type) {
						h.handler(data);
	
						if(h.once) {
							_handlers.splice(index, 1);
						}
					}
				});
			};
	
			//------- cal 'Constructor'
			self.init();
		};
	
	})();


/***/ },
/* 2 */
/***/ function(module, exports) {

	(function() {
		window.Promise = function Promise(onResolve, onReject) {
			var self = this;
	
			this.data = undefined;
	
			this.resolved = false;
			this.rejected = false;
			this.done = false;
	
			this.onResolve = onResolve;
			this.onReject = onReject;
	
			this.ret = undefined;
	
	
			this.set = function(data) {
				if(self.done)
					throw "Promise is already resolved / rejected";
				self.data = data;
			};
	
			this.resolve = function(data) {
				self.set(data);
				self.resolved = self.done = true;
				if(self.onResolve) {
					self._resolve();
				}
			};
	
			this._resolve = function() {
				if(!self.ret) {
					self.ret = new Promise();
				}
	
				var v = self.onResolve(self.data);
	
				if(v && v instanceof Promise) {
					v.then(self.ret.resolve, self.ret.reject);
				}
				else {
					self.ret.resolve(v);
				}
	
			};
	
			this.reject = function(data) {
				self.set(data);
				self.rejected = self.done = true;
	
				if(self.onReject) {
					self.onReject(this.data);
				}
				if(self.ret && self.ret instanceof Promise) {
					self.ret.reject(this.data);
				}
			};
	
			this._reject = function() {
				if(!self.ret) {
					self.ret = new Promise();
				}
	
				self.onReject(self.data);
				self.ret.reject(self.data);
			};
	
			this.then = function(res, rej) {
				self.ret = new Promise();
	
				if(res && typeof res === 'function')
					self.onResolve = res;
	
				if(rej && typeof rej === 'function')
					self.onReject = rej;
	
	
				if(self.resolved) {
					self._resolve();
				}
	
				if(self.rejected) {
					self._reject();
				}
	
				return self.ret;
			};
	
			this.catch = function(cb) {
				if(self.rejected)
					cb(self.data);
				else
					self.onReject = cb;
			};
		};
	
		window.Promise.all = function(arr) {
			var p = new Promise();
	
			var data = [];
	
			if(arr.length === 0) {
				p.resolve();
			} else {
				arr.forEach(function(prom, index) {
					prom
					.then(function(d) {
						if(p.done)
							return;
							
						data[index] = d;
						var allResolved = arr.reduce(function(state, p1) {
							return state && p1.resolved;
						}, true);
						if(allResolved) {
							p.resolve(data);
						}
	
					})
					.catch(function(err) {
						p.reject(err);
					});
				});
			}
	
			return p;
		};
	
	})();


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
	 * Define Ajax-Class & init global Singleton
	 */
	(function() {
		var Ajax = function() {};
	
		Ajax.prototype.ajax = function(url, type, data, json) {
			var p = new Promise();
			var xmlhttp = new XMLHttpRequest();
	        xmlhttp.onreadystatechange = function() {
	            if(xmlhttp.readyState == 4) {
					var resp = xmlhttp.responseText;
					var ct = xmlhttp.getResponseHeader('content-type');
					if(ct.match(/.*text\/json.*/)) {
						resp = JSON.parse(resp);
					}
	
					if(xmlhttp.status == 200) {
	                	p.resolve(resp);
					} else {
						p.reject(resp);
					}
	            }
	        };
	
	        xmlhttp.open(type, url, true);
	
			if(data) {
				if(json) {
					xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
					xmlhttp.send(JSON.stringify(data));
				} else {
					xmlhttp.send(data);
				}
			} else {
				xmlhttp.send();
			}
	
	        return p;
		};
	
		Ajax.prototype.GET = function(url) {
			return Ajax.prototype.ajax(url, 'GET');
		};
	
		Ajax.prototype.GET_JSON = function(url) {
			return Ajax.prototype.ajax(url, 'GET', undefined, true);
		};
	
		Ajax.prototype.POST_JSON = function(url, data) {
			return Ajax.prototype.ajax(url, 'POST', data, true);
		};
	
		Ajax.prototype.DELETE_JSON = function(url, data) {
			return Ajax.prototype.ajax(url, 'DELETE', data, true);
		};
	
		/*
		Ajax.prototype.GET = function(url) {
			var p = new Promise();
			var xmlhttp = new XMLHttpRequest();
	        xmlhttp.onreadystatechange = function() {
	            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	                p.resolve(xmlhttp.responseText);
	            }
	        }
	        xmlhttp.open('GET', url, true);
	        xmlhttp.send();
	
	        return p;
		}
	
		Ajax.prototype.GET_JSON = function(url) {
			var p = new Promise();
			var xmlhttp = new XMLHttpRequest();
	        xmlhttp.onreadystatechange = function() {
	            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	                p.resolve(JSON.parse(xmlhttp.responseText));
	            }
	        }
	        xmlhttp.open('GET', url, true);
	        xmlhttp.send();
	
	        return p;
		}
	
		Ajax.prototype.POST_JSON = function(url, data) {
			var p = new Promise();
			var xmlhttp = new XMLHttpRequest();
	        xmlhttp.onreadystatechange = function() {
	            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	                p.resolve(JSON.parse(xmlhttp.responseText));
	            }
	        }
	        xmlhttp.open('POST', url, true);
	        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	        xmlhttp.send(JSON.stringify(data));
	
	        return p;
		}
	
		Ajax.prototype.DELETE_JSON = function(url, data) {
			var xmlhttp = new XMLHttpRequest();
	        xmlhttp.onreadystatechange = function() {
	            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	                p.resolve(JSON.parse(xmlhttp.responseText));
	            }
	        }
	        xmlhttp.open('DELETE', url, true);
	        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	        xmlhttp.send(JSON.stringify(data));
	
	        return p;
		}
	
		*/
	
		window.AJAX = new Ajax();
	})();


/***/ },
/* 4 */
/***/ function(module, exports) {

	(function() {
		var Actions = function() {
			var self = this;
	
			self.loaded = new Promise();
	
			AJAX.GET_JSON('actions')
			.then(function(actions) {
				actions.forEach(function(name) {
					self[name] = self.createAction(name);
				});
				self.loaded.resolve();
			});
	
		};
	
		Actions.prototype.createAction = function(name) {
			var action = function(data) {
				DISPATCHER.dispatch(name, data);
			};
	
			return action;
		};
	
	
		window.ACTIONS = new Actions();
	
	})();


/***/ },
/* 5 */
/***/ function(module, exports) {

	(function() {
		window.UTIL = {
			loadScript: function(src) {
				var p = new Promise();
	
				var scripts = document.querySelectorAll('script[src="'+src+'"]');
	
				//------- Script already loaded
				if(scripts.length > 0) {
					p.resolve();
				} else {
					var script = document.createElement('script');
					script.setAttribute('src', src);
					script.async = false;
					script.addEventListener('load', function (e) {
						p.resolve(e);
					}, false);
	
					document.head.appendChild(script);
				}
	
				return p;
			},
	
			loadStylesheet: function(href) {
				var p = new Promise();
	
				var links = document.querySelectorAll('link[href="'+href+'"]');
	
				if(links.length > 0) {
					p.resolve();
				} else {
					var link = document.createElement('link');
					link.setAttribute('rel', 'stylesheet');
					link.setAttribute('href', href);
					link.addEventListener('load', function (e) {
						p.resolve(e);
					}, false);
	
					document.head.appendChild(link);
				}
	
				return p;
			}
		};
	})();


/***/ },
/* 6 */
/***/ function(module, exports) {

	(function() {
		var Render = function() {
	
			var self = this;
			this.SPECIAL_ATTR = ['repeat', 'cloned', 'model', 'view'];
	
			this.replDataset = function(el, model) {
				for(var name in el.dataset) {
					self.replDataAttr(el, name, model);
				}
			};
	
			this.replDataAttr = function(el, name, model) {
				//------- Skip special attributes
				if(self.SPECIAL_ATTR.indexOf(name) != -1)
					return;
	
				if(el.dataset[name] && typeof el.dataset[name] === 'string') {
					var attr = el.dataset[name];
					attr = self.eval(attr, model);
	
					try {
						el[name] = attr;
						el.setAttribute(name, attr);
					} catch(e) {
						console.err('could not set attribute ' + name + ' on element ' + el);
					}
				}
			};
	
			this.replHTML = function(el, model) {
				el.innerHTML = self.eval(el.innerHTML, model);
			};
	
			this.repl = function(str, model) {
				var path = str.match(/\${([^{}]*?)}/);
				if(!path)
					return str;
				path = path[1];
				var parts = path.split(".");
	
				var value = model;
				for(var i = 0; i < parts.length; i++ ) {
					if(parts[i] !== '')
						value = value[parts[i]];
				}
	
				if(value === undefined || value === null)
					value = '';
	
				str = str.replace(/\${([^{}]*?)}/, value);
	
				return str;
			};
	
			this.eval = function(str, model) {
				str = self.repl(str, model);
	
				var path = str.match(/\${{([^{}]*?)}}/);
				if(!path)
					return str;
				path = path[1];
	
				var value;
				with(model) {
					value = eval(path);
				}
	
				str = str.replace(/\${{([^{}]*?)}}/, value);
	
				return str;
			};
	
			this.path = function(attr) {
				var path = attr.match(/\${(.*)}/);
				if(!path)
					return null;
				path = path[1];
	
				return path;
			};
	
			this.removeCloned = function(el) {
				el = el || document;
				self.removeElements(el, '[data-cloned]');
			}
	
			this.removeElements = function(el, selector){
			    if(selector === undefined) {
			    	selector = el;
			    	el = document;
			    }
	
				var elements = el.querySelectorAll(selector);
			    for(var i = 0; i < elements.length; i++) {
			        elements[i].parentNode.removeChild(elements[i]);
			    }
			}
	
		}
	
		window.RENDER = new Render();
	})();


/***/ },
/* 7 */
/***/ function(module, exports) {

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


/***/ },
/* 8 */
/***/ function(module, exports) {

	"user strict";
	
	(function() {
		function View() {
	
			var self = this;
			this.VIEW_UPDATED = "VIEW_UPDATED";
			var handlers = {};
	
			this.init = function() {
				self.registerHandler("STORE_UPDATED", function(name) {
					Array.prototype.forEach.call(document.querySelectorAll('*[data-model="'+name+'"]'), self.initContainer);
				});
			};
	
	
			this.initView = function(view) {
				Array.prototype.forEach.call(view.querySelectorAll('*[data-model]'), self.initContainer);
				DISPATCHER.dispatch(self.VIEW_UPDATED, view.dataset.view);
			};
	
	
			this.initContainer = function(container) {
				var modelName = container.dataset.model;
				var model;
				with(STORES)
					model = eval(modelName);
				model = model.get();
	
				self.initElement(container, model, modelName);
				Array.prototype.forEach.call(container.children, function(el) {
					self.initElement(el, model, modelName);
				});
	
			};
	
			this.initElement = function(el, model, modelName) {
				//------- Filter Textnodes etc.
				if(!el.dataset)
					return;
	
				//------- skip cloned tags - they are already rendered
				if(el.dataset.cloned)
					return;
	
	
				//------- render element
				if(el.dataset.repeat) {
					self.initRepeatElement(el, model, modelName);
					return;
				}
				//------- render repeatElement
				else {
					RENDER.replDataset(el, model, modelName);
					if(el.children.length === 0)
						RENDER.replHTML(el, model);
	
					if(self['init'+el.tagName.toUpperCase()])
						self['init'+el.tagName.toUpperCase()](el, model, modelName);
				}
	
				//------- do recursion
				Array.prototype.forEach.call(el.children, function(child) {
					//------- skip children with own data-model
					if(child.dataset && child.dataset.model)
						return;
					self.initElement(child, model, modelName);
				});
			};
	
			this.initRepeatElement = function(el, model, modelName) {
				RENDER.removeCloned(el.parentNode);
				for(var index in model) {
					var clone = el.cloneNode(true);
					delete clone.dataset.repeat;
	
					//------- replace $parent with model  (without key)
					//------- replace $index with index
					self.initElement(clone, model[index]);
	
					clone.dataset.cloned = true;
	
					Array.prototype.forEach.call(clone.querySelectorAll("*"), function(child) {
						self.initElement(child, model[index]);
					});
	
					el.parentElement.appendChild(clone);
				}
			}
	
			this.initINPUT = function(el, model, modelName) {
				var store = eval(modelName);
				el.onblur = function() {
					var data = store.get();
					var path = RENDER.path(el.dataset.value);
					data = eval("data."+path+"='"+el.value+"'; data;");
					store.set(data);
				}
			}
	
	
			//------- call 'Constructor'
			self.init();
		}
	
		View.prototype = new Listener("VIEW");
	
		window.VIEW = new View();
	
	})();


/***/ },
/* 9 */
/***/ function(module, exports) {

	(function() {
		var Router = function() {
	
			var self = this;
			this.ROUTE_FINISHED = "ROUTE_FINISHED";
			this.routing = false;
			this.viewState = {};
			this.handlers= [];
	
			this.init = function() {
				self.initFinishedHandler();
	
				/*
				AJAX.GET_JSON("route")
				.then(function(routes) {
					routes.stores.forEach(STORES.loadStore);
				});
				*/
			};
	
			this.initFinishedHandler = function() {
				//------- Listener that fires ROUTE_FINISHED if all views are updated
				self.registerHandler("VIEW_UPDATED", function(name) {
					if(!self.viewState[name])
						self.viewState[name] = {loading : false, html: null};
					else
						self.viewState[name].loading = false;
	
					var finished = true;
					for(var v in self.viewState) {
						if(!self.viewState.hasOwnProperty(v)) continue;
						if(finished && self.viewState[v].loading)
							finished = false;
					}
					if(finished && !self.routing) {
						DISPATCHER.dispatch(self.ROUTE_FINISHED, null);
					}
				});
			};
	
			this.getViewstate = function(view) {
				if(view) {
					return self.viewState[view] || {};
				} else {
					return self.viewState;
				}
			};
	
			this.setLoading = function(views) {
				//------ set all available views to loading
				Array.prototype.forEach.call(views, function(view) {
					var viewName = view.dataset.view;
					if(!self.viewState[viewName]) {
						self.viewState[viewName] = {loading : true, html: null};
						return;
					} else {
						self.viewState[viewName].loading = true;
					}
	
				});
			};
	
			this.setRoute = function(hash) {
				self.routing = true;
				var views = document.querySelectorAll("*[data-view]");
	
				//------ set all available views to loading
				self.setLoading(views);
	
				Array.prototype.forEach.call(views, function(view, index) {
					var last = index+1 == views.length;
					var viewName = view.dataset.view;
	
					var html = STATE.htmlForView(viewName);
	
					//------- No Route found
					if(html === null) {
						view.innerHTML = null;
						self.viewState[viewName].html = null;
						if(last)
							self.routing = false;
						DISPATCHER.dispatch('VIEW_UPDATED', viewName);
						return;
					}
	
	
					//------- View's html needs to be updated
					if(self.viewState[viewName].html != html) {
						self.viewState[viewName].html = html;
					} else {
						//------- View's html does not need to change
						if(last)
							self.routing = false;
						DISPATCHER.dispatch('VIEW_UPDATED', viewName);
						return;
					}
	
	
					var _setHTML = function() {
						var arg1 = view;
						var arg2 = html.toString();
						return function() {
							setHTML(arg1, arg2);
						};
					}();
	
	
	
					var stores = STATE.storesForView(viewName);
	
					Promise.all(stores.map(STORES.loadStore))
					.then(_setHTML);
	
				});
	
				self.routing = false;
			};
	
			var setHTML = function(view, html) {
				var url = 'html/'+html+(html.endsWith('.html') ? '' : '.html');
				AJAX.GET(url)
				.then(function(resp) {
					view.innerHTML = resp;
					VIEW.initView(view);
				});
			};
	
			//------- call 'Constructor'
			self.init();
		};
	
		Router.prototype = new Listener("ROUTER");
	
		window.ROUTER = new Router();
	})();


/***/ },
/* 10 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWMzMjQzMGFiZjNlMDVlZjRiZmEiLCJ3ZWJwYWNrOi8vLy4vZW50cnkuanMiLCJ3ZWJwYWNrOi8vLy4vZGlzcGF0Y2hlci5qcyIsIndlYnBhY2s6Ly8vLi9wcm9taXNlLmpzIiwid2VicGFjazovLy8uL2FqYXguanMiLCJ3ZWJwYWNrOi8vLy4vYWN0aW9uLmpzIiwid2VicGFjazovLy8uL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vcmVuZGVyLmpzIiwid2VicGFjazovLy8uL3N0b3JlLmpzIiwid2VicGFjazovLy8uL3ZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vcm91dGVyLmpzIiwid2VicGFjazovLy8uL3N0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7O0FBRUE7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLGtDQUFrQzs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQzNERDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMLEtBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNoSUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxnRUFBK0Q7QUFDL0Q7QUFDQSxLQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFtRTtBQUNuRTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvRUFBbUU7QUFDbkU7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEVBQUM7Ozs7Ozs7QUN0SEQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKO0FBQ0EsSUFBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTs7QUFFQSxFQUFDOzs7Ozs7O0FDM0JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDN0NEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTRCLEtBQUssS0FBSztBQUN0QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFpQixrQkFBa0I7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsMEJBQXlCLEtBQUssS0FBSzs7QUFFbkM7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDhCQUE2QixLQUFLLE1BQU07QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEwQixLQUFLLE1BQU07O0FBRXJDO0FBQ0E7O0FBRUE7QUFDQSw4QkFBNkIsS0FBSztBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQW9CLHFCQUFxQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxFQUFDOzs7Ozs7O0FDdEdEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTs7QUFFRjtBQUNBLGVBQWM7QUFDZDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUM5SEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7O0FBRUo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQThDLE1BQU07QUFDcEQ7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsRUFBQzs7Ozs7OztBQzdHRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFpQztBQUNqQztBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBLEtBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOzs7O0FBSUw7O0FBRUE7QUFDQTs7QUFFQSxLQUFJOztBQUVKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEVBQUM7Ozs7Ozs7QUN0SUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCxPQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJOztBQUVKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTs7QUFFSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEVBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAxYzMyNDMwYWJmM2UwNWVmNGJmYVxuICoqLyIsIndpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obXNnLCB1cmwsIGxpbmVudW1iZXIpIHtcclxuICAgIHZhciB0ZXh0ID0gJ0Vycm9yIG1lc3NhZ2U6ICcrbXNnKydcXG5VUkw6ICcrdXJsKydcXG5MaW5lIE51bWJlcjogJytsaW5lbnVtYmVyO1xyXG4gICAgYWxlcnQodGV4dCk7XHJcbn07XHJcblxyXG5yZXF1aXJlKFwiLi9wcm9taXNlLmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9hamF4LmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9hY3Rpb24uanNcIik7XHJcblxyXG5yZXF1aXJlKFwiLi91dGlsLmpzXCIpO1xyXG5cclxucmVxdWlyZShcIi4vcmVuZGVyLmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9kaXNwYXRjaGVyLmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9zdG9yZS5qc1wiKTtcclxucmVxdWlyZShcIi4vdmlldy5qc1wiKTtcclxucmVxdWlyZShcIi4vcm91dGVyLmpzXCIpO1xyXG5yZXF1aXJlKFwiLi9zdGF0ZS5qc1wiKTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2VudHJ5LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBEaXNwYXRjaGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgX2xpc3RlbmVycyA9IFtdO1xyXG5cdFx0dGhpcy5xdWV1ZSA9IFtdO1xyXG5cclxuXHRcdHRoaXMucmVnaXN0ZXJMaXN0ZW5lciA9IGZ1bmN0aW9uKGwpIHtcclxuXHRcdFx0X2xpc3RlbmVycy5wdXNoKGwpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmRpc3BhdGNoID0gZnVuY3Rpb24odHlwZSwgZGF0YSkge1xyXG5cdFx0XHRzZWxmLnF1ZXVlLnB1c2goe3R5cGU6IHR5cGUsIGRhdGE6IGRhdGF9KTtcclxuXHRcdFx0X2xpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGwpIHtcclxuXHRcdFx0XHRsLm9uKHR5cGUsIGRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdH07XHJcblxyXG5cdHdpbmRvdy5ESVNQQVRDSEVSID0gbmV3IERpc3BhdGNoZXIoKTtcclxufSkoKTtcclxuXHJcbihmdW5jdGlvbigpIHtcclxuXHR3aW5kb3cuTGlzdGVuZXIgPSBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR0aGlzLmxpc3RlbmVyX25hbWUgPSBuYW1lO1xyXG5cdFx0dmFyIF9oYW5kbGVycyA9IFtdO1xyXG5cclxuXHJcblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0RElTUEFUQ0hFUi5yZWdpc3Rlckxpc3RlbmVyKHNlbGYpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnJlZ2lzdGVySGFuZGxlciA9IGZ1bmN0aW9uKHR5cGUsIGgsIG9uY2UpIHtcclxuXHRcdFx0b25jZSA9IG9uY2UgfHwgZmFsc2U7XHJcblx0XHRcdF9oYW5kbGVycy5wdXNoKHt0eXBlOiB0eXBlLCBoYW5kbGVyOmgsIG9uY2U6IG9uY2V9KTtcclxuXHJcblx0XHRcdGZvcih2YXIgaW5kZXggaW4gRElTUEFUQ0hFUi5xdWV1ZSkge1xyXG5cdFx0XHRcdHZhciBhY3Rpb24gPSBESVNQQVRDSEVSLnF1ZXVlW2luZGV4XTtcclxuXHRcdFx0XHRzZWxmLm9uKGFjdGlvbi50eXBlLCBhY3Rpb24uZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5vbiA9IGZ1bmN0aW9uKHR5cGUsIGRhdGEpIHtcclxuXHRcdFx0X2hhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24oaCwgaW5kZXgpIHtcclxuXHRcdFx0XHRpZihoLnR5cGUgPT09IHR5cGUpIHtcclxuXHRcdFx0XHRcdGguaGFuZGxlcihkYXRhKTtcclxuXHJcblx0XHRcdFx0XHRpZihoLm9uY2UpIHtcclxuXHRcdFx0XHRcdFx0X2hhbmRsZXJzLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8tLS0tLS0tIGNhbCAnQ29uc3RydWN0b3InXHJcblx0XHRzZWxmLmluaXQoKTtcclxuXHR9O1xyXG5cclxufSkoKTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2Rpc3BhdGNoZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XHJcblx0d2luZG93LlByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKG9uUmVzb2x2ZSwgb25SZWplY3QpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHR0aGlzLmRhdGEgPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0dGhpcy5yZXNvbHZlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5yZWplY3RlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5kb25lID0gZmFsc2U7XHJcblxyXG5cdFx0dGhpcy5vblJlc29sdmUgPSBvblJlc29sdmU7XHJcblx0XHR0aGlzLm9uUmVqZWN0ID0gb25SZWplY3Q7XHJcblxyXG5cdFx0dGhpcy5yZXQgPSB1bmRlZmluZWQ7XHJcblxyXG5cclxuXHRcdHRoaXMuc2V0ID0gZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRpZihzZWxmLmRvbmUpXHJcblx0XHRcdFx0dGhyb3cgXCJQcm9taXNlIGlzIGFscmVhZHkgcmVzb2x2ZWQgLyByZWplY3RlZFwiO1xyXG5cdFx0XHRzZWxmLmRhdGEgPSBkYXRhO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnJlc29sdmUgPSBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdHNlbGYuc2V0KGRhdGEpO1xyXG5cdFx0XHRzZWxmLnJlc29sdmVkID0gc2VsZi5kb25lID0gdHJ1ZTtcclxuXHRcdFx0aWYoc2VsZi5vblJlc29sdmUpIHtcclxuXHRcdFx0XHRzZWxmLl9yZXNvbHZlKCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5fcmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZighc2VsZi5yZXQpIHtcclxuXHRcdFx0XHRzZWxmLnJldCA9IG5ldyBQcm9taXNlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciB2ID0gc2VsZi5vblJlc29sdmUoc2VsZi5kYXRhKTtcclxuXHJcblx0XHRcdGlmKHYgJiYgdiBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuXHRcdFx0XHR2LnRoZW4oc2VsZi5yZXQucmVzb2x2ZSwgc2VsZi5yZXQucmVqZWN0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRzZWxmLnJldC5yZXNvbHZlKHYpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnJlamVjdCA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0c2VsZi5zZXQoZGF0YSk7XHJcblx0XHRcdHNlbGYucmVqZWN0ZWQgPSBzZWxmLmRvbmUgPSB0cnVlO1xyXG5cclxuXHRcdFx0aWYoc2VsZi5vblJlamVjdCkge1xyXG5cdFx0XHRcdHNlbGYub25SZWplY3QodGhpcy5kYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihzZWxmLnJldCAmJiBzZWxmLnJldCBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuXHRcdFx0XHRzZWxmLnJldC5yZWplY3QodGhpcy5kYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLl9yZWplY3QgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoIXNlbGYucmV0KSB7XHJcblx0XHRcdFx0c2VsZi5yZXQgPSBuZXcgUHJvbWlzZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmLm9uUmVqZWN0KHNlbGYuZGF0YSk7XHJcblx0XHRcdHNlbGYucmV0LnJlamVjdChzZWxmLmRhdGEpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnRoZW4gPSBmdW5jdGlvbihyZXMsIHJlaikge1xyXG5cdFx0XHRzZWxmLnJldCA9IG5ldyBQcm9taXNlKCk7XHJcblxyXG5cdFx0XHRpZihyZXMgJiYgdHlwZW9mIHJlcyA9PT0gJ2Z1bmN0aW9uJylcclxuXHRcdFx0XHRzZWxmLm9uUmVzb2x2ZSA9IHJlcztcclxuXHJcblx0XHRcdGlmKHJlaiAmJiB0eXBlb2YgcmVqID09PSAnZnVuY3Rpb24nKVxyXG5cdFx0XHRcdHNlbGYub25SZWplY3QgPSByZWo7XHJcblxyXG5cclxuXHRcdFx0aWYoc2VsZi5yZXNvbHZlZCkge1xyXG5cdFx0XHRcdHNlbGYuX3Jlc29sdmUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoc2VsZi5yZWplY3RlZCkge1xyXG5cdFx0XHRcdHNlbGYuX3JlamVjdCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gc2VsZi5yZXQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuY2F0Y2ggPSBmdW5jdGlvbihjYikge1xyXG5cdFx0XHRpZihzZWxmLnJlamVjdGVkKVxyXG5cdFx0XHRcdGNiKHNlbGYuZGF0YSk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRzZWxmLm9uUmVqZWN0ID0gY2I7XHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdHdpbmRvdy5Qcm9taXNlLmFsbCA9IGZ1bmN0aW9uKGFycikge1xyXG5cdFx0dmFyIHAgPSBuZXcgUHJvbWlzZSgpO1xyXG5cclxuXHRcdHZhciBkYXRhID0gW107XHJcblxyXG5cdFx0aWYoYXJyLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRwLnJlc29sdmUoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFyci5mb3JFYWNoKGZ1bmN0aW9uKHByb20sIGluZGV4KSB7XHJcblx0XHRcdFx0cHJvbVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKGQpIHtcclxuXHRcdFx0XHRcdGlmKHAuZG9uZSlcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGRhdGFbaW5kZXhdID0gZDtcclxuXHRcdFx0XHRcdHZhciBhbGxSZXNvbHZlZCA9IGFyci5yZWR1Y2UoZnVuY3Rpb24oc3RhdGUsIHAxKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBzdGF0ZSAmJiBwMS5yZXNvbHZlZDtcclxuXHRcdFx0XHRcdH0sIHRydWUpO1xyXG5cdFx0XHRcdFx0aWYoYWxsUmVzb2x2ZWQpIHtcclxuXHRcdFx0XHRcdFx0cC5yZXNvbHZlKGRhdGEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuXHRcdFx0XHRcdHAucmVqZWN0KGVycik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBwO1xyXG5cdH07XHJcblxyXG59KSgpO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vcHJvbWlzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcbiAqIERlZmluZSBBamF4LUNsYXNzICYgaW5pdCBnbG9iYWwgU2luZ2xldG9uXHJcbiAqL1xyXG4oZnVuY3Rpb24oKSB7XHJcblx0dmFyIEFqYXggPSBmdW5jdGlvbigpIHt9O1xyXG5cclxuXHRBamF4LnByb3RvdHlwZS5hamF4ID0gZnVuY3Rpb24odXJsLCB0eXBlLCBkYXRhLCBqc29uKSB7XHJcblx0XHR2YXIgcCA9IG5ldyBQcm9taXNlKCk7XHJcblx0XHR2YXIgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0KSB7XHJcblx0XHRcdFx0dmFyIHJlc3AgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcclxuXHRcdFx0XHR2YXIgY3QgPSB4bWxodHRwLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKTtcclxuXHRcdFx0XHRpZihjdC5tYXRjaCgvLip0ZXh0XFwvanNvbi4qLykpIHtcclxuXHRcdFx0XHRcdHJlc3AgPSBKU09OLnBhcnNlKHJlc3ApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBcdHAucmVzb2x2ZShyZXNwKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cC5yZWplY3QocmVzcCk7XHJcblx0XHRcdFx0fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgeG1saHR0cC5vcGVuKHR5cGUsIHVybCwgdHJ1ZSk7XHJcblxyXG5cdFx0aWYoZGF0YSkge1xyXG5cdFx0XHRpZihqc29uKSB7XHJcblx0XHRcdFx0eG1saHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04XCIpO1xyXG5cdFx0XHRcdHhtbGh0dHAuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0eG1saHR0cC5zZW5kKGRhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR4bWxodHRwLnNlbmQoKTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHA7XHJcblx0fTtcclxuXHJcblx0QWpheC5wcm90b3R5cGUuR0VUID0gZnVuY3Rpb24odXJsKSB7XHJcblx0XHRyZXR1cm4gQWpheC5wcm90b3R5cGUuYWpheCh1cmwsICdHRVQnKTtcclxuXHR9O1xyXG5cclxuXHRBamF4LnByb3RvdHlwZS5HRVRfSlNPTiA9IGZ1bmN0aW9uKHVybCkge1xyXG5cdFx0cmV0dXJuIEFqYXgucHJvdG90eXBlLmFqYXgodXJsLCAnR0VUJywgdW5kZWZpbmVkLCB0cnVlKTtcclxuXHR9O1xyXG5cclxuXHRBamF4LnByb3RvdHlwZS5QT1NUX0pTT04gPSBmdW5jdGlvbih1cmwsIGRhdGEpIHtcclxuXHRcdHJldHVybiBBamF4LnByb3RvdHlwZS5hamF4KHVybCwgJ1BPU1QnLCBkYXRhLCB0cnVlKTtcclxuXHR9O1xyXG5cclxuXHRBamF4LnByb3RvdHlwZS5ERUxFVEVfSlNPTiA9IGZ1bmN0aW9uKHVybCwgZGF0YSkge1xyXG5cdFx0cmV0dXJuIEFqYXgucHJvdG90eXBlLmFqYXgodXJsLCAnREVMRVRFJywgZGF0YSwgdHJ1ZSk7XHJcblx0fTtcclxuXHJcblx0LypcclxuXHRBamF4LnByb3RvdHlwZS5HRVQgPSBmdW5jdGlvbih1cmwpIHtcclxuXHRcdHZhciBwID0gbmV3IFByb21pc2UoKTtcclxuXHRcdHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQgJiYgeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUoeG1saHR0cC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHhtbGh0dHAub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgICAgICB4bWxodHRwLnNlbmQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHA7XHJcblx0fVxyXG5cclxuXHRBamF4LnByb3RvdHlwZS5HRVRfSlNPTiA9IGZ1bmN0aW9uKHVybCkge1xyXG5cdFx0dmFyIHAgPSBuZXcgUHJvbWlzZSgpO1xyXG5cdFx0dmFyIHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZih4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiB4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHAucmVzb2x2ZShKU09OLnBhcnNlKHhtbGh0dHAucmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgeG1saHR0cC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgICAgIHhtbGh0dHAuc2VuZCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gcDtcclxuXHR9XHJcblxyXG5cdEFqYXgucHJvdG90eXBlLlBPU1RfSlNPTiA9IGZ1bmN0aW9uKHVybCwgZGF0YSkge1xyXG5cdFx0dmFyIHAgPSBuZXcgUHJvbWlzZSgpO1xyXG5cdFx0dmFyIHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZih4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiB4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHAucmVzb2x2ZShKU09OLnBhcnNlKHhtbGh0dHAucmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgeG1saHR0cC5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcclxuICAgICAgICB4bWxodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLThcIik7XHJcbiAgICAgICAgeG1saHR0cC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHA7XHJcblx0fVxyXG5cclxuXHRBamF4LnByb3RvdHlwZS5ERUxFVEVfSlNPTiA9IGZ1bmN0aW9uKHVybCwgZGF0YSkge1xyXG5cdFx0dmFyIHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZih4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiB4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHAucmVzb2x2ZShKU09OLnBhcnNlKHhtbGh0dHAucmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgeG1saHR0cC5vcGVuKCdERUxFVEUnLCB1cmwsIHRydWUpO1xyXG4gICAgICAgIHhtbGh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOFwiKTtcclxuICAgICAgICB4bWxodHRwLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcDtcclxuXHR9XHJcblxyXG5cdCovXHJcblxyXG5cdHdpbmRvdy5BSkFYID0gbmV3IEFqYXgoKTtcclxufSkoKTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2FqYXguanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XHJcblx0dmFyIEFjdGlvbnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRzZWxmLmxvYWRlZCA9IG5ldyBQcm9taXNlKCk7XHJcblxyXG5cdFx0QUpBWC5HRVRfSlNPTignYWN0aW9ucycpXHJcblx0XHQudGhlbihmdW5jdGlvbihhY3Rpb25zKSB7XHJcblx0XHRcdGFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRcdFx0c2VsZltuYW1lXSA9IHNlbGYuY3JlYXRlQWN0aW9uKG5hbWUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0c2VsZi5sb2FkZWQucmVzb2x2ZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdH07XHJcblxyXG5cdEFjdGlvbnMucHJvdG90eXBlLmNyZWF0ZUFjdGlvbiA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdHZhciBhY3Rpb24gPSBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdERJU1BBVENIRVIuZGlzcGF0Y2gobmFtZSwgZGF0YSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBhY3Rpb247XHJcblx0fTtcclxuXHJcblxyXG5cdHdpbmRvdy5BQ1RJT05TID0gbmV3IEFjdGlvbnMoKTtcclxuXHJcbn0pKCk7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9hY3Rpb24uanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XG5cdHdpbmRvdy5VVElMID0ge1xuXHRcdGxvYWRTY3JpcHQ6IGZ1bmN0aW9uKHNyYykge1xuXHRcdFx0dmFyIHAgPSBuZXcgUHJvbWlzZSgpO1xuXG5cdFx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFtzcmM9XCInK3NyYysnXCJdJyk7XG5cblx0XHRcdC8vLS0tLS0tLSBTY3JpcHQgYWxyZWFkeSBsb2FkZWRcblx0XHRcdGlmKHNjcmlwdHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRwLnJlc29sdmUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRcdFx0c2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjKTtcblx0XHRcdFx0c2NyaXB0LmFzeW5jID0gZmFsc2U7XG5cdFx0XHRcdHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRwLnJlc29sdmUoZSk7XG5cdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwO1xuXHRcdH0sXG5cblx0XHRsb2FkU3R5bGVzaGVldDogZnVuY3Rpb24oaHJlZikge1xuXHRcdFx0dmFyIHAgPSBuZXcgUHJvbWlzZSgpO1xuXG5cdFx0XHR2YXIgbGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW2hyZWY9XCInK2hyZWYrJ1wiXScpO1xuXG5cdFx0XHRpZihsaW5rcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHAucmVzb2x2ZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cdFx0XHRcdGxpbmsuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xuXHRcdFx0XHRsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXHRcdFx0XHRsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdHAucmVzb2x2ZShlKTtcblx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwO1xuXHRcdH1cblx0fTtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdXRpbC5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIihmdW5jdGlvbigpIHtcclxuXHR2YXIgUmVuZGVyID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0dGhpcy5TUEVDSUFMX0FUVFIgPSBbJ3JlcGVhdCcsICdjbG9uZWQnLCAnbW9kZWwnLCAndmlldyddO1xyXG5cclxuXHRcdHRoaXMucmVwbERhdGFzZXQgPSBmdW5jdGlvbihlbCwgbW9kZWwpIHtcclxuXHRcdFx0Zm9yKHZhciBuYW1lIGluIGVsLmRhdGFzZXQpIHtcclxuXHRcdFx0XHRzZWxmLnJlcGxEYXRhQXR0cihlbCwgbmFtZSwgbW9kZWwpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMucmVwbERhdGFBdHRyID0gZnVuY3Rpb24oZWwsIG5hbWUsIG1vZGVsKSB7XHJcblx0XHRcdC8vLS0tLS0tLSBTa2lwIHNwZWNpYWwgYXR0cmlidXRlc1xyXG5cdFx0XHRpZihzZWxmLlNQRUNJQUxfQVRUUi5pbmRleE9mKG5hbWUpICE9IC0xKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdGlmKGVsLmRhdGFzZXRbbmFtZV0gJiYgdHlwZW9mIGVsLmRhdGFzZXRbbmFtZV0gPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0dmFyIGF0dHIgPSBlbC5kYXRhc2V0W25hbWVdO1xyXG5cdFx0XHRcdGF0dHIgPSBzZWxmLmV2YWwoYXR0ciwgbW9kZWwpO1xyXG5cclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0ZWxbbmFtZV0gPSBhdHRyO1xyXG5cdFx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKG5hbWUsIGF0dHIpO1xyXG5cdFx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnIoJ2NvdWxkIG5vdCBzZXQgYXR0cmlidXRlICcgKyBuYW1lICsgJyBvbiBlbGVtZW50ICcgKyBlbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMucmVwbEhUTUwgPSBmdW5jdGlvbihlbCwgbW9kZWwpIHtcclxuXHRcdFx0ZWwuaW5uZXJIVE1MID0gc2VsZi5ldmFsKGVsLmlubmVySFRNTCwgbW9kZWwpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnJlcGwgPSBmdW5jdGlvbihzdHIsIG1vZGVsKSB7XHJcblx0XHRcdHZhciBwYXRoID0gc3RyLm1hdGNoKC9cXCR7KFtee31dKj8pfS8pO1xyXG5cdFx0XHRpZighcGF0aClcclxuXHRcdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0XHRwYXRoID0gcGF0aFsxXTtcclxuXHRcdFx0dmFyIHBhcnRzID0gcGF0aC5zcGxpdChcIi5cIik7XHJcblxyXG5cdFx0XHR2YXIgdmFsdWUgPSBtb2RlbDtcclxuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrICkge1xyXG5cdFx0XHRcdGlmKHBhcnRzW2ldICE9PSAnJylcclxuXHRcdFx0XHRcdHZhbHVlID0gdmFsdWVbcGFydHNbaV1dO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZih2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKVxyXG5cdFx0XHRcdHZhbHVlID0gJyc7XHJcblxyXG5cdFx0XHRzdHIgPSBzdHIucmVwbGFjZSgvXFwkeyhbXnt9XSo/KX0vLCB2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gc3RyO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmV2YWwgPSBmdW5jdGlvbihzdHIsIG1vZGVsKSB7XHJcblx0XHRcdHN0ciA9IHNlbGYucmVwbChzdHIsIG1vZGVsKTtcclxuXHJcblx0XHRcdHZhciBwYXRoID0gc3RyLm1hdGNoKC9cXCR7eyhbXnt9XSo/KX19Lyk7XHJcblx0XHRcdGlmKCFwYXRoKVxyXG5cdFx0XHRcdHJldHVybiBzdHI7XHJcblx0XHRcdHBhdGggPSBwYXRoWzFdO1xyXG5cclxuXHRcdFx0dmFyIHZhbHVlO1xyXG5cdFx0XHR3aXRoKG1vZGVsKSB7XHJcblx0XHRcdFx0dmFsdWUgPSBldmFsKHBhdGgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzdHIgPSBzdHIucmVwbGFjZSgvXFwke3soW157fV0qPyl9fS8sIHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMucGF0aCA9IGZ1bmN0aW9uKGF0dHIpIHtcclxuXHRcdFx0dmFyIHBhdGggPSBhdHRyLm1hdGNoKC9cXCR7KC4qKX0vKTtcclxuXHRcdFx0aWYoIXBhdGgpXHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdHBhdGggPSBwYXRoWzFdO1xyXG5cclxuXHRcdFx0cmV0dXJuIHBhdGg7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMucmVtb3ZlQ2xvbmVkID0gZnVuY3Rpb24oZWwpIHtcclxuXHRcdFx0ZWwgPSBlbCB8fCBkb2N1bWVudDtcclxuXHRcdFx0c2VsZi5yZW1vdmVFbGVtZW50cyhlbCwgJ1tkYXRhLWNsb25lZF0nKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnJlbW92ZUVsZW1lbnRzID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yKXtcclxuXHRcdCAgICBpZihzZWxlY3RvciA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHQgICAgXHRzZWxlY3RvciA9IGVsO1xyXG5cdFx0ICAgIFx0ZWwgPSBkb2N1bWVudDtcclxuXHRcdCAgICB9XHJcblxyXG5cdFx0XHR2YXIgZWxlbWVudHMgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHRcdCAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdCAgICAgICAgZWxlbWVudHNbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50c1tpXSk7XHJcblx0XHQgICAgfVxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdHdpbmRvdy5SRU5ERVIgPSBuZXcgUmVuZGVyKCk7XHJcbn0pKCk7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9yZW5kZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIoZnVuY3Rpb24oKSB7XHJcblx0d2luZG93LlNUT1JFUyA9IHt9O1xyXG5cclxuXHRTVE9SRVMubG9hZGVkID0gbmV3IFByb21pc2UoKTtcclxuXHJcblx0U1RPUkVTLmxvYWRTdG9yZSA9IGZ1bmN0aW9uKHMpIHtcclxuXHRcdHJldHVybiBVVElMLmxvYWRTY3JpcHQoJ3N0b3JlLycrcyk7XHJcblx0fTtcclxuXHJcblx0QUpBWC5HRVRfSlNPTihcInJvdXRlXCIpXHJcblx0LnRoZW4oZnVuY3Rpb24ocm91dGVzKSB7XHJcblx0XHRQcm9taXNlLmFsbChyb3V0ZXMuc3RvcmVzLm1hcChTVE9SRVMubG9hZFN0b3JlKSlcclxuXHRcdC50aGVuKFNUT1JFUy5sb2FkZWQucmVzb2x2ZSk7XHJcblx0fSk7XHJcblxyXG5cdC8qXHJcblx0ICogT3B0aW9uczoge25hbWUsIHVybCwgbG9hZCwgb2JqLCBpbml0RnVuY3Rpb25zfVxyXG5cdCAqL1xyXG5cdHdpbmRvdy5zdG9yZSA9IGZ1bmN0aW9uKG9wdCkge1xyXG5cclxuXHRcdHRoaXMuU1RPUkVfVVBEQVRFRCA9IFwiU1RPUkVfVVBEQVRFRFwiO1xyXG5cclxuXHRcdHRoaXMuU1RPUkVfR0VUX1NVQ0VTUyA9IG9wdC5uYW1lICsgXCJfR0VUX1NVQ0NFU1NcIjtcclxuXHRcdHRoaXMuU1RPUkVfR0VUX0VSUk9SID0gb3B0Lm5hbWUgKyBcIl9HRVRfRVJST1JcIjtcclxuXHJcblx0XHR0aGlzLlNUT1JFX1BPU1RfU1VDRVNTID0gb3B0Lm5hbWUgKyBcIl9QT1NUX1NVQ0NFU1NcIjtcclxuXHRcdHRoaXMuU1RPUkVfUE9TVF9FUlJPUiA9IG9wdC5uYW1lICsgXCJfUE9TVF9FUlJPUlwiO1xyXG5cclxuXHRcdHRoaXMuU1RPUkVfREVMRVRFX1NVQ0VTUyA9IG9wdC5uYW1lICsgXCJfREVMRVRFX1NVQ0NFU1NcIjtcclxuXHRcdHRoaXMuU1RPUkVfREVMRVRFX0VSUk9SID0gb3B0Lm5hbWUgKyBcIl9ERUxFVEVfRVJST1JcIjtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0dmFyIF9uYW1lID0gb3B0Lm5hbWU7XHJcblx0XHR2YXIgX3VybCA9IG9wdC51cmw7XHJcblx0XHR2YXIgX2RhdGEgPSBvcHQub2JqIHx8IHt9O1xyXG5cclxuXHJcblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0TGlzdGVuZXIuY2FsbChzZWxmLCBfbmFtZSk7XHJcblxyXG5cdFx0XHRvcHQuaW5pdEZ1bmN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGZ1bmMpIHtcclxuXHRcdFx0XHRuZXcgRnVuY3Rpb24oXCJzZWxmXCIsIGZ1bmMpLmNhbGwoc2VsZiwgc2VsZik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYob3B0LmxvYWQpIHtcclxuXHRcdFx0XHRzZWxmLmxvYWQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmxvYWQgPSBmdW5jdGlvbihpZCkge1xyXG5cdFx0XHRpZighX3VybCkgcmV0dXJuO1xyXG5cdFx0XHR2YXIgdXJsID0gX3VybCArIChpZCA/ICcvJytpZCA6ICcnKTtcclxuXHJcblx0XHRcdEFKQVguR0VUX0pTT04odXJsKVxyXG5cdFx0XHQudGhlbihzZWxmLnNldCk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmdldCA9IGZ1bmN0aW9uKGlkZW50aWZpZXIpIHtcclxuXHRcdFx0c3dpdGNoKHR5cGVvZiBpZGVudGlmaWVyKSB7XHJcblx0XHRcdFx0Y2FzZSBcInN0cmluZ1wiOlxyXG5cdFx0XHRcdFx0cmV0dXJuIF9kYXRhW2lkZW50aWZpZXJdO1xyXG5cdFx0XHRcdGNhc2UgXCJvYmplY3RcIjpcclxuXHRcdFx0XHRcdHJldHVybiBzZWxmLmZpbmQoaWRlbnRpZmllcik7XHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHJldHVybiBfZGF0YTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5zZXQgPSBmdW5jdGlvbihkKSB7XHJcblx0XHRcdF9kYXRhID0gZDtcclxuXHJcblx0XHRcdHNlbGYuY2hhbmdlZCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmZpbmQgPSBmdW5jdGlvbihvYmopIHtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IF9kYXRhLmZpbHRlcihmdW5jdGlvbihlbCkge1xyXG5cdFx0XHRcdHZhciBlcSA9IHRydWU7XHJcblx0XHRcdFx0Zm9yKHZhciBrZXkgaW4gb2JqKSB7XHJcblx0XHRcdFx0XHRpZihlcSAmJiBlbC5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGVsW2tleV0gPT0gb2JqW2tleV0pIHtcclxuXHRcdFx0XHRcdFx0ZXEgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0ZXEgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGVxO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0c3dpdGNoIChyZXN1bHQubGVuZ3RoKSB7XHJcblx0XHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdFswXTtcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnBvc3QgPSBmdW5jdGlvbihpZCkge1xyXG5cdFx0XHRpZighX3VybCkgcmV0dXJuO1xyXG5cdFx0XHR2YXIgdXJsID0gX3VybCArIChpZCA/ICcvJytpZCA6ICcnKTtcclxuXHJcblx0XHRcdEFKQVguUE9TVF9KU09OKHVybCwgX2RhdGEpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XHJcblx0XHRcdGlmKCFpZCkge1xyXG5cdFx0XHRcdHRocm93IFwiU3RvcmUjZGVsZXRlIG11c3QgYmUgY2FsbGVkIHdpdGggYW4gaWQgYXMgYXJndW1lbnRcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgdXJsID0gX3VybCArIChpZCA/ICcvJytpZCA6ICcnKTtcclxuXHJcblx0XHRcdEFKQVguREVMRVRFX0pTT04odXJsKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMuY2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRESVNQQVRDSEVSLmRpc3BhdGNoKHNlbGYuU1RPUkVfVVBEQVRFRCwgX25hbWUpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmLmluaXQoKTtcclxuXHJcblx0fTtcclxuXHJcblx0d2luZG93LnN0b3JlLnByb3RvdHlwZSA9IG5ldyBMaXN0ZW5lcigpO1xyXG5cdHdpbmRvdy5zdG9yZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSB3aW5kb3cuc3RvcmU7XHJcbn0pKCk7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zdG9yZS5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlciBzdHJpY3RcIjtcclxuXHJcbihmdW5jdGlvbigpIHtcclxuXHRmdW5jdGlvbiBWaWV3KCkge1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHRoaXMuVklFV19VUERBVEVEID0gXCJWSUVXX1VQREFURURcIjtcclxuXHRcdHZhciBoYW5kbGVycyA9IHt9O1xyXG5cclxuXHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZWxmLnJlZ2lzdGVySGFuZGxlcihcIlNUT1JFX1VQREFURURcIiwgZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnKltkYXRhLW1vZGVsPVwiJytuYW1lKydcIl0nKSwgc2VsZi5pbml0Q29udGFpbmVyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmluaXRWaWV3ID0gZnVuY3Rpb24odmlldykge1xyXG5cdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHZpZXcucXVlcnlTZWxlY3RvckFsbCgnKltkYXRhLW1vZGVsXScpLCBzZWxmLmluaXRDb250YWluZXIpO1xyXG5cdFx0XHRESVNQQVRDSEVSLmRpc3BhdGNoKHNlbGYuVklFV19VUERBVEVELCB2aWV3LmRhdGFzZXQudmlldyk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmluaXRDb250YWluZXIgPSBmdW5jdGlvbihjb250YWluZXIpIHtcclxuXHRcdFx0dmFyIG1vZGVsTmFtZSA9IGNvbnRhaW5lci5kYXRhc2V0Lm1vZGVsO1xyXG5cdFx0XHR2YXIgbW9kZWw7XHJcblx0XHRcdHdpdGgoU1RPUkVTKVxyXG5cdFx0XHRcdG1vZGVsID0gZXZhbChtb2RlbE5hbWUpO1xyXG5cdFx0XHRtb2RlbCA9IG1vZGVsLmdldCgpO1xyXG5cclxuXHRcdFx0c2VsZi5pbml0RWxlbWVudChjb250YWluZXIsIG1vZGVsLCBtb2RlbE5hbWUpO1xyXG5cdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGNvbnRhaW5lci5jaGlsZHJlbiwgZnVuY3Rpb24oZWwpIHtcclxuXHRcdFx0XHRzZWxmLmluaXRFbGVtZW50KGVsLCBtb2RlbCwgbW9kZWxOYW1lKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmluaXRFbGVtZW50ID0gZnVuY3Rpb24oZWwsIG1vZGVsLCBtb2RlbE5hbWUpIHtcclxuXHRcdFx0Ly8tLS0tLS0tIEZpbHRlciBUZXh0bm9kZXMgZXRjLlxyXG5cdFx0XHRpZighZWwuZGF0YXNldClcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0gc2tpcCBjbG9uZWQgdGFncyAtIHRoZXkgYXJlIGFscmVhZHkgcmVuZGVyZWRcclxuXHRcdFx0aWYoZWwuZGF0YXNldC5jbG9uZWQpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHJcblx0XHRcdC8vLS0tLS0tLSByZW5kZXIgZWxlbWVudFxyXG5cdFx0XHRpZihlbC5kYXRhc2V0LnJlcGVhdCkge1xyXG5cdFx0XHRcdHNlbGYuaW5pdFJlcGVhdEVsZW1lbnQoZWwsIG1vZGVsLCBtb2RlbE5hbWUpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLy0tLS0tLS0gcmVuZGVyIHJlcGVhdEVsZW1lbnRcclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0UkVOREVSLnJlcGxEYXRhc2V0KGVsLCBtb2RlbCwgbW9kZWxOYW1lKTtcclxuXHRcdFx0XHRpZihlbC5jaGlsZHJlbi5sZW5ndGggPT09IDApXHJcblx0XHRcdFx0XHRSRU5ERVIucmVwbEhUTUwoZWwsIG1vZGVsKTtcclxuXHJcblx0XHRcdFx0aWYoc2VsZlsnaW5pdCcrZWwudGFnTmFtZS50b1VwcGVyQ2FzZSgpXSlcclxuXHRcdFx0XHRcdHNlbGZbJ2luaXQnK2VsLnRhZ05hbWUudG9VcHBlckNhc2UoKV0oZWwsIG1vZGVsLCBtb2RlbE5hbWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLy0tLS0tLS0gZG8gcmVjdXJzaW9uXHJcblx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZWwuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKSB7XHJcblx0XHRcdFx0Ly8tLS0tLS0tIHNraXAgY2hpbGRyZW4gd2l0aCBvd24gZGF0YS1tb2RlbFxyXG5cdFx0XHRcdGlmKGNoaWxkLmRhdGFzZXQgJiYgY2hpbGQuZGF0YXNldC5tb2RlbClcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRzZWxmLmluaXRFbGVtZW50KGNoaWxkLCBtb2RlbCwgbW9kZWxOYW1lKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuaW5pdFJlcGVhdEVsZW1lbnQgPSBmdW5jdGlvbihlbCwgbW9kZWwsIG1vZGVsTmFtZSkge1xyXG5cdFx0XHRSRU5ERVIucmVtb3ZlQ2xvbmVkKGVsLnBhcmVudE5vZGUpO1xyXG5cdFx0XHRmb3IodmFyIGluZGV4IGluIG1vZGVsKSB7XHJcblx0XHRcdFx0dmFyIGNsb25lID0gZWwuY2xvbmVOb2RlKHRydWUpO1xyXG5cdFx0XHRcdGRlbGV0ZSBjbG9uZS5kYXRhc2V0LnJlcGVhdDtcclxuXHJcblx0XHRcdFx0Ly8tLS0tLS0tIHJlcGxhY2UgJHBhcmVudCB3aXRoIG1vZGVsICAod2l0aG91dCBrZXkpXHJcblx0XHRcdFx0Ly8tLS0tLS0tIHJlcGxhY2UgJGluZGV4IHdpdGggaW5kZXhcclxuXHRcdFx0XHRzZWxmLmluaXRFbGVtZW50KGNsb25lLCBtb2RlbFtpbmRleF0pO1xyXG5cclxuXHRcdFx0XHRjbG9uZS5kYXRhc2V0LmNsb25lZCA9IHRydWU7XHJcblxyXG5cdFx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoY2xvbmUucXVlcnlTZWxlY3RvckFsbChcIipcIiksIGZ1bmN0aW9uKGNoaWxkKSB7XHJcblx0XHRcdFx0XHRzZWxmLmluaXRFbGVtZW50KGNoaWxkLCBtb2RlbFtpbmRleF0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRlbC5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGNsb25lKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuaW5pdElOUFVUID0gZnVuY3Rpb24oZWwsIG1vZGVsLCBtb2RlbE5hbWUpIHtcclxuXHRcdFx0dmFyIHN0b3JlID0gZXZhbChtb2RlbE5hbWUpO1xyXG5cdFx0XHRlbC5vbmJsdXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgZGF0YSA9IHN0b3JlLmdldCgpO1xyXG5cdFx0XHRcdHZhciBwYXRoID0gUkVOREVSLnBhdGgoZWwuZGF0YXNldC52YWx1ZSk7XHJcblx0XHRcdFx0ZGF0YSA9IGV2YWwoXCJkYXRhLlwiK3BhdGgrXCI9J1wiK2VsLnZhbHVlK1wiJzsgZGF0YTtcIik7XHJcblx0XHRcdFx0c3RvcmUuc2V0KGRhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vLS0tLS0tLSBjYWxsICdDb25zdHJ1Y3RvcidcclxuXHRcdHNlbGYuaW5pdCgpO1xyXG5cdH1cclxuXHJcblx0Vmlldy5wcm90b3R5cGUgPSBuZXcgTGlzdGVuZXIoXCJWSUVXXCIpO1xyXG5cclxuXHR3aW5kb3cuVklFVyA9IG5ldyBWaWV3KCk7XHJcblxyXG59KSgpO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdmlldy5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIihmdW5jdGlvbigpIHtcclxuXHR2YXIgUm91dGVyID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0dGhpcy5ST1VURV9GSU5JU0hFRCA9IFwiUk9VVEVfRklOSVNIRURcIjtcclxuXHRcdHRoaXMucm91dGluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy52aWV3U3RhdGUgPSB7fTtcclxuXHRcdHRoaXMuaGFuZGxlcnM9IFtdO1xyXG5cclxuXHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZWxmLmluaXRGaW5pc2hlZEhhbmRsZXIoKTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdEFKQVguR0VUX0pTT04oXCJyb3V0ZVwiKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihyb3V0ZXMpIHtcclxuXHRcdFx0XHRyb3V0ZXMuc3RvcmVzLmZvckVhY2goU1RPUkVTLmxvYWRTdG9yZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQqL1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmluaXRGaW5pc2hlZEhhbmRsZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8tLS0tLS0tIExpc3RlbmVyIHRoYXQgZmlyZXMgUk9VVEVfRklOSVNIRUQgaWYgYWxsIHZpZXdzIGFyZSB1cGRhdGVkXHJcblx0XHRcdHNlbGYucmVnaXN0ZXJIYW5kbGVyKFwiVklFV19VUERBVEVEXCIsIGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdFx0XHRpZighc2VsZi52aWV3U3RhdGVbbmFtZV0pXHJcblx0XHRcdFx0XHRzZWxmLnZpZXdTdGF0ZVtuYW1lXSA9IHtsb2FkaW5nIDogZmFsc2UsIGh0bWw6IG51bGx9O1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHNlbGYudmlld1N0YXRlW25hbWVdLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0dmFyIGZpbmlzaGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRmb3IodmFyIHYgaW4gc2VsZi52aWV3U3RhdGUpIHtcclxuXHRcdFx0XHRcdGlmKCFzZWxmLnZpZXdTdGF0ZS5oYXNPd25Qcm9wZXJ0eSh2KSkgY29udGludWU7XHJcblx0XHRcdFx0XHRpZihmaW5pc2hlZCAmJiBzZWxmLnZpZXdTdGF0ZVt2XS5sb2FkaW5nKVxyXG5cdFx0XHRcdFx0XHRmaW5pc2hlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihmaW5pc2hlZCAmJiAhc2VsZi5yb3V0aW5nKSB7XHJcblx0XHRcdFx0XHRESVNQQVRDSEVSLmRpc3BhdGNoKHNlbGYuUk9VVEVfRklOSVNIRUQsIG51bGwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2V0Vmlld3N0YXRlID0gZnVuY3Rpb24odmlldykge1xyXG5cdFx0XHRpZih2aWV3KSB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGYudmlld1N0YXRlW3ZpZXddIHx8IHt9O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBzZWxmLnZpZXdTdGF0ZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnNldExvYWRpbmcgPSBmdW5jdGlvbih2aWV3cykge1xyXG5cdFx0XHQvLy0tLS0tLSBzZXQgYWxsIGF2YWlsYWJsZSB2aWV3cyB0byBsb2FkaW5nXHJcblx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwodmlld3MsIGZ1bmN0aW9uKHZpZXcpIHtcclxuXHRcdFx0XHR2YXIgdmlld05hbWUgPSB2aWV3LmRhdGFzZXQudmlldztcclxuXHRcdFx0XHRpZighc2VsZi52aWV3U3RhdGVbdmlld05hbWVdKSB7XHJcblx0XHRcdFx0XHRzZWxmLnZpZXdTdGF0ZVt2aWV3TmFtZV0gPSB7bG9hZGluZyA6IHRydWUsIGh0bWw6IG51bGx9O1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzZWxmLnZpZXdTdGF0ZVt2aWV3TmFtZV0ubG9hZGluZyA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc2V0Um91dGUgPSBmdW5jdGlvbihoYXNoKSB7XHJcblx0XHRcdHNlbGYucm91dGluZyA9IHRydWU7XHJcblx0XHRcdHZhciB2aWV3cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIqW2RhdGEtdmlld11cIik7XHJcblxyXG5cdFx0XHQvLy0tLS0tLSBzZXQgYWxsIGF2YWlsYWJsZSB2aWV3cyB0byBsb2FkaW5nXHJcblx0XHRcdHNlbGYuc2V0TG9hZGluZyh2aWV3cyk7XHJcblxyXG5cdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHZpZXdzLCBmdW5jdGlvbih2aWV3LCBpbmRleCkge1xyXG5cdFx0XHRcdHZhciBsYXN0ID0gaW5kZXgrMSA9PSB2aWV3cy5sZW5ndGg7XHJcblx0XHRcdFx0dmFyIHZpZXdOYW1lID0gdmlldy5kYXRhc2V0LnZpZXc7XHJcblxyXG5cdFx0XHRcdHZhciBodG1sID0gU1RBVEUuaHRtbEZvclZpZXcodmlld05hbWUpO1xyXG5cclxuXHRcdFx0XHQvLy0tLS0tLS0gTm8gUm91dGUgZm91bmRcclxuXHRcdFx0XHRpZihodG1sID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHR2aWV3LmlubmVySFRNTCA9IG51bGw7XHJcblx0XHRcdFx0XHRzZWxmLnZpZXdTdGF0ZVt2aWV3TmFtZV0uaHRtbCA9IG51bGw7XHJcblx0XHRcdFx0XHRpZihsYXN0KVxyXG5cdFx0XHRcdFx0XHRzZWxmLnJvdXRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdERJU1BBVENIRVIuZGlzcGF0Y2goJ1ZJRVdfVVBEQVRFRCcsIHZpZXdOYW1lKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHQvLy0tLS0tLS0gVmlldydzIGh0bWwgbmVlZHMgdG8gYmUgdXBkYXRlZFxyXG5cdFx0XHRcdGlmKHNlbGYudmlld1N0YXRlW3ZpZXdOYW1lXS5odG1sICE9IGh0bWwpIHtcclxuXHRcdFx0XHRcdHNlbGYudmlld1N0YXRlW3ZpZXdOYW1lXS5odG1sID0gaHRtbDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8tLS0tLS0tIFZpZXcncyBodG1sIGRvZXMgbm90IG5lZWQgdG8gY2hhbmdlXHJcblx0XHRcdFx0XHRpZihsYXN0KVxyXG5cdFx0XHRcdFx0XHRzZWxmLnJvdXRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdERJU1BBVENIRVIuZGlzcGF0Y2goJ1ZJRVdfVVBEQVRFRCcsIHZpZXdOYW1lKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHR2YXIgX3NldEhUTUwgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBhcmcxID0gdmlldztcclxuXHRcdFx0XHRcdHZhciBhcmcyID0gaHRtbC50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRzZXRIVE1MKGFyZzEsIGFyZzIpO1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9KCk7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0dmFyIHN0b3JlcyA9IFNUQVRFLnN0b3Jlc0ZvclZpZXcodmlld05hbWUpO1xyXG5cclxuXHRcdFx0XHRQcm9taXNlLmFsbChzdG9yZXMubWFwKFNUT1JFUy5sb2FkU3RvcmUpKVxyXG5cdFx0XHRcdC50aGVuKF9zZXRIVE1MKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0c2VsZi5yb3V0aW5nID0gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBzZXRIVE1MID0gZnVuY3Rpb24odmlldywgaHRtbCkge1xyXG5cdFx0XHR2YXIgdXJsID0gJ2h0bWwvJytodG1sKyhodG1sLmVuZHNXaXRoKCcuaHRtbCcpID8gJycgOiAnLmh0bWwnKTtcclxuXHRcdFx0QUpBWC5HRVQodXJsKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihyZXNwKSB7XHJcblx0XHRcdFx0dmlldy5pbm5lckhUTUwgPSByZXNwO1xyXG5cdFx0XHRcdFZJRVcuaW5pdFZpZXcodmlldyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLy0tLS0tLS0gY2FsbCAnQ29uc3RydWN0b3InXHJcblx0XHRzZWxmLmluaXQoKTtcclxuXHR9O1xyXG5cclxuXHRSb3V0ZXIucHJvdG90eXBlID0gbmV3IExpc3RlbmVyKFwiUk9VVEVSXCIpO1xyXG5cclxuXHR3aW5kb3cuUk9VVEVSID0gbmV3IFJvdXRlcigpO1xyXG59KSgpO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vcm91dGVyLmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBTdGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHRoaXMuc3RhdGUgPSB1bmRlZmluZWQ7XHJcblx0XHR0aGlzLm1hcHBpbmcgPSBudWxsO1xyXG5cdFx0dGhpcy5hcmdzID0gbnVsbDtcclxuXHJcblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0UHJvbWlzZS5hbGwoW0FDVElPTlMubG9hZGVkLCBTVE9SRVMubG9hZGVkXSlcclxuXHRcdFx0LnRoZW4oc2VsZi5hamF4TWFwcGluZyk7XHJcblxyXG5cdFx0XHQvL3NlbGYuYWpheE1hcHBpbmcoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5hamF4TWFwcGluZyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRBSkFYLkdFVF9KU09OKCdzdGF0ZScpXHJcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHN0YXRlcykge1xyXG5cdFx0XHRcdHNlbGYubWFwcGluZyA9IHN0YXRlcztcclxuXHRcdFx0XHRzZWxmLmluaXRNYXBwaW5nKCk7XHJcblx0XHRcdFx0c2VsZi5pbml0TGlzdGVuZXIoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuaW5pdE1hcHBpbmcgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8tLS0tLS0tIGNyZWF0ZSBhIG1ldGhvZCBmb3IgZXZlcnkgc3RhdGVcclxuXHRcdFx0c2VsZi5tYXBwaW5nLmZvckVhY2goZnVuY3Rpb24oc3RhdGUpIHtcclxuXHRcdFx0XHRpZighc3RhdGUubmFtZSkgdGhyb3cgXCJFdmVyeSBTdGF0ZSBuZWVkcyBhIG5hbWUgYXR0aWJ1dGVcIjtcclxuXHRcdFx0XHRpZighc3RhdGUudXJsKSB0aHJvdyBcIkV2ZXJ5IFN0YXRlIG5lZWRzIGFuIHVybCBhdHRpYnV0ZVwiO1xyXG5cdFx0XHRcdHN0YXRlLmFjdGlvbnMgPSBzdGF0ZS5hY3Rpb25zIHx8IFtdO1xyXG5cdFx0XHRcdHN0YXRlLnByb21pc2VzID0gc3RhdGUucHJvbWlzZXMgfHwgW107XHJcblx0XHRcdFx0c3RhdGUudmlld3MgPSBzdGF0ZS52aWV3cyB8fCBbXTtcclxuXHJcblx0XHRcdFx0c2VsZltzdGF0ZS5uYW1lXSA9IGZ1bmN0aW9uKGFyZ3MsIGV4dGVybikge1xyXG5cclxuXHRcdFx0XHRcdGlmKHNlbGYuc3RhdGUgJiYgc3RhdGUubmFtZSA9PT0gc2VsZi5zdGF0ZS5uYW1lICYmIGFyZ3MgPT09IHNlbGYuYXJncylcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdGlmKCEhc3RhdGUucmVkaXJlY3QpIHtcclxuXHRcdFx0XHRcdFx0c2VsZltzdGF0ZS5yZWRpcmVjdF0oYXJncywgZXh0ZXJuKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vVE9ETyBoYW5kbGVyIHByb21pc2VzICYgYWN0aW9uc1xyXG5cclxuXHRcdFx0XHRcdGV4dGVybiA9ICEhIGV4dGVybjtcclxuXHJcblx0XHRcdFx0XHQvLy0tLS0tLS0gc2V0IGN1cnJlbnQgc3RhdGUgJiBhcmd1bWVudHNcclxuXHRcdFx0XHRcdHNlbGYuc3RhdGUgPSBzdGF0ZTtcclxuXHRcdFx0XHRcdHNlbGYuYXJncyA9IGFyZ3M7XHJcblx0XHRcdFx0XHQvLy0tLS0tLS0gY3JlYXRlIExpc3RlbmVyIGZvciBldmVyeSBhY3Rpb25cclxuXHJcblx0XHRcdFx0XHRzZWxmLnJlZ2lzdGVySGFuZGxlcignUk9VVEVfRklOSVNIRUQnLCBESVNQQVRDSEVSLmRpc3BhdGNoLmJpbmQoRElTUEFUQ0hFUiwgJ1NUQVRFXycrc3RhdGUubmFtZSwgYXJncyksIHRydWUpO1xyXG5cclxuXHRcdFx0XHRcdHN0YXRlLmFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbihhY3Rpb24pIHtcclxuXHRcdFx0XHRcdFx0c2VsZi5yZWdpc3RlckhhbmRsZXIoJ1JPVVRFX0ZJTklTSEVEJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0RElTUEFUQ0hFUi5kaXNwYXRjaChhY3Rpb24sIGFyZ3MpO1xyXG5cdFx0XHRcdFx0XHR9LCB0cnVlKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdC8vLS0tLS0tLSBzZXQgdXJsIGFuZCByZW5kZXIgdmlld3NcclxuXHRcdFx0XHRcdHZhciB1cmwgPSBzZWxmLnVybEZyb21TdGF0ZShzdGF0ZS51cmwsIGFyZ3MpO1xyXG5cdFx0XHRcdFx0Uk9VVEVSLnNldFJvdXRlKHVybCk7XHJcblxyXG5cdFx0XHRcdFx0Ly8tLS0tLS0tIHNldCB1cmwgZm9yIGJyb3dzZXJcclxuXHRcdFx0XHRcdHNlbGYuc2V0VXJsKHVybCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuaW5pdExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBzZWxmLm9uSGFzaENoYW5nZSgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLm9uSGFzaENoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgcyA9IHNlbGYuc3RhdGVGcm9tVXJsKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKSk7XHJcblx0XHRcdHNlbGZbcy5zdGF0ZV0ocy5hcmdzLCB0cnVlKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5zZXRVcmwgPSBmdW5jdGlvbih1cmwpIHtcclxuXHRcdFx0aWYod2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpID09PSB1cmwpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0dmFyIGwgPSB3aW5kb3cub25oYXNoY2hhbmdlO1xyXG5cdFx0XHR3aW5kb3cub25oYXNoY2hhbmdlID0gbnVsbDtcclxuXHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdXJsO1xyXG5cclxuXHRcdFx0d2luZG93Lm9uaGFzaGNoYW5nZSA9IGw7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMucmVnZXhGcm9tVXJsID0gZnVuY3Rpb24odXJsKSB7XHJcblx0XHRcdHZhciByZWdleCA9IC86KFtcXHddKykvO1xyXG5cdFx0XHR3aGlsZSh1cmwubWF0Y2gocmVnZXgpKSB7XHJcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UocmVnZXgsIFwiKFteXFwvXSspXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB1cmwrJyQnO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmFyZ3NGcm9tVXJsID0gZnVuY3Rpb24ocGF0dGVybiwgdXJsKSB7XHJcblx0XHRcdHZhciByID0gc2VsZi5yZWdleEZyb21VcmwocGF0dGVybik7XHJcblx0XHRcdHZhciBuYW1lcyA9IHBhdHRlcm4ubWF0Y2gocik7XHJcblx0XHRcdHZhciB2YWx1ZXMgPSB1cmwubWF0Y2gocik7XHJcblxyXG5cdFx0XHR2YXIgYXJncyA9IHt9O1xyXG5cdFx0XHRuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUsIGkpIHtcclxuXHRcdFx0XHRpZihpID09PSAwKSByZXR1cm47XHJcblx0XHRcdFx0YXJnc1tuYW1lLnN1YnN0cigxKV0gPSB2YWx1ZXNbaV07XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIGFyZ3M7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc3RhdGVGcm9tVXJsID0gZnVuY3Rpb24odXJsKSB7XHJcblx0XHRcdHZhciBzO1xyXG5cdFx0XHRzZWxmLm1hcHBpbmcuZm9yRWFjaChmdW5jdGlvbihzdGF0ZSkge1xyXG5cdFx0XHRcdGlmKHMpXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHRcdHZhciByID0gc2VsZi5yZWdleEZyb21Vcmwoc3RhdGUudXJsKTtcclxuXHRcdFx0XHRpZih1cmwubWF0Y2gocikpIHtcclxuXHRcdFx0XHRcdHZhciBhcmdzID0gc2VsZi5hcmdzRnJvbVVybChzdGF0ZS51cmwsIHVybCk7XHJcblx0XHRcdFx0XHRzID0ge1xyXG5cdFx0XHRcdFx0XHRcInN0YXRlXCI6IHN0YXRlLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwiYXJnc1wiOiBhcmdzXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZighcykgdGhyb3cgXCJObyBTdGF0ZSBmb3VuZCBmb3IgdXJsIFwiK3VybDtcclxuXHJcblx0XHRcdHJldHVybiBzO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnVybEZyb21TdGF0ZSA9IGZ1bmN0aW9uKHVybCwgYXJncykge1xyXG5cdFx0XHR2YXIgcmVnZXggPSAvOihbXFx3XSspLztcclxuXHRcdFx0d2hpbGUodXJsLm1hdGNoKHJlZ2V4KSkge1xyXG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4LCBmdW5jdGlvbihtKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYXJnc1ttLnN1YnN0cigxKV07XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5odG1sRm9yVmlldyA9IGZ1bmN0aW9uKHZpZXdOYW1lKSB7XHJcblx0XHRcdHZhciB2ID0gc2VsZi52aWV3Rm9yTmFtZSh2aWV3TmFtZSk7XHJcblx0XHRcdHJldHVybiB2ICYmIHYuaHRtbDtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5zdG9yZXNGb3JWaWV3ID0gZnVuY3Rpb24odmlld05hbWUpIHtcclxuXHRcdFx0dmFyIHYgPSBzZWxmLnZpZXdGb3JOYW1lKHZpZXdOYW1lKTtcclxuXHRcdFx0cmV0dXJuIHYgJiYgdi5zdG9yZXMgfHwgW107XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMudmlld0Zvck5hbWUgPSBmdW5jdGlvbih2aWV3TmFtZSkge1xyXG5cdFx0XHR2YXIgcmV0ID0gbnVsbDtcclxuXHRcdFx0c2VsZi5zdGF0ZS52aWV3cy5mb3JFYWNoKGZ1bmN0aW9uKHZpZXcpIHtcclxuXHRcdFx0XHRpZighcmV0ICYmIHZpZXcubmFtZSA9PSB2aWV3TmFtZSlcclxuXHRcdFx0XHRcdHJldCA9IHZpZXc7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gcmV0O1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0c2VsZi5pbml0KCk7XHJcblx0fTtcclxuXHJcblx0U3RhdGUucHJvdG90eXBlID0gbmV3IExpc3RlbmVyKFwiU1RBVEVcIik7XHJcblxyXG5cdHdpbmRvdy5TVEFURSA9IG5ldyBTdGF0ZSgpO1xyXG59KSgpO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3RhdGUuanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==