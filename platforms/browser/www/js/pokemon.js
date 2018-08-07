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
	var id = window.localStorage.getItem("lider");
	var pkmn = window.localStorage.getItem("pk"+id);
	var nombre = pk_dict[pkmn]["nombre"];
	var nivel = window.localStorage.getItem("lv"+id);
	var cp = window.localStorage.getItem("cp"+id)*nivel;
	var exp = window.localStorage.getItem("xp"+id);
	var sig = xp_dict[parseInt(nivel,10)+1]-parseInt(exp,10);
	var msg = '<center style="height:99%font-size: 20px;position: relative;top: +12px;"><b id="msg_txt">Tu compañero es '+nombre+'</b></center>';
	var partner = '<center style="height:99%"><img id="pkmn" style="height:99%;width:auto;max-width:99%;position:relative;top:50%;transform:translateY(-50%);" src="pkmn/'+pkmn+'.png" /></center>';
	var sub = '<table class="status"><tr><td class="stat"><b>Nivel</b>: '+nivel+'</td><td class="stat"><b>CP</b>: '+cp+'</td></tr><tr><td class="stat"><b>Exp</b>: '+exp+'</td><td class="stat"><b>Sig</b>: '+sig+'</td></tr></table>';
	document.getElementById("msg").innerHTML = msg;
	document.getElementById("partner").innerHTML = partner;
	document.getElementById("sub").innerHTML = sub;
	document.getElementById("pokemon").style.display = "";
	fitPartner();
}

function fitPartner() {
	var h1 = document.getElementById("body").offsetHeight-222;
	var w1 = document.getElementById("body").offsetWidth-22;
	document.getElementById("partner").style.height = h1+"px";
	if ( h1 < 100 ) document.getElementById("partner").style.opacity = 0;
	else document.getElementById("partner").style.opacity = 1;
	try {
		if ( h1 < w1 ) document.getElementById("pkmn").style.height = h1+"px";
		else document.getElementById("pkmn").style.height = w1+"px";
	} catch(err) { null; }
}

$(window).bind('resize',function(e) { fitPartner(); });

$(window).bind('orientationchange',function(e) { fitPartner(); });
