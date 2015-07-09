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
