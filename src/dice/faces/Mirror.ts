import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";
import { Game } from "../../game";

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

    async resolve(game: Game, currentPlayer: Player, multiplier: number): Promise<void> {
        //nothing to do here, mirror can't be resolved on its own
    }

    hasChoice(): boolean {
        return true;
    }   
}