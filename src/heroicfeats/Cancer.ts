import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class Cancer extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(6, CostType.MOON);
    }

    handleEffect(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 8;
    }
}
