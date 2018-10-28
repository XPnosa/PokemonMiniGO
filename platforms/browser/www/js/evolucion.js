var id = window.location.search.substr(1).split("=")[1]

var bool = [false,false]

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
		fitPartner();
		start();
	}
};

function ready() {
	printPokemon();
}

function start() {
	setXpDict({0:0});
}

function printPokemon() {
	var pkmn = window.localStorage.getItem("pk"+id);
	var nombre = pk_dict[pkmn]["nombre"];
	var forma = ev_dict[pkmn]["form"];
	var evos = ev_dict[pkmn]["evol"];
	var cp = parseInt(window.localStorage.getItem("cp"+id),10);
	var msg = '<center style="height:99%font-size: 20px;position: relative;top: +15px;"><b id="msg_txt">¿Evolucionar a '+nombre+'?</b></center>';
	var partner = '<center style="height:99%"><img id="pkmn" style="height:99%;width:auto;max-width:99%;position:relative;top:50%;transform:translateY(-50%);" src="pkmn/'+pkmn+'.png" /></center>';
	var sub = '<center style="height:100%;overflow-x:auto;overflow-y:hidden;white-space:nowrap;">'
	for (i=0;i<evos.length;i++) {
		var evo = evos[i]
		if ( window.localStorage.getItem("dx"+evo) == 'capturado' ) var style = "margin: 10px; height: 75px; filter: opacity(100%);";
		else if ( window.localStorage.getItem("dx"+evo) == 'visto' ) var style = "margin: 10px; height: 75px; filter: opacity(75%) grayscale(100%);";
		else var style = "margin: 10px; height: 75px; filter: opacity(75%) saturate(0%) brightness(0%);";
		sub += "<div style='height:100%;display:inline-block;' onclick='checkEvo(\""+evo+"\","+forma+","+cp+")'>";
		sub += "<img style='"+style+"' class='evo' id="+evo+" src='pkmn/"+evo+".png' /></div>";
	}
	sub += '</center>';
	document.getElementById("msg").innerHTML = msg;
	document.getElementById("partner").innerHTML = partner;
	document.getElementById("sub").innerHTML = sub;
	document.getElementById("pokemon").style.display = "";
	fitPartner();
}

function checkEvo(evo,pre,cpo){
	bool = [false,false]
	var evos = document.getElementsByClassName("evo");
	var gold = " drop-shadow(gold 0px 0px 7px)";
	for (e=0;e<evos.length;e++) {
		evos[e].style.filter = evos[e].style.filter.replace((gold+gold+gold),"");
		if ( evos[e].id == evo ) evos[e].style.filter += (gold+gold+gold);
	}
	var forma = ev_dict[evo]["form"];
	var tipos = pk_dict[evo]["tipo"];
	var ratio = Math.pow(2,(pre+forma))*25;
	if ( tipos.length == 1 ) var r = [ratio,0]
	else var r = [ratio*0.6,ratio*0.4]
	var partner = "<center style='height:99%'><div id='evol' class='ev_types'>";
	for (t=0;t<tipos.length;t++) {
		var req = r[t];
		var tot = parseInt(window.localStorage.getItem("caramelo"+tipos[t]),10);
		var stl = pk_dict[evo]["tipo"][t]
		if ( tot < req ) { bool[t] = true; stl += " imposible"; }
		partner += "<input type='button' onclick='doEvo(\""+evo+"\","+cpo+","+r+")' class='ev_type "+stl+"' value='🍬 "+pk_dict[evo]["tipo"][t]+": "+tot+"/"+req+"' />";
	}
	partner += "</div></center>";
	document.getElementById("partner").innerHTML = partner;
	fitPartner();
}

function doEvo(evo,cpo,ev1,ev2) {
	var nombre = pk_dict[evo]["nombre"];
	var tipos = pk_dict[evo]["tipo"];
	var pkmn = window.localStorage.getItem("pk"+id);
	var cpn = parseInt(cpo)+parseInt(cp_dict[evo]["CP"])-parseInt(cp_dict[pkmn]["CP"]);
	var ev = [ev1,ev2];
	var p = pk_dict[pkmn]["nombre"];
	if ( bool[0] || bool[1] ) confirm('Te faltan caramelos...');
	else if (confirm('¿Evolucionar a '+p+'?')) {
		for (c=0;c<tipos.length;c++) {
			var cantidad = parseInt(window.localStorage.getItem("caramelo"+tipos[c]),10)-ev[c];
			window.localStorage.setItem("caramelo"+tipos[c], cantidad);
		}
		window.localStorage.setItem("pk"+id, evo);
		window.localStorage.setItem("cp"+id, cpn);
		window.localStorage.setItem("dx"+evo, "capturado");
		var msg = '<center style="height:99%font-size: 20px;position: relative;top: +15px;"><b id="msg_txt">¡Bienvenido '+nombre+'!</b></center>';
		var partner = '<center style="height:99%"><img id="pkmn" style="height:99%;width:auto;max-width:99%;position:relative;top:50%;transform:translateY(-50%);" src="pkmn/'+evo+'.png" /></center>';
		document.getElementById("msg").innerHTML = msg;
		document.getElementById("partner").innerHTML = partner;
		document.getElementById(evo).style.filter = "none";
		fitPartner();
		setTimeout(function() { confirm('¡Evolucionado a '+nombre+'!'); }, 50);
		setTimeout(function() { window.history.back(); }, 50);
	}
}

function fitPartner() {
	var h1 = document.getElementById("body").offsetHeight-222;
	var w1 = document.getElementById("body").offsetWidth-22;
	document.getElementById("partner").style.height = h1+"px";
	if ( h1 < 50 ) document.getElementById("partner").style.opacity = 0;
	else document.getElementById("partner").style.opacity = 1;
	try {
		if ( h1 < w1 ) document.getElementById("pkmn").style.height = h1+"px";
		else document.getElementById("pkmn").style.height = w1+"px";
	} catch(err) { null; }
	try {
		document.getElementById("evol").style.height = h1+"px";
		document.getElementById("evol").style.display = "table-cell";
		document.getElementById("evol").style.width = "1000000px";
		document.getElementById("evol").style.verticalAlign = "middle";
	} catch(err) { null; }
}

$(window).bind('resize',function(e) { fitPartner(); });

$(window).bind('orientationchange',function(e) { fitPartner(); });
