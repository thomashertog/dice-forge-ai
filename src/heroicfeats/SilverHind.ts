import { CostType } from "../CostType";
import { Player } from "../Player";
import { CommandLineInterface } from "../interfaces/cli";
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
        const die = await currentPlayer.getUserInterface().whichDieToRoll(game, currentPlayer);

        if(die === undefined){
            return new Promise((resolve) => {resolve(false)});
        }else {
            await minorBlessing(game, currentPlayer, die);
            return new Promise((resolve) => {resolve(true)});
        }
    }

    getGloryPointsAtEndOfGame(): number {
        return 2;
    }
}
