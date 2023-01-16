import { CostType } from "../costType";
import { Player } from "../player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class BlackmithsChest extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(1, CostType.MOON);
    }

    handleEffect(currentPlayer: Player): void {
        currentPlayer.extraChest();
    }

    getGloryPointsAtEndOfGame(): number {
        return 2;
    }
}

