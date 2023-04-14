import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { DieFace } from "./DieFace";

export class GloryPoints3 extends DieFace{
    
    constructor(){
        super('GP3', 8);
    }

    toString(): string {
        return `${chalk.green(3)}`;
    }

    unstyledString(): string {
        return '3';
    }

    resolve(game: Game, currentPlayer: Player, multiplier: number): void {
        currentPlayer.addGloryPoints(multiplier * 3);
    }
}