window.onerror = function(msg, url, linenumber) {
    var text = 'Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber;
    alert(text);
};

require("./promise.js");
require("./ajax.js");
require("./action.js");

require("./util.js");

require("./render.js");
require("./dispatcher.js");
require("./store.js");
require("./view.js");
require("./router.js");
require("./state.js");
