import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class Moon2 extends BuyableDieFace{
    
    constructor(){
        super('M2');
    }

    toString(): string {
        return `${chalk.blue(2)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 2);
    }
    
    getCost(): number {
        return 6;
    }
}