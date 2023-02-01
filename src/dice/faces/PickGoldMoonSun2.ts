import chalk from "chalk";
import { Player } from "../../Player";
import { questionUntilValidAnswer } from "../../util";
import { DieFace } from "./DieFace";

export class PickGoldMoonSun2 extends DieFace{
    
    constructor(){
        super('P2');
    }

    toString(): string {
        return `${chalk.yellow(2)}/${chalk.blue(2)}/${chalk.red(2)}`;
    }

    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        let pick1GoldMoonSun = 
        (await questionUntilValidAnswer(`
                current resources: ${currentPlayer.getResourcesString()}
                you want the gold (G), moon shards (M) or sun shards (S)`, 
                'G', 'M', 'S')).toUpperCase();
                
        if (pick1GoldMoonSun === 'G') {
            await currentPlayer.addGold(multiplier * 2);
        } else if (pick1GoldMoonSun === 'M') {
            currentPlayer.addMoon(multiplier * 2);
        } else if (pick1GoldMoonSun === 'S') {
            currentPlayer.addSun(multiplier * 2);
        }
    }
 
    hasChoice(): boolean {
        return true;
    }
}