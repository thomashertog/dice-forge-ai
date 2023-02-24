import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class Sun1 extends BuyableDieFace{
    
    constructor(){
        super('S1');
    }

    toString(): string {
        return `${chalk.red(1)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addSun(multiplier * 1);
    }
    
    getCost(): number {
        return 3;
    }
}