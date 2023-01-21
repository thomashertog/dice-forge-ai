import chalk from "chalk";
import { CostType } from "../costType";
import { Player } from "../player";
import { getDieFacesAsPrettyString, questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class SilverHind extends AbstractHeroicFeatCard implements ReinforcementEffect{
    
    constructor(){
        super(2, CostType.MOON);
    }

    toString = () => {
        return `Silver Hind (${chalk.blue(2)})`;
    }

    addToListOfReinforcements(player: Player): void {
        player.reinforcements.push(this);
    }

    async handleReinforcement(currentPlayer: Player): Promise<boolean> {
        let answer = await (await questionUntilValidAnswer(`you currently have these resources: ${currentPlayer.getResourcesString()}\nyour dice are as follows:\n${getDieFacesAsPrettyString('left', currentPlayer.leftDie.faces)}\t${getDieFacesAsPrettyString('right', currentPlayer.rightDie.faces)}\ndo you want to roll your left die (L) or the right die (R) or cancel (C)`, 'R', 'L', 'C')).toUpperCase();

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
