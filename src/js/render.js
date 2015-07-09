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
