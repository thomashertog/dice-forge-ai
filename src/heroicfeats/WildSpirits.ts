import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class WildSpirits extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(1, CostType.SUN);
    }

    handleEffect(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 2;
    }
}
