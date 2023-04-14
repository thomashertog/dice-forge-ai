import { CostType } from "../CostType";
import { Player } from "../Player";
import { Game } from "../game";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class BlackmithsChest extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('BC', 1, CostType.MOON);
    }

    handleEffect(game: Game, currentPlayer: Player): void {
        currentPlayer.extraChest();
    }

    getGloryPointsAtEndOfGame(): number {
        return 2;
    }
}

