import chalk from "chalk";
import { CostType } from "../CostType";
import { Player } from "../Player";
import { questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class GuardiansOwl extends AbstractHeroicFeatCard implements ReinforcementEffect{

    constructor(){
        super('GO', 2, CostType.SUN);
    }

    addToListOfReinforcements(currentPlayer: Player): void {
        currentPlayer.reinforcements.push(this);
    }

    async handleReinforcement(currentPlayer: Player): Promise<boolean> {
        let answer = (await questionUntilValidAnswer(currentPlayer.game, `do you want ${chalk.yellow(1)}, ${chalk.blueBright(1)}, ${chalk.red(1)} or Cancel?`, 'G', 'M', 'S', 'C')).toUpperCase();

        switch(answer){
            case 'G': await currentPlayer.addGold(1); break;
            case 'M': currentPlayer.addMoon(1); break;
            case 'S': currentPlayer.addSun(1); break;
            case 'C': return new Promise((resolve) => {resolve(false)});
        }
        return new Promise((resolve) => {resolve(true)});
    }

    getGloryPointsAtEndOfGame(): number {
        return 4;
    }
}
