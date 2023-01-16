import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class BlacksmithsHammer extends AbstractHeroicFeatCard implements InstantEffect{

    gold: number;

    constructor(){
        super(1, CostType.MOON);
        this.gold = 0;
    }

    handleEffect(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 0;
    }
}
