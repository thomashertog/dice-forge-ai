import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";
import { InstantEffect } from "./InstantEffect";

export class BlackmithsChest extends AbstractHeroicFeatCard implements InstantEffect{

    constructor(){
        super(1, CostType.MOON);
    }

    handleEffect(): void {
        //TODO
    }

    getGloryPointsAtEndOfGame(): number {
        return 2;
    }
}

