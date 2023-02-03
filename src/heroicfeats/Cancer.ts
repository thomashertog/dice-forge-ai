import { CostType } from "../CostType";
import { Player } from "../Player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Cancer extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super('C', 6, CostType.MOON);
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        await currentPlayer.receiveDivineBlessing();
        await currentPlayer.receiveDivineBlessing();
    }

    getGloryPointsAtEndOfGame(): number {
        return 8;
    }
}
