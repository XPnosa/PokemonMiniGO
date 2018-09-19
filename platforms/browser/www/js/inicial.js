var initial = 0;

var choices = 3*7;

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
	if ( window.localStorage.getItem("pk0") == null ) printInitials();
	else bye();
}

function start() {
	setXpDict({0:0});
}

function printInitials() {
	var initial = '<img id="pkmn" onclick="setInitial(this);" style="height:99%;width:auto;max-width:99%;position:relative;top:50%;transform:translateY(-50%);" />';
	var msg = '<center style="height:99%;font-size:20px;position:relative;top:15px;"><b id="msg_txt">¡Elige a tu compañero!</b></center>';
	var partner = '<center style="height:99%;">'+initial+'</center>';
	var lot = "<center style='height:100%;'>";
	for (i=1;i<=choices;i++) {
		lot += "<div style='margin-left: -1px; height: 100%; display: inline-block;' onclick='showInitial("+i+");'>";
		lot += "<img id='i"+i+"' style='margin: 10px; height: 75px; transition: 250ms; filter: grayscale(100%);' src='img/ball_5.png'><br />";
		lot += "<img id='j"+i+"' style='margin: 10px; height: 75px; transition: 250ms; filter: brightness(50%) saturate(50%); position: relative; top: -100px; opacity: .5;' src='img/type_"+(((i-1)%3)+1)+".png'></div>"; 
	}
	lot += "</center>";
	document.getElementById("msg").innerHTML = msg;
	document.getElementById("partner").innerHTML = partner;
	document.getElementById("set").innerHTML = lot;
	document.getElementById("pokemon").style.display = "";
	fitPartner();
}

function showInitial(idx) {
	var pkmn = getInitial(idx);
	var nombre = pk_dict[pkmn]["nombre"];
	try { document.getElementById("j"+initial).style.filter = "brightness(50%) saturate(50%)"; } catch(err) { null; }
	try { document.getElementById("i"+initial).style.filter = "grayscale(100%);"; } catch(err) { null; }
	try { document.getElementById("j"+idx).style.filter = "brightness(100%) saturate(100%)"; } catch(err) { null; }
	try { document.getElementById("i"+idx).style.filter = "brightness(50%) saturate(50%) grayscale(100%);"; } catch(err) { null; }
	document.getElementById("pkmn").src = "pkmn/"+pkmn+".png";
	document.getElementById("msg_txt").innerHTML = "¿Eliges a "+nombre+"?";
	initial = idx;
}

function getInitial(idx) {
	switch(idx) {
		case 1:  return "001";
		case 2:  return "004";
		case 3:  return "007";
		case 4:  return "152";
		case 5:  return "155";
		case 6:  return "158";
		case 7:  return "252";
		case 8:  return "255";
		case 9:  return "258";
		case 10: return "387";
		case 11: return "390";
		case 12: return "393";
		case 13: return "495";
		case 14: return "498";
		case 15: return "501";
		case 16: return "650";
		case 17: return "653";
		case 18: return "656";
		case 19: return "722";
		case 20: return "725";
		case 21: return "728";
		default: return "025";
	}
}

function setInitial(obj) {
	var pkmn = getInitial(initial);
	var chosen = confirm("Tu compañero será " + pk_dict[pkmn].nombre);
	if ( chosen ) saveData(pkmn);
}

function saveData(pkmn) {
	if ( window.localStorage.getItem("pk0") == null ) {
		window.localStorage.setItem("pk0", pkmn);
		window.localStorage.setItem("lv0", 5);
		window.localStorage.setItem("xp0", 250);
		window.localStorage.setItem("cp0", 320);
		window.localStorage.setItem("dx"+pkmn, "capturado");
		window.localStorage.setItem("pokeball", 10);
		window.localStorage.setItem("superball", 0);
		window.localStorage.setItem("ultraball", 0);
		window.localStorage.setItem("dinero", 3000);
		window.localStorage.setItem("lider", 0);
		window.localStorage.setItem("ganar", 0);
		window.localStorage.setItem("total", 0);
	}
	bye();
}

function callPikach() {
	if ( initial == 0 ) showInitial(initial)
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
}

function dontBack(){
	window.location.hash="no-back-button";
	window.location.hash="Again-No-back-button"
	window.onhashchange=function(){
		window.location.hash="no-back-button";
	}
}

function onBackKeyDown(e) {
	var secret = confirm("Debes elegir a un compañero...");
	if (secret) setTimeout(function() { callPikach(); }, 10000);
	else navigator.app.exitApp();
	e.preventDefault();
}

$(window).bind('resize',function(e) { fitPartner(); });

$(window).bind('orientationchange',function(e) { fitPartner(); });
