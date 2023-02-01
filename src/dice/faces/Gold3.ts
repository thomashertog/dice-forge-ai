import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Gold3 extends DieFace{
    
    constructor(){
        super('G3');
    }

    toString(): string {
        return `${chalk.yellow(3)}`;
    }

    async resolveRoll(currentPlayer: Player, multiplier: number): Promise<void> {
        await currentPlayer.addGold(multiplier * 3);
    }
    
}