import { CostType } from "../CostType";
import { Player } from "../Player";
import { Game } from "../game";
import { receiveDivineBlessing } from "../util";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Cancer extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('C', 6, CostType.MOON);
    }

    async handleEffect(game: Game, currentPlayer: Player): Promise<void> {
        await receiveDivineBlessing(game, currentPlayer);
        await receiveDivineBlessing(game, currentPlayer);
    }

    getGloryPointsAtEndOfGame(): number {
        return 8;
    }
}
