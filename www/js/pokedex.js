var xmlhttp = new XMLHttpRequest();

var pokedex = {}

var generation = 0;

var current_pokemon = 0;

var current_alt_image = 1;

var load_completed = false;

var alt_forms = ["003_f2","003_f3","006_f2","006_f3","006_f4","009_f2","009_f3","012_f2","015_f2","018_f2","019_f2","020_f2","025_f2","026_f2","026_f3","026_f4","027_f2","028_f2","036_f2","037_f2","038_f2","050_f2","051_f2","052_f2","052_f3","052_f4","053_f2","058_f2","059_f2","065_f2","068_f2","071_f2","074_f2","075_f2","076_f2","077_f2","078_f2","079_f2","080_f2","080_f3","083_f2","088_f2","089_f2","094_f2","094_f3","099_f2","100_f2","101_f2","103_f2","105_f2","110_f2","115_f2","121_f2","122_f2","127_f2","128_f2","128_f3","128_f4","130_f2","131_f2","133_f2","142_f2","143_f2","144_f2","145_f2","146_f2","149_f2","150_f2","150_f3","154_f2","157_f2","160_f2","181_f2","194_f2","199_f2","208_f2","211_f2","212_f2","214_f2","215_f2","222_f2","227_f2","229_f2","248_f2","254_f2","257_f2","260_f2","263_f2","264_f2","282_f2","302_f2","303_f2","306_f2","308_f2","310_f2","319_f2","323_f2","334_f2","354_f2","358_f2","359_f2","359_f3","362_f2","373_f2","376_f2","380_f2","381_f2","382_f2","383_f2","384_f2","386_f2","386_f3","386_f4","398_f2","412_f2","412_f3","413_f2","413_f3","421_f2","422_f2","423_f2","428_f2","445_f2","445_f3","448_f2","448_f3","460_f2","475_f2","478_f2","479_f2","479_f3","479_f4","479_f5","479_f6","483_f2","484_f2","485_f2","487_f2","491_f2","492_f2","500_f2","503_f2","521_f2","530_f2","531_f2","545_f2","549_f2","550_f2","550_f3","554_f2","555_f2","560_f2","562_f2","569_f2","570_f2","571_f2","585_f2","585_f3","585_f4","586_f2","586_f3","586_f4","592_f2","593_f2","604_f2","609_f2","618_f2","623_f2","628_f2","641_f2","642_f2","645_f2","646_f2","646_f3","647_f2","648_f2","652_f2","655_f2","658_f2","658_f3","666_f2","666_f3","666_f4","666_f5","666_f6","666_f7","666_f8","668_f2","668_f3","670_f2","670_f3","676_f2","676_f3","676_f4","678_f2","678_f3","681_f2","687_f2","689_f2","691_f2","701_f2","705_f2","706_f2","710_f2","710_f3","710_f4","711_f2","711_f3","711_f4","713_f2","718_f2","718_f3","718_f4","719_f2","720_f2","724_f2","740_f2","741_f2","741_f3","741_f4","745_f2","745_f3","746_f2","768_f2","774_f2","780_f2","800_f2","800_f3","800_f4","801_f2","801_f3","801_f4","807_f2","809_f2","812_f2","815_f2","818_f2","823_f2","826_f2","834_f2","839_f2","841_f2","842_f2","844_f2","849_f2","849_f3","849_f4","851_f2","854_f2","855_f2","858_f2","861_f2","869_f2","870_f2","876_f2","877_f2","879_f2","884_f2","888_f2","889_f2","892_f2","892_f3","892_f4","898_f2","898_f3","901_f2","902_f2","905_f2","916_f2","925_f2","931_f2","931_f3","931_f4","952_f2","964_f2","970_f2","978_f2","978_f3","978_f4","978_f5","978_f6","982_f2","998_f2","999_f2","1012_f2","1013_f2","1017_f2","1017_f3","1017_f4","1024_f2","1024_f3"];

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
		for (i=1;i<=9;i++) {
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
	for (var f=8;f>=2;f--) if (alt_forms.includes(pkmn+"_f"+f)) info.innerHTML += "<img style='float: right; padding-left: 5px;' class='pk_img pokeball' onclick='viewImage(\""+pkmn+"_f"+f+"\")' src='img/extraball_"+f+".png' />";
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
	var form_match = pkmn.match(/_f([2-8])$/);
	current_pokemon = parseInt(form_match ? pkmn.slice(0, -form_match[0].length) : pkmn, 10);
	current_alt_image = form_match ? parseInt(form_match[1], 10) : 1;
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
		case (idx >= 722 && idx <= 809):
			region = "Alola"; break;
		case (idx >= 810 && idx <= 905):
			region = "Galar"; break;
		case (idx >= 906 && idx <= 1025):
			region = "Paldea"; break;
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
		case 8:
			region = "Galar"; break;
		case 9:
			region = "Paldea"; break;
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
