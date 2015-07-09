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
