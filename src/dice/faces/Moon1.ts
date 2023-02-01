import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Moon1 extends DieFace{
    
    constructor(){
        super('M1');
    }

    toString(): string {
        return `${chalk.blue(1)}`;
    }

    resolveRoll(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 1);
    }
    
}