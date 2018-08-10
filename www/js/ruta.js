var wild_pkmn;

var run = false;

var state = 0;

var offset = 1;

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
		fitPath();
		start();
	}
};

function ready() {
	printSubmenu();
	encounter(); 
}

function start() {
	setXpDict({0:0});
}

function printSubmenu() {
	var content = "<center style='height:100%;'><b>" + 
	"<div style='height:100%;display:inline-block;' onclick='wildCapture(1)'>" + 
	"<img style='margin:10px; height:50px;' src='img/ball_1.png' />" + 
	"<br><span id='ball1' style='position: relative;top: -5px;'>" + 
	window.localStorage.getItem("pokeball") + "</span></div>" +
	"<div style='height:100%;display:inline-block;' onclick='wildCapture(2)'>" + 
	"<img style='margin:10px; height:50px;' src='img/ball_2.png' />" + 
	"<br><span id='ball2' style='position: relative;top: -5px;'>" + 
	window.localStorage.getItem("superball") + "</span></div>" +
	"<div style='height:100%;display:inline-block;' onclick='wildCapture(3)'>" + 
	"<img style='margin:10px; height:50px;' src='img/ball_3.png' />" + 
	"<br><span id='ball3' style='position: relative;top: -5px;'>" + 
	window.localStorage.getItem("ultraball") + "</span></div>" +
	"</b></center>";
	document.getElementById("sub").innerHTML = content;
}

function encounter() {
	var lider = window.localStorage.getItem("lider");
	var my_lv = window.localStorage.getItem("lv"+lider);
	var my_cp = window.localStorage.getItem("cp"+lider) * my_lv;
	var pkmn = getRandId(last_pokemon);
	var lvl = Math.floor( Math.random() * ( my_lv / 2 ) ) + Math.floor( my_lv / 2 );
	var cp = cp_dict[pkmn]["CP"] * lvl;
	var ratio = 2;
	if ( my_lv >= 25 ) ratio = 1.5;
	if ( my_lv >= 50 ) ratio = 1;
	if ( my_lv >= 75 ) ratio = 0.5;
	while ( my_cp < cp * ratio ) {
		pkmn = getRandId(last_pokemon);
		lvl = Math.floor( Math.random() * ( my_lv / 2 ) ) + Math.floor( my_lv / 2 );
		cp = cp_dict[pkmn]["CP"] * lvl;
	}
	wildEnter(pkmn,lvl,cp);
}

function wildEnter(pkmn,lvl,cp) {
	offset = 1; wild_pkmn = [pkmn,lvl,cp]
	var wild = "<center style='height:99%'><img id='pkmn' style='height:99%;width:auto;max-width:99%;position:relative;top:50%;transform:translateY(-50%);' src='pkmn/"+pkmn+".png' /></center>"
	document.getElementById("wild").innerHTML = wild;
	var message = "<center style='height:99%font-size: 20px;position: relative;top: +15px;'><b id='msg_txt'>¡"+pk_dict[pkmn]["nombre"]+" salvaje apareció!</b></center>"
	document.getElementById("msg").innerHTML = message;
	if ( window.localStorage.getItem("dx"+pkmn) == null ) window.localStorage.setItem("dx"+pkmn, "visto");
	else if ( window.localStorage.getItem("dx"+pkmn) == "capturado" ) document.getElementById("msg").className += " gold";
	fitPath(); document.getElementById("path").style.display = "";
}

function wildDefeat() {
	if ( !run ) {
		var message = "¡"+pk_dict[wild_pkmn[0]]["nombre"]+" salvaje derrotado!"
		document.getElementById("msg_txt").innerHTML = message;
		document.getElementById("pkmn").className += " defeat";
		run = true;
	}
}

function wildCapture(ball) {
	if ( !run ) {
		if ( ball == 1 ) var cantidad = parseInt(window.localStorage.getItem("pokeball"));
		else if ( ball == 2 ) var cantidad = parseInt(window.localStorage.getItem("superball"));
		else if ( ball == 3 ) var cantidad = parseInt(window.localStorage.getItem("ultraball"));
		if ( cantidad > 0 ) {
			if ( launch(ball) ) {
				var message = "¡"+pk_dict[wild_pkmn[0]]["nombre"]+" salvaje capturado!"
				document.getElementById("msg_txt").innerHTML = message;
				document.getElementById("pkmn").className += " catch";
				document.getElementById("wild").className += " ball_"+ball;
				updatePokedex(); state = 4; run = true; 
			} else {
				var message = "¡El lanzamiento falló!"
				document.getElementById("msg_txt").innerHTML = message;
				document.getElementById("pkmn").className += " fault";
				timeout = setTimeout(function() {
					document.getElementById("pkmn").className = "";
				}, 500);
				offset++;
			}
		} else {
			var message = "¡No quedan unidades!"
			document.getElementById("msg_txt").innerHTML = message;
		}
	}
}

function wildRun() {
	if ( run ) {
		var exp = Math.floor(wild_pkmn[2]/25);
		var cash = Math.floor(wild_pkmn[2]/10);
		if ( state == 1 ) {
			var msg = "Experiencia ganada: " + exp;
			document.getElementById("msg_txt").innerHTML = msg;
			if ( updateLevel(exp) ) state = 2;
			else state = 3;
		} else if ( state == 2 ) {
			var lider = window.localStorage.getItem("lider");
			var pkm = pk_dict[window.localStorage.getItem("pk"+lider)]["nombre"];
			var lvl = window.localStorage.getItem("lv"+lider);
			var msg = "¡" + pkm  + " subió al nivel " + lvl + "!";
			document.getElementById("msg_txt").innerHTML = msg;
			state = 3;
		} else if ( state == 3 ) {
			var msg = "Dinero encontrado: " + cash;
			document.getElementById("msg_txt").innerHTML = msg;
			window.localStorage.setItem("dinero", parseInt(window.localStorage.getItem("dinero"),10)+cash);
			state = 5;
		} else if ( state == 4 ) {
			state = 5;
		} else if ( state == 5 ) {
			location.href = "./main.html";
		} else {
			state = 1;
		}
	}
}

function updateLevel(xp) {
	var lider = window.localStorage.getItem("lider");
	var lvl = parseInt(window.localStorage.getItem("lv"+lider),10);
	var exp = parseInt(window.localStorage.getItem("xp"+lider),10);
	var ganar = parseInt(window.localStorage.getItem("ganar"),10);
	window.localStorage.setItem("ganar", ganar+1);
	if ( lvl == 100 ) return false;
	window.localStorage.setItem("xp"+lider, exp+xp);
	if ( exp+xp >= xp_dict[lvl+1] ) {
		window.localStorage.setItem("lv"+lider, lvl+1);
		if ( lvl == 99 ) window.localStorage.setItem("xp"+lider, xp_dict[lvl+1]);
		return true;
	} else return false;
}

function updatePokedex() {
	var total = parseInt(window.localStorage.getItem("total"),10);
	window.localStorage.setItem("pk"+total, wild_pkmn[0]);
	window.localStorage.setItem("lv"+total, wild_pkmn[1]);
	window.localStorage.setItem("cp"+total, wild_pkmn[2]);
	window.localStorage.setItem("xp"+total, xp_dict[wild_pkmn[1]]);
	window.localStorage.setItem("dx"+wild_pkmn[0], "capturado");
	window.localStorage.setItem("total", total+1);
}

function launch(ball) {
	if ( ball == 1 ) {
		var cantidad = parseInt(window.localStorage.getItem("pokeball"));
		window.localStorage.setItem("pokeball", cantidad-1);
	} else if ( ball == 2 ) {
		var cantidad = parseInt(window.localStorage.getItem("superball"));
		window.localStorage.setItem("superball", cantidad-1);
	} else if ( ball == 3 ) {
		var cantidad = parseInt(window.localStorage.getItem("ultraball"));
		window.localStorage.setItem("ultraball", cantidad-1);
	}
	document.getElementById("ball"+ball).innerHTML = cantidad-1
	return catched(ball);
}

function catched(ball) {
	var lider = window.localStorage.getItem("lider");
	var my_lv = window.localStorage.getItem("lv"+lider);
	var my_cp = window.localStorage.getItem("cp"+lider) * my_lv;
	var rnd = Math.floor( Math.random() * my_cp + my_lv * 10 + offset * 100 ) + 1;
	var dif = wild_pkmn[2]
	if ( ball == 2 ) ball = 1.5;
	if ( ball == 3 ) ball = 2;
	if ( rnd * ball > dif ) return true;
	else return false;
}

function getRandId(l) {
	var n = Math.floor( Math.random() * l ) + 1;
	var r = n<10?"00"+n:n<100?"0"+n:n
	return r;
}

function fitPath() {
	var h1 = document.getElementById("body").offsetHeight-222;
	var w1 = document.getElementById("body").offsetWidth-22;
	document.getElementById("wild").style.height = h1+"px";
	if ( h1 < 100 ) document.getElementById("wild").style.opacity = 0;
	else document.getElementById("wild").style.opacity = 1;
	try {
		if ( h1 < w1 ) document.getElementById("pkmn").style.height = h1+"px";
		else document.getElementById("pkmn").style.height = w1+"px";
	} catch(err) { null; }
}

$(window).bind('resize',function(e) { fitPath(); });

$(window).bind('orientationchange',function(e) { fitPath(); });
