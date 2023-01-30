import chalk from "chalk";
import { CostType } from "../costType";
import { Player } from "../player";
import { questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class Elder extends AbstractHeroicFeatCard implements ReinforcementEffect{

    constructor(){
        super(1, CostType.SUN);
    }

    toString():string {
        return `Elder (${chalk.red(1)})`;
    }

    addToListOfReinforcements(currentPlayer: Player): void {
        currentPlayer.reinforcements.push(this);
    }

    async handleReinforcement(currentPlayer: Player): Promise<boolean> {
        if(currentPlayer.gold >= 3){
            let answer = await (await questionUntilValidAnswer(`You currently have ${chalk.yellow(currentPlayer.gold)}, do you want to spend 3 gold to gain 4 glory points (Y/N)`, "Y", "N")).toUpperCase();
            if(answer === "N"){
                return new Promise((resolve) => {resolve(false)});
            }else{
                await currentPlayer.addGold(-3);
                currentPlayer.addGloryPoints(4);
            }
        }
        return new Promise((resolve) => {resolve(true)});
    }

    getGloryPointsAtEndOfGame(): number {
        return 0;
    }
}
