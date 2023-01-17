import { CostType } from "../costType";
import { Player } from "../player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Cancer extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(6, CostType.MOON);
    }

    handleEffect(currentPlayer: Player): void {
        currentPlayer.receiveDivineBlessing();
        currentPlayer.receiveDivineBlessing();
    }

    getGloryPointsAtEndOfGame(): number {
        return 8;
    }
}
