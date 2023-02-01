import chalk from "chalk";
import { Player } from "../../Player";
import { questionUntilValidAnswer } from "../../util";
import { DieFace } from "./DieFace";

export class PickGold3GP2 extends DieFace {

    constructor() {
        super('P3');
    }

    toString(): string {
        return `${chalk.yellow(3)}/${chalk.green(2)}`;
    }

    async resolveRoll(currentPlayer: Player, multiplier: number): Promise<void> {
        let pickGoldGP = (await questionUntilValidAnswer(`
                current resources: ${currentPlayer.getResourcesString()}
                you want the gold (G) or glory points(P)?`,
            'G', 'P')).toUpperCase();

        if (pickGoldGP === 'G') {
            await currentPlayer.addGold(multiplier * 3);
        } else if (pickGoldGP === 'P') {
            currentPlayer.addGloryPoints(multiplier * 2);
        }
    }

    hasChoice(): boolean {
        return true;
    }
}