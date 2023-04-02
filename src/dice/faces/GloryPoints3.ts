import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class GloryPoints3 extends BuyableDieFace{
    
    constructor(){
        super('GP3');
    }

    toString(): string {
        return `${chalk.green(3)}`;
    }

    unstyledString(): string {
        return '3';
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addGloryPoints(multiplier * 3);
    }
 
    getCost(): number {
        return 8;
    }
}