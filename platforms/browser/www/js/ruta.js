var wild_pkmn;

var state = 0;

var offset = 1;

var run = false;

var wait = false;

var click = false;

var last_message;

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

function cap(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function printSubmenu() {
	var pokeballs = parseInt(window.localStorage.getItem("pokeball"),10);
	var superballs = parseInt(window.localStorage.getItem("superball"),10);
	var ultraballs = parseInt(window.localStorage.getItem("ultraball"),10);
	if ( pokeballs > 999999 ) pokeballs = Math.floor( pokeballs / 1000000 ) + " M";
	else if ( pokeballs > 999 ) pokeballs = Math.floor( pokeballs / 1000 ) + " K";
	if ( superballs > 999999 ) superballs = Math.floor( superballs / 1000000 ) + " M";
	else if ( superballs > 999 ) superballs = Math.floor( superballs / 1000 ) + " K";
	if ( ultraballs > 999999 ) ultraballs = Math.floor( ultraballs / 1000000 ) + " M";
	else if ( ultraballs > 999 ) ultraballs = Math.floor( ultraballs / 1000 ) + " K";
	var content = "<center style='height:100%;'><b>" + 
	"<div style='height:100%;display:inline-block;' onclick='wildCapture(1)'>" + 
	"<img style='margin:10px; height:50px;' src='img/ball_1.png' />" + 
	"<br><span id='ball1' style='position: relative;top: -5px;'>" + pokeballs + "</span></div>" +
	"<div style='height:100%;display:inline-block;' onclick='wildCapture(2)'>" + 
	"<img style='margin:10px; height:50px;' src='img/ball_2.png' />" + 
	"<br><span id='ball2' style='position: relative;top: -5px;'>" + superballs + "</span></div>" +
	"<div style='height:100%;display:inline-block;' onclick='wildCapture(3)'>" + 
	"<img style='margin:10px; height:50px;' src='img/ball_3.png' />" + 
	"<br><span id='ball3' style='position: relative;top: -5px;'>" + ultraballs + "</span></div>" +
	"</b></center>";
	document.getElementById("sub").innerHTML = content;
}

function encounter() {
	var lider = parseInt(window.localStorage.getItem("lider"),10);
	var my_lv = parseInt(window.localStorage.getItem("lv"+lider),10);
	var my_cp = parseInt(window.localStorage.getItem("cp"+lider),10) * my_lv;
	var ganar = parseInt(window.localStorage.getItem("ganar"),10);
	var total = parseInt(window.localStorage.getItem("total"),10);
	var libre = getLibres();
	var help = Math.floor( ( ganar + total + libre ) / 1000 ) + 1;
	var pkmn = getRandId(last_pokemon);
	var lvl = Math.floor( Math.random() * Math.floor( my_lv / 2 ) ) + Math.floor( my_lv / 2 ) + 1;
	var cp = cp_dict[pkmn]["CP"] * lvl;
	var ev = ev_dict[pkmn]["form"]
	var ratio = 2;
	var forma = 0;
	var retry = 0;
	var logged = false;
	if ( my_lv >= 25 ) { ratio = 1.5; forma = 1; }
	if ( my_lv >= 50 ) { ratio = 1; forma = 2; }
	if ( my_lv >= 75 ) { ratio = 0.5; forma = 3; }
	if ( window.localStorage.getItem("dx"+pkmn) == "capturado" ) logged = true;
	while ( my_cp < cp * ratio || ev > forma || ( logged && retry < help ) ) {
		pkmn = getRandId(last_pokemon);
		lvl = Math.floor( Math.random() * ( my_lv / 2 ) ) + Math.floor( my_lv / 2 );
		cp = cp_dict[pkmn]["CP"] * lvl;
		ev = ev_dict[pkmn]["form"]
		if ( window.localStorage.getItem("dx"+pkmn) == "capturado" ) logged = true;
		else logged = false;
		retry++;
	}
	wild_pkmn = [pkmn,lvl,cp]
	var item = Math.floor( Math.random() * 50 );
	if ( item < 2 ) wildCandy(pk_dict[pkmn]["tipo"]);
	else if ( item < 4 ) wildMoney(my_lv);
	else if ( item < 5 ) wildBalls(my_lv);
	else wildEnter(pkmn,lvl,cp);
}

function wildCandy(tipos) {
	var tipo = ( tipos.length == 2 )?tipos[1]:tipos[0]
	var caramelos = Math.floor( ( wild_pkmn[1] - 1 ) / 10 ) + 1;
	var fix_name = ( caramelos == 1 )?"Caramelo":"Caramelos";
	var message = "<center style='height:99%;font-size: 20px;position: relative;top: +15px;'><b id='msg_txt'>¡Recibes "+caramelos+" "+fix_name+" "+tipo+"!</b></center>";
	document.getElementById("msg").innerHTML = message;
	var wild = "<center style='height:99%'><img id='pkmn' style='height:99%;width:auto;max-width:99%;position:relative;top:50%;transform:translateY(-50%);' src='img/candy.png' /></center>"
	document.getElementById("wild").innerHTML = wild;
	fitPath(); document.getElementById("path").style.display = "";
	var cantidad = parseInt(window.localStorage.getItem("caramelo"+tipo),10) + caramelos;
	if ( cantidad < 999 ) window.localStorage.setItem("caramelo"+tipo, cantidad);
	else window.localStorage.setItem("caramelo"+tipo, 999);
	state = 5; setTimeout(function() { run = true; click = true; }, 500);
}

function wildMoney(nivel) {
	var money = nivel * ( 20 + Math.floor( nivel / 10 ) )
	var message = "<center style='height:99%;font-size: 20px;position: relative;top: +15px;'><b id='msg_txt'>Dinero recogido: "+money.toLocaleString()+"</b></center>";
	document.getElementById("msg").innerHTML = message;
	var filter = (money<=1000)?"hue-rotate(-45deg)grayscale(10%)":(money<=2000)?"grayscale(100%)":"grayscale(10%)"
	var wild = "<center style='height:99%'><img id='pkmn' style='height:99%;width:auto;max-width:99%;position:relative;top:50%;transform:translateY(-50%);filter:"+filter+";' src='img/coin.png' /></center>"
	document.getElementById("wild").innerHTML = wild;
	fitPath(); document.getElementById("path").style.display = "";
	var cantidad = parseInt(window.localStorage.getItem("dinero"),10) + money;
	if ( cantidad > 9999999 ) cantidad = 9999999;
	window.localStorage.setItem("dinero", cantidad);
	state = 5; setTimeout(function() { run = true; click = true; }, 500);
}

function wildBalls(nivel) {
	var idx, tipo, balls;
	if ( nivel < 25 ) { idx = 1; tipo = "pokeball"; balls = Math.floor( nivel / 5 ); }
	else if ( nivel < 50 ) { idx = 2; tipo = "superball"; balls = Math.floor( nivel / 10 ); }
	else { idx = 3; tipo = "ultraball"; balls = Math.floor( nivel / 20 ); }
	var fix = ( balls > 1 )?"s":"";
	var message = "<center style='height:99%;font-size: 20px;position: relative;top: +15px;'><b id='msg_txt'>¡Has encontrado "+balls+" "+cap(tipo+fix).replace('Poke','Poké')+"!</b></center>";
	document.getElementById("msg").innerHTML = message;
	var wild = "<center style='height:99%'><img id='pkmn' style='height:99%;width:auto;max-width:99%;position:relative;top:50%;transform:translateY(-50%);' src='img/ball_"+idx+""+balls+".png' /></center>"
	document.getElementById("wild").innerHTML = wild;
	fitPath(); document.getElementById("path").style.display = "";
	var cantidad = parseInt(window.localStorage.getItem(tipo),10) + balls;
	if ( cantidad > 9999999 ) cantidad = 9999999;
	window.localStorage.setItem(tipo, cantidad);
	state = 5; setTimeout(function() { run = true; click = true; }, 500);
}

function wildEnter(pkmn,lvl,cp) {
	offset = 1; 
	var ball = "";
	if ( window.localStorage.getItem("dx"+pkmn) == "capturado" ) ball = "<img src='img/favicon.gif' style='height: 20px; margin: 10px; vertical-align: middle; float:'>";
	var wild = "<center style='height:99%'><img id='pkmn' style='height:99%;width:auto;max-width:99%;position:relative;top:50%;transform:translateY(-50%);' src='pkmn/"+pkmn+".png' /></center>"
	document.getElementById("wild").innerHTML = wild;
	var message = "<center style='height:99%;font-size: 20px;position: relative;top: +15px;'>"+ball.replace("float:","float: left;").replace("margin","margin-left")+"<b id='msg_txt'>¡"+pk_dict[pkmn]["nombre"]+" salvaje apareció!</b>"+ball.replace("float:","float: right;").replace("margin","margin-right")+"</center>"
	document.getElementById("msg").innerHTML = message;
	if ( window.localStorage.getItem("dx"+pkmn) == null ) window.localStorage.setItem("dx"+pkmn, "visto");
	fitPath(); document.getElementById("path").style.display = "";
	setTimeout(function() { click = true; }, 500);
}

function wildDefeat() {
	if ( !run && click ) {
		click = false;
		if ( defeated() ) {
			var message = "¡"+pk_dict[wild_pkmn[0]]["nombre"]+" salvaje derrotado!"
			document.getElementById("msg_txt").innerHTML = message;
			document.getElementById("pkmn").className += " defeat";
			state = 1; run = true;
		} else {
			var message = "¡"+pk_dict[wild_pkmn[0]]["nombre"]+" salvaje huyó!"
			document.getElementById("msg_txt").innerHTML = message;
			document.getElementById("pkmn").className += " evade";
			state = 5; run = true;
		}
		setTimeout(function() { click = true; }, 500);
	}
}

function wildCapture(ball) {
	if ( !run ) {
		if ( ball == 1 ) var cantidad = parseInt(window.localStorage.getItem("pokeball"));
		else if ( ball == 2 ) var cantidad = parseInt(window.localStorage.getItem("superball"));
		else if ( ball == 3 ) var cantidad = parseInt(window.localStorage.getItem("ultraball"));
		if ( cantidad > 0 ) {
			if ( click ) {
				click = false;
				if ( launch(ball) ) {
					var message = "¡"+pk_dict[wild_pkmn[0]]["nombre"]+" salvaje capturado!"
					document.getElementById("msg_txt").innerHTML = message;
					document.getElementById("pkmn").className += " catch";
					document.getElementById("wild").className += " ball_"+ball;
					if ( window.localStorage.getItem("dx"+wild_pkmn[0]) != "capturado" ) {
						timeout1 = setTimeout(function() {
							document.getElementById("wild").className += " shiny";
						}, 1000);
					}
					updatePokedex(); state = 5; run = true; 
				} else {
					var message = "¡El lanzamiento falló!"
					last_message = message;
					document.getElementById("msg_txt").innerHTML = message;
					document.getElementById("pkmn").className += " fault";
					timeout2 = setTimeout(function() {
						document.getElementById("pkmn").className = document.getElementById("pkmn").className.replace(" fault","");
					}, 500);
					offset++; state = -1;
				}
				setTimeout(function() { click = true; }, 1000);
			}
		} else {
			var message = "¡No quedan unidades!"
			document.getElementById("msg_txt").innerHTML = message;
		}
	}
}

function wildRun() {
	if ( run && click ) {
		click = false;
		var lider = parseInt(window.localStorage.getItem("lider"),10);
		var nivel = parseInt(window.localStorage.getItem("lv"+lider),10);
		var exp = Math.floor(wild_pkmn[2]/50) + nivel;
		var cash = Math.floor(wild_pkmn[2]/25) - nivel;
		if ( state == 1 ) {
			var msg = "Experiencia ganada: " + exp.toLocaleString();
			document.getElementById("msg_txt").innerHTML = msg;
			if ( updateLevel(exp) ) state = 2;
			else state = 4;
			setTimeout(function() { click = true; }, 250);
		} else if ( state == 2 ) {
			var lider = window.localStorage.getItem("lider");
			var pkm = pk_dict[window.localStorage.getItem("pk"+lider)]["nombre"];
			var lvl = window.localStorage.getItem("lv"+lider);
			var msg = "¡" + pkm  + " subió al nivel " + lvl + "!";
			document.getElementById("msg_txt").innerHTML = msg;
			state = 3;
			setTimeout(function() { click = true; }, 500);
		} else if ( state == 3 ) {
			var msg = "¡Has obtenido 3 Caramelos!";
			document.getElementById("msg_txt").innerHTML = msg;
			state = 4;
			setTimeout(function() { click = true; }, 500);
		} else if ( state == 4 ) {
			var msg = "Dinero recogido: " + cash.toLocaleString();
			document.getElementById("msg_txt").innerHTML = msg;
			var dinero = parseInt(window.localStorage.getItem("dinero"),10)+cash
			if ( dinero > 9999999 ) dinero = 9999999;
			window.localStorage.setItem("dinero", dinero);
			state = 5;
			setTimeout(function() { click = true; }, 250);
		} else if ( state == 5 ) {
			bye()
		} else {
			state = 1; click = true;
		}
	}
}

function updateLevel(xp) {
	var lider = window.localStorage.getItem("lider");
	var lvl = parseInt(window.localStorage.getItem("lv"+lider),10);
	var exp = parseInt(window.localStorage.getItem("xp"+lider),10);
	var ganar = parseInt(window.localStorage.getItem("ganar"),10)+1;
	var tipos = pk_dict[window.localStorage.getItem("pk"+lider)]["tipo"];
	if ( ganar > 9999999 ) ganar = 9999999;
	window.localStorage.setItem("ganar", ganar);
	if ( lvl == 100 ) return false;
	window.localStorage.setItem("xp"+lider, exp+xp);
	if ( exp+xp >= xp_dict[lvl+1] ) {
		window.localStorage.setItem("lv"+lider, lvl+1);
		if ( lvl == 99 ) window.localStorage.setItem("xp"+lider, xp_dict[lvl+1]);
		if ( tipos.length == 1 ) {
			var cantidad = parseInt(window.localStorage.getItem("caramelo"+tipos[0]))+3;
			if ( cantidad > 999 ) cantidad = 999;
			window.localStorage.setItem("caramelo"+tipos[0],cantidad);
		} else {
			var cantidad1 = parseInt(window.localStorage.getItem("caramelo"+tipos[0]))+2;
			if ( cantidad1 > 999 ) cantidad1 = 999;
			window.localStorage.setItem("caramelo"+tipos[0],cantidad1);
			var cantidad2 = parseInt(window.localStorage.getItem("caramelo"+tipos[1]))+1;
			if ( cantidad2 > 999 ) cantidad2 = 999;
			window.localStorage.setItem("caramelo"+tipos[1],cantidad2);
		}
		return true;
	} else return false;
}

function updatePokedex() {
	var total = parseInt(window.localStorage.getItem("total"),10)+1;
	if ( total > 9999999 ) total = 9999999;
	window.localStorage.setItem("pk"+total, wild_pkmn[0]);
	window.localStorage.setItem("lv"+total, wild_pkmn[1]);
	window.localStorage.setItem("cp"+total, wild_pkmn[2]);
	window.localStorage.setItem("xp"+total, xp_dict[wild_pkmn[1]]);
	window.localStorage.setItem("dx"+wild_pkmn[0], "capturado");
	window.localStorage.setItem("total", total);
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
	cantidad = cantidad - 1;
	if ( cantidad > 999999 ) cantidad = Math.floor( cantidad / 1000000 ) + " M";
	else if ( cantidad > 999 ) cantidad = Math.floor( cantidad / 1000 ) + " K";
	document.getElementById("ball"+ball).innerHTML = cantidad
	return catched(ball);
}

function catched(ball) {
	var lider = window.localStorage.getItem("lider");
	var my_lv = window.localStorage.getItem("lv"+lider);
	var my_cp = window.localStorage.getItem("cp"+lider) * my_lv;
	var rnd = Math.floor( Math.random() * my_cp + my_lv * 10 + offset * 100 );
	var dif = wild_pkmn[2]
	if ( ball == 2 ) ball = 1.5;
	if ( ball == 3 ) ball = 2;
	if ( rnd * ball > dif ) return true;
	else return false;
}

function defeated() {
	var lider = window.localStorage.getItem("lider");
	var my_lv = window.localStorage.getItem("lv"+lider);
	var my_cp = window.localStorage.getItem("cp"+lider) * my_lv;
	var rnd = Math.floor( Math.random() * my_cp + my_lv * 10 + offset * 100 );
	var fac = Math.floor( 5 - ( my_lv / 50 ) );
	var dif = wild_pkmn[2]
	if ( rnd * fac > dif ) return true;
	else return false;
}

function showStats() {
	if ( !wait && click && state == 0 ) {
		click = false;
		last_message = document.getElementById("msg_txt").innerHTML
		var lv = wild_pkmn[1]
		var cp = wild_pkmn[2]
		if ( lv < 5 ) lv = 5;
		message = "Nivel: " + lv;
		document.getElementById("msg_txt").innerHTML = message;
		timeout3 = setTimeout(function() {
			if ( state == 0 ) document.getElementById("msg_txt").innerHTML = last_message;
			click = true; wait = false;
		}, 1000);
		wait = true;
	}
}

function getRandId(l) {
	var n = Math.floor( Math.random() * l ) + 1;
	var r = n<10?"00"+n:n<100?"0"+n:n
	return r;
}

function getLibres() {
	var c = 0;
	var total = parseInt(window.localStorage.getItem("total"),10);
	for (i=0;i<=total;i++){
		if ( window.localStorage.getItem("st"+i) == 'ko' ) c++;
	}
	return c;
}

function fitPath() {
	var h1 = document.getElementById("body").offsetHeight-222;
	var w1 = document.getElementById("body").offsetWidth-22;
	document.getElementById("wild").style.height = h1+"px";
	if ( h1 < 50 ) document.getElementById("wild").style.opacity = 0;
	else document.getElementById("wild").style.opacity = 1;
	try {
		if ( h1 < w1 ) document.getElementById("pkmn").style.height = h1+"px";
		else document.getElementById("pkmn").style.height = w1+"px";
	} catch(err) { null; }
}

$(window).bind('resize',function(e) { fitPath(); });

$(window).bind('orientationchange',function(e) { fitPath(); });
