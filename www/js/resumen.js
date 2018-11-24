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
	printBag();
}

function printBag() {
	var content = '<table class="status summary">';
	for (i=0;i<pk_types.length;i++) if (summary[i]>0) content += '<tr><td style="width:75%;"><b>Caramelo '+pk_types[i]+'</b>:</td><td> + '+summary[i]+'</td></tr>';
	content += '</table>';
	var title = '<center><div id="resumen">Caramelos Obtenidos</div></center>';
	document.getElementById("content").innerHTML = content;
	document.getElementById("bag").innerHTML = title + document.getElementById("bag").innerHTML;
	document.getElementById("bag").style.display = "";
}

function getLibres() {
	var c = 0;
	var total = parseInt(window.localStorage.getItem("total"),10);
	for (i=0;i<=total;i++){
		if ( window.localStorage.getItem("st"+i) == 'ko' ) c++;
	}
	return c;
}

function getVistas() {
	var c = 0;
	for (i=1;i<=last_pokemon;i++){
		var pkmn = i<10?"00"+i:i<100?"0"+i:i
		if ( window.localStorage.getItem("dx"+pkmn) != null ) c++;
	}
	return c;
}

function getCapturadas() {
	var c = 0;
	for (i=1;i<=last_pokemon;i++){
		var pkmn = i<10?"00"+i:i<100?"0"+i:i
		if ( window.localStorage.getItem("dx"+pkmn) == "capturado" ) c++;
	}
	return c;
}

function getCandy() {
	location.href="./caramelos.html";
}

function fitContent() {
	var h1 = document.getElementById("body").offsetHeight-75;
	document.getElementById("content").style.height = h1+"px";
}

$(window).bind('resize',function(e) { fitContent(); });

$(window).bind('orientationchange',function(e) { fitContent(); });
