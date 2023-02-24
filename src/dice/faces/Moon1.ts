import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class Moon1 extends BuyableDieFace{
    
    constructor(){
        super('M1');
    }

    toString(): string {
        return `${chalk.blue(1)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 1);
    }

    getCost(): number {
        return 2;
    }
    
}