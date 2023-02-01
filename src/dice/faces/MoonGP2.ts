import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class MoonGP2 extends DieFace{
    
    constructor(){
        super('MGP2');
    }

    toString(): string {
        return `${chalk.green(2)}+${chalk.blue(2)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 2);
        currentPlayer.addGloryPoints(multiplier * 2);
    }
    
}