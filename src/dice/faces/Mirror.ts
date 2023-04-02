import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Mirror extends DieFace{
    
    constructor(){
        super('M');
    }

    toString(): string {
        return `${chalk.bgCyan(' ')}`;
    }

    unstyledString(): string {
        return ' ';
    }

    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        //TODO
    }

    hasChoice(): boolean {
        return true;
    }   
}