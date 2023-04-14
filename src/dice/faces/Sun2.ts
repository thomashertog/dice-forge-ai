import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { DieFace } from "./DieFace";

export class Sun2 extends DieFace{
    
    constructor(){
        super('S2', 8);
    }

    toString(): string {
        return `${chalk.red(2)}`;
    }

    unstyledString(): string {
        return '2';
    }
    
    resolve(game: Game, currentPlayer: Player, multiplier: number): void {
        currentPlayer.addSun(multiplier * 2);
    }
}