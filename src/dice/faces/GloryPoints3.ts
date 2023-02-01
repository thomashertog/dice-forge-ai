import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class GloryPoints3 extends DieFace{
    
    constructor(){
        super('GP3');
    }

    toString(): string {
        return `${chalk.green(3)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addGloryPoints(multiplier * 3);
    }
    
}