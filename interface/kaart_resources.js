kaart_codes = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'F7', 'F6', 'F5', 'F4', 'F3', 'F2', 'F1']
kaart_alias = ['hamer', 'kist', 'hinde', 'kobold', 'veerman', 'x3', 'kreef', 'hydra', 'sinfx', 'spiegel', 'gorgo', 'minotaur', 'uil', '3g+3b', 'oudere']
kaart_rood_kost = [0, 0, 0, 0, 0, 0, 0, 5, 6, 5, 4, 3, 2, 1, 1]
kaart_blauw_kost = [1, 1, 2, 3, 4, 5, 6, 5, 0, 0, 0, 0, 0, 0, 0]
kaart_punten = [0, 2, 2, 6, 12, 4, 8, 26, 10, 10, 14, 8, 4, 2, 0]
kaart_pool= [1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 7]

converteer_code_naar_kaart = function(code) {
    index = kaart_codes.indexOf(code)

    return({
        code: code,
        alias: kaart_alias[index],
        index: index,
        kost_rood: kaart_rood_kost[index],
        kost_blauw: kaart_blauw_kost[index],
        punten: kaart_punten[index],
        pool: kaart_pool[index]
    })
}