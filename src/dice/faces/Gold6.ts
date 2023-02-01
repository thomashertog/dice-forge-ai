import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Gold6 extends DieFace{
    
    constructor(){
        super('G6');
    }

    toString(): string {
        return `${chalk.yellow(6)}`;
    }

    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        await currentPlayer.addGold(multiplier * 6);
    }
    
}