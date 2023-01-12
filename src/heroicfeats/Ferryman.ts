import { CostType } from "../costType";
import { AbstractHeroicFeatCard } from "./AbstractHeroicFeatCard";

export class FerryMan extends AbstractHeroicFeatCard{

    constructor(){
        super(4, CostType.MOON);
    }

    getGloryPointsAtEndOfGame(): number {
        return 12;
    }
}
