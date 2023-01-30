import { CostType } from "../CostType";
import { Player } from "../Player";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class BlacksmithsHammer extends AbstractHeroicFeatCard implements InstantEffect{

    gold: number;

    constructor(){
        super(1, CostType.MOON);
        this.gold = 0;
    }

    async handleEffect(currentPlayer: Player): Promise<void> {
        currentPlayer.activeHammerCount += 1;
    }

    getGloryPointsAtEndOfGame(): number {
        return 0;
    }
}
