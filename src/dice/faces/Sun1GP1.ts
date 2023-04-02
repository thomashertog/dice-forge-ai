import chalk from "chalk";
import { Player } from "../../Player";
import { BuyableDieFace } from "./BuyableDieFace";

export class Sun1GP1 extends BuyableDieFace{
    
    constructor(){
        super('GP1S1');
    }

    toString(): string {
        return `${chalk.green(1)}+${chalk.red(1)}`;
    }

    unstyledString(): string {
        return '1+1';
    }

    resolve(currentPlayer: Player, multiplier: number): void {
        currentPlayer.addGloryPoints(multiplier * 1);
        currentPlayer.addSun(multiplier * 1);
    }
    
    getCost(): number {
        return 4;
    }
}