var summary = window.location.search.substr(1).split("=")[1].split(",");

var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},
	receivedEvent: function(id) {
		start();
	}
};

function start() {
	fitContent();
	printSummary();
}

function printSummary() {
	var content = '<table class="status summary">';
	for (i=0;i<pk_types.length;i++) if (summary[i]>0) content += '<tr><td style="width:75%;"><b>Caramelo '+pk_types[i]+'</b>:</td><td> + '+summary[i]+'</td></tr>';
	content += '</table>';
	var title = '<center><div id="resumen">Caramelos Conseguidos</div></center>';
	document.getElementById("content").innerHTML = content;
	document.getElementById("bag").innerHTML = title + document.getElementById("bag").innerHTML;
	document.getElementById("bag").style.display = "";
}

function fitContent() {
	var h1 = document.getElementById("body").offsetHeight-75;
	document.getElementById("content").style.height = h1+"px";
}

$(window).bind('resize',function(e) { fitContent(); });

$(window).bind('orientationchange',function(e) { fitContent(); });
