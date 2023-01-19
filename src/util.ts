import { DieFaceOption, printDieFaceOption } from './diefaceoption';
import { InstantEffect } from './heroicfeats/InstantEffect';
import { ReinforcementEffect } from './heroicfeats/ReinforcementEffect';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

const terminal = readline.createInterface(input, output);

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
    return (arg as ReinforcementEffect).addToListOfReinforcements !== undefined;
}

export async function questionUntilValidAnswer(message: string, ...options: string[]): Promise<string>{
    options.map(option => option.toUpperCase());
    let answer = await question(message);
    while(!options.includes((answer + "").toUpperCase())){
        console.log(`sorry, ${answer} is not valid`);
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


async function question(message: string) {
    return new Promise(resolve => {terminal.question(message, resolve);});
}

export function getArrayOfNumberStringsUpTo(maxOptions: number, offset?: number): Array<string> {    
    let options: string[] = new Array();
    for (let i = 1; i <= maxOptions; i++) {
        if (offset !== undefined && offset > 0){
            options.push(i + offset + "");
        }else{
            options.push(i + "");
        }
    }
    return options;
}
