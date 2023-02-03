import chalk from "chalk";
import { CostType } from "../CostType";
import { Player } from "../Player";
import { questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class GuardiansOwl extends AbstractHeroicFeatCard implements ReinforcementEffect{

    constructor(){
        super('O', 2, CostType.SUN);
    }

    addToListOfReinforcements(currentPlayer: Player): void {
        currentPlayer.reinforcements.push(this);
    }

    async handleReinforcement(currentPlayer: Player): Promise<boolean> {
        let answer = (await questionUntilValidAnswer(`
        currently your resources are: ${chalk.yellow(currentPlayer.gold)}, ${chalk.blue(currentPlayer.moon)}, ${chalk.red(currentPlayer.sun)}
        do you want ${chalk.yellow(1)} (G), ${chalk.blue(1)} (M), ${chalk.red(1)} (S) or cancel (C)`, 
        'G', 'M', 'S', 'C')).toUpperCase();

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
