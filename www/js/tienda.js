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
	printShop();
}

function printShop() {
	var content = "<table style='text-align:center;margin-top:0'><thead><tr><th class='cell'>Objeto</th><th class='cell'>Precio</th><th class='cell'>Cantidad</th></tr></thead><tbody><tr>" + 
	"<td class='cell'><img style='height:50px' src='img/ball_1.png'>" +
	"</td><td class='cell'><span id='p1' title='200'>200</span></td><td class='cell'><span id='c1' title='0'>0</span>" +
	"</td><td><input onclick='mas(1);' class='stock' type='button' value='+'><br><input onclick='menos(1);' class='stock' type='button' value='-'></td></tr>" +
	"<td class='cell'><img style='height:50px' src='img/ball_2.png'>" +
	"</td><td class='cell'><span id='p2' title='600'>600</span></td><td class='cell'><span id='c2' title='0'>0</span>" +
	"</td><td><input onclick='mas(2);' class='stock' type='button' value='+'><br><input onclick='menos(2);' class='stock' type='button' value='-'></td></tr>" +
	"<td class='cell'><img style='height:50px' src='img/ball_3.png'>" +
	"</td><td class='cell'><span id='p3' title='1200'>1.200</span></td><td class='cell'><span id='c3' title='0'>0</span>" +
	"</td><td><input onclick='mas(3);' class='stock' type='button' value='+'><br><input onclick='menos(3);' class='stock' type='button' value='-'></td></tr>" +
	"</tbody></table><center><div id='fondos'>Dinero: " + parseInt(window.localStorage.getItem("dinero"),10).toLocaleString() + 
	"</div><div id='precio'>Total: 0</div><div onclick='comprar()' id='comprar'>👛</div></center>"
	document.getElementById("shop").innerHTML = content;
	document.getElementById("shop").style.display = "";
}

function mas(n) {
	var cantidad = parseInt(document.getElementById("c"+n).title,10)
	if ( cantidad < 1000 ) {
		if ( cantidad >= 100 ) cantidad = cantidad + 100;
		else if ( cantidad >= 10 ) cantidad = cantidad + 10;
		else cantidad = cantidad + 1;
		document.getElementById("c"+n).title = cantidad
		document.getElementById("c"+n).innerHTML = cantidad.toLocaleString();
	}
	fixTotal();
}

function menos(n) {
	var cantidad = parseInt(document.getElementById("c"+n).title,10)
	if ( cantidad > 0 ) {
		if ( cantidad > 100 )cantidad = cantidad - 100;
		else if ( cantidad > 10 ) cantidad = cantidad - 10;
		else cantidad = cantidad - 1;
		document.getElementById("c"+n).title = cantidad
		document.getElementById("c"+n).innerHTML = cantidad.toLocaleString();
	}
	fixTotal();
}

function comprar() {
	var total = 0;
	for (i=1;i<=3;i++) total += parseInt(document.getElementById("c"+i).title,10) * parseInt(document.getElementById("p"+i).title,10)
	var response = confirm("¿Pagar " +total.toLocaleString()+ " por la compra?");
	if ( response == true ) {
		var fondos = parseInt(window.localStorage.getItem("dinero"),10);
		var pokeballs = parseInt(window.localStorage.getItem("pokeball"),10);
		var superballs = parseInt(window.localStorage.getItem("superball"),10);
		var ultraballs = parseInt(window.localStorage.getItem("ultraball"),10);
		var unidades_p = parseInt(document.getElementById("c1").title,10);
		var unidades_s = parseInt(document.getElementById("c2").title,10);
		var unidades_u = parseInt(document.getElementById("c3").title,10);
		var total_poke = pokeballs+unidades_p;
		var total_super = superballs+unidades_s;
		var total_ultra = ultraballs+unidades_u;
		if ( total_poke > 9999999 ) total_poke = 9999999;
		if ( total_super > 9999999 ) total_super = 9999999;
		if ( total_ultra > 9999999 ) total_ultra = 9999999;
		window.localStorage.setItem("pokeball", total_poke);
		window.localStorage.setItem("superball", total_super);
		window.localStorage.setItem("ultraball", total_ultra);
		window.localStorage.setItem("dinero", fondos-total);
		location.href = "./main.html";
	}
}

function fixTotal() {
	var total = 0;
	for (i=1;i<=3;i++) total += parseInt(document.getElementById("c"+i).title,10) * parseInt(document.getElementById("p"+i).title,10)
	if ( total > parseInt(window.localStorage.getItem("dinero"),10) ) {
		document.getElementById("comprar").className += " disabled";
	} else {
		document.getElementById("comprar").className = "";
	}
	document.getElementById("precio").innerHTML = "Total: " + String(total.toLocaleString());
}

$(window).bind('resize',function(e) { null; });

$(window).bind('orientationchange',function(e) { null; });
