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
