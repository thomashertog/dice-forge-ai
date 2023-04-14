import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { DieFace } from "./DieFace";

export class Moon2 extends DieFace{
    
    constructor(){
        super('M2', 6);
    }

    toString(): string {
        return `${chalk.blueBright(2)}`;
    }

    unstyledString(): string {
        return '2';
    }

    resolve(game: Game, currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 2);
    }
}