import { CostType } from "../CostType";
import { Player } from "../Player";
import { CommandLineInterface } from "../cli";
import { Game } from "../game";
import { minorBlessing } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { ReinforcementEffect } from "./ReinforcementEffect";

export class SilverHind extends AbstractHeroicFeatCard implements ReinforcementEffect{
    
    constructor(){
        super('SH', 2, CostType.MOON);
    }

    addToListOfReinforcements(player: Player): void {
        player.reinforcements.push(this);
    }

    async handleReinforcement(game: Game, currentPlayer: Player): Promise<boolean> {
        const answer = await CommandLineInterface.whichDieToRoll(game);
        
        if(answer === 'C'){
            return new Promise((resolve) => {resolve(false)});
        }else if(answer === 'L'){
            await minorBlessing(game, currentPlayer, currentPlayer.leftDie);
            return new Promise((resolve) => {resolve(true)});
        }else{
            await minorBlessing(game, currentPlayer, currentPlayer.rightDie);
            return new Promise((resolve) => {resolve(true)});
        }
    }

    getGloryPointsAtEndOfGame(): number {
        return 2;
    }
}
