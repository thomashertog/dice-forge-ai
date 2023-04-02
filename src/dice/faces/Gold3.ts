import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class Gold3 extends BuyableDieFace{
    
    constructor(){
        super('G3');
    }

    toString(): string {
        return `${chalk.yellow(3)}`;
    }
    
    unstyledString(): string {
        return '3';
    }
    
    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        await currentPlayer.addGold(multiplier * 3);
    }
    
    getCost(): number {
        return 2;
    }
}