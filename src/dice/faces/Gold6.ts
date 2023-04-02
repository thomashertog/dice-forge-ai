import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class Gold6 extends BuyableDieFace{
    
    constructor(){
        super('G6');
    }

    toString(): string {
        return `${chalk.yellow(6)}`;
    }

    unstyledString(): string {
        return '6';
    }

    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        await currentPlayer.addGold(multiplier * 6);
    }

    getCost(): number {
        return 4;
    }
}