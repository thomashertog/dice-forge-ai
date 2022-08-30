function ui_gooi_dobbelsteen(speler, dobbelsteen, index) {

	zijde = document.getElementById("dobbelsteen_"+dobbelsteen+"_speler_"+speler+"-"+index)
	worp = document.getElementById("dobbelsteen_worp_"+dobbelsteen+"_speler_"+speler)
	
	worp.className = zijde.className
}

function ui_update_resources(speler, resource, aantal, max_aantal = null) {

	if(max_aantal === null) {
		inhoud = aantal
	} else {
		inhoud = aantal + " / " + max_aantal
	}
	
	document.getElementById(resource + "_speler_" + speler).innerHTML = inhoud

}

function ui_plaats_dobbelsteen_zijde(winkel_id, steen_id) {

	var winkel = document.getElementById(winkel_id)
	var steen = document.getElementById(steen_id)

	steen.className = winkel.className
	winkel.remove()

}

function ui_locatie_naar_pool(locatie) {
	index = parseInt(locatie[1])
	
	if(locatie[0] == 'F') {
		return(7 - Math.floor((index-1)/2))
	} else {
		return((index-1)/2)
	}
}

function ui_verplaats_pion(speler_id, pool) {
	if(speler_id == 1) {
		kleur = "orange"
	} else {
		kleur = "black"
	}

	pion = document.getElementById("player_" + kleur)

	if(pool == 0) {
		document.getElementById("position-init-" + kleur).appendChild(pion)
	} else {
		document.getElementById("position-" + pool).appendChild(pion)
	}
}

function ui_zet_beschikbaarheid_kaart(kaart, aantal) {

	if(aantal == 0) {
		document.getElementById("exploit-" + kaart).remove()
	} else {
		document.getElementById("card-counter-" + kaart).innerHTML = aantal
	}

}

function ui_commando_balk_reset() {
	document.getElementById('commando_balk').innerHTML = ''
}

function ui_commando_balk_add_text(tekst) {

	msg = document.createElement('span')
	msg.innerHTML = tekst

	document.getElementById('commando_balk').appendChild(msg)
}

function ui_commando_balk_add_button(tekst, tag) {

	btn = document.createElement('input')
	btn.type = 'button'
	btn.value = tekst
	btn.addEventListener('click', function(){
		commando_button_clicked(tag)
	})

	document.getElementById('commando_balk').appendChild(btn)
}

