import chalk from "chalk";
import { Player } from "../../Player";
import { questionUntilValidAnswer } from "../../util";
import { BuyableDieFace } from "./BuyableDieFace";

export class PickGoldMoonSun1 extends BuyableDieFace{
    
    constructor(){
        super('P1');
    }

    toString(): string {
        return `${chalk.yellow(1)}/${chalk.blue(1)}/${chalk.red(1)}`;
    }

    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        let pick1GoldMoonSun = 
        (await questionUntilValidAnswer(`
current resources: ${currentPlayer.getResourcesString()}
you want the gold (G), moon shards (M) or sun shards (S)`, 
                'G', 'M', 'S')).toUpperCase();
                
        if (pick1GoldMoonSun === 'G') {
            await currentPlayer.addGold(multiplier * 1);
        } else if (pick1GoldMoonSun === 'M') {
            currentPlayer.addMoon(multiplier * 1);
        } else if (pick1GoldMoonSun === 'S') {
            currentPlayer.addSun(multiplier * 1);
        }
    }
    
    hasChoice(): boolean {
        return true;
    }

    getCost(): number {
        return 4;
    }   
}