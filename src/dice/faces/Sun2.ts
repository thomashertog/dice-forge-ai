import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class Sun2 extends BuyableDieFace{
    
    constructor(){
        super('S2');
    }

    toString(): string {
        return `${chalk.red(2)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addSun(multiplier * 2);
    }
 
    getCost(): number {
        return 8;
    }
}