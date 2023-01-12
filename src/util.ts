import { DieFaceOption } from './diefaceoption';
import { InstantEffect } from './heroicfeats/InstantEffect';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';

export function shuffle(array: Array<DieFaceOption>) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export function isInstantEffect(arg: any): arg is InstantEffect{
    return (arg as InstantEffect).handleEffect !== undefined;
}

export function isReinforcementEffect(arg: any): arg is ReinforcementEffect{
    return (arg as ReinforcementEffect).handleReinforcement !== undefined;
}