import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class Gold2Moon1 extends BuyableDieFace {
    
    constructor(){
        super('G2M1');
    }

    toString(): string {
        return `${chalk.yellow(2)}+${chalk.blue(1)}`;
    }

    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        currentPlayer.addMoon(multiplier * 1);
        await currentPlayer.addGold(multiplier * 2);
    }
    
    getCost(): number {
        return 4;
    }
}