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
		content += '<input type="button" id="c'+i+'" title="'+pk_types[i]+'" onclick="switchInfo(this,'+i+')" class="candy '+pk_types[i]+'" value=" '+caramelos[i]+' "/>';
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
		var c = document.getElementById("c0").offsetWidth;
		for (i=0;i<pk_types.length;i++) {
			document.getElementById("c"+i).style.height = c+"px";
		}
	} catch(err) { null; }
}

$(window).bind('resize',function(e) { fitContent(); });

$(window).bind('orientationchange',function(e) { fitContent(); });
