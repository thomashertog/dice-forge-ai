import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Moon2 extends DieFace{
    
    constructor(){
        super('M2');
    }

    toString(): string {
        return `${chalk.blue(2)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 2);
    }
    
}