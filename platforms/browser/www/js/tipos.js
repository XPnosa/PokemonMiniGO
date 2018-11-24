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

function ready() {
	printTypes();
}

function start() {
	setXpDict({0:0});
}

function printTypes() {
	document.getElementById("menu").innerHTML = "<center><legend style='padding: 10px;'><b class='subtitle'>Filtrar Pokemon</b></legend></center><div id='list' style='top:0'></div>";
	var content = '<center>';
	for (i=0;i<pk_types.length;i++) content += '<input type="button" class="menu alt '+pk_types[i]+'" value="'+pk_types[i]+'" onclick="filerType(\''+pk_types[i]+'\');">';
	content += '<hr><input type="button" style="width: 90%; border-radius: 10px;" class="menu white" value="MOSTRAR TODOS" onclick="location.href = \'caja.html\';"></center>';
	document.getElementById("list").innerHTML = content;
	document.getElementById("menu").style.display = "";
}

function filerType(tipo) {
	location.href = 'caja.html?tipo='+tipo;
}
