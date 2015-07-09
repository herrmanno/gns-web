(function() {
	window.DIALOG = {};
	DIALOG.VIEWID = 'dialog';

	var dialog = document.createElement('div');
	dialog.dataset.model = 'DIALOG_STORE';
	dialog.dataset.style = 'display: ${};';

	dialog.id = 'dialog';


	var content = document.createElement('div');
	content.id = 'dialog-content';
	content.dataset.view = DIALOG.VIEWID;

	dialog.appendChild(content);

	var timer = setInterval( function () {
	    if ( document.readyState !== 'complete' ) return;
	    clearInterval( timer );
	    document.body.appendChild(dialog);

	}, 100 );
})();
