var collection = []

var load_completed = false;

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
	printLegend();
	loadBox();
}

function start() {
	setXpDict({0:0});
}

function loadBox() {
	fitBox();
	var total = parseInt(window.localStorage.getItem("total"),10);
	var i = 0;
	var p
	var refreshIntervalId = setInterval(function() {
		if ( i <= ( total ) ) {
			if ( window.localStorage.getItem("pk"+i) != null && window.localStorage.getItem("st"+i) != "ko" ) {
				printBox(i);
			}
			if ( i == total && !load_completed ) {
				var legend = '<div onclick="searchBox();" class="active box"><div>Caja</div></div>' +
				'<div onclick="orderBox()" class="inactive order"><div id="orden">Fecha ▲</div></div>' + 
				'<div onclick="freePkmn()" class="inactive delete"id="libre"><div>Liberar</div></div>';
				document.getElementById("loading").style.display = 'none';
				document.getElementById("legend").innerHTML = legend;
				document.getElementById("libre").className += " disabled";
				var list = document.getElementsByClassName('pkmn');
				for(i=0; i<list.length; i++) list[i].classList.add("visible");
				load_completed = true;
			}
		} else clearInterval(refreshIntervalId);
		i++
	}, 0);
}

function fitBox() {
	var h1 = document.getElementById("body").offsetHeight-50;
	document.getElementById("pkbox").style.height = h1+"px";
	if ( document.getElementById("legend").offsetHeight > 50 ) var h2 = document.getElementById("pkbox").offsetHeight-60;
	else var h2 = document.getElementById("pkbox").offsetHeight-45;
	document.getElementById("list").style.height = h2+"px";
	var h3 = document.getElementById("body").offsetWidth-50;
	try {
		if ( h3 <= 350 ) document.getElementById("num").style.display = 'none';
		else document.getElementById("num").style.display = '';
	} catch(err) { null; }
}

function printLegend() {
	var legend = '<div style="cursor:default;" class="active"><div>Cargando</div></div>' +
	'<div class="init inactive"><div class="init">&nbsp;</div></div>'
	document.getElementById("pkbox").innerHTML = "<legend id='legend'>"+legend+"</legend>" + 
	"<div id='list'><img id='loading' title='Cargando...' src='img/loading.gif' /></div>";
}

function setLeader(idx) {
	window.localStorage.setItem("lider", idx);
	window.history.back();
}

function printBox(idx) {
	var lider = window.localStorage.getItem("lider");
	var pkmn = window.localStorage.getItem("pk"+idx);
	var lv = parseInt(window.localStorage.getItem("lv"+idx),10);
	if ( lv < 5 ) { lv = 5; window.localStorage.setItem("lv"+idx, 5); }
	var xp = parseInt(window.localStorage.getItem("xp"+idx),10);
	if ( xp < 250 ) { xp = 250; window.localStorage.setItem("xp"+idx, 250); }
	var cp = parseInt(cp_dict[pkmn]["CP"],10);
	if ( idx > 0 && window.localStorage.getItem("st"+idx) == null ) {
		var p = Math.floor( Math.random() * ( cp / 10 ) ) + 1;
		var c = Math.floor( Math.random() * 2 );
		if ( c == 0 ) c--;
		window.localStorage.setItem("cp"+idx, cp+c*p);
		window.localStorage.setItem("st"+idx, "ok");
	}
	cp = parseInt(window.localStorage.getItem("cp"+idx),10);
	var pokemon = "<div id='id_"+idx+"' title='"+pkmn+"' class='pkmn'>";
	pokemon += "<img onclick='setLeader("+idx+")' class='pk_img' src='pkmn/"+pkmn+".png' />"
	pokemon += "<input type='button' onclick='setLeader("+idx+")' class='pk_name' value='Nivel: "+lv+"' />";
	pokemon += "<input type='button' onclick='setLeader("+idx+")' class='pk_name pk_cp' value='CP: "+(cp*lv).toLocaleString()+"' />";
	if ( idx != lider ) pokemon += "<input type='checkbox' onclick='check(this);' class='pk_name pk_check' id='"+idx+"' value="+pkmn+" />";
	pokemon += "</div>";
	var newcontent = document.createElement('div');
	newcontent.innerHTML = pokemon;
	document.getElementById("list").appendChild(newcontent.firstChild);
	if ( !load_completed ) collection.push([idx,pkmn,lv,lv*cp]);
}

function orderBox() {
	var orden = document.getElementById("orden").innerHTML;
	switch (orden) {
		case "Fecha ▲":
			collection.sort(function(a,b){return a[1]-b[1];});
			document.getElementById("orden").innerHTML = "Número ▲";
			break;
		case "Fecha ▼":
			collection.sort(function(a,b){return b[1]-a[1];});
			document.getElementById("orden").innerHTML = "Número ▼";
			break;
		case "Número ▲":
			collection.sort(function(a,b){return a[2]-b[2];});
			document.getElementById("orden").innerHTML = "Nivel ▲";
			break;
		case "Número ▼":
			collection.sort(function(a,b){return b[2]-a[2];});
			document.getElementById("orden").innerHTML = "Nivel ▼";
			break;
		case "Nivel ▲":
			collection.sort(function(a,b){return a[3]-b[3];});
			document.getElementById("orden").innerHTML = "CP ▲";
			break;
		case "Nivel ▼":
			collection.sort(function(a,b){return b[3]-a[3];});
			document.getElementById("orden").innerHTML = "CP ▼";
			break;
		case "CP ▲":
			collection.sort(function(a,b){return b[0]-a[0];});
			document.getElementById("orden").innerHTML = "Fecha ▼";
			break;
		case "CP ▼":
			collection.sort(function(a,b){return a[0]-b[0];});
			document.getElementById("orden").innerHTML = "Fecha ▲";
			break;
	}
	document.getElementById("list").innerHTML = "";
	for ( i = 0 ; i < collection.length ; i++ ) printBox(collection[i][0]);
	var list = document.getElementsByClassName('pkmn');
	for(i=0; i<list.length; i++) list[i].classList.add("visible");
}

function freePkmn() {
	var selected = []
	var all = document.getElementsByClassName("pk_check");
	for ( i = 0 ; i < all.length ; i++ ) 
		if ( all[i].checked ) selected.push(  parseInt(all[i].id, 10) )
	var exit = confirm("¿Liberar " + selected.length.toLocaleString() + " Pokemon?")
	if ( exit ) {
		for ( i = 0 ; i < selected.length ; i++ ) {
			var idx = selected[i];
			window.localStorage.setItem("st"+idx, "ko");
		}
		location.reload();
	}
}

function searchBox() {
	var search = prompt("Buscar pokemon en la caja");
	if ( search == null ) search = ""
	var list = document.querySelectorAll('.pkmn');
	for ( i = 0 ; i < list.length ; i++ ) 
		if ( parseInt(search, 10) == parseInt(list[i].title, 10) )
			list[i].style.display = "";
		else
			list[i].style.display = "none";
	for ( i = 0 ; i < collection.length ; i++ )
		if ( pk_dict[collection[i][1]].nombre.toLowerCase().indexOf(search.toLowerCase()) >= 0 )
			document.getElementById("id_"+collection[i][0]).style.display = "";
}

function check(obj) {
	var selected = []
	var all = document.getElementsByClassName("pk_check");
	for ( i = 0 ; i < all.length ; i++ ) 
		if ( all[i].checked ) selected.push(  parseInt(all[i].id, 10) )
	if ( selected.length > 0 ) document.getElementById("libre").className = "inactive delete";
	else document.getElementById("libre").className = "inactive delete disabled";
}

$(window).bind('resize',function(e) { fitBox(); });

$(window).bind('orientationchange',function(e) { fitBox(); });
