import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class GloryPoints4 extends BuyableDieFace{
    
    constructor(){
        super('GP4');
    }

    toString(): string {
        return `${chalk.green(4)}`;
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addMoon(multiplier * 4);
    }
 
    getCost(): number {
        return 12;
    }
}