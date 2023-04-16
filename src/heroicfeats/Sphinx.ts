import { CostType } from "../CostType";
import { Player } from "../Player";
import { CommandLineInterface } from "../interfaces/cli";
import { Game } from "../game";
import { minorBlessing } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Sphinx extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('S', 6, CostType.SUN);
    }

    async handleEffect(game: Game, currentPlayer: Player): Promise<void> {
        const answer = await new CommandLineInterface().whichDieToRoll(game, currentPlayer.name);

        if(answer === 'L'){
            await minorBlessing(game, currentPlayer, currentPlayer.leftDie);
            await minorBlessing(game, currentPlayer, currentPlayer.leftDie);
            await minorBlessing(game, currentPlayer,currentPlayer.leftDie);
            await minorBlessing(game, currentPlayer,currentPlayer.leftDie);
        }else if(answer === 'R'){
            await minorBlessing(game, currentPlayer,currentPlayer.rightDie);
            await minorBlessing(game, currentPlayer,currentPlayer.rightDie);
            await minorBlessing(game, currentPlayer,currentPlayer.rightDie);
            await minorBlessing(game, currentPlayer,currentPlayer.rightDie);
        }
    }

    getGloryPointsAtEndOfGame(): number {
        return 10;
    }
}
