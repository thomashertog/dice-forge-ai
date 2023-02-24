import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";
import { DieFace } from "./DieFace";

export class Gold4 extends BuyableDieFace{
    
    constructor(){
        super('G4');
    }

    toString(): string {
        return `${chalk.yellow(4)}`;
    }

    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        await currentPlayer.addGold(multiplier * 4);
    }
    
    getCost(): number {
        return 3;
    }
}