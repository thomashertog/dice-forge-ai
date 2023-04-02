import chalk from "chalk";
import { Player } from "../../Player";
import { questionUntilValidAnswer } from "../../util";
import { BuyableDieFace } from "./BuyableDieFace";

export class PickGoldMoonSun2 extends BuyableDieFace{
    
    constructor(){
        super('P2');
    }

    toString(): string {
        return `${chalk.yellow(2)}/${chalk.blueBright(2)}/${chalk.red(2)}`;
    }

    unstyledString(): string {
        return '2/2/2';
    }

    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        let pick1GoldMoonSun = 
        (await questionUntilValidAnswer(currentPlayer.game, `you want the Gold, Moon shards or Sun shards?`, 'G', 'M', 'S')).toUpperCase();
                
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

    getCost(): number {
        return 12;
    }
}