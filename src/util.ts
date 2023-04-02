import { stdin as input, stdout as output } from 'process';
import * as readline from 'readline';
import { BuyableDieFace } from './dice/faces/BuyableDieFace';
import { DieFace } from './dice/faces/DieFace';
import { HeroicFeatCard } from './heroicfeats/HeroicFeatCard';
import { InstantEffect } from './heroicfeats/InstantEffect';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';
import { Game } from './game';

const terminal = readline.createInterface(input, output);

export function shuffle(array: Array<DieFace>): Array<DieFace> {
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
    return (arg as ReinforcementEffect).addToListOfReinforcements !== undefined;
}

export async function questionUntilValidAnswer(game: Game | null, message: string, ...options: string[]): Promise<string>{
    options.map(option => option.toUpperCase());
    let answer = await question(game, message);
    while(!options.includes((answer + "").toUpperCase())){
        console.log(`
        sorry, ${answer} is not valid
        it should be one of ${options.map(option => option.toUpperCase())}`);
        answer = await question(game, message);
    }
    return answer + "";
}

export function getDieFacesAsPrettyString(name: string, dieFaces: Array<DieFace>, usePadding: boolean): string{
    if(dieFaces === undefined){
        return '';
    }
    let print = `${name}: `;
    print += toPaddedString(dieFaces, RIGHT_PADDING_LENGTH - print.length);

    return print;
}

export function toPaddedString(dieFaces: Array<DieFace | BuyableDieFace>, paddingLength?: number): string{
    let result = dieFaces.join(', ');
    //styling through chalk messes with length, padding needs to be done manually
    const resultLength = dieFaces.map(face => {return face.unstyledString()}).join(', ').length;
    for(let i = resultLength; i < (paddingLength || RIGHT_PADDING_LENGTH); i++){
        result += ' ';
    }
    return result;
}

async function question(game: Game | null, message: string):Promise<string> {
    console.clear();
    if(!!game){
        console.log(`${game}`);
    }
    return new Promise(resolve => {terminal.question(message, resolve);});
}

export function getArrayOfNumberStringsUpTo(maxNumber: number, offset:number=1): Array<string> {    
    let options: string[] = new Array();
    for (let i = offset; i <= maxNumber; i++) {
        options.push(i + "");
    }
    return options;
}

export async function chooseDieFace(options: Array<DieFace>, game: Game, showOptions?: boolean): Promise<DieFace>{
    showOptions = showOptions || false;
    const answer = await (await questionUntilValidAnswer(game, 
`${showOptions ? getDieFacesAsPrettyString('', options, false) : ''}
which dieface do you pick?`,
        ...options.map(option => option.code))).toUpperCase();

        return options.find(option => option.is(answer)) as DieFace;
}

export function countCardsByType(cards: Array<HeroicFeatCard>): Map<HeroicFeatCard, number> {
    return cards.reduce((accumulator, currentCard) => pushCard(accumulator, currentCard), new Map<HeroicFeatCard, number>());

    function pushCard(accumulator: Map<HeroicFeatCard, number>, currentCard: HeroicFeatCard): Map<HeroicFeatCard, number> {
        let currentAmount = accumulator.get(currentCard) || 0;
        accumulator.set(currentCard, currentAmount+1);

        return accumulator;
    }

}

export const RIGHT_PADDING_LENGTH = 40;