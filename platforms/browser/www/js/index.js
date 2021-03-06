var xmlhttp = new XMLHttpRequest();

var pk_types = ["Normal","Fuego","Agua","Eléctrico","Planta","Hielo","Lucha","Veneno","Tierra","Volador","Psíquico","Bicho","Roca","Fantasma","Dragón","Acero","Siniestro","Hada"]

var pk_dict, ev_dict, cp_dict, xp_dict;

var last_pokemon = 807;

function setPkDict(filePath) {
	xmlhttp.open("GET", filePath, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			pk_dict = JSON.parse(xmlhttp.responseText);
			ready();
		}
	};
	xmlhttp.send();
}

function setEvDict(filePath) {
	xmlhttp.open("GET", filePath, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			ev_dict = JSON.parse(xmlhttp.responseText);
			setPkDict("json/pokedex.json");
		}
	};
	xmlhttp.send();
}

function setCpDict(filePath) {
	xmlhttp.open("GET", filePath, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			cp_dict = JSON.parse(xmlhttp.responseText);
			setEvDict("json/evol.json");
		}
	};
	xmlhttp.send();
}

function setXpDict(base) {
	for (idx=1;idx<=100;idx++) {
		base[idx] = base[idx-1]+idx;
	}
	var exp = {}
	for (i=1;i<=100;i++) {
		xp = 0;
		for (j=1;j<=i;j++) {
			xp += base[j]
		}
		exp[i] = Math.floor((xp+(i-1)*i/33)*250/43);
	}
	xp_dict = exp;
	setCpDict("json/cp.json");
}

function bye() {
	location.href = "./main.html";
}
