import { CostType } from "../CostType";
import { Player } from "../Player";
import { Game } from "../game";
import { CommandLineInterface } from "../interfaces/cli";
import { minorBlessing } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Sphinx extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('S', 6, CostType.SUN);
    }

    async handleEffect(game: Game, currentPlayer: Player): Promise<void> {
        const die = await currentPlayer.getUserInterface().whichDieToRoll(game, currentPlayer);

        if(die === undefined){
            return;
        }

        await minorBlessing(game, currentPlayer, die);
        await minorBlessing(game, currentPlayer, die);
        await minorBlessing(game, currentPlayer,die);
        await minorBlessing(game, currentPlayer,die);
    }

    getGloryPointsAtEndOfGame(): number {
        return 10;
    }
}
