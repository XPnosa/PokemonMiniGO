var xmlhttp = new XMLHttpRequest();

var pokedex = {}

var generation = 0;

var current_pokemon = 0;

var current_alt_image = 1;

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
		printLegend();
		readJson("json/pokedex.json");
	}
};

function readJson(filePath) {
	xmlhttp.open("GET", filePath, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			fitDex();
			var pokemon = JSON.parse(xmlhttp.responseText);
			var len = Object.keys(pokemon).length;
			for (i=1;i<=len;i++) {
				var pkmn = i<10?"00"+i:i<100?"0"+i:i
				pokedex[pkmn] = pokemon[pkmn]
			}
			var i = 1
			var refreshIntervalId = setInterval(function() {
				var pkmn = i<10?"00"+i:i<100?"0"+i:i
				if ( i <= ( len ) ) {
					printPokedex(pkmn);
					if ( i == len && !load_completed ) {
						showDex(0);
						load_completed = true;
						document.getElementById("loading").style.display = 'none';
						var list = document.getElementsByClassName('pkmn');
						for(i=0; i<list.length; i++) list[i].classList.add("visible");
					}
				} else clearInterval(refreshIntervalId);
				i++
			}, 0);
		}
	};
	xmlhttp.send();
}

function printLegend() {
	var legend = '<div style="cursor:default;" class="active"><div>Cargando</div></div>' +
	'<div class="init inactive"><div class="init">&nbsp;</div></div>'
	document.getElementById("pkdex").innerHTML = "<legend id='legend'>"+legend+"</legend>" + 
	"<div id='list'><img id='loading' title='Cargando...' src='img/loading.gif' /></div>";
}

function printPokedex(pkmn) {
	var gen = getGeneration(pkmn);
	var pokemon = "<div id='"+pkmn+"' class='pkmn "+gen+"'>";
	if ( window.localStorage.getItem("dx"+pkmn) == 'capturado' ) {
		pokemon += "<img class='pk_img' onclick='viewImage(\""+pkmn+"\")' src='pkmn/"+pkmn+".png' />"
		pokemon += "<input type='button' onclick='showDetails(\""+pkmn+"\")' class='pk_name' value='"+pokedex[pkmn].nombre+"' />";
		pokemon += "<input type='button' onclick='showDetails(\""+pkmn+"\")' class='pk_name altura' value='Altura: "+pokedex[pkmn].altura+"' />";
		pokemon += "<input type='button' onclick='showDetails(\""+pkmn+"\")' class='pk_name peso' value='Peso: "+pokedex[pkmn].peso+"' />";
		pokemon += "<div class='pk_types'>";
		for (var t=0;t<pokedex[pkmn].tipo.length;t++) pokemon += "<div onclick='showDetails(\""+pkmn+"\")' class='pk_type "+pokedex[pkmn].tipo[t]+"'><span>"+pokedex[pkmn].tipo[t]+"</span></div>";
		pokemon += "</div></div>";
	} else if ( window.localStorage.getItem("dx"+pkmn) == 'visto' ) {
		pokemon += "<img style='opacity:0.5; filter: grayscale(100%);' class='pk_img' src='pkmn/"+pkmn+".png' />"
		pokemon += "<input type='button' class='pk_name' value='"+pokedex[pkmn].nombre+"' />";
		pokemon += "</div>";
	} else {
		pokemon += "<img style='opacity:0.5; filter: saturate(0%) brightness(10000%);' class='pk_img' src='pkmn/"+pkmn+".png' />"
		pokemon += "</div>";
	}
	var newcontent = document.createElement('div');
	newcontent.innerHTML = pokemon;
	document.getElementById("list").appendChild(newcontent.firstChild);
}

function showDex(n) {
	document.getElementById("loading-mini").style.display='';
	setTimeout(function(){
		generation = n;
		var list = document.querySelectorAll('.pkmn');
		for(i=0; i<list.length; i++) list[i].style.display = "none";
		if (n==0) var legend = '<div onclick="shearchDex(\'Nacional\');" class="active"><div>Nacional</div></div>';
		else var legend = '<div title="Pokedex Nacional" onclick="showDex(0);" class="inactive"><div>#</div></div>';
		for (i=1;i<=7;i++) {
			if (i==n) legend += '<div onclick="shearchDex(\''+getRegion(i)+'\');" class="G'+i+' active"><div>'+getRegion(i)+'</div></div>';
			else legend += '<div title="Pokedex '+getRegion(i)+'" onclick="showDex('+i+');" class="G'+i+' inactive"><div>'+i+'</div></div>';
		}
		document.getElementById("legend").innerHTML = legend;
		if (n==0) list = document.querySelectorAll('.pkmn');
		else list = document.querySelectorAll('.'+getRegion(n));
		for(i=0; i<list.length; i++) list[i].style.display = "";
		document.getElementById("loading-mini").style.display='none';
	}, 0);
}

function shearchDex(region) {
	var search = prompt("Buscar pokemon en la Pokedex " + region);
	if ( search == null ) search = ""
	if ( region == "Nacional" )
		var list = document.querySelectorAll('.pkmn');
	else
		var list = document.querySelectorAll('.' + region);
	for ( i=0 ; i<list.length ; i++ ) 
		if ( parseInt(search, 10) == parseInt(list[i].id, 10) )
			list[i].style.display = "";
		else
			list[i].style.display = "none";
	for ( num in pokedex )
		if ( pokedex.hasOwnProperty(num) )
			if ( region == getGeneration(num) || region == "Nacional" )
				if ( pokedex[num].nombre.toLowerCase().indexOf(search.toLowerCase()) >= 0 )
					if ( window.localStorage.getItem("dx"+num) != null )
						document.getElementById(num).style.display = "";
}

function showDetails(pkmn) {
	var details = document.getElementById("details");
	var photo = document.getElementById("photo");
	var info = document.getElementById("info");
	current_pokemon = parseInt(pkmn, 10);
	var desc = ( Math.floor( Math.random() * 2 ) == 0 )?pokedex[pkmn].info_x:pokedex[pkmn].info_y;
	desc += "<center><table><tr><td><b>Altura</b>: "+pokedex[pkmn].altura+"</td>";
	desc += "<td><b>Peso</b>: "+pokedex[pkmn].peso+"</td></tr></table></center>";
	photo.src = "pkmn/"+pkmn+".png";
	var type = "<center><div class='pk_types_info'>";
	for (var t=0;t<pokedex[pkmn].tipo.length;t++) type += "<div class='pk_type "+pokedex[pkmn].tipo[t]+"'><span>"+pokedex[pkmn].tipo[t]+"</span></div>";
	type += "<div></center>";
	info.innerHTML += "<img style='float: right;' class='pk_img pokeball' onclick='viewImage(\""+pkmn+"\")' src='img/ball_1.png' />";
	info.innerHTML += "<p class='title'><span id='num'>" + pkmn + " - </span>" + pokedex[pkmn].nombre + "</p>" + desc  + "<hr />" + type;
	details.style.display = ""; 
	var ball_list = document.getElementsByClassName('pokeball');
	for(i=0; i<ball_list.length; i++) ball_list[i].addEventListener('touchend', function(e){e.stopPropagation();}, false); 
	fitDex();
}

function closeDetails() {
	var info = document.getElementById("info");
	var photo = document.getElementById("photo");
	var details = document.getElementById("details");
	info.innerHTML = ""
	photo.src = "";
	details.style.display = "none";
}

function viewImage(pkmn) {
	if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	var photo = document.getElementById("photo-full");
	var gallery = document.getElementById("gallery");
	photo.src = "pkmn/"+pkmn+".png";
	gallery.style.display = "";
}

function closeImage() {
	var gallery = document.getElementById("gallery");
	var photo = document.getElementById("photo-full");
	gallery.style.display = "none";
	photo.src = "";
}

function getGeneration(pkmn) {
	var region;
	var idx = parseInt(pkmn, 10);
	switch (true) {
		case (idx >= 1 && idx <= 151):
			region = "Kanto"; break;
		case (idx >= 152 && idx <= 251):
			region = "Johto"; break;
		case (idx >= 252 && idx <= 386):
			region = "Hoenn"; break;
		case (idx >= 387 && idx <= 493):
			region = "Sinnoh"; break;
		case (idx >= 494 && idx <= 649):
			region = "Unova"; break;
		case (idx >= 650 && idx <= 721):
			region = "Kalos"; break;
		case (idx >= 722 && idx <= 807):
			region = "Alola"; break;
	}
	return region
}

function getRegion(n) {
	var region;
	switch (n) {
		case 1:
			region = "Kanto"; break;
		case 2:
			region = "Johto"; break;
		case 3:
			region = "Hoenn"; break;
		case 4:
			region = "Sinnoh"; break;
		case 5:
			region = "Unova"; break;
		case 6:
			region = "Kalos"; break;
		case 7:
			region = "Alola"; break;
		default: 
			region = n;
	}
	return region
}

function fitDex() {
	var h1 = document.getElementById("body").offsetHeight-50;
	document.getElementById("pkdex").style.height = h1+"px";
	if ( document.getElementById("legend").offsetHeight > 50 ) var h2 = document.getElementById("pkdex").offsetHeight-60;
	else var h2 = document.getElementById("pkdex").offsetHeight-45;
	document.getElementById("list").style.height = h2+"px";
	var h3 = document.getElementById("body").offsetWidth-50;
	document.getElementById("info").style.width = h3+"px";
	var h4 = document.getElementById("info").offsetHeight-50;
	document.getElementById("photo").style.height = h4+"px";
	var photo = document.getElementById("photo-full")
	if ( document.getElementById("body").offsetHeight < document.getElementById("body").offsetWidth ) {
		photo.style.width = "auto";
		photo.style.height = "99%";
	} else {
		photo.style.width = "99%";
		photo.style.height = "auto";
	}
	try {
		if ( h3 <= 350 ) document.getElementById("num").style.display = 'none';
		else document.getElementById("num").style.display = '';
	} catch(err) {
		null;
	}
}

$(window).bind('resize',function(e) { fitDex(); });

$(window).bind('orientationchange',function(e) { fitDex(); });
