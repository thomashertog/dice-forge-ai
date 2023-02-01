import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Sun2 extends DieFace{
    
    constructor(){
        super('S2');
    }

    toString(): string {
        return `${chalk.red(2)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addSun(multiplier * 2);
    }
    
}