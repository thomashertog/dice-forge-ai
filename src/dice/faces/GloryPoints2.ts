import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class GloryPoints2 extends DieFace{
    
    constructor(){
        super('GP2');
    }

    toString(): string {
        return `${chalk.green(2)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addGloryPoints(multiplier * 2);
    }
    
}