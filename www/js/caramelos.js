var caramelos = []

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
	printCandy();
}

function start() {
	setXpDict({0:0});
}

function printCandy() {
	var content = '<div class="status"><center>'
	for (i=0;i<pk_types.length;i++) {
		caramelos.push(parseInt(window.localStorage.getItem("caramelo"+pk_types[i]),10));
		content += '<input style="color: white; text-shadow: 1px 1px 1px black; text-transform: uppercase;" type="button" id="c'+i+'" title="'+pk_types[i]+'" onclick="switchInfo(this,'+i+')" class="candy '+pk_types[i]+'" value=" '+caramelos[i]+' "/>';
		content += '<img id="n'+i+'" title="'+pk_types[i]+'" onclick="switchInfo(document.getElementById(\'c'+i+'\'),'+i+')" class="candy '+pk_types[i]+'" style=';
		content += '"filter: brightness(50%) saturate(50%); border: 0; margin: 0; padding: 0; position: absolute; opacity: 0;" src="img/candy_go.png" />';
	}
	content += '</center></div>';
	document.getElementById("content").innerHTML = content;
	document.getElementById("bag").style.opacity = 1;
	fitContent();
}

function switchInfo(obj,idx) {
	if (obj.value.indexOf(' ') >= 0 ) obj.value = obj.title;
	else  obj.value = ' ' + caramelos[idx] + ' ';
}

function fitContent() {
	var h1 = document.getElementById("body").offsetHeight-30;
	document.getElementById("content").style.height = h1+"px";
	try {
		var px = document.getElementById("c0").offsetWidth;
		for (i=0;i<pk_types.length;i++) {
			document.getElementById("c"+i).style.height = px+"px";
			document.getElementById("n"+i).style.height = px+"px";
			document.getElementById("n"+i).style.width = px+"px";
			var bodyRect = document.body.getBoundingClientRect();
			var elemRect = document.getElementById("c"+i).getBoundingClientRect();
			var offset_1 = elemRect.top - bodyRect.top, offset_2 = elemRect.left - bodyRect.left;
			document.getElementById("n"+i).style.top = offset_1+"px";
			document.getElementById("n"+i).style.left = offset_2+"px";
			document.getElementById("n"+i).style.opacity = "0.333";
		}
	} catch(err) { null; }
}

$(window).bind('resize',function(e) { fitContent(); });

$(window).bind('orientationchange',function(e) { fitContent(); });
