import { DieFaceOption, printDieFaceOption } from './DieFaceOption';
import { InstantEffect } from './heroicfeats/InstantEffect';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

const terminal = readline.createInterface(input, output);

export function shuffle(array: Array<DieFaceOption>): Array<DieFaceOption> {
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

export async function questionUntilValidAnswer(message: string, ...options: string[]): Promise<string>{
    options.map(option => option.toUpperCase());
    let answer = await question(message);
    while(!options.includes((answer + "").toUpperCase())){
        console.log(`sorry, ${answer} is not valid\nit should be one of ${options.map(option => option.toUpperCase())}`);
        answer = await question(message);
    }
    return answer + "";
}

export function getDieFacesAsPrettyString(name: string, dieFaces: Array<DieFaceOption>): string{
    let print = `${name}: `;
    for(let face of dieFaces){
        print += `${printDieFaceOption(face)}, `;
    }
    return print;
}


async function question(message: string):Promise<string> {
    readline.clearScreenDown(input);
    return new Promise(resolve => {terminal.question(message, resolve);});
}

export function getArrayOfNumberStringsUpTo(maxNumber: number, offset:number=1): Array<string> {    
    let options: string[] = new Array();
    for (let i = offset; i <= maxNumber; i++) {
        options.push(i + "");
    }
    return options;
}
