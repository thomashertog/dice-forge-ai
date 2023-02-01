import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Sun1 extends DieFace{
    
    constructor(){
        super('S1');
    }

    toString(): string {
        return `${chalk.red(1)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addSun(multiplier * 1);
    }
    
}