function init_speler(startspeler) {

	begin_goud = 3;
	if(startspeler) {
		begin_goud = 2;
	}

	speler = {
		resources: {
			goud: begin_goud,
			rood: 0,
			blauw: 0,
			score: 0,
			hamer: 0
		},
        resources_max: {
            goud: 12,
            rood: 6,
            blauw: 6,
            score: null,
            hamer: 0
        },
		dobbelsteen: {
			links: ["G1", "G1", "G1", "G1", "G1", "FS1"],
			rechts: ["G1", "G1", "G1", "G1", "MS1", "VP2"]
		},
        huidige_dobbelsteen: {
            links: "G1",
            rechts: "G1"
        },
		kaarten: new Array(15).fill(0),
		positie_pion: 0,
        beschikbare_krachten: []
	}

	return(speler);

}

init_ronde = function() {

    fases = [
        {
            fase: 'hemelse zegening',
            speler: 3
        },
        {
            fase: 'hemelse zegening',
            speler: 3
        },
        {
            fase: 'kies kracht'
        },
        {
            fase: 'actie1',
        },
        {
            fase: 'actie2',
        },
        {
            fase: 'hemelse zegening',
            speler: 3
        },
        {
            fase: 'hemelse zegening',
            speler: 3
        }
    ]

    return(fases)

}

kies_resources = function(speler_id, resource_arr) {
    if(resource_arr[0] != 0) {
        voeg_resource_toe(speler_id, 'goud', resource_arr[0])
    }
    if(resource_arr[1] != 0) {
        voeg_resource_toe(speler_id, 'rood', resource_arr[1])
    }
    if(resource_arr[2] != 0) {
        voeg_resource_toe(speler_id, 'blauw', resource_arr[2])
    }
    if(resource_arr[3] != 0) {
        voeg_resource_toe(speler_id, 'score', resource_arr[3])
    }
    if(resource_arr[4] != 0) {
        voeg_resource_toe(speler_id, 'hamer', resource_arr[4])
    }
}

voeg_resource_toe = function(speler_id, resource, aantal) {
    spel.spelers[speler_id-1].resources[resource] += aantal;

    ui_update_resources(
        speler_id, 
        resource, 
        spel.spelers[speler_id-1].resources[resource], 
        max_aantal = spel.spelers[speler_id-1].resources_max[resource])
}

// gooi dobbelsteen
function gooi_dobbelsteen(speler_id, dobbelsteen) {

    // selecteer een random zijde van de dobbelsteen
    index = Math.floor(Math.random() * 6)
    worp = spel.spelers[speler_id-1].dobbelsteen[dobbelsteen][index]

    // registreer de worp als de huidige dobbelsteen
    spel.spelers[speler_id-1].huidige_dobbelsteen[dobbelsteen] = worp

    // pas the UI aan
    ui_gooi_dobbelsteen(speler_id, dobbelsteen, index + 1)

    // return het gegooide resultaat
    return(spel.spelers[speler_id-1].dobbelsteen[dobbelsteen][index])
}

// voer een hemelse zegening uit voor `speler`. Als 
hemelse_zegening = function(speler_id) {

    // verwijder fase uit de spel historiek
    spel.fases.shift()

    if(speler_id == 3) {
        worp1 = [gooi_dobbelsteen(1, 'links'), gooi_dobbelsteen(1, 'rechts')]
        worp2 = [gooi_dobbelsteen(2, 'links'), gooi_dobbelsteen(2, 'rechts')]

        console.log("Speler 1 gooit " + worp1.toString())
        console.log("Speler 2 gooit " + worp2.toString())

        // voeg nieuwe fases toe
        spel.fases.unshift(
            {
                fase: 'resource keuze',
                speler_id: 1,
                opties: get_resource_opties(1, worp1)
            },
            {
                fase: 'resource keuze',
                speler_id: 2,
                opties: get_resource_opties(2, worp2)
            }
        )

    } else if(speler_id == 1) {
        worp1 = [gooi_dobbelsteen(1, 'links'), gooi_dobbelsteen(1, 'rechts')]
        worp2 = []
    } else {
        worp1 = []
        worp2 = [gooi_dobbelsteen(2, 'links'), gooi_dobbelsteen(2, 'rechts')]
    }
}

koop_kaart = function(speler_id, kaart) {

    // betaal kosten kaart
    voeg_resource_toe(speler_id, 'rood', -(kaart.kost_rood + (!fase.rood_betaald)*2))
    voeg_resource_toe(speler_id, 'blauw', -kaart.kost_blauw)

    // ontvang punten voor aankoop kaart
    voeg_resource_toe(speler_id, 'score', kaart.punten)

    // verminder de beschikbaarheid van de kaart
    spel.beschikbare_kaarten[kaart.index] -= 1
    ui_zet_beschikbaarheid_kaart(kaart.code, spel.beschikbare_kaarten[kaart.index])

    // registreer eigendom van de kaart in het spelers object
    spel.spelers[speler_id - 1].kaarten[kaart.index] += 1

    // TODO kaart specifieke interactie --> voeg nieuwe fases hiervoor toe
    ['hamer', 'kist', 'hinde', 'kobold', 'veerman', 'x3', 'kreef', 'hydra', 'sinfx', 'spiegel', 'gorgo', 'minotaur', 'uil', '3g+3b', 'oudere']
    if(kaart.alias == "hamer") {
        spel.spelers[speler_id - 1].resources_max.hamer += 30

        // update UI
        voeg_resource_toe(speler_id, 'hamer', 0)
    } else if(kaart.alias == 'kist') {
        spel.spelers[speler_id - 1].resources_max.goud += 4
        spel.spelers[speler_id - 1].resources_max.rood += 3
        spel.spelers[speler_id - 1].resources_max.blauw += 3

        // update UI
        voeg_resource_toe(speler_id, 'goud', 0)
        voeg_resource_toe(speler_id, 'rood', 0)
        voeg_resource_toe(speler_id, 'blauw', 0)
    } else if(kaart.alias == 'hinde') {
        // TODO    
    } else if(kaart.alias == 'kobold') {
        // TODO    
    } else if(kaart.alias == 'x3') {
        // TODO    
    } else if(kaart.alias == 'kreeft') {
        spel.fases.unshift(
            {
                fase: 'hemelse zegening',
                speler: speler_id
            },
            {
                fase: 'hemelse zegening',
                speler: speler_id
            }
        )
    } else if(kaart.alias == 'sfinx') {
        // TODO            
    } else if(kaart.alias == 'spiegel') {
        // TODO
    } else if(kaart.alias == 'minotaur') {
        // TODO
    } else if(kaart.alias == 'uil') {
        // TODO
    } else if(kaart.alias == '3g+3b') {
        voeg_resource_toe(speler_id, 'goud', min(3, spel.spelers[speler_id - 1].resources_max.goud - spel.spelers[speler_id - 1].resources.goud))
        voeg_resource_toe(speler_id, 'blauw', min(3, spel.spelers[speler_id - 1].resources_max.blauw - spel.spelers[speler_id - 1].resources.blauw))
    } else if(kaart.alias == 'oudere') {
        // TODO
    }

    // verdringing
    // wordt uitgevoerd voor het kaart specifieke effect
    if(spel.spelers[3-speler_id].positie_pion == kaart.pool) {

        // plaats pion op start positie
        ui_verplaats_pion(3-speler_id, 0)

        // de verdrongen speler krijgt een extra dobbelsteen worp
        spel.fases.unshift(
            {
                fase: 'hemelse zegening',
                speler: 3 - speler_id
            }
        )
    }   
}

// start de volgende fase van het spel
update_spel = function() {
    
    fase = spel.fases[0]

    if(fase.fase == 'hemelse zegening') {
        hemelse_zegening(fase.speler)
    } else if(fase.fase == 'resource keuze') {
        spel.AI[fase.speler_id - 1].resource_keuze(fase.opties)
    } else if(fase.fase == 'kies kracht') {
        spel.AI[spel.actieve_speler - 1].kies_kracht()
    } else if(fase.fase == 'actie1') {
        spel.AI[spel.actieve_speler - 1].kies_actie(true)
    } else if(fase.fase == 'actie2') {
        spel.AI[spel.actieve_speler - 1].kies_actie(false)
    }

}

var spel = {

	spelers: [
		init_speler(true),
		init_speler(false)
	],
    AI: [
        spelerAI(1),
        spelerAI(2)
    ],
	ronde: 1,
	actieve_speler: 1,
	fases: init_ronde(),
    beschikbare_kaarten: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
}

const interval = setInterval(function() {
    update_spel()
  }, 250);


