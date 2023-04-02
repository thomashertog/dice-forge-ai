import chalk from "chalk";
import { CostType } from "../CostType";
import { Player } from "../Player";
import { getDieFacesAsPrettyString, questionUntilValidAnswer } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class SilverHind extends AbstractHeroicFeatCard implements ReinforcementEffect{
    
    constructor(){
        super('SH', 2, CostType.MOON);
    }

    addToListOfReinforcements(player: Player): void {
        player.reinforcements.push(this);
    }

    async handleReinforcement(currentPlayer: Player): Promise<boolean> {
        let answer = (await questionUntilValidAnswer(currentPlayer.game, `Do you want to roll your Left die or the Right die or Cancel?`, 'R', 'L', 'C')).toUpperCase();

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
