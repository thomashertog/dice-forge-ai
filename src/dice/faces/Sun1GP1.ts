import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { DieFace } from "./DieFace";

export class Sun1GP1 extends DieFace{
    
    constructor(){
        super('GP1S1', 4);
    }

    toString(): string {
        return `${chalk.green(1)}+${chalk.red(1)}`;
    }

    unstyledString(): string {
        return '1+1';
    }

    resolve(game: Game, currentPlayer: Player, multiplier: number): void {
        currentPlayer.addGloryPoints(multiplier * 1);
        currentPlayer.addSun(multiplier * 1);
    }
}