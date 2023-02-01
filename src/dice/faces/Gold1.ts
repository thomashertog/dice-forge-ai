import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Gold1 extends DieFace{
    
    constructor(){
        super('G1');
    }

    toString(): string {
        return `${chalk.yellow(1)}`;
    }

    async resolveRoll(currentPlayer: Player, multiplier: number): Promise<void> {
        await currentPlayer.addGold(multiplier * 1);
    }
    
}