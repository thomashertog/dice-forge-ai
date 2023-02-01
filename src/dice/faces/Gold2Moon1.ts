import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Gold2Moon1 extends DieFace{
    
    constructor(){
        super('G2M1');
    }

    toString(): string {
        return `${chalk.yellow(2)}+${chalk.blue(1)}`;
    }

    async resolveRoll(currentPlayer: Player, multiplier: number): Promise<void> {
        currentPlayer.addMoon(multiplier * 1);
        await currentPlayer.addGold(multiplier * 2);
    }
    
}