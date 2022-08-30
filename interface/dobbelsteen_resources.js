// Namen van de zijdes zoals gebruikt in BGA
zijdes = ['G1', 'VP2', 'G3', 'MS1', 'G4', 'FS1', 'G2-PLUS-MS1', 'G1-OR-FS1-OR-MS1', 'G3-OR-VP2', 'MS2', 'FS2', 'VP3', 'G1-PLUS-VP1-PLUS-FS1-PLUS-MS1', 'VP4', 'MIRROR', 'X3']

goud_kost_zijde = [
    0, 0, 2, 2, 3, 3, 4, 4, 5, 6, 8, 8, 12, 12, 0, 0
]

// Keuze mogelijkheden wanneer een zijde gegooid wordt:
// [goud, rood, blauw, punten, hamer]
resource_keuze_zijde = [
    // G1
    [
        [1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1]
    ],
    // VP2
    [
        [0, 0, 0, 2, 0]
    ],
    // G3
    [
        [3, 0, 0, 0, 0],
        [2, 0, 0, 0, 1],
        [1, 0, 0, 0, 2],
        [0, 0, 0, 0, 3]
    ],
    // MS1
    [
        [0, 0, 1, 0, 0]
    ],
    // G4
    [
        [4, 0, 0, 0, 0],
        [3, 0, 0, 0, 1],
        [2, 0, 0, 0, 2],
        [1, 0, 0, 0, 3],
        [0, 0, 0, 0, 4]
    ],
    // FS1
    [
        [0, 1, 0, 0, 0]
    ],
    // G2-PLUS-MS1
    [
        [2, 0, 1, 0, 0],
        [1, 0, 1, 0, 1],
        [0, 0, 1, 0, 2]
    ],
    // G1-OR-FS1-OR-MS1
    [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1]
    ],
    // G3-OR-VP2
    [
        [3, 0, 0, 0, 0],
        [2, 0, 0, 0, 1],
        [1, 0, 0, 0, 2],
        [0, 0, 0, 0, 3],
        [0, 0, 0, 2, 0]
    ],
    // MS2
    [
        [0, 0, 2, 0, 0]
    ],
    // FS2
    [
        [0, 2, 0, 0, 0]
    ],
    // VP3
    [
        [0, 0, 0, 3, 0]
    ],
    // G1-PLUS-VP1-PLUS-FS1-PLUS-MS1
    [
        [1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1]
    ],
    // VP4
    [
        [0, 0, 0, 4, 0]
    ],
    // MIRROR
    [
        [0, 0, 0, 0, 0]
    ],
    // X3
    [
        [0, 0, 0, 0, 0]
    ]
]

// vereenvoudig keuze
// verwijder dubbels en resourcefen die niet in de voorraad van de speler passen
vereenvoudig_resource_opties = function(speler_id, keuze, minotaurus) {
    
    // bepaal het maximaal aantal resourcefen dat toegevoegd kan worden (of weggenomen in het geval van de minotaurus)
    if(minotaurus) {
        limiet = [
            spel.spelers[speler_id-1].resources.goud,
            spel.spelers[speler_id-1].resources.rood,
            spel.spelers[speler_id-1].resources.blauw,
            spel.spelers[speler_id-1].resources.score,
            0
        ]
    } else {
        limiet = [
            spel.spelers[speler_id-1].resources_max.goud - spel.spelers[speler_id-1].resources.goud,
            spel.spelers[speler_id-1].resources_max.rood - spel.spelers[speler_id-1].resources.rood,
            spel.spelers[speler_id-1].resources_max.blauw - spel.spelers[speler_id-1].resources.blauw,
            100,
            spel.spelers[speler_id-1].resources_max.hamer - spel.spelers[speler_id-1].resources.hamer
        ]
    }

    // pas de limiet toe op de keuzes
    for(let i = 0; i < keuze.length; i++) {
        keuze[i] = keuze[i].map((x, idx) => Math.min(x, limiet[idx]))
    }

    // pas minotaurus toe, alle resources * -1
    if(minotaurus) {
        keuze.map(optie => optie.map(x => -x))
    }  

    // verwijder duplicaten en oninteressante keuzes
    let i = 0;
    while(i < keuze.length) {
        for(let j = 0; j < keuze.length; j++) {
            
            if(j == i) continue;

            // is optie j beter of even goed als optie i
            beter = true
            for(let idx = 0; idx < 5; idx++) {
                if(keuze[i][idx] > keuze[j][idx]) {
                    beter = false
                    break;
                }
            }

            if(beter) {
                keuze.splice(i, 1)
                i = i - 1
            }
        }

        i++;
    }

    return(keuze)
}

get_resource_opties = function(speler_id, worp, allow_special = true, minotaurus = false) {

    if(worp.length == 1) {
        if(worp[0] == 'MIRROR' & allow_special) {
            return(get_resource_opties(
                3-speler_id, 
                [
                    spel.spelers[3-speler_id].huidige_dobbelsteen['links'],          
                    spel.spelers[3-speler_id].huidige_dobbelsteen['rechts']
                ],
                allow_special = false))
        } else {
            keuze = resource_keuze_zijde[zijdes.indexOf(worp[0])]
        }
    } else {

        if(worp[0] == 'X3' & allow_special) {
            keuze = get_resource_opties(speler_id, worp[1], true)
            return(keuze.map(x => x.map(y => y * 3)))
        }
        if(worp[1] == 'X3' & allow_special) {
            keuze = get_resource_opties(speler_id, worp[0], true)
            return(keuze.map(x => x.map(y => y * 3)))
        }

        keuze_links = get_resource_opties(speler_id, [worp[0]], allow_special)
        keuze_rechts = get_resource_opties(speler_id, [worp[1]], allow_special)

        keuze = []
        for(let il = 0; il < keuze_links.length; il++) {
            for(let ir = 0; ir < keuze_rechts.length; ir++) {
                keuze.push(
                    keuze_links[il].map((a, i) => a + keuze_rechts[ir][i])
                )
            }
        }
    }

    return(vereenvoudig_resource_opties(speler_id, keuze, minotaurus))
}

