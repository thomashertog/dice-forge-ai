function spelerAI(speler_id) {

    AI = {
        speler_id: speler_id,
        resource_keuze: function(opties) {
            if(opties.length == 1) {
                spel.fases.shift()
                kies_resources(speler_id, opties[0])
            } else {
                // TODO
                console.log('not yet implemented')
            }
        },
        kies_kracht: function() {
            beschikbaar = spel.spelers[speler_id-1].beschikbare_krachten

            if(beschikbaar.length == 0) {

                spel.fases.shift()

                // TODO
                console.log('TODO vernieuw beschikbare krachten')
            } else {
                // TODO
                console.log('TODO implementeer het gebruik van krachten')
            }
        },
        kies_actie: function(first = true) {
            spel.fases.shift()

            spel.fases.unshift({
                fase: 'wacht op speler',
                actie: 'kies actie',
                type: null,
                zijde_geselecteerd: null,
                rood_betaald: first 
            })

            ui_commando_balk_reset()
            ui_commando_balk_add_text("Speler " + speler_id + ": Selecteer een actie ")   
            ui_commando_balk_add_button("Be\u00EBindig beurt zonder actie", "einde actie")   
        }

    }

    return(AI)
}

function commando_button_clicked(tag) {
    
    fase = spel.fases[0]

    if(!fase.fase == "wacht op speler") {
        console.log("Error: commando button clicked, maar speler actie niet vereist!")
    }

    if(tag == 'einde actie') {
        
        if(fase.actie == 'kies actie') {
        
            spel.fases.shift()
            ui_commando_balk_reset()
        }
    } else if(tag == 'cancel') {
        
        if(fase.actie == 'kies actie') {

            spel.fases[0] = {
                fase: 'wacht op speler',
                actie: 'kies actie',
                type: fase.type,
                zijde_geselecteerd: null,
                rood_betaald: fase.rood_betaald 
            }

            ui_commando_balk_reset()
            ui_commando_balk_add_text("Speler " + speler_id + ": Selecteer een actie ")   
            ui_commando_balk_add_button("Be\u00EBindig beurt zonder actie", "einde actie")   
        }

    }

}

function klik_tegel(event) {

    fase = spel.fases[0]

    console.log(fase)

    // momenteel geen speler interactie verwacht
    if(fase.fase != "wacht op speler") {
        return
    }

    // momenteel wordt er een andere input verwacht
    if(fase.actie != 'kies actie') {
        return
    }

    // speler heeft al gekozen om een kaart te kopen en kan daarom geen tegels meer kopen
    if(fase.type == 'koop kaart') {
        return
    }

    zijde = event.target.className.split("side-")[1].toUpperCase()
    kost = goud_kost_zijde[zijdes.indexOf(zijde)]

    // zijde kan gekocht worden
    if(spel.spelers[spel.actieve_speler - 1].resources.goud >= kost &
        spel.spelers[spel.actieve_speler - 1].resources.rood >= (!fase.rood_betaald)*2 ) {

        spel.fases[0] = {
            fase: 'wacht op speler',
            actie: 'kies actie',
            type: fase.type,
            zijde_geselecteerd: zijde,
            zijde_geselecteerd_id: event.target.id,
            rood_betaald: fase.rood_betaald
        }

        ui_commando_balk_reset()
        ui_commando_balk_add_text("Speler " + spel.actieve_speler + ": Kies een dobbelsteenzijde om te vervangen ")   
        ui_commando_balk_add_button("Annuleer", "cancel")   
    }


}


function klik_dobbelsteen(event) {

    fase = spel.fases[0]

     // momenteel geen speler interactie verwacht
     if(fase.fase != "wacht op speler") {
        return
    }

    // momenteel wordt er een andere input verwacht
    if(fase.actie != 'kies actie') {
        return
    }

    // speler heeft al gekozen om een kaart te kopen en kan daarom geen tegels meer kopen
    if(fase.type == 'koop kaart') {
        return
    }

    // speler heeft nog geen zijde gekozen en kan dus ook nog niet smeden
    if(fase.zijde_geselecteerd === null) {
        return
    }

    zijde = fase.zijde_geselecteerd
    kost = goud_kost_zijde[zijdes.indexOf(zijde)]

    eigenschappen = event.target.id.split("dobbelsteen_")[1].split("_speler_")
    vervang_kant = eigenschappen[0]
    speler = eigenschappen[1].split('-')[0]
    positie = eigenschappen[1].split('-')[1] - 1

    // Goed geprobeerd, maar je kan enkel op je eigen dobbelsteen zijdes smeden :)
    if(speler != spel.actieve_speler) {
        return
    }

    // zijde kan gekocht worden
    if(spel.spelers[spel.actieve_speler - 1].resources.goud >= kost &
        spel.spelers[spel.actieve_speler - 1].resources.rood >= (!fase.rood_betaald)*2 ) {

        // betaal kosten
        voeg_resource_toe(spel.actieve_speler, 'goud', -kost)

        if(!fase.rood_betaald) {
            voeg_resource_toe(spel.actieve_speler, 'rood', -2)
        }

        // pas de zijde aan in het spel object
        spel.spelers[spel.actieve_speler - 1].dobbelsteen[vervang_kant][positie] = zijde

        // pas de zijde aan in de UI
        ui_plaats_dobbelsteen_zijde(fase.zijde_geselecteerd_id, event.target.id)

        // pas de fase aan
        spel.fases[0] = {
            fase: 'wacht op speler',
            actie: 'kies actie',
            type: 'smeden',
            zijde_geselecteerd: null,
            rood_betaald: true
        }

        ui_commando_balk_reset()
        ui_commando_balk_add_text("Speler " + speler + ": Wil je nog een zijde smeden?")   
        ui_commando_balk_add_button("Be\u00EBindig beurt zonder extra zijdes te smeden", "einde actie")   
    }
}