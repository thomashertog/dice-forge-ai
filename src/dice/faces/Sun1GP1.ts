import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Sun1GP1 extends DieFace{
    
    constructor(){
        super('SGP1');
    }

    toString(): string {
        return `${chalk.green(1)}+${chalk.red(1)}`;
    }

    resolveRoll(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addGloryPoints(multiplier * 1);
        currentPlayer.addSun(multiplier * 1);
    }
    
}