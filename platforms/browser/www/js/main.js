var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		dontBack();
		document.addEventListener("backbutton", onBackKeyDown, false);
		app.receivedEvent('deviceready');
	},
	receivedEvent: function(id) {
		start();
	}
};

function ready() { 
	//window.localStorage.clear();
	if ( window.localStorage.getItem("pk0") == null ) {
		window.localStorage.setItem("pk0", "025");
		window.localStorage.setItem("lv0", 5);
		window.localStorage.setItem("xp0", 250);
		window.localStorage.setItem("cp0", cp_dict["025"]["CP"]);
		window.localStorage.setItem("dx025", "capturado");
		window.localStorage.setItem("pokeball", 10);
		window.localStorage.setItem("superball", 0);
		window.localStorage.setItem("ultraball", 0);
		window.localStorage.setItem("dinero", 3000);
		window.localStorage.setItem("lider", 0);
		window.localStorage.setItem("ganar", 0);
		window.localStorage.setItem("total", 0);
	}
	printMenu();
}

function start() {
	setXpDict({0:0});
}

function printMenu() {
	document.getElementById("menu").innerHTML = "<center><legend style='padding: 10px;'><b class='subtitle'>Pokemon Mini Go</b></legend></center><div id='list'></div>";
	var content = '<br />' + 
	'<input type="button" class="menu red" value="Pokedex" onclick="showPokedex();">' + 
	'<input type="button" class="menu yellow" value="Bolsa" onclick="showBag();">' + 
	'<input type="button" class="menu green" value="Pokemon" onclick="showPokemon();">' + 
	'<input type="button" class="menu cyan" value="Tienda" onclick="showShop();">' + 
	'<input type="button" class="menu blue" value="Ruta" onclick="showPath();">' + 
	'<hr class="vs"><input type="button" class="menu black" value="Salir" onclick="closeApp();">';
	document.getElementById("list").innerHTML = content;
	document.getElementById("menu").style.display = "";
}

function showPokedex() {
	location.href="./pokedex.html";
}

function showBag() {
	location.href="./bolsa.html";
}

function showPokemon() {
	location.href="./pokemon.html";
}

function showShop() {
	location.href="./tienda.html";
}

function showPath() {
	location.href="./ruta.html";
}

function closeApp() {
	var exit = confirm("¿Salir de la aplicación?")
	if ( exit ) navigator.app.exitApp();
}

function dontBack(){
	window.location.hash="no-back-button";
	window.location.hash="Again-No-back-button"
	window.onhashchange=function(){
		window.location.hash="no-back-button";
	}
}

function onBackKeyDown(e) {
	e.preventDefault();
}

$(window).bind('resize',function(e) { null; });

$(window).bind('orientationchange',function(e) { null; });
