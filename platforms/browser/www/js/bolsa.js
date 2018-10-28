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
	var dinero = parseInt(window.localStorage.getItem("dinero"),10);
	var pokeball = parseInt(window.localStorage.getItem("pokeball"),10);
	var superball = parseInt(window.localStorage.getItem("superball"),10);
	var ultraball = parseInt(window.localStorage.getItem("ultraball"),10);
	var ganar = parseInt(window.localStorage.getItem("ganar"),10);
	var total = parseInt(window.localStorage.getItem("total"),10);
	var libre = getLibres();
	var vistas = getVistas();
	var capturadas = getCapturadas();
	var comptelado = Math.floor((100*(vistas+capturadas))/(last_pokemon*2))
	var content = '<table class="status">' +
	'<tr><td style="width:64%"><b>Dinero en la bolsa</b>:</td><td>'+dinero.toLocaleString()+'</td></tr></table><hr><table class="status">' + 
	'<tr><td style="width:64%"><b>Pokeballs restantes</b>:</td><td>'+pokeball.toLocaleString()+'</td></tr>' + 
	'<tr><td style="width:64%"><b>Superballs restantes</b>:</td><td>'+superball.toLocaleString()+'</td></tr>' + 
	'<tr><td style="width:64%"><b>Ultraballs restantes</b>:</td><td>'+ultraball.toLocaleString()+'</td></tr></table><hr><table class="status">' + 
	'<tr><td style="width:64%"><b>Pokemon derrotados</b>:</td><td>'+ganar.toLocaleString()+'</td></tr>' + 
	'<tr><td style="width:64%"><b>Pokemon capturados</b>:</td><td>'+total.toLocaleString()+'</td></tr>' + 
	'<tr><td style="width:64%"><b>Pokemon liberados</b>:</td><td>'+libre.toLocaleString()+'</td></tr></table><hr><table class="status">' + 
	'<tr><td style="width:64%"><b>Especies vistas</b>:</td><td>'+vistas+'/'+last_pokemon+'</td></tr>' + 
	'<tr><td style="width:64%"><b>Especies capturadas</b>:</td><td>'+capturadas+'/'+last_pokemon+'</td></tr>' + 
	'<tr><td style="width:64%"><b>Pokedex completada</b>:</td><td>'+comptelado+'%</td></tr></table>';
	var buttons = '<center><div onclick="getCandy()" id="caramelos">🍬</div></center>';
	document.getElementById("content").innerHTML = content;
	document.getElementById("bag").innerHTML += buttons;
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
