import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { DieFace } from "./DieFace";

export class Moon1 extends DieFace{
    
    constructor(){
        super('M1', 2);
    }

    toString(): string {
        return `${chalk.blueBright(1)}`;
    }

    unstyledString(): string {
        return '1';
    }

    resolve(game: Game, currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 1);
    }    
}