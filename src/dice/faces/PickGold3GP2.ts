import chalk from "chalk";
import { Player } from "../../Player";
import { questionUntilValidAnswer } from "../../util";
import { BuyableDieFace } from "./BuyableDieFace";

export class PickGold3GP2 extends BuyableDieFace {

    constructor() {
        super('P3');
    }

    toString(): string {
        return `${chalk.yellow(3)}/${chalk.green(2)}`;
    }

    unstyledString(): string {
        return '3/2';
    }

    async resolve(currentPlayer: Player, multiplier: number): Promise<void> {
        let pickGoldGP = (await questionUntilValidAnswer(currentPlayer.game, `you want the Gold (G) or glory Points?`, 'G', 'P')).toUpperCase();

        if (pickGoldGP === 'G') {
            await currentPlayer.addGold(multiplier * 3);
        } else if (pickGoldGP === 'P') {
            currentPlayer.addGloryPoints(multiplier * 2);
        }
    }

    hasChoice(): boolean {
        return true;
    }

    getCost(): number {
        return 5;
    }
}