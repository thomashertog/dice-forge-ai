import { CostType } from "../CostType";
import { Player } from "../Player";
import { Game } from "../game";
import { receiveDivineBlessing } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Minotaur extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('M', 3, CostType.SUN);
    }

    async handleEffect(game: Game, currentPlayer: Player): Promise<void> {
        for(let player of game.players){
            if(player === currentPlayer){
                continue;
            }
            await receiveDivineBlessing(game, player, false);
        }
    }

    getGloryPointsAtEndOfGame(): number {
        return 8;
    }
}
