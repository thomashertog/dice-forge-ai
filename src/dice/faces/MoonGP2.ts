import chalk from "chalk";
import { Player } from "../../Player";
import { Game } from "../../game";
import { DieFace } from "./DieFace";

export class MoonGP2 extends DieFace{
    
    constructor(){
        super('GP2M2', 12);
    }

    toString(): string {
        return `${chalk.green(2)}+${chalk.blueBright(2)}`;
    }

    unstyledString(): string {
        return '2+2';
    }

    resolve(game: Game, currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 2);
        currentPlayer.addGloryPoints(multiplier * 2);
    }
}