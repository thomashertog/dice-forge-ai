import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { DieFace } from "./DieFace";

export class Sun1 extends DieFace{
    
    constructor(){
        super('S1', 3);
    }

    toString(): string {
        return `${chalk.red(1)}`;
    }

    unstyledString(): string {
        return '1';
    }

    resolve(game: Game, currentPlayer: Player, multiplier: number): void {
        currentPlayer.addSun(multiplier * 1);
    }
}