import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class GloryPoints4 extends DieFace{
    
    constructor(){
        super('GP4');
    }

    toString(): string {
        return `${chalk.green(4)}`;
    }

    resolveRoll(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 4);
    }
    
}