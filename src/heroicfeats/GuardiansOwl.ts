import chalk from "chalk";
import { CostType } from "../costType";
import { Player } from "../player";
import { questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class GuardiansOwl extends AbstractHeroicFeatCard implements ReinforcementEffect{

    constructor(){
        super(2, CostType.SUN);
    }

    toString = () => {
        return `Guardian's Owl (${chalk.red(2)})`;
    }

    addToListOfReinforcements(currentPlayer: Player): void {
        currentPlayer.reinforcements.push(this);
    }

    async handleReinforcement(currentPlayer: Player): Promise<boolean> {
        let answer = await (await questionUntilValidAnswer(`currently your resources are: ${chalk.yellow(currentPlayer.gold)}, ${chalk.blue(currentPlayer.moon)}, ${chalk.red(currentPlayer.sun)}\ndo you want ${chalk.yellow(1)} (G), ${chalk.blue(1)} (M), ${chalk.red(1)} (S) or cancel (C)`, 'G', 'M', 'S', 'C')).toUpperCase();

        switch(answer){
            case 'G': currentPlayer.addGold(1); break;
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