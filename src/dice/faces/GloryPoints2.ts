import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";
import { Game } from "../../game";

export class GloryPoints2 extends DieFace{
    
    constructor(){
        super('GP2');
    }

    toString(): string {
        return `${chalk.green(2)}`;
    }

    unstyledString(): string {
        return '2';
    }

    resolve(game: Game, currentPlayer: Player, multiplier: number): void {
        currentPlayer.addGloryPoints(multiplier * 2);
    }
    
}