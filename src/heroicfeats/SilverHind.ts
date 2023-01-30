import chalk from "chalk";
import { CostType } from "../CostType";
import { Player } from "../Player";
import { getDieFacesAsPrettyString, questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class SilverHind extends AbstractHeroicFeatCard implements ReinforcementEffect{
    
    constructor(){
        super(2, CostType.MOON);
    }

    toString():string {
        return `Silver Hind (${chalk.blue(2)})`;
    }

    addToListOfReinforcements(player: Player): void {
        player.reinforcements.push(this);
    }

    async handleReinforcement(currentPlayer: Player): Promise<boolean> {
        let answer = (await questionUntilValidAnswer(`
        you currently have these resources: ${currentPlayer.getResourcesString()}
        your dice are as follows:
        ${getDieFacesAsPrettyString('left', currentPlayer.leftDie.faces)}
        ${getDieFacesAsPrettyString('right', currentPlayer.rightDie.faces)}
        do you want to roll your left die (L) or the right die (R) or cancel (C)`, 'R', 'L', 'C')).toUpperCase();

        if(answer === 'C'){
            return new Promise((resolve) => {resolve(false)});
        }else if(answer === 'L'){
            await currentPlayer.minorBlessing(currentPlayer.leftDie);
            return new Promise((resolve) => {resolve(true)});
        }else{
            await currentPlayer.minorBlessing(currentPlayer.rightDie);
            return new Promise((resolve) => {resolve(true)});
        }
    }

    getGloryPointsAtEndOfGame(): number {
        return 2;
    }
}
