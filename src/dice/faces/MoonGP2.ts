import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class MoonGP2 extends BuyableDieFace{
    
    constructor(){
        super('MGP2');
    }

    toString(): string {
        return `${chalk.green(2)}+${chalk.blue(2)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 2);
        currentPlayer.addGloryPoints(multiplier * 2);
    }
    
    getCost(): number {
        return 12;
    }
}