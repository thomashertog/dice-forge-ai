import chalk from "chalk";
import { Player } from "../../Player";
import { DieFace } from "./DieFace";

export class Gold4 extends DieFace{
    
    constructor(){
        super('G4');
    }

    toString(): string {
        return `${chalk.yellow(4)}`;
    }

    async resolveRoll(currentPlayer: Player, multiplier: number): Promise<void> {
        await currentPlayer.addGold(multiplier * 4);
    }
    
}